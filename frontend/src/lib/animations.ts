import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animate elements on scroll into view
 */
export const animateOnScroll = (selector: string, animation: gsap.TweenVars) => {
  gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
    gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        once: true,
      },
      ...animation,
    });
  });
};

/**
 * Fade in animation on scroll
 */
export const fadeInOnScroll = (selector: string) => {
  animateOnScroll(selector, {
    duration: 0.8,
    opacity: 1,
    y: 0,
  });

  gsap.set(selector, { opacity: 0, y: 30 });
};

/**
 * Slide in from left on scroll
 */
export const slideInLeftOnScroll = (selector: string) => {
  gsap.set(selector, { opacity: 0, x: -50 });
  animateOnScroll(selector, {
    duration: 0.8,
    opacity: 1,
    x: 0,
  });
};

/**
 * Slide in from right on scroll
 */
export const slideInRightOnScroll = (selector: string) => {
  gsap.set(selector, { opacity: 0, x: 50 });
  animateOnScroll(selector, {
    duration: 0.8,
    opacity: 1,
    x: 0,
  });
};

/**
 * Scale up animation on scroll
 */
export const scaleUpOnScroll = (selector: string) => {
  gsap.set(selector, { opacity: 0, scale: 0.9 });
  animateOnScroll(selector, {
    duration: 0.8,
    opacity: 1,
    scale: 1,
  });
};

/**
 * Stagger animation for multiple elements
 */
export const staggerFadeIn = (selector: string, staggerDelay = 0.1) => {
  gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
    gsap.set(element, { opacity: 0, y: 30 });
    gsap.to(element, {
      scrollTrigger: {
        trigger: element.parentElement,
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 1,
      y: 0,
      stagger: staggerDelay,
    });
  });
};

/**
 * Rotate animation on scroll
 */
export const rotateOnScroll = (selector: string) => {
  gsap.set(selector, { opacity: 0, rotation: -10 });
  animateOnScroll(selector, {
    duration: 0.8,
    opacity: 1,
    rotation: 0,
  });
};

/**
 * Hover animation
 */
export const addHoverAnimation = (selector: string, hoverAnimation: gsap.TweenVars) => {
  gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
    element.addEventListener('mouseenter', () => {
      gsap.to(element, hoverAnimation);
    });
    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        duration: 0.3,
        scale: 1,
        y: 0,
        ...hoverAnimation,
      });
    });
  });
};

/**
 * Timeline animation
 */
export const createTimeline = () => {
  return gsap.timeline();
};

/**
 * Animate number counter
 */
export const animateCounter = (element: HTMLElement, target: number, duration = 2) => {
  const obj = { value: 0 };
  gsap.to(obj, {
    value: target,
    duration,
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toLocaleString();
    },
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      once: true,
    },
  });
};
