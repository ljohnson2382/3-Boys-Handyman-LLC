import React, { useState } from 'react';
import SEO from '../components/SEO';

const images = [
  { src: '/images/carousel-1.jpg', alt: 'Remodeled kitchen with sage green island, light gray shaker cabinets, quartz countertops, and stainless steel appliances' },
  { src: '/images/image_1.jpg', alt: 'Coffee mug reading "Up and at \'em" on a jobsite workbench next to a framing square' },
  { src: '/images/image_2.jpg', alt: 'Newly installed ceiling fan with light in a corner of a room with paneled walls' },
  { src: '/images/image_3.jpg', alt: 'Built-in wall shelving unit under construction, unpainted and empty, before finishing' },
  { src: '/images/image_4.jpg', alt: 'Bedroom mid-repaint with fresh olive green walls, ceiling and window still masked in plastic sheeting' },
  { src: '/images/image_5.jpg', alt: 'Finished built-in bookshelf and media wall with mounted TV and LED accent lighting in a bright carpeted living room' },
  { src: '/images/image_6.jpg', alt: 'Vaulted bedroom ceiling with newly installed bronze ceiling fan and gray-painted walls' },
  { src: '/images/image_7.jpg', alt: 'Vaulted living room with matching ceiling fan and built-in shelving and TV wall unit' },
  { src: '/images/image_8.jpg', alt: 'Dated white ceiling fan with multiple globe lights before replacement' },
  { src: '/images/image_9.jpg', alt: 'Crew member installing wood-look vinyl plank flooring with a pry bar and stack of paint cans nearby' },
  { src: '/images/image_10.jpg', alt: 'Bedroom before renovation, with tan walls, wood floor, and original trim' },
  { src: '/images/image_11.jpg', alt: 'Bedroom walls stripped of old paint and patched, prepped for repainting' },
  { src: '/images/image_12.jpg', alt: 'Finished walk-in closet and dressing room with built-in shoe shelving, refinished hardwood floors, and a new ceiling fan' },
];

export default function Portfolio() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="bg-navy">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 lg:py-16">
        <SEO
          title="Project Portfolio"
          description="Browse completed kitchen, bathroom, deck, and home renovation projects by Healthy Homes, LLC in Manchester, New Hampshire."
          path="/portfolio"
        />
        <h1 className="text-3xl font-bold text-orange mb-6">Project Portfolio</h1>
        <p className="text-lg text-lightGray mb-8">A showcase of our completed projects and transformations.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(img)}
              className="block w-full h-48 p-0 bg-transparent border-0 focus:outline-none"
              aria-label={`Open larger image: ${img.alt}`}>
              <img src={img.src} alt={img.alt} className="w-full h-48 object-cover rounded-lg shadow-md" />
            </button>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelected(null)}>
            <div className="w-full p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button className="text-white text-2xl absolute -top-2 -right-2 bg-black/50 rounded-full p-1" onClick={() => setSelected(null)} aria-label="Close">✕</button>
                <img
                  src={selected.src}
                  alt={selected.alt}
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
