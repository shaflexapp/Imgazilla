import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  width?: number;
  height?: number;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  width = 350,
  height = 350,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // Initial slider position in percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const { left, width: containerWidth } =
      containerRef.current.getBoundingClientRect();
    let newPosition = ((e.clientX - left) / containerWidth) * 100;
    if (newPosition < 0) newPosition = 0;
    if (newPosition > 100) newPosition = 100;

    setSliderPosition(newPosition);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='relative overflow-hidden border border-primary-lightGreen rounded-md border-dashed outline-hidden bg-transparent focus:outline-hidden focus:bg-transparent select-none'
      style={{ width: `${width}px`, height: `${height}px` }}
      onMouseDown={handleMouseDown}
    >
      {/* Before Image */}
      <img
        src={beforeImage}
        alt='Before'
        className='absolute top-0 left-0 h-full w-full object-cover outline-hidden bg-transparent focus:outline-hidden focus:bg-transparent'
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        draggable='false'
      />

      {/* After Image */}
      <img
        src={afterImage}
        alt='After'
        className='absolute top-0 left-0 h-full w-full object-cover outline-hidden bg-transparent focus:outline-hidden focus:bg-transparent'
        draggable='false'
      />

      <div
        className='absolute top-0 bottom-0'
        style={{
          left: `${sliderPosition}%`,
        }}
      >
        <div className='w-0.5 h-full bg-primary-lightGreen opacity-80 cursor-ew-resize' />
        <div className='w-2.5 h-2.5 bg-primary-lightGreen rounded-full absolute top-1/2 -translate-y-1/2 -ml-1 cursor-ew-resize focus:outline-hidden focus:bg-transparent' />
      </div>
    </div>
  );
};
