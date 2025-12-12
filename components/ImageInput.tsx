import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, X, RefreshCw, Image as ImageIcon, Smartphone } from 'lucide-react';
import { ImageFile } from '../types';

interface Props {
  onImageSelected: (image: ImageFile) => void;
  currentImage: ImageFile | null;
  onClear: () => void;
}

const ImageInput: React.FC<Props> = ({ onImageSelected, currentImage, onClear }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelected({
        data: reader.result as string,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  // Handle Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("无法访问相机。请检查权限设置。");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onImageSelected({
          data: dataUrl,
          mimeType: 'image/jpeg'
        });
        stopCamera();
      }
    }
  };

  // 1. Camera View
  if (isCameraOpen) {
    return (
      <div className="relative w-full h-[500px] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover" 
          playsInline 
          muted 
        />
        {/* Camera Overlay UI */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        <div className="absolute top-6 right-6 pointer-events-auto">
           <button 
            onClick={stopCamera}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/20 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center pointer-events-auto">
          <button 
            onClick={capturePhoto}
            className="group relative p-1 rounded-full border-4 border-white/30 transition-all active:scale-95"
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-lg group-hover:scale-95 transition-transform duration-200" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Image Preview with Ambient Blur (App Effect)
  if (currentImage) {
    return (
      <div className="relative w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl group transition-all duration-500">
        {/* Ambient Background Layer - Fills Container */}
        <div 
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-110 saturate-150 transition-transform duration-700"
          style={{ backgroundImage: `url(${currentImage.data})` }}
        />
        
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />

        {/* Main Image Container - Proportional & Contained */}
        <div className="relative z-10 w-full min-h-[400px] max-h-[600px] flex items-center justify-center p-6">
          <img 
            src={currentImage.data} 
            alt="Preview" 
            className="max-w-full max-h-[550px] w-auto h-auto object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
          />
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
           <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 bg-black/40 hover:bg-black/60 text-white text-sm font-medium rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-105 shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" /> 
            <span className="hidden sm:inline">更换</span>
          </button>
          <button 
            onClick={onClear}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/80 hover:bg-red-600/90 text-white text-sm font-medium rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-105 shadow-lg shadow-red-500/20"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">移除</span>
          </button>
        </div>

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
        />
      </div>
    );
  }

  // 3. Upload State (Modern/Glassy)
  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative w-full min-h-[360px] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-6 cursor-pointer overflow-hidden group
        ${isDragging 
          ? 'border-primary bg-primary/10 scale-[1.01] shadow-xl shadow-primary/10' 
          : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500/50 hover:shadow-2xl'
        }`}
    >
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -inset-[200px] bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full pointer-events-none" />

      {/* Icons */}
      <div className="relative">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 relative z-10">
          <ImageIcon className="w-10 h-10 text-slate-400 group-hover:text-primary transition-colors duration-300" />
        </div>
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full border border-primary/30 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
      </div>
      
      <div className="text-center relative z-10 px-4">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
          点击或拖拽上传图片
        </h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          支持 JPG, PNG, WebP • 自动识别内容
        </p>
      </div>

      <div className="flex gap-3 relative z-10 mt-2">
        <div className="px-5 py-2.5 bg-slate-700/50 rounded-lg text-slate-300 text-sm font-medium border border-slate-600 group-hover:bg-slate-700 transition-colors">
          浏览文件
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            startCamera();
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-primary hover:text-white text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-primary/25 border border-transparent hover:border-primary/50"
        >
          <Camera className="w-4 h-4" /> 
          打开相机
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageInput;