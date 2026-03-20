import React from 'react';

const StickyScroll = () => {
  return (
    <main className='bg-navy z-[40] relative rounded-t-[40px] lg:rounded-t-[60px] shadow-[0_-30px_60px_rgba(0,0,0,0.6)] border-t border-white/5 -mt-16 lg:-mt-48'>
      <div className='wrapper'>
        <section className='text-white w-full bg-navy flex flex-col items-center justify-center py-24 lg:py-32 relative'>
          <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#e6332911_1px,transparent_1px),linear-gradient(to_bottom,#e6332911_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

          <h1 className='2xl:text-7xl text-5xl px-8 font-heading font-semibold text-center tracking-tight leading-[120%] relative z-10'>
            La Nostra Galleria
            <br />
            <span className="text-crimson font-light italic">Più che calcio</span> <br />
            <span className="text-xl tracking-[0.3em] font-light uppercase opacity-50 mt-10 block">Scorri verso il basso 👇</span>
          </h1>
        </section>
      </div>

      <section className='text-white w-full bg-navy relative z-10 pb-32'>
        <div className='container-main mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6'>
          {/* Left Column */}
          <div className='grid gap-4 lg:gap-6 md:col-span-4'>
            <figure className='w-full'>
              <img
                src='https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='transition-all duration-300 w-full h-[300px] lg:h-[400px] align-bottom object-cover rounded-[1.5rem]'
              />
            </figure>
            <figure className='w-full'>
              <img
                src='https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='transition-all duration-300 w-full h-[400px] lg:h-[500px] align-bottom object-cover rounded-[1.5rem]'
              />
            </figure>
            <figure className='w-full'>
              <img
                src='https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='transition-all duration-300 w-full h-[300px] lg:h-[400px] align-bottom object-cover rounded-[1.5rem]'
              />
            </figure>
            <figure className='w-full'>
              <img
                src='https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='transition-all duration-300 w-full h-[300px] lg:h-[400px] align-bottom object-cover rounded-[1.5rem]'
              />
            </figure>
          </div>

          {/* Center Column (Sticky on Desktop) */}
          <div className='md:sticky md:top-6 lg:top-10 md:h-[calc(100vh-80px)] w-full md:col-span-4 gap-4 lg:gap-6 grid grid-rows-3 mb-4 md:mb-0'>
            <figure className='w-full h-[250px] md:h-full relative overflow-hidden rounded-[1.5rem]'>
              <img
                src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='absolute inset-0 transition-all duration-300 h-full w-full object-cover'
              />
            </figure>
            <figure className='w-full h-[250px] md:h-full relative overflow-hidden rounded-[1.5rem]'>
              <img
                src='https://images.unsplash.com/photo-1518605338461-1d701cedbccc?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='absolute inset-0 transition-all duration-300 h-full w-full object-cover'
              />
            </figure>
            <figure className='w-full h-[250px] md:h-full relative overflow-hidden rounded-[1.5rem]'>
              <img
                src='https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='absolute inset-0 transition-all duration-300 h-full w-full object-cover'
              />
            </figure>
          </div>

          {/* Right Column */}
          <div className='grid gap-4 lg:gap-6 md:col-span-4'>
            <figure className='w-full'>
              <img
                src='https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='transition-all duration-300 w-full h-[350px] lg:h-[450px] align-bottom object-cover rounded-[1.5rem]'
              />
            </figure>
            <figure className='w-full'>
              <img
                src='https://images.unsplash.com/photo-1627993077598-f22718fb4427?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='transition-all duration-300 w-full h-[250px] lg:h-[350px] align-bottom object-cover rounded-[1.5rem]'
              />
            </figure>
            <figure className='w-full'>
              <img
                src='https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='transition-all duration-300 w-full h-[400px] lg:h-[500px] align-bottom object-cover rounded-[1.5rem]'
              />
            </figure>
            <figure className='w-full'>
              <img
                src='https://images.unsplash.com/photo-1551280857-2b9ebf241519?w=500&auto=format&fit=crop'
                alt=''
                loading="lazy"
                className='transition-all duration-300 w-full h-[250px] lg:h-[350px] align-bottom object-cover rounded-[1.5rem]'
              />
            </figure>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StickyScroll;
