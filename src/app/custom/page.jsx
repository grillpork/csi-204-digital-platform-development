"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, ShoppingCart, CheckCircle2, Image as ImageIcon, ArrowLeft, Move, ZoomIn, ZoomOut, RotateCcw, Trash2, FlipHorizontal2, Tag } from 'lucide-react';
import { mockProducts } from '@/app/data/products';
import { useProductStore } from '@/store/product';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_PRINT_ZONE = { x: 0.27, y: 0.20, w: 0.46, h: 0.70 };

function CustomShirtPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const productId = parseInt(searchParams.get('id')) || 1;
  const product = mockProducts.find((p) => p.id === productId) || mockProducts[0];

  const addToCart = useProductStore((state) => state.addToCart);

  // States for posting custom shirt for sale
  const [showPostModal, setShowPostModal] = useState(false);
  const [postName, setPostName] = useState(product.name ? `เสื้อยืดคัสตอมลายพิเศษ` : "เสื้อยืดคัสตอม");
  const [postDescription, setPostDescription] = useState("เสื้อยืดสตรีทแวร์คัสตอมลายพิเศษ คุณภาพพรีเมียม");
  const [postPrice, setPostPrice] = useState(product.price || 370);
  const [postIsPublic, setPostIsPublic] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

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
  const [printTechnique, setPrintTechnique] = useState('DFT');

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
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า');
      router.push('/login');
      return;
    }

    const currentFile = viewSide === 'front' ? overlayFileFront : overlayFileBack;
    if (!currentFile) {
      alert('กรุณาอัปโหลดรูปภาพสกรีนเสื้อก่อนยืนยัน');
      return;
    }

    try {
      setIsUploading(true);

      // 1. Generate composite image blob
      const compositeBlob = await generateCompositeImage();

      // Calculate price based on options
      let finalPrice = product.price;
      if (screenSize === 'A3') finalPrice += 100;
      if (screenSize === 'Logo') finalPrice -= 50;

      // 2. Auto-save customized shirt design as a draft product (isPublic = false)
      const formData = new FormData();
      formData.append('images', compositeBlob, `custom-design-${viewSide}.png`);
      formData.append('name', `${product.name} (Custom — ${viewSide === 'front' ? 'ด้านหน้า' : 'ด้านหลัง'})`);
      formData.append('description', `เสื้อยืดแต่งลายคัสตอมส่วนตัว ขนาดสกรีน ${screenSize}`);
      formData.append('price', finalPrice.toString());
      
      const postCategory = product.category || 'TSHIRT';
      formData.append('category', postCategory);
      formData.append('colors', shirtColor);
      formData.append('sizes', shirtSize);
      formData.append('stock', '1');

      // Append custom design metadata for manufacturing & reproduction
      formData.append('isCustom', 'true');
      formData.append('baseProductId', product.id.toString());
      formData.append('overlayFile', currentFile); // Original transparent graphic
      formData.append('overlayPositionX', overlayPos.x.toString());
      formData.append('overlayPositionY', overlayPos.y.toString());
      formData.append('overlaySize', overlaySize.toString());
      formData.append('printSide', viewSide);
      formData.append('screenSize', screenSize);
      formData.append('printTechnique', printTechnique);
      formData.append('isPublic', 'false'); // draft/private product

      // 3. Post product creation to server
      const productResponse = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      const productResult = await productResponse.json();

      if (!productResponse.ok) {
        throw new Error(productResult.error || 'Failed to create customized product');
      }

      const createdProduct = productResult.data;

      // 4. Add the newly created customized product ID to the cart
      const cartResult = await addToCart({
        id: createdProduct.id,
      });

      if (cartResult?.needLogin) {
        router.push('/login');
        return;
      }

      // 5. Redirect the user to checkout/payment drawer on the shop page
      router.push('/?checkout=true');
    } catch (e) {
      console.error(e);
      alert('การสั่งซื้อล้มเหลว กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePostForSale = async () => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนทำการโพสขายสินค้า');
      router.push('/login');
      return;
    }

    const currentFile = viewSide === 'front' ? overlayFileFront : overlayFileBack;
    if (!currentFile) {
      alert('กรุณาอัปโหลดรูปภาพสกรีนเสื้อก่อนทำรายการ');
      return;
    }

    if (!postName.trim() || !postDescription.trim()) {
      alert('กรุณากรอกข้อมูลสินค้าให้ครบถ้วน');
      return;
    }

    try {
      setIsPosting(true);

      // 1. Generate composite image blob
      const compositeBlob = await generateCompositeImage();

      // 2. Prepare FormData for API POST /api/products
      const formData = new FormData();
      formData.append('images', compositeBlob, `custom-design-${viewSide}.png`);
      formData.append('name', postName);
      formData.append('description', postDescription);
      formData.append('price', postPrice.toString());
      
      const postCategory = product.category || 'TSHIRT';
      formData.append('category', postCategory);
      
      // Add all available sizes and colors to the product listing
      formData.append('colors', shirtColor);
      const availableSizes = ["S", "M", "L", "XL", "XXL"];
      availableSizes.forEach(sz => formData.append('sizes', sz));
      
      formData.append('stock', '100'); // print-on-demand stock

      // Append custom design metadata for manufacturing & reproduction
      formData.append('isCustom', 'true');
      formData.append('baseProductId', product.id.toString());
      formData.append('overlayFile', currentFile); // Original transparent graphic
      formData.append('overlayPositionX', overlayPos.x.toString());
      formData.append('overlayPositionY', overlayPos.y.toString());
      formData.append('overlaySize', overlaySize.toString());
      formData.append('printSide', viewSide);
      formData.append('screenSize', screenSize);
      formData.append('printTechnique', printTechnique);
      formData.append('isPublic', postIsPublic ? 'true' : 'false');

      // 3. Post to server
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      const resultData = await response.json();

      if (!response.ok) {
        if (resultData.errors) {
          const errorsText = Object.entries(resultData.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
            .join('\n');
          throw new Error(errorsText || 'Validation failed');
        }
        throw new Error(resultData.error || 'Failed to post product');
      }

      alert('โพสขายสินค้าของคุณเรียบร้อยแล้ว!');
      setShowPostModal(false);
      
      if (resultData.data?.id) {
        router.push(`/product/${resultData.data.id}`);
      } else {
        router.push('/');
      }
    } catch (e) {
      console.error(e);
      alert(`การโพสขายล้มเหลว: ${e.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-slate-500 mb-8 items-center gap-2">
          <Link href="/" className="hover:text-slate-950 transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> กลับสู่หน้าหลัก
          </Link>
          <span>/</span>
          <Link href={`/product/${product.id}`} className="hover:text-slate-950 transition-colors">
            {product.name}
          </Link>
          <span>/</span>
          <span className="text-slate-950 font-medium">ออกแบบเอง</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            ออกแบบเสื้อ — {product.name}
          </h1>
          <p className="text-slate-500 text-lg">
            อัปโหลดลายของคุณแล้วลากวางตำแหน่งที่ต้องการบนเสื้อ
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row shadow-sm">
          {/* Left: Template Canvas */}
          <div className="flex-1 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                1. วางลายบนเสื้อ
              </h2>

              {/* Front / Back toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5">
                <button
                  onClick={() => setViewSide('front')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewSide === 'front'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  ด้านหน้า
                </button>
                <button
                  onClick={() => setViewSide('back')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewSide === 'back'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
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
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                  <ZoomOut size={16} className="text-slate-500" />
                  <input
                    type="range"
                    min={40}
                    max={300}
                    value={overlaySize}
                    onChange={(e) => setOverlaySize(parseInt(e.target.value))}
                    className="w-32 accent-blue-500"
                  />
                  <ZoomIn size={16} className="text-slate-500" />
                  <span className="text-xs text-slate-500 ml-1 w-10">{overlaySize}px</span>
                </div>

                {/* Reset position */}
                <button
                  onClick={() => { setOverlayPos({ x: 150, y: 200 }); setOverlaySize(120); }}
                  className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-800 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg transition-colors"
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
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 bg-red-50/50 border border-red-200 px-3 py-2 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  ลบลาย
                </button>
              </div>
            )}

            {/* Template + Overlay Canvas */}
            <div
              ref={canvasRef}
              className="relative w-full bg-slate-100/50 border border-slate-200/60 rounded-xl overflow-hidden select-none"
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
                />
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
                    <Upload className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">กรุณาอัปโหลดรูปลายสกรีนเพื่อเริ่มออกแบบ</p>
                  </div>
                </div>
              )}
            </div>


          </div>

          {/* Right: Options & Upload */}
          <div className="w-full lg:w-80 p-6 md:p-8 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-6">2. รายละเอียดเสื้อ</h2>

              {/* Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">อัปโหลดลายสกรีน</label>
                <label
                  htmlFor="file-upload-custom"
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-slate-300 px-4 py-4 hover:bg-slate-100/50 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-blue-500">
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
                <p className="text-xs text-slate-400 mt-2 text-center">รองรับ PNG, JPG, GIF สูงสุด 10MB</p>
              </div>

              {/* Color */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">สีเสื้อ</label>
                <div className="flex gap-3">
                  <button onClick={() => setShirtColor('White')} className={`w-8 h-8 rounded-full bg-white border-2 ${shirtColor === 'White' ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-200'}`}></button>
                  <button onClick={() => setShirtColor('Black')} className={`w-8 h-8 rounded-full bg-black border-2 ${shirtColor === 'Black' ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-slate-800'}`}></button>
                </div>
              </div>

              {/* Shirt Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">ไซส์เสื้อ</label>
                <select
                  value={shirtSize}
                  onChange={(e) => setShirtSize(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 bg-white ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="S">S (อก 34&quot;)</option>
                  <option value="M">M (อก 38&quot;)</option>
                  <option value="L">L (อก 42&quot;)</option>
                  <option value="XL">XL (อก 46&quot;)</option>
                  <option value="2XL">2XL (อก 50&quot;)</option>
                </select>
              </div>

              {/* Screen Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">ขนาดสกรีน</label>
                <select
                  value={screenSize}
                  onChange={(e) => setScreenSize(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 bg-white ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Logo">Logo (ไม่เกิน 10x10 cm)</option>
                  <option value="A4">A4 (มาตรฐาน)</option>
                  <option value="A3">A3 (เต็มหน้าอก/หลัง)</option>
                </select>
              </div>

              {/* Screen Technique */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-600 mb-2">เทคนิคการสกรีน</label>
                <select
                  value={printTechnique}
                  onChange={(e) => setPrintTechnique(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 bg-white ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="DFT">DFT (พิมพ์ฟิล์มรีดร้อน - สีสด ละเอียด)</option>
                  <option value="DTG">DTG (พิมพ์ตรงลงเสื้อ - นุ่ม ซึมเข้าเนื้อผ้า)</option>
                </select>
              </div>
            </div>

            {/* Preorder Button or Success */}
            <div>
              {uploadSuccess ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-semibold mb-1">สั่งซื้อสำเร็จ!</p>
                  <p className="text-xs text-green-600/80 mb-3">รายการของคุณถูกบันทึกแล้ว</p>
                  <button
                    onClick={() => {
                      setOverlayImageFront(null);
                      setOverlayImageBack(null);
                      setOverlayFileFront(null);
                      setOverlayFileBack(null);
                      setUploadSuccess(false);
                    }}
                    className="text-xs px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
                  >
                    สั่งเพิ่มอีกตัว
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handlePreorder}
                    disabled={!overlayImage || isUploading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
                  >
                    {isUploading ? (
                      <span className="animate-pulse">กำลังประมวลผล...</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        พรีออเดอร์
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowPostModal(true)}
                    disabled={!overlayImage || isUploading}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 px-3 py-3.5 text-sm font-semibold hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="โพสขายเสื้อชิ้นนี้"
                  >
                    <Tag className="w-4 h-4" />
                    โพสขาย
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for posting custom shirt */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              ข้อมูลเพื่อโพสขายเสื้อยืด
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              กำหนดรายละเอียดสำหรับสินค้าชิ้นนี้เพื่อเผยแพร่ลงบนตลาดกลาง (Marketplace)
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">ชื่อสินค้า</label>
                <input
                  type="text"
                  value={postName}
                  onChange={(e) => setPostName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="เช่น เสื้อยืดพิมพ์ลายกราฟิกแนวสตรีท"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">รายละเอียดสินค้า</label>
                <textarea
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="รายละเอียดลายสกรีน เนื้อผ้า ทรงเสื้อ..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">ราคาขาย (บาท)</label>
                <input
                  type="number"
                  value={postPrice}
                  onChange={(e) => setPostPrice(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">สถานะสินค้า</label>
                <select
                  value={postIsPublic ? "true" : "false"}
                  onChange={(e) => setPostIsPublic(e.target.value === "true")}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="true">เผยแพร่ทันที (Published)</option>
                  <option value="false">บันทึกเป็นแบบร่าง (Draft)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPostModal(false)}
                disabled={isPosting}
                className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 text-sm font-semibold transition-all disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handlePostForSale}
                disabled={isPosting}
                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-3 text-sm font-semibold transition-all shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isPosting ? 'กำลังโพส...' : 'โพสขายสินค้า'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomShirtPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <span className="animate-pulse font-medium">กำลังโหลดหน้าระบบออกแบบ...</span>
      </div>
    }>
      <CustomShirtPageContent />
    </Suspense>
  );
}
