import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  lazy?: boolean;
  placeholder?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallback = '🛍️',
  lazy = true,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4='
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // If it's an emoji or not a URL, render as text
  if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('blob:')) {
    return (
      <div className={`flex items-center justify-center text-6xl ${className}`}>
        {src || fallback}
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <img 
            src={placeholder} 
            alt="Loading..." 
            className="w-8 h-8 opacity-50"
          />
        </div>
      )}
      
      {isInView && (
        <>
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
              <img 
                src={placeholder} 
                alt="Loading..." 
                className="w-8 h-8 opacity-50"
              />
            </div>
          )}
          
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
          />
          
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-6xl">
              {fallback}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OptimizedImage;
