import React, { useRef, useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface ImageModalProps {
  images: { id: string; path: string; order?: number | null; }[];
  currentIndex: number;
  altText: string; 
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, currentIndex, altText, onClose, onNavigate }) => {
  const [canPan, setCanPan] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    onNavigate(newIndex);
    if (transformRef.current) {
      transformRef.current.resetTransform();
      setCanPan(false);
    }
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    onNavigate(newIndex);
    if (transformRef.current) {
      transformRef.current.resetTransform();
      setCanPan(false);
    }
  };

  const handleThumbnailClick = (index: number) => {
    onNavigate(index);
    if (transformRef.current) {
      transformRef.current.resetTransform();
      setCanPan(false);
    }
  };

  useEffect(() => {
    if (thumbnailRef.current) {
      const activeThumb = thumbnailRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        const scrollLeft = activeThumb.offsetLeft - (thumbnailRef.current.clientWidth / 2) + (activeThumb.clientWidth / 2);
        thumbnailRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  if (!images.length) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Gambar Utama */}
        <div className="relative flex justify-center items-center my-2">
          <TransformWrapper
            ref={transformRef}
            initialScale={1}
            minScale={0.5}
            maxScale={5}
            limitToBounds={true}
            doubleClick={{ disabled: false, mode: canPan ? "reset" : "zoomIn" }}
            pinch={{ disabled: true }}
            wheel={{ disabled: true }}
            panning={{
              disabled: !canPan,
              allowLeftClickPan: true,
              allowRightClickPan: true,
              wheelPanning: false,
            }}
            onZoomStop={(ref) => {
              setCanPan(ref.state.scale > 1);
            }}
            onTransformed={(ref) => {
              setCanPan(ref.state.scale > 1);
            }}
          >
            <TransformComponent>
              <img
                src={`${import.meta.env.VITE_BASE_URL}${images[currentIndex].path}`}
                alt={`${altText} — Image ${currentIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-xl cursor-grab"
                style={{ touchAction: 'none' }}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>

        {/* Tombol Navigasi bawah */}
        <div className="flex justify-between items-center mt-4 px-2">
          <button
            onClick={handlePrev}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-white text-lg">
            {currentIndex + 1} / {images.length}
          </div>
          <button
            onClick={handleNext}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Daftar Thumbnail */}
        <div ref={thumbnailRef} className="flex overflow-x-auto py-4 space-x-2 mt-4 max-w-full">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 ${
                index === currentIndex ? 'border-white ring-2 ring-blue-500' : 'border-gray-600'
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}${image.path}`}
                alt={`${altText} — Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;