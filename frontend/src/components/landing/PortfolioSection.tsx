'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioSection() {
  const [current, setCurrent] = useState(0);

  const projects = [
    {
      id: 1,
      title: 'Investor Dashboard',
      category: 'Web Platform',
      description: 'Advanced portfolio tracking and management interface',
      image: 'bg-gradient-to-br from-blue-600 to-purple-600',
    },
    {
      id: 2,
      title: 'Signal Analytics',
      category: 'Real-time Data',
      description: 'Live market signals with prediction accuracy metrics',
      image: 'bg-gradient-to-br from-emerald-600 to-blue-600',
    },
    {
      id: 3,
      title: 'Trading Terminal',
      category: 'Desktop App',
      description: 'Professional-grade trading terminal with advanced charts',
      image: 'bg-gradient-to-br from-orange-600 to-red-600',
    },
    {
      id: 4,
      title: 'Market Analysis',
      category: 'Analytics',
      description: 'Comprehensive market analysis with AI insights',
      image: 'bg-gradient-to-br from-pink-600 to-orange-600',
    },
  ];

  const nextSlide = () => {
    gsap.to('.carousel-slide', {
      duration: 0.5,
      opacity: 0,
      y: 10,
    });
    setTimeout(() => {
      setCurrent((current + 1) % projects.length);
      gsap.from('.carousel-slide', {
        duration: 0.5,
        opacity: 0,
        y: -10,
      });
    }, 250);
  };

  const prevSlide = () => {
    gsap.to('.carousel-slide', {
      duration: 0.5,
      opacity: 0,
      y: -10,
    });
    setTimeout(() => {
      setCurrent((current - 1 + projects.length) % projects.length);
      gsap.from('.carousel-slide', {
        duration: 0.5,
        opacity: 0,
        y: 10,
      });
    }, 250);
  };

  useEffect(() => {
    // Animate section header
    gsap.from('.portfolio-header', {
      scrollTrigger: {
        trigger: '.portfolio-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    // Animate carousel container
    gsap.from('.portfolio-carousel', {
      scrollTrigger: {
        trigger: '.portfolio-carousel',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
    });

    // Animate project info
    gsap.from('.project-info', {
      scrollTrigger: {
        trigger: '.project-info',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
      delay: 0.2,
    });
  }, []);

  return (
    <section className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 portfolio-header">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">Our Work</p>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-7xl md:text-8xl font-black text-white leading-tight max-w-3xl">
              Featured Projects
            </h2>
            <div className="flex gap-4">
              <button
                onClick={prevSlide}
                className="w-14 h-14 border-2 border-gray-700 hover:border-blue-400 text-gray-400 hover:text-blue-400 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="w-14 h-14 border-2 border-gray-700 hover:border-blue-400 text-gray-400 hover:text-blue-400 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Project Carousel */}
        <div className="space-y-8 portfolio-carousel">
          <div className="overflow-hidden rounded-xl">
            <div className="carousel-slide">
              <div className={`${projects[current].image} h-96 rounded-xl flex items-center justify-center`}>
                <div className="text-center">
                  <p className="text-white/80 text-lg font-medium mb-2">{projects[current].category}</p>
                  <h3 className="text-white text-4xl font-bold">{projects[current].title}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 project-info">
            <div>
              <h3 className="text-3xl font-black text-white mb-3">{projects[current].title}</h3>
              <p className="text-gray-400 text-lg leading-relaxed">{projects[current].description}</p>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex gap-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === current ? 'bg-blue-400 w-8' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
              <p className="text-gray-500">
                <span className="text-white font-bold text-2xl">{String(current + 1).padStart(2, '0')}</span>
                <span className="text-gray-600"> / </span>
                <span>{String(projects.length).padStart(2, '0')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
