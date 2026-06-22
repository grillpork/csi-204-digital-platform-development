"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Upload, Scissors, ShoppingCart, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import getCroppedImg from '../../utils/cropImage';
import NavbarA from '../page'; // Assuming you have a reusable navbar, else I'll omit or put a placeholder. Wait, page.jsx doesn't export NavbarA as default. I will just build a simple header.

export default function CustomShirtPage() {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const [shirtSize, setShirtSize] = useState('M');
  const [screenSize, setScreenSize] = useState('A4');
  const [shirtColor, setShirtColor] = useState('White');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [resultData, setResultData] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setUploadSuccess(false);
      setResultData(null);
    }
  };

  const handlePreorder = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      
      // 1. Get the cropped image blob
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('designImage', croppedImage, 'custom-design.jpg');
      formData.append('shirtSize', shirtSize);
      formData.append('screenSize', screenSize);
      formData.append('color', shirtColor);

      // 3. Send to API
      const response = await fetch('/api/custom-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResultData(data);
      setUploadSuccess(true);
      
    } catch (e) {
      console.error(e);
      alert('การสั่งซื้อล้มเหลว กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">สั่งตัดเสื้อ Custom (Preorder)</h1>
          <p className="text-[#a1a1aa] text-lg">อัปโหลดลายที่คุณต้องการ เลือกขนาดสกรีนและไซส์เสื้อ</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-[#27272a] overflow-hidden flex flex-col md:flex-row shadow-2xl">
          
          {/* Left Side: Image Upload & Crop */}
          <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-[#27272a]">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-400" />
              1. ลายสกรีนของคุณ
            </h2>
            
            {!imageSrc ? (
              <div className="mt-4 flex justify-center rounded-xl border border-dashed border-[#3f3f46] px-6 py-16 hover:bg-[#27272a] transition-colors cursor-pointer relative">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-[#a1a1aa]" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-[#ededed] justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-300"
                    >
                      <span>อัปโหลดรูปภาพ</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={onFileChange} />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-[#a1a1aa] mt-2">รองรับ PNG, JPG, GIF ขนาดสูงสุด 10MB</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-[400px] bg-[#000] rounded-xl overflow-hidden group">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={3 / 4}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
                <button
                  onClick={() => setImageSrc(null)}
                  className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-md backdrop-blur-md transition-colors"
                >
                  เปลี่ยนรูปใหม่
                </button>
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 p-3 rounded-lg backdrop-blur-md flex items-center gap-3">
                  <Scissors className="w-4 h-4 text-[#a1a1aa]" />
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Options & Preorder */}
          <div className="w-full md:w-80 p-8 bg-[#121212] flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-6">2. รายละเอียดเสื้อ</h2>
              
              {/* Color */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">สีเสื้อ</label>
                <div className="flex gap-3">
                  <button onClick={() => setShirtColor('White')} className={`w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center ${shirtColor === 'White' ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-200'}`}></button>
                  <button onClick={() => setShirtColor('Black')} className={`w-8 h-8 rounded-full bg-black border-2 flex items-center justify-center ${shirtColor === 'Black' ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-[#27272a]'}`}></button>
                </div>
              </div>

              {/* Shirt Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">ไซส์เสื้อ</label>
                <select 
                  value={shirtSize} 
                  onChange={(e) => setShirtSize(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-[#ededed] bg-[#1a1a1a] ring-1 ring-inset ring-[#27272a] focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                >
                  <option value="S">S (อก 34")</option>
                  <option value="M">M (อก 38")</option>
                  <option value="L">L (อก 42")</option>
                  <option value="XL">XL (อก 46")</option>
                  <option value="2XL">2XL (อก 50")</option>
                </select>
              </div>

              {/* Screen Size */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">ขนาดสกรีน</label>
                <select 
                  value={screenSize} 
                  onChange={(e) => setScreenSize(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-[#ededed] bg-[#1a1a1a] ring-1 ring-inset ring-[#27272a] focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                >
                  <option value="Logo">Logo (ไม่เกิน 10x10 cm)</option>
                  <option value="A4">A4 (มาตรฐาน)</option>
                  <option value="A3">A3 (เต็มหน้าอก/หลัง)</option>
                </select>
              </div>
            </div>

            {/* Preorder Button or Success Message */}
            <div>
              {uploadSuccess ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-semibold mb-1">สั่งซื้อสำเร็จ!</p>
                  <p className="text-xs text-green-300/80 break-all mb-3">{resultData?.imageUrl}</p>
                  <button 
                    onClick={() => {
                      setImageSrc(null);
                      setUploadSuccess(false);
                    }}
                    className="text-xs px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-md transition-colors"
                  >
                    สั่งเพิ่มอีกตัว
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePreorder}
                  disabled={!imageSrc || isUploading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-[#27272a] disabled:text-[#a1a1aa] disabled:cursor-not-allowed transition-all"
                >
                  {isUploading ? (
                    <span className="animate-pulse">กำลังประมวลผล...</span>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      ยืนยันการพรีออเดอร์
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}
