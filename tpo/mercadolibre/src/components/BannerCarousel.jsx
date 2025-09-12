import React, { useState, useEffect, useRef, useCallback } from 'react';
import { banners } from '../data/banners';
import './BannerCarousel.css';

const BannerCarousel = ({
  autoplay = true,
  interval = 5000,
  pauseOnHover = true,
  infinite = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const trackRef = useRef(null);

  // Precargar imágenes adyacentes
  const preloadImages = useCallback(() => {
    const prevIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
    const nextIndex = currentIndex === banners.length - 1 ? 0 : currentIndex + 1;
    
    [prevIndex, nextIndex].forEach(index => {
      const img = new Image();
      img.src = banners[index].image;
    });
  }, [currentIndex]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && !isPaused && !isDragging) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => infinite ? (prev + 1) % banners.length : Math.min(prev + 1, banners.length - 1));
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, isPaused, isDragging, interval, infinite]);

  // Navegación con teclado
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(prev => infinite ? (prev - 1 + banners.length) % banners.length : Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex(prev => infinite ? (prev + 1) % banners.length : Math.min(prev + 1, banners.length - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Manejo de mouse/touch para swipe
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches?.[0]?.clientX || 0);
    setTranslateX(0);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
    const deltaX = currentX - startX;
    setTranslateX(deltaX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }

    // Threshold para cambiar slide (30% del ancho)
    const threshold = carouselRef.current ? carouselRef.current.offsetWidth * 0.3 : 100;
    
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    setTranslateX(0);
  };

  const handleSlideClick = (href, e) => {
    // Solo navegar si no fue un drag
    if (Math.abs(translateX) < 5) {
      window.open(href, '_self');
    } else {
      e.preventDefault();
    }
  };

  return (
    <div 
      className="banner-carousel"
      role="region"
      aria-label="Promociones"
      onMouseEnter={pauseOnHover ? () => setIsPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setIsPaused(false) : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={carouselRef}
    >
      <div className="banner-carousel__container">
        <div 
          className="banner-carousel__track"
          ref={trackRef}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? translateX : 0}px))`,
            transition: isDragging ? 'none' : 'transform 400ms cubic-bezier(0.25, 1, 0.5, 1)'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="banner-carousel__slide"
              style={{ backgroundColor: banner.bgColor }}
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${banners.length}`}
              onClick={(e) => handleSlideClick(banner.href, e)}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="banner-carousel__image"
              />
            </div>
          ))}
        </div>

        {/* Flechas de navegación */}
        <button
          className="banner-carousel__arrow banner-carousel__arrow--left"
          onClick={goToPrevious}
          aria-label="Anterior"
          disabled={!infinite && currentIndex === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          className="banner-carousel__arrow banner-carousel__arrow--right"
          onClick={goToNext}
          aria-label="Siguiente"
          disabled={!infinite && currentIndex === banners.length - 1}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Indicadores (bullets) */}
        <div className="banner-carousel__indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`banner-carousel__indicator ${index === currentIndex ? 'banner-carousel__indicator--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;