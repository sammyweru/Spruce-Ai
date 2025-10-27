
import React, { useState, useRef, useEffect } from 'react';

interface ImageComparatorProps {
  originalImage: string;
  generatedImage: string;
  activeFilter: string;
  onItemSelect?: (x: number, y: number, imgWidth: number, imgHeight: number) => void;
  isSelectable: boolean;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ originalImage, generatedImage, activeFilter, onItemSelect, isSelectable }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [clickMarker, setClickMarker] = useState<{x: number, y: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (clickMarker) {
      const timer = setTimeout(() => setClickMarker(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [clickMarker]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        setSliderPosition(percentage);
    }
  }

  const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }
  const handleTouchEnd = () => {
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onItemSelect || !isSelectable) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (generatedImageRef.current) {
        onItemSelect(x, y, rect.width, rect.height);
        setClickMarker({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto aspect-video rounded-lg overflow-hidden select-none group shadow-2xl bg-slate-200">
      <img src={originalImage} alt="Original Room" className="absolute top-0 left-0 w-full h-full object-cover" />
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        onClick={handleImageClick}
      >
        <img 
          ref={generatedImageRef}
          src={generatedImage} 
          alt="Generated Design" 
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-300 filter-${activeFilter} ${isSelectable ? 'cursor-crosshair' : ''}`} 
        />
        {clickMarker && (
            <div 
                className="absolute w-8 h-8 rounded-full border-2 border-white bg-teal-500/50 animate-ping"
                style={{
                    left: `${clickMarker.x}%`,
                    top: `${clickMarker.y}%`,
                    transform: 'translate(-50%, -50%)',
                    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) forwards'
                }}
            ></div>
        )}
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize group-hover:opacity-100 opacity-0 transition-opacity duration-300"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
          </svg>
        </div>
      </div>
      <div className="absolute top-2 left-2 bg-slate-800/50 text-white text-xs px-2 py-1 rounded">Original</div>
      <div className="absolute top-2 right-2 bg-slate-800/50 text-white text-xs px-2 py-1 rounded" style={{ opacity: sliderPosition > 50 ? 1 : 0 }}>Generated</div>

    </div>
  );
};

export default ImageComparator;