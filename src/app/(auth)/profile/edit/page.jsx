"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Trash2, UserRound } from "lucide-react";
import { formatThaiPhone, isValidThaiPhone, phoneDigits } from "@/lib/phone";

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};
  try { return JSON.parse(text); } catch { return {}; }
}

export default function EditProfile() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", bio: "", avatarUrl: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/user/profile")
      .then(async (response) => {
        const body = await readJson(response);
        if (!response.ok) throw new Error(body.error || "โหลดข้อมูลบัญชีไม่สำเร็จ");
        if (active) setForm({ ...body.user, phone: formatThaiPhone(body.user.phone), address: body.user.address || "", bio: body.user.bio || "" });
      })
      .catch((error) => active && setMessage(error.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  function change(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === "phone" ? formatThaiPhone(value) : value }));
  }

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaving(true); setMessage("");
    try {
      const data = new FormData(); data.append("avatar", file);
      const response = await fetch("/api/user/avatar", { method: "POST", body: data });
      const body = await readJson(response);
      if (!response.ok) throw new Error(body.error || "อัปโหลดรูปไม่สำเร็จ");
      setForm((current) => ({ ...current, avatarUrl: body.avatarUrl }));
      await refresh();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  async function removeAvatar() {
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/user/avatar", { method: "DELETE" });
      const body = await readJson(response);
      if (!response.ok) throw new Error(body.error || "ลบรูปไม่สำเร็จ");
      setForm((current) => ({ ...current, avatarUrl: null }));
      await refresh();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  async function submit(event) {
    event.preventDefault();
    if (form.phone && !isValidThaiPhone(form.phone)) {
      setMessage("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักและขึ้นต้นด้วย 0");
      return;
    }
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, phone: form.phone, address: form.address, bio: form.bio }) });
      const body = await readJson(response);
      if (!response.ok) throw new Error(body.error || "บันทึกข้อมูลไม่สำเร็จ");
      await refresh();
      router.push("/profile"); router.refresh();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  if (loading) return <p>กำลังโหลดข้อมูลบัญชี…</p>;
  return <div className="mx-auto max-w-xl">
    <h1 className="mb-6 text-2xl font-bold">แก้ไขข้อมูลส่วนตัว</h1>
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-col items-center gap-3">
        {form.avatarUrl ? <img src={form.avatarUrl} alt="รูปโปรไฟล์" className="h-28 w-28 rounded-full object-cover" /> : <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-100"><UserRound size={40} /></div>}
        <div className="flex gap-2"><label className="cursor-pointer rounded-lg border px-3 py-2 text-xs font-semibold">เปลี่ยนรูป<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} className="hidden" /></label>{form.avatarUrl && <button type="button" onClick={removeAvatar} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600"><Trash2 size={13} />ลบรูป</button>}</div>
        <p className="text-xs text-slate-500">PNG, JPG หรือ WebP ไม่เกิน 10MB</p>
      </div>
      <label className="block text-sm font-medium text-slate-600">ชื่อ-นามสกุล<input name="name" value={form.name} onChange={change} required minLength={2} maxLength={100} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>
      <label className="block text-sm font-medium text-slate-600">อีเมล<input type="email" value={form.email} disabled className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-100 p-3" /><span className="mt-1 block text-xs text-slate-400">อีเมลสำหรับเข้าสู่ระบบไม่สามารถเปลี่ยนจากหน้านี้</span></label>
      <label className="block text-sm font-medium text-slate-600">เบอร์โทรศัพท์<input name="phone" type="tel" inputMode="numeric" pattern="0[0-9]{2}-[0-9]{3}-[0-9]{4}" minLength={12} maxLength={12} placeholder="095-807-2692" value={form.phone} onChange={change} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /><span className="mt-1 block text-xs text-slate-400">รูปแบบ 095-807-2692 ({phoneDigits(form.phone).length}/10 หลัก)</span></label>
      <label className="block text-sm font-medium text-slate-600">ที่อยู่จัดส่ง<textarea name="address" rows={4} value={form.address} onChange={change} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>
      <label className="block text-sm font-medium text-slate-600">เกี่ยวกับฉัน<textarea name="bio" maxLength={500} rows={3} value={form.bio} onChange={change} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>
      {message && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>}
      <button disabled={saving} className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "กำลังบันทึก…" : "บันทึกข้อมูล"}</button>
    </form>
  </div>;
}
