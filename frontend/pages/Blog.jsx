import React, { useState } from 'react';

const posts = [
  {
    title: 'How we plan our flocks for consistent egg supply',
    date: '05 Mar 2026',
    category: 'Farm Planning',
    image: '/images/flock.png',
    summary:
      'Peak production cycles, breed selection and shed scheduling all influence how many eggs reach your shelves each day.',
    fullContent: 'Running a poultry operation means planning months in advance. Every time a new batch of day-old chicks is placed in a shed, we already have a calculated timeline mapping exactly when they will peak in egg production. By staggering these cycles across our 12 environmentally-controlled sheds, we ensure there is absolutely no drop in supply during seasonal shifts or extreme weather. This is how your local supermarket is never out of Hussain Farms eggs!'
  },
  {
    title: 'Biosecurity practices that protect our birds',
    date: '20 Feb 2026',
    category: 'Biosecurity',
    image: '/images/hero-chickens.png',
    summary:
      'From foot dips and visitor logs to structured staff movement, every small step reduces disease risk for flocks.',
    fullContent: 'Biosecurity is the most critical foundation of our farm. Before any vehicle enters the campus, it goes through an automated disinfection spray tunnel. Farm workers are required to shower and switch into dedicated farm PPE. By treating the farm like a clean-room, we drastically reduce the need for antibiotics or medicinal interventions, allowing our birds to grow happily and naturally without compromising immune health.'
  },
  {
    title: 'Optimizing feed for growth and shell strength',
    date: '02 Feb 2026',
    category: 'Nutrition',
    image: '/images/eggs.png',
    summary:
      'Balanced energy, protein and mineral levels support both bird health and commercial performance.',
    fullContent: 'A chicken is only as healthy as the feed it consumes. We work exclusively with top-tier nutritionists who sample and verify the macro-nutrients of our feed daily. For our laying hens, calcium and Vitamin D reserves are formulated precisely to guarantee incredibly strong eggshells and vibrant yolks. It means fewer breakages during transport and a richer, creamier taste when you crack them into the pan at home.'
  }
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
            FARM BLOG
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Stories and insights from Hussain Farms.
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-700">
            Learn how we manage flocks, maintain quality and deliver consistent
            poultry products all year round.
          </p>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft-card transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-44 w-full">
                <img 
                  src={post.image} 
                  alt={post.category} 
                  loading="lazy" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5 text-sm text-slate-700">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-farm-green-dark">
                  {post.category}
                </p>
                <h2 className="text-base font-semibold leading-snug text-farm-brown">
                  {post.title}
                </h2>
                <p className="text-[11px] text-slate-400">{post.date}</p>
                <p className="mt-2 text-xs leading-relaxed md:text-sm">{post.summary}</p>
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="mt-4 inline-flex text-xs font-bold uppercase tracking-wide text-farm-orange transition hover:text-orange-600"
                >
                  Read more →
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Read More Modal Overlay */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="relative h-64 w-full">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  className="h-full w-full object-cover" 
                />
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-md transition hover:bg-slate-900"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-farm-green-dark">
                  {selectedPost.category}
                </p>
                <h2 className="mt-2 text-2xl font-bold leading-tight text-farm-brown md:text-3xl">
                  {selectedPost.title}
                </h2>
                <p className="mt-2 text-xs font-medium text-slate-500">Published on {selectedPost.date}</p>
                <div className="mt-6  leading-relaxed text-slate-700 md:text-base">
                  <p>{selectedPost.fullContent}</p>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="mt-8 btn-secondary w-full"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
