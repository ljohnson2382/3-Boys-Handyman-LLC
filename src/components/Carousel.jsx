import { useEffect, useState } from 'react';

export default function Carousel({ images = ['/images/carousel-1.jpg'], interval = 5000 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full relative overflow-hidden">
      <div className="w-full h-52 md:h-72 lg:h-[420px] relative">
        {images.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={`slide-${i}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>

      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <button
          aria-label="Previous slide"
          onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
          className="bg-black/40 text-white rounded-full p-2 hover:bg-black/60"
        >
          ‹
        </button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          aria-label="Next slide"
          onClick={() => setIndex((i) => (i + 1) % images.length)}
          className="bg-black/40 text-white rounded-full p-2 hover:bg-black/60"
        >
          ›
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
