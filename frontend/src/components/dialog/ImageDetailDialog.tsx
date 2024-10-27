import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  initialIndex: number;
}

const ImageDetailDialog: React.FC<ImageDetailDialogProps> = ({
  isOpen,
  onOpenChange,
  images,
  initialIndex
}) => {
  const [scale, setScale] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setScale(1);
  }, [currentIndex]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prevScale => {
      const newScale = prevScale + delta;
      return Math.min(Math.max(0.1, newScale), 3);
    });
  };

  useEffect(() => {
    if (isOpen) {
      setScale(1);
    }
  }, [isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images?.length || !isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen min-h-screen flex items-center justify-center p-0
       bg-background/30 backdrop-blur-md border-none outline-none focus:outline-none
       transition-all duration-200" tabIndex={-1}>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 left-6 w-10 h-10 rounded-full border hover:bg-accent flex items-center justify-center text-white transition-colors"
        >
          <X size={20} />
        </button>
        <div 
          className="relative w-full h-full flex items-center justify-center"
          onWheel={handleWheel}
        >
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            style={{
              transform: `scale(${scale})`,
              transition: 'transform 0.2s ease-in-out',
              maxHeight: '90vh',
              maxWidth: '90vw',
              objectFit: 'contain'
            }}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailDialog;