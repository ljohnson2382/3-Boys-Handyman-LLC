import React, { useState } from 'react';

const images = [
  '/images/carousel-1.jpg',
  '/images/image_1.jpg',
  '/images/image_2.jpg',
  '/images/image_3.jpg',
  '/images/image_4.jpg',
  '/images/image_5.jpg',
  '/images/image_6.jpg',
  '/images/image_7.jpg',
  '/images/image_8.jpg',
  '/images/image_9.jpg',
  '/images/image_10.jpg',
  '/images/image_11.jpg',
  '/images/image_12.jpg',
];

export default function Portfolio() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="bg-navy">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 lg:py-16">
        <h1 className="text-3xl font-bold text-orange mb-6">Project Portfolio</h1>
        <p className="text-lg text-lightGray mb-8">A showcase of our completed projects and transformations.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(src)}
              className="block w-full h-48 p-0 bg-transparent border-0 focus:outline-none"
              aria-label={`Open project image ${i + 1}`}>
              <img src={src} alt={`Project ${i + 1}`} className="w-full h-48 object-cover rounded-lg shadow-md" />
            </button>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelected(null)}>
            <div className="w-full p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button className="text-white text-2xl absolute -top-2 -right-2 bg-black/50 rounded-full p-1" onClick={() => setSelected(null)} aria-label="Close">✕</button>
                <img
                  src={selected}
                  alt="Selected project"
                  className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
