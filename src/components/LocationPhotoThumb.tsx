import { ImageWithFallback } from './figma/ImageWithFallback';

interface LocationPhotoThumbProps {
  src: string | undefined;
  alt: string;
  size?: number; // Size in pixels (default: 112px)
}

/**
 * LocationPhotoThumb - Restaurant photo thumbnail with white frame and soft shadow
 * 
 * Features:
 * - Square shape (1:1 aspect ratio)
 * - White background with padding to create frame effect
 * - Rounded corners (20px)
 * - Soft shadow
 */
export function LocationPhotoThumb({ 
  src, 
  alt,
  size = 112 
}: LocationPhotoThumbProps) {
  return (
    <div 
      className="bg-white rounded-[20px] p-1.5 flex-shrink-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <ImageWithFallback
        src={src || ''}
        alt={alt}
        className="w-full h-full rounded-[16px] object-cover"
      />
    </div>
  );
}
