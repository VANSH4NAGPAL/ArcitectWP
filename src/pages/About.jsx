import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Carousel from '../components/Carousel';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);


const About = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const sectionRefs = useRef([]);
  // Ref for the root element to query all headings
  const headingsRootRef = useRef(null);

  // Animate all h1, h2, h3 headings with SplitText and staggered animation
  useEffect(() => {
    if (!headingsRootRef.current) return;
    const headings = headingsRootRef.current.querySelectorAll('h1, h2, h3');
    const splits = [];
    headings.forEach((heading, idx) => {
      const split = new SplitType(heading, { types: 'chars' });
      splits.push(split);
      gsap.fromTo(
        split.chars,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.04,
          ease: 'power3.out',
          delay: 0.2 + idx * 0.2,
        }
      );
    });
    return () => splits.forEach(split => split.revert());
  }, []);


  useGSAP(() => {
    sectionRefs.current.forEach((section) => {
      if (section) {
        // Animate left and right children separately for each section
        const left = section.querySelector('.gsap-left');
        const right = section.querySelector('.gsap-right');

        if (left) {
          gsap.from(left, {
            opacity: 0,
            x: -80,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          });
        }
        if (right) {
          gsap.from(right, {
            opacity: 0,
            x: 80,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      }
    });
  }, []);


  return (
    <div ref={headingsRootRef} className="min-h-screen bg-white flex flex-col  !mt-20">
      {/* Mobile Navigation Button - Top Right, animated with framer-motion (from Contact.jsx) */}
      

      {/* ABOUT SECTION */}
      <div>
        {/* MAIN CONTENT */}
        <main
          ref={el => sectionRefs.current[0] = el}
          className="flex-1 flex flex-col gap-12 "
        >
          {/* HERO SECTION */}
          <section className="w-full flex flex-col md:flex-row min-h-[74vh] md:!mt-8 z-0  !p-0 bg-[#0e1111] ">
            {/* Left: Company Name and Project Title */}
            <div className="gsap-left basis-[40%] md:basis-[40%] h-auto flex flex-col  justify-center items-start  !px-10 md:!px-20 !py-0 md:!py-0 !min-h-[340px]">
              <h1
                className="!mb-1 text-2xl sm:text-3xl md:text-5xl tracking-widest animate-split whitespace-nowrap"
                style={{ display: 'inline-block' }}
              >
                Studio Design Palette
              </h1>
              <h1
                className="!mb-36  text-3xl md:text-2xl  tracking-widest animate-split"
                style={{ display: 'inline-block' }}
              >
                Inspiring spaces, creative solutions.
              </h1>
              <div className="!mt-10">
                <div className="  md:text-lg font-light tracking-widest min-h-[2.5rem] flex items-center">
                  <AnimatePresence mode="wait">
                    {currentProject?.title && (
                      <motion.span
                        key={currentProject.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="block w-full text-4xl"
                      >
                        {currentProject.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            {/* Right: Carousel */}
            <div className="gsap-right basis-[60%] md:basis-[60%] flex items-end justify-end bg-[#0e1111] !p-0 !m-0 min-h-[340px] relative">
              <div className="w-full h-[340px] md:h-dvh !m-0 !p-0">
                <Carousel onSlideChange={setCurrentProject} />
              </div>
            </div>
          </section>

          {/* CEO SECTION */}
          <section
            ref={el => sectionRefs.current[1] = el}
            className="w-full flex flex-col md:flex-row !mt-10 !mb-10 !px-0 md:!px-0 items-center justify-center"
          >
            {/* Left: CEO Image */}
            <div className="gsap-left basis-[50%] md:basis-[50%] md:flex items-center justify-center !p-0 !m-0 min-h-[420px] hidden">
              <img
                src="/background-image.png"
                alt="CEO"
                className="w-[40rem] h-[590px] object-cover object-center"
              />
            </div>
            {/* Right: CEO Text */}
            <div className="gsap-right basis-[50%] md:basis-[50%] flex flex-col items-baseline justify-baseline md:justify-center md:items-center !px-10 md:!px-20 !py-0 md:!py-0 bg-white min-h-[420px]">
              <div className="w-full flex flex-col items-center">
                <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-black !mb-8 text-center">
                  ABOUT
                  
                  US
                </h2>
                <p
                  className="text-black/80 text-base md:text-lg font-light leading-relaxed !mb-0 !mt-0 text-center"
                  style={{ maxWidth: 420 }}
                >
                  This is the area you explain who you are and how you can solve
                  their problem. Pull them in and show them exactly why they
                  need you and how you'll be able to make their life/business
                  better.
                </p>
              </div>
            </div>
          </section>
        </main>
        <section
          ref={el => sectionRefs.current[2] = el}
          className="bg-[#0e1111] w-full flex flex-col md:flex-row items-center !-mt-40 md:!mt-10 !px-0 md:!px-0 overflow-hidden"
        >
          {/* Left 50%: Image with overlay text */}
          <div className="gsap-left w-full bg-[#0e1111] md:w-4/4 flex items-center justify-center !p-0 !m-0 min-h-[400px] flex-col">
            <div className="w-full flex flex-row items-center justify-center relative overflow-hidden">
              <img
                src="/about2.jpg"
                alt="about us page building pic"
                className="md:flex hidden max-w-full max-h-[600px] w-auto h-auto object-cover md:max-lg:w-70 md:max-lg:max-h-[400px]"
                style={{ objectFit: 'cover', width: '50%', height: 'auto' }}
              />
              {/* Overlay text on image using absolute positioning */}
              <h1
                className="hidden md:block text-white text-5xl font-bold drop-shadow-lg whitespace-nowrap scroll-none absolute left-10 top-1/2 -translate-y-1/2 z-10 animate-split"
                style={{ pointerEvents: 'none', display: 'inline-block' }}
              >
                A look into our Work
              </h1>
            </div>
            <div className="flex items-center justify-center flex-col !mt-18 md:max-lg:!mt-28">
              <h1
                className='flex text-4xl animate-split'
                style={{ display: 'inline-block' }}
              >
                About the Company
              </h1>
              <p className="!p-10 text-2xl flex">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellat vero dignissimos ipsam, sequi enim neque?<br /> Laboriosam
                beatae consequatur repellat vel 
                fugit fugiat, itaque quos quod obcaecati eaque architecto <br />id
                illum tempore? Mollitia consequatur quidem, animi aliquam
                inventore incidunt ipsa
                <br /> exercitationem architecto ad at, itaque sit illum? Eius
                est vel consectetur?
              </p>
            </div>
          </div>
          {/* Right 50%: More text or content */}
          <div className="gsap-right w-full md:w-1/2 flex items-center justify-center !p-0 !m-0 min-h-[400px] self-end">
            <div className="w-full max-w-[440px] h-[450px] md:h-[780px] md:max-lg:h-[450px] md:max-lg:!mt-100 flex flex-col items-end justify-end md:max-lg:top-0 md:top-15 !m-20 md:!m-0 overflow-hidden">
              <div className="relative w-full h-full flex flex-col justify-end">
                <img
                  src="/about1.jpg"
                  alt="Photography"
                  className="w-full h-full max-h-[780px] object-cover shadow bg-[#0e1111]"
                  style={{ objectFit: 'cover' }}
                />
                {/* Overlay Perfection and StudioDesignPalette on the image using absolute positioning */}
                <span
                  className="absolute right-6 top-1/4 -translate-y-1/2 text-white text-5xl font-light tracking-widest z-10"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '2px', pointerEvents: 'none' }}
                >
                  Perfection
                </span>
                <span
                  className="absolute left-4 bottom-4 text-white text-xs tracking-widest z-10"
                  style={{ pointerEvents: 'none' }}
                >
                  StudioDesignPalette
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;