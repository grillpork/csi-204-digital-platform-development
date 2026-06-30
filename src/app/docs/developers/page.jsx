"use client";

import React from 'react';
import { Mail, Code2, Layers, Cpu, Database } from 'lucide-react';

const developers = [
  {
    id: 1,
    name: "นักพัฒนาคนที่ 1",
    role: "Full Stack Developer",
    bio: "รับผิดชอบการออกแบบโครงสร้างสถาปัตยกรรม Frontend (Next.js) และการจัดการระบบ State ในหน้าสั่งออกแบบเสื้อผ้า (Custom Designer)",
    skills: ["Next.js", "React.js", "Zustand", "Tailwind CSS"],
    email: "dev1@example.com",
    github: "github.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "นักพัฒนาคนที่ 2",
    role: "Full Stack Developer",
    bio: "ดูแลรับผิดชอบระบบหลังบ้าน (Backend Route Handlers) และความปลอดภัยของระบบยืนยันตัวตน (JWT Authentication / NextAuth)",
    skills: ["Node.js", "NextAuth", "JWT", "RESTful API"],
    email: "dev2@example.com",
    github: "github.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "นักพัฒนาคนที่ 3",
    role: "Full Stack Developer",
    bio: "ออกแบบฐานข้อมูลเชิงสัมพันธ์ (PostgreSQL) การจัดการข้อมูลความคมชัดของอาร์ตเวิร์ค และระบบจัดการคลังเสื้อ (Inventory Management)",
    skills: ["PostgreSQL", "Prisma ORM", "Neon Database", "SQL"],
    email: "dev3@example.com",
    github: "github.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "นักพัฒนาคนที่ 4",
    role: "Full Stack Developer",
    bio: "จัดการระบบคำนวณราคาขาย (Pricing Service) การคำนวณแบ่งส่วนรายได้กำไร (Revenue Sharing) และเชื่อมโยงระบบตะกร้าสินค้า",
    skills: ["Zustand State", "Checkout Logic", "Pricing Algorithm", "UI/UX"],
    email: "dev4@example.com",
    github: "github.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "นักพัฒนาคนที่ 5",
    role: "Full Stack Developer",
    bio: "ดูแลรับผิดชอบระบบบริการยืนยันตัวตนผู้ใช้ (KYC), การถอนเงินรายได้ (Withdrawal Process) และระบบติดตามขนส่งสินค้า (Tracking Number)",
    skills: ["KYC Integration", "Payment Webhooks", "Logistics API", "Cloud Storage"],
    email: "dev5@example.com",
    github: "github.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop"
  }
];

export default function DevelopersPage() {
  return (
    <div className="w-full bg-white text-slate-800">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">ทีมผู้พัฒนา (Developer Team)</h1>
        <p className="text-[15px] leading-7 text-slate-500 max-w-2xl">
          กลุ่มผู้พัฒนาแพลตฟอร์ม The Shirtsy ประกอบด้วยนักพัฒนาฟูลสแต็ก 5 ท่านที่รับผิดชอบร่วมกันในการออกแบบ พัฒนา และดูแลความปลอดภัยของระบบทั้งหมด
        </p>
      </div>

      {/* Grid Layout for Dev Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {developers.map((dev) => (
          <div 
            key={dev.id} 
            className="group flex flex-col justify-between bg-slate-50 hover:bg-slate-100/70 border border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <img 
                    src={dev.avatar} 
                    alt={dev.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base">{dev.name}</h3>
                  <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 mt-1">
                    {dev.role}
                  </span>
                </div>
              </div>

              {/* Bio description */}
              <p className="text-xs leading-relaxed text-slate-500 mb-6 min-h-[50px]">
                {dev.bio}
              </p>

              {/* Core Skill Pills */}
              <div className="mb-6">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">เชี่ยวชาญ / ทักษะหลัก</h4>
                <div className="flex flex-wrap gap-1.5">
                  {dev.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="text-[11px] font-medium px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Contact Links */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer">
                <Mail className="w-3.5 h-3.5" />
                {dev.email}
              </span>
              <a 
                href={`https://${dev.github}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Overview Info Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600" />
          การทำงานแบบ Full-Stack ในทีม
        </h3>
        <p className="text-xs leading-relaxed text-slate-600">
          ทีมงานนักพัฒนาทั้ง 5 คน ปฏิบัติการร่วมกันภายใต้ระเบียบวิธีพัฒนาซอฟต์แวร์สมัยใหม่ (Agile Methodology) สามารถสลับสับเปลี่ยนหน้าที่การทำงานทั้งส่วนหน้าบ้าน (Frontend) ระบบประมวลผลเซิร์ฟเวอร์ (Backend) การออกแบบฐานข้อมูล และการควบคุมระบบคลาวด์เพื่อความยืดหยุ่นในการแก้ปัญหาและเพิ่มความเร็วในการขยายตัวของฟังก์ชันแพลตฟอร์ม
        </p>
      </div>
    </div>
  );
}
