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

  const catalog = [
    ['เสื้อยืดคอตตอนคลาสสิก', 'TSHIRT', 290, 120, '/img/white-t-shirt/wh-t-shirt-cover.jpg', ['White','Black'], ['S','M','L','XL']],
    ['เสื้อยืดโอเวอร์ไซซ์มินิมอล', 'TSHIRT', 390, 80, '/images/1782492211769-2oxslzifnwu-test.png', ['White','Gray'], ['M','L','XL','XXL']],
    ['เสื้อโปโลทำงานพรีเมียม', 'POLO', 490, 65, '/images/1782492893964-zd9aa4mk6g-test.png', ['Black','Navy'], ['S','M','L','XL']],
    ['ฮู้ดดี้ผ้าคอตตอนหนา', 'HOODIE', 790, 40, '/images/1782506792467-mfw6lw9datk-690587754_1733216234671297_1761071839488886865_n.png', ['Black','Gray'], ['M','L','XL']],
    ['เสื้อแขนยาว Everyday', 'LONG_SLEEVE', 450, 55, '/images/1782685941069-yf77vik6g1-71-lp7NYU5L._AC_UF894,1000_QL80_.jpg', ['White','Black'], ['S','M','L','XL']],
    ['เสื้อกล้าม Active', 'TANK_TOP', 320, 70, '/images/1782685941070-8vq8y9qxsos-189fa748c3_gojo-blue-eyes-jujutsu-kaisen-hd-live.webp', ['White','Black'], ['S','M','L']],
    ['เสื้อยืด Essential สีดำ', 'TSHIRT', 310, 100, '/img/white-t-shirt/template/wh-t-shirt-TEM-f.png', ['Black'], ['S','M','L','XL','XXL']],
    ['เสื้อยืดสกรีนหน้าอก', 'TSHIRT', 420, 75, '/img/white-t-shirt/template/wh-t-shirt-TEM-b.png', ['White','Cream'], ['S','M','L','XL']],
    ['โปโล Smart Casual', 'POLO', 550, 50, '/img/white-t-shirt/template/wh-t-shirt-TEM-f-removebg.png', ['Navy','White'], ['M','L','XL']],
    ['ฮู้ดดี้ Everyday Zip', 'HOODIE', 890, 35, '/img/white-t-shirt/template/wh-t-shirt-TEM-b-removebg.png', ['Black','Gray'], ['M','L','XL','XXL']],
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
  const colorsList = [['White'], ['Black'], ['Gray'], ['Navy'], ['Black', 'Gray'], ['White', 'Navy'], ['White', 'Black']];
  const sizesList = [['S', 'M', 'L'], ['M', 'L', 'XL'], ['S', 'M', 'L', 'XL'], ['M', 'L', 'XL', 'XXL']];
  const imagesMap = {
    'TSHIRT': '/img/white-t-shirt/wh-t-shirt-cover.jpg',
    'POLO': '/images/1782492893964-zd9aa4mk6g-test.png',
    'HOODIE': '/img/white-t-shirt/template/wh-t-shirt-TEM-b-removebg.png',
    'LONG_SLEEVE': '/images/1782685941069-yf77vik6g1-71-lp7NYU5L._AC_UF894,1000_QL80_.jpg',
    'TANK_TOP': '/images/1782685941070-8vq8y9qxsos-189fa748c3_gojo-blue-eyes-jujutsu-kaisen-hd-live.webp'
  };

  for (let i = 1; i <= 90; i++) {
    const category = categoriesList[i % categoriesList.length];
    const name = `${categoriesNames[category]} รุ่นที่ ${i}`;
    const price = 250 + ((i * 15) % 650);
    const stock = 10 + ((i * 7) % 150);
    const image = imagesMap[category];
    const colors = colorsList[i % colorsList.length];
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
