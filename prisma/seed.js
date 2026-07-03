require('dotenv').config({ path: '.env' });

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: { name: 'customer' },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  console.log('✅ Roles created:', { customerRole, adminRole });

  const seller = await prisma.user.upsert({
    where: { email: 'catalog@shirtsy.local' },
    update: { isSeller: true, shopName: 'The Shirtsy Official' },
    create: {
      name: 'The Shirtsy Official',
      email: 'catalog@shirtsy.local',
      password: await bcrypt.hash('CatalogOnly!2026', 12),
      roleId: customerRole.id,
      isSeller: true,
      shopName: 'The Shirtsy Official',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@shirtsy.local' },
    update: { roleId: adminRole.id },
    create: { name: 'Shirtsy Admin', email: 'admin@shirtsy.local', password: await bcrypt.hash('AdminTest!2026', 12), roleId: adminRole.id },
  });

  const allowedImages = [
    '/img/black-t-shirt/simple-black-t-shirt-worn-by-man.jpg',
    '/img/white-t-shirt/wh-t-shirt-cover.jpg'
  ];

  const catalog = [
    ['เสื้อยืดคอตตอนคลาสสิก', 'TSHIRT', 290, 120, allowedImages[1], ['White'], ['S','M','L','XL']],
    ['เสื้อยืดโอเวอร์ไซซ์มินิมอล', 'TSHIRT', 390, 80, allowedImages[0], ['Black'], ['M','L','XL','XXL']],
    ['เสื้อโปโลทำงานพรีเมียม', 'POLO', 490, 65, allowedImages[0], ['Black'], ['S','M','L','XL']],
    ['ฮู้ดดี้ผ้าคอตตอนหนา', 'HOODIE', 790, 40, allowedImages[0], ['Black'], ['M','L','XL']],
    ['เสื้อแขนยาว Everyday', 'LONG_SLEEVE', 450, 55, allowedImages[1], ['White'], ['S','M','L','XL']],
    ['เสื้อกล้าม Active', 'TANK_TOP', 320, 70, allowedImages[1], ['White'], ['S','M','L']],
    ['เสื้อยืด Essential สีดำ', 'TSHIRT', 310, 100, allowedImages[0], ['Black'], ['S','M','L','XL','XXL']],
    ['เสื้อยืดสกรีนหน้าอก', 'TSHIRT', 420, 75, allowedImages[1], ['White'], ['S','M','L','XL']],
    ['โปโล Smart Casual', 'POLO', 550, 50, allowedImages[1], ['White'], ['M','L','XL']],
    ['ฮู้ดดี้ Everyday Zip', 'HOODIE', 890, 35, allowedImages[0], ['Black'], ['M','L','XL','XXL']],
  ];

  // Generate 90 additional products programmatically to reach exactly 100 items
  const categoriesList = ['TSHIRT', 'POLO', 'HOODIE', 'LONG_SLEEVE', 'TANK_TOP'];
  const categoriesNames = {
    'TSHIRT': 'เสื้อยืดสตรีทมินิมอล',
    'POLO': 'เสื้อโปโลสปอร์ตพรีเมียม',
    'HOODIE': 'เสื้อฮู้ดสเก็ตเตอร์',
    'LONG_SLEEVE': 'เสื้อแขนยาว Cozy',
    'TANK_TOP': 'เสื้อกล้าม Gym Sport'
  };
  const sizesList = [['S', 'M', 'L'], ['M', 'L', 'XL'], ['S', 'M', 'L', 'XL'], ['M', 'L', 'XL', 'XXL']];

  for (let i = 1; i <= 90; i++) {
    const category = categoriesList[i % categoriesList.length];
    const name = `${categoriesNames[category]} รุ่นที่ ${i}`;
    const price = 250 + ((i * 15) % 650);
    const stock = 10 + ((i * 7) % 150);
    // Alternate between black shirt image and white shirt image
    const image = allowedImages[i % allowedImages.length];
    const colors = image === allowedImages[0] ? ['Black'] : ['White'];
    const sizes = sizesList[i % sizesList.length];
    catalog.push([name, category, price, stock, image, colors, sizes]);
  }

  for (const [name, category, price, stock, image, colors, sizes] of catalog) {
    const existing = await prisma.product.findFirst({ where: { name, sellerId: seller.id } });
    const data = { name, description: `${name} ผลิตสำหรับลูกค้าไทย เนื้อผ้าใส่สบาย เหมาะสำหรับสวมใส่และนำไปสกรีน`, category, price, stock, images: [image], colors, sizes, sellerId: seller.id, is_public: true, approvalStatus: 'APPROVED', reviewedAt: new Date() };
    if (existing) await prisma.product.update({ where: { id: existing.id }, data });
    else await prisma.product.create({ data });
  }
  console.log(`✅ Catalog products ready: ${catalog.length} items`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log('✅ Seeding complete!');
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
