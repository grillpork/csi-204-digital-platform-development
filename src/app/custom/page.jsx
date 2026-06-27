"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Upload, ShoppingCart, CheckCircle2, Image as ImageIcon, ArrowLeft, Move, ZoomIn, ZoomOut, RotateCcw, Trash2, FlipHorizontal2 } from 'lucide-react';
import NavbarA from '../../components/ui/NavbarA';
import { mockProducts } from '../data/products';
import { useProductStore } from '../../store/product';

const DEFAULT_PRINT_ZONE = { x: 0.27, y: 0.20, w: 0.46, h: 0.70 };

export default function CustomShirtPage() {
  const searchParams = useSearchParams();
  const productId = parseInt(searchParams.get('id')) || 1;
  const product = mockProducts.find((p) => p.id === productId) || mockProducts[0];

  const [lang, setLang] = useState('TH');
  
  const addToCart = useProductStore((state) => state.addToCart);

  // Front / Back toggle
  const [viewSide, setViewSide] = useState('front');

  // Uploaded overlay image — separate state per side
  const [overlayImageFront, setOverlayImageFront] = useState(null);
  const [overlayImageBack, setOverlayImageBack] = useState(null);
  const [overlayPosFront, setOverlayPosFront] = useState({ x: 150, y: 200 });
  const [overlayPosBack, setOverlayPosBack] = useState({ x: 150, y: 200 });
  const [overlaySizeFront, setOverlaySizeFront] = useState(120);
  const [overlaySizeBack, setOverlaySizeBack] = useState(120);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Derived current-side values
  const overlayImage = viewSide === 'front' ? overlayImageFront : overlayImageBack;
  const setOverlayImage = viewSide === 'front' ? setOverlayImageFront : setOverlayImageBack;
  const overlayPos = viewSide === 'front' ? overlayPosFront : overlayPosBack;
  const setOverlayPos = viewSide === 'front' ? setOverlayPosFront : setOverlayPosBack;
  const overlaySize = viewSide === 'front' ? overlaySizeFront : overlaySizeBack;
  const setOverlaySize = viewSide === 'front' ? setOverlaySizeFront : setOverlaySizeBack;

  // Add state to store raw File objects for upload
  const [overlayFileFront, setOverlayFileFront] = useState(null);
  const [overlayFileBack, setOverlayFileBack] = useState(null);
  const setOverlayFile = viewSide === 'front' ? setOverlayFileFront : setOverlayFileBack;

  // Current template image
  const currentTemplateImg = viewSide === 'front'
    ? (product.templateImgFront || product.image)
    : (product.templateImgBack || product.image);

  // Shirt options
  const [shirtSize, setShirtSize] = useState('M');
  const [screenSize, setScreenSize] = useState('A4');
  const [shirtColor, setShirtColor] = useState('White');

  // Submission
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const canvasRef = useRef(null);
  const templateImgRef = useRef(null);

  // Print zone: the area on the shirt body where designs can be placed
  // Defined as percentages of the rendered template image
  // These values match the chest/body area of the t-shirt template
  const printZonePercent = product.printZone || DEFAULT_PRINT_ZONE;

  // Track the pixel-based print zone within the canvas
  const [printZone, setPrintZone] = useState(null);

  // Extract printZone values to use in dependencies list to prevent dependency recreation issues
  const pzX = printZonePercent.x;
  const pzY = printZonePercent.y;
  const pzW = printZonePercent.w;
  const pzH = printZonePercent.h;

  // Compute the rendered image bounds and print zone in pixels
  const computePrintZone = useCallback(() => {
    const img = templateImgRef.current;
    const container = canvasRef.current;
    if (!img || !container || !img.naturalWidth || !img.naturalHeight) return;

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = containerW / containerH;

    let renderedW, renderedH;
    if (imgRatio > containerRatio) {
      renderedW = containerW;
      renderedH = containerW / imgRatio;
    } else {
      renderedH = containerH;
      renderedW = containerH * imgRatio;
    }

    const imgOffsetX = (containerW - renderedW) / 2;
    const imgOffsetY = (containerH - renderedH) / 2;

    // Convert percentage-based print zone to pixel coordinates within the canvas
    setPrintZone({
      x: imgOffsetX + pzX * renderedW,
      y: imgOffsetY + pzY * renderedH,
      w: pzW * renderedW,
      h: pzH * renderedH,
    });
  }, [pzX, pzY, pzW, pzH]);

  // Recompute on resize
  useEffect(() => {
    computePrintZone();
    window.addEventListener('resize', computePrintZone);
    return () => window.removeEventListener('resize', computePrintZone);
  }, [computePrintZone, currentTemplateImg]);

  // Handle file upload
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setOverlayFile(file); // Store raw File object
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setOverlayImage(reader.result);
        // Center the overlay within the print zone
        if (printZone) {
          setOverlayPos({
            x: printZone.x + printZone.w / 2,
            y: printZone.y + printZone.h / 2,
          });
        } else {
          setOverlayPos({ x: 150, y: 200 });
        }
        setOverlaySize(120);
        setUploadSuccess(false);
      });
      reader.readAsDataURL(file);
    }
  };

  // Mouse/Touch drag handlers
  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Check if click is within the overlay image
    const halfSize = overlaySize / 2;
    if (
      mouseX >= overlayPos.x - halfSize &&
      mouseX <= overlayPos.x + halfSize &&
      mouseY >= overlayPos.y - halfSize &&
      mouseY <= overlayPos.y + halfSize
    ) {
      setIsDragging(true);
      setDragOffset({
        x: mouseX - overlayPos.x,
        y: mouseY - overlayPos.y,
      });
    }
  }, [overlayPos, overlaySize]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const halfSize = overlaySize / 2;
    let newX = clientX - rect.left - dragOffset.x;
    let newY = clientY - rect.top - dragOffset.y;

    // Clamp so the overlay stays within the print zone on the shirt
    if (printZone) {
      newX = Math.max(printZone.x + halfSize, Math.min(printZone.x + printZone.w - halfSize, newX));
      newY = Math.max(printZone.y + halfSize, Math.min(printZone.y + printZone.h - halfSize, newY));
    } else {
      newX = Math.max(halfSize, Math.min(rect.width - halfSize, newX));
      newY = Math.max(halfSize, Math.min(rect.height - halfSize, newY));
    }

    setOverlayPos({ x: newX, y: newY });
  }, [isDragging, dragOffset, overlaySize, printZone]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const generateCompositeImage = () => {
    return new Promise((resolve, reject) => {
      const container = canvasRef.current;
      const templateImg = templateImgRef.current;
      if (!container || !templateImg) {
        reject(new Error("Canvas elements not loaded"));
        return;
      }

      // Create a high-resolution canvas with 4:3.5 aspect ratio
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 700;
      const ctx = canvas.getContext('2d');

      const containerW = 800;
      const containerH = 700;
      const imgRatio = templateImg.naturalWidth / templateImg.naturalHeight;
      const containerRatio = containerW / containerH;

      let renderedW, renderedH;
      if (imgRatio > containerRatio) {
        renderedW = containerW;
        renderedH = containerW / imgRatio;
      } else {
        renderedH = containerH;
        renderedW = containerH * imgRatio;
      }

      const imgOffsetX = (containerW - renderedW) / 2;
      const imgOffsetY = (containerH - renderedH) / 2;

      // Draw template image
      ctx.drawImage(templateImg, imgOffsetX, imgOffsetY, renderedW, renderedH);

      // Draw overlay image
      if (overlayImage) {
        const overlay = new Image();
        overlay.crossOrigin = "anonymous";
        overlay.onload = () => {
          // Scale client coordinates to high-resolution canvas size (800x700)
          const scaleX = 800 / container.clientWidth;
          const scaleY = 700 / container.clientHeight;

          const canvasOverlayX = overlayPos.x * scaleX;
          const canvasOverlayY = overlayPos.y * scaleY;
          const canvasOverlaySize = overlaySize * scaleX;

          ctx.drawImage(
            overlay,
            canvasOverlayX - canvasOverlaySize / 2,
            canvasOverlayY - canvasOverlaySize / 2,
            canvasOverlaySize,
            canvasOverlaySize
          );

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png');
        };
        overlay.onerror = (err) => reject(err);
        overlay.src = overlayImage;
      } else {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      }
    });
  };

  const handlePreorder = async () => {
    const currentFile = viewSide === 'front' ? overlayFileFront : overlayFileBack;
    if (!currentFile) {
      alert('กรุณาอัปโหลดรูปภาพสกรีนเสื้อก่อนยืนยัน');
      return;
    }

    try {
      setIsUploading(true);

      // 1. Generate composite image blob
      const compositeBlob = await generateCompositeImage();

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('designImage', compositeBlob, `custom-design-${viewSide}.png`);
      formData.append('shirtSize', shirtSize);
      formData.append('screenSize', screenSize);
      formData.append('color', shirtColor);

      // 3. Upload to server
      const response = await fetch('/api/custom-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Calculate price based on options
      let finalPrice = product.price;
      if (screenSize === 'A3') finalPrice += 100;
      if (screenSize === 'Logo') finalPrice -= 50;

      // 4. Add the composite designed product to the shopping cart store
      addToCart({
        id: `custom-${product.id}-${Date.now()}`,
        name: `${product.name} (Custom — ${viewSide === 'front' ? 'ด้านหน้า' : 'ด้านหลัง'})`,
        price: finalPrice,
        image: data.imageUrl, // Show the composite image containing the uploaded print
        quantity: 1,
        details: {
          shirtSize,
          screenSize,
          color: shirtColor,
          side: viewSide
        }
      });

      setUploadSuccess(true);
    } catch (e) {
      console.error(e);
      alert('การสั่งซื้อล้มเหลว กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <NavbarA lang={lang} onLangToggle={() => setLang((l) => (l === 'EN' ? 'TH' : 'EN'))} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-[#a1a1aa] mb-8 items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> กลับสู่หน้าหลัก
          </Link>
          <span>/</span>
          <Link href={`/product/${product.id}`} className="hover:text-white transition-colors">
            {product.name}
          </Link>
          <span>/</span>
          <span className="text-white font-medium">ออกแบบเอง</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            ออกแบบเสื้อ — {product.name}
          </h1>
          <p className="text-[#a1a1aa] text-lg">
            อัปโหลดลายของคุณแล้วลากวางตำแหน่งที่ต้องการบนเสื้อ
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-[#27272a] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
          {/* Left: Template Canvas */}
          <div className="flex-1 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[#27272a]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                1. วางลายบนเสื้อ
              </h2>

              {/* Front / Back toggle */}
              <div className="flex items-center bg-[#111] rounded-lg border border-[#27272a] p-0.5">
                <button
                  onClick={() => setViewSide('front')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewSide === 'front'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  ด้านหน้า
                </button>
                <button
                  onClick={() => setViewSide('back')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewSide === 'back'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  ด้านหลัง
                </button>
              </div>
            </div>

            {/* Controls under canvas */}
            {overlayImage && (
              <div className="pb-3 flex flex-wrap justify-center items-center gap-3">
                {/* Size controls */}
                <div className="flex items-center gap-2 bg-[#111] rounded-lg px-3 py-2 border border-[#27272a]">
                  <ZoomOut size={16} className="text-[#a1a1aa]" />
                  <input
                    type="range"
                    min={40}
                    max={300}
                    value={overlaySize}
                    onChange={(e) => setOverlaySize(parseInt(e.target.value))}
                    className="w-32 accent-blue-500"
                  />
                  <ZoomIn size={16} className="text-[#a1a1aa]" />
                  <span className="text-xs text-[#a1a1aa] ml-1 w-10">{overlaySize}px</span>
                </div>

                {/* Reset position */}
                <button
                  onClick={() => { setOverlayPos({ x: 150, y: 200 }); setOverlaySize(120); }}
                  className="flex items-center gap-1.5 text-sm text-[#a1a1aa] hover:text-white bg-[#111] border border-[#27272a] px-3 py-2 rounded-lg transition-colors"
                >
                  <RotateCcw size={14} />
                  รีเซ็ต
                </button>

                {/* Remove overlay */}
                <button
                  onClick={() => {
                    setOverlayImage(null);
                    setOverlayFile(null);
                  }}
                  className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 bg-[#111] border border-red-500/30 px-3 py-2 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  ลบลาย
                </button>
              </div>
            )}

            {/* Template + Overlay Canvas */}
            <div
              ref={canvasRef}
              className="relative w-full bg-[#111] rounded-xl overflow-hidden select-none"
              style={{ aspectRatio: '4/3.5', cursor: isDragging ? 'grabbing' : 'default' }}
              onMouseDown={overlayImage ? handlePointerDown : undefined}
              onTouchStart={overlayImage ? handlePointerDown : undefined}
            >

              {/* Drag hint */}
              {overlayImage && !isDragging && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-xs text-white/80 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Move size={12} />
                  ลากเพื่อย้ายตำแหน่งลาย
                </div>
              )}

              {/* Template Image */}
              <img
                ref={templateImgRef}
                src={currentTemplateImg}
                alt={`${product.name} — ${viewSide === 'front' ? 'ด้านหน้า' : 'ด้านหลัง'}`}
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
                onLoad={computePrintZone}
              />

              {/* Print Zone Guide (dashed rectangle) */}
              {printZone && (
                <div
                  className="absolute border-2 border-dashed border-blue-400/40 rounded-lg pointer-events-none"
                  style={{
                    left: `${printZone.x}px`,
                    top: `${printZone.y}px`,
                    width: `${printZone.w}px`,
                    height: `${printZone.h}px`,
                  }}
                >
                  {/* {!overlayImage && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-blue-400/60 whitespace-nowrap font-medium">
                      พื้นที่สกรีน
                    </span>
                  )} */}
                </div>
              )}

              {/* Overlay Image */}
              {overlayImage && (
                <img
                  src={overlayImage}
                  alt="custom overlay"
                  className="absolute pointer-events-none"
                  style={{
                    width: `${overlaySize}px`,
                    height: `${overlaySize}px`,
                    objectFit: 'contain',
                    left: `${overlayPos.x - overlaySize / 2}px`,
                    top: `${overlayPos.y - overlaySize / 2}px`,
                    filter: isDragging ? 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' : 'none',
                    transition: isDragging ? 'none' : 'filter 0.2s',
                  }}
                  draggable={false}
                />
              )}

              {/* No image uploaded hint */}
              {!overlayImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Upload className="mx-auto h-10 w-10 text-[#a1a1aa] mb-3" />
                    <p className="text-[#a1a1aa] text-sm">กรุณาอัปโหลดรูปลายสกรีนเพื่อเริ่มออกแบบ</p>
                  </div>
                </div>
              )}
            </div>

            
          </div>

          {/* Right: Options & Upload */}
          <div className="w-full lg:w-80 p-6 md:p-8 bg-[#121212] flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-6">2. รายละเอียดเสื้อ</h2>

              {/* Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">อัปโหลดลายสกรีน</label>
                <label
                  htmlFor="file-upload-custom"
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-[#3f3f46] px-4 py-4 hover:bg-[#27272a] transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">
                    {overlayImage ? 'เปลี่ยนรูปภาพ' : 'เลือกรูปภาพ'}
                  </span>
                  <input
                    id="file-upload-custom"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={onFileChange}
                  />
                </label>
                <p className="text-xs text-[#a1a1aa] mt-2 text-center">รองรับ PNG, JPG, GIF สูงสุด 10MB</p>
              </div>

              {/* Color */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">สีเสื้อ</label>
                <div className="flex gap-3">
                  <button onClick={() => setShirtColor('White')} className={`w-8 h-8 rounded-full bg-white border-2 ${shirtColor === 'White' ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-200'}`}></button>
                  <button onClick={() => setShirtColor('Black')} className={`w-8 h-8 rounded-full bg-black border-2 ${shirtColor === 'Black' ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-[#27272a]'}`}></button>
                </div>
              </div>

              {/* Shirt Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">ไซส์เสื้อ</label>
                <select
                  value={shirtSize}
                  onChange={(e) => setShirtSize(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-[#ededed] bg-[#1a1a1a] ring-1 ring-inset ring-[#27272a] focus:ring-2 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="S">S (อก 34&quot;)</option>
                  <option value="M">M (อก 38&quot;)</option>
                  <option value="L">L (อก 42&quot;)</option>
                  <option value="XL">XL (อก 46&quot;)</option>
                  <option value="2XL">2XL (อก 50&quot;)</option>
                </select>
              </div>

              {/* Screen Size */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">ขนาดสกรีน</label>
                <select
                  value={screenSize}
                  onChange={(e) => setScreenSize(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-[#ededed] bg-[#1a1a1a] ring-1 ring-inset ring-[#27272a] focus:ring-2 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Logo">Logo (ไม่เกิน 10x10 cm)</option>
                  <option value="A4">A4 (มาตรฐาน)</option>
                  <option value="A3">A3 (เต็มหน้าอก/หลัง)</option>
                </select>
              </div>
            </div>

            {/* Preorder Button or Success */}
            <div>
              {uploadSuccess ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-semibold mb-1">สั่งซื้อสำเร็จ!</p>
                  <p className="text-xs text-green-300/80 mb-3">รายการของคุณถูกบันทึกแล้ว</p>
                  <button
                    onClick={() => {
                      setOverlayImageFront(null);
                      setOverlayImageBack(null);
                      setOverlayFileFront(null);
                      setOverlayFileBack(null);
                      setUploadSuccess(false);
                    }}
                    className="text-xs px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-md transition-colors"
                  >
                    สั่งเพิ่มอีกตัว
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handlePreorder}
                    disabled={!overlayImage || isUploading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-[#27272a] disabled:text-[#a1a1aa] disabled:cursor-not-allowed transition-all"
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
                  <button
                    disabled={!overlayImage || isUploading}
                    className="max-w-30 flex items-center justify-center gap-1.5 rounded-xl border border-[#3f3f46] bg-[#1a1a1a] px-1 py-1 text-sm font-semibold text-[#ededed] hover:bg-[#27272a] hover:border-[#52525b] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="บันทึกลงคอลเลกชั่น"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    บันทึกลงคอลเลกชั่น
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
