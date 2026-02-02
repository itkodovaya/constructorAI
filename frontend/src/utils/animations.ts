import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Регистрируем плагины GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// Плавное появление элемента
export const fadeIn = (element: HTMLElement | string, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
    }
  );
};

// Плавное появление с масштабированием
export const fadeInScale = (element: HTMLElement | string, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      delay,
      ease: 'back.out(1.7)',
    }
  );
};

// Плавное появление слева
export const slideInLeft = (element: HTMLElement | string, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, x: -100 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
    }
  );
};

// Плавное появление справа
export const slideInRight = (element: HTMLElement | string, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, x: 100 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
    }
  );
};

// Плавное появление снизу
export const slideInUp = (element: HTMLElement | string, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 100 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
    }
  );
};

// Вращение и появление
export const rotateIn = (element: HTMLElement | string, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, rotation: -180, scale: 0.5 },
    {
      opacity: 1,
      rotation: 0,
      scale: 1,
      duration: 1,
      delay,
      ease: 'back.out(1.7)',
    }
  );
};

// Плавное появление с размытием
export const blurIn = (element: HTMLElement | string, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, filter: 'blur(20px)' },
    {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1,
      delay,
      ease: 'power3.out',
    }
  );
};

// Анимация текста (печатание)
export const typeText = (
  element: HTMLElement | string,
  text: string,
  speed = 0.05
) => {
  return gsap.to(element, {
    duration: text.length * speed,
    text: text,
    ease: 'none',
  });
};

// Плавное появление карточек по очереди
export const staggerCards = (elements: HTMLElement[] | string, delay = 0.1) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 50, scale: 0.9 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: delay,
      ease: 'power3.out',
    }
  );
};

// Плавное появление с эффектом волны
export const waveIn = (elements: HTMLElement[] | string, delay = 0.1) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 30, rotation: -5 },
    {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 0.8,
      stagger: delay,
      ease: 'power3.out',
    }
  );
};

// Пульсация
export const pulse = (element: HTMLElement | string) => {
  return gsap.to(element, {
    scale: 1.1,
    duration: 0.5,
    yoyo: true,
    repeat: -1,
    ease: 'power2.inOut',
  });
};

// Плавное вращение
export const rotate = (element: HTMLElement | string, duration = 2) => {
  return gsap.to(element, {
    rotation: 360,
    duration,
    repeat: -1,
    ease: 'none',
  });
};

// Плавное движение вверх-вниз
export const float = (element: HTMLElement | string) => {
  return gsap.to(element, {
    y: -20,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: 'power1.inOut',
  });
};

// Эффект свечения
export const glow = (element: HTMLElement | string) => {
  return gsap.to(element, {
    boxShadow: '0 0 30px rgba(67, 97, 238, 0.6)',
    duration: 1.5,
    yoyo: true,
    repeat: -1,
    ease: 'power2.inOut',
  });
};

// Анимация при наведении
export const hoverScale = (element: HTMLElement | string) => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  el.addEventListener('mouseenter', () => {
    gsap.to(el, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' });
  });
};

// Анимация при клике
export const clickBounce = (element: HTMLElement | string) => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  el.addEventListener('click', () => {
    gsap.to(el, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.out' });
  });
};

// Плавное исчезновение
export const fadeOut = (element: HTMLElement | string, onComplete?: () => void) => {
  return gsap.to(element, {
    opacity: 0,
    y: -30,
    duration: 0.5,
    ease: 'power3.in',
    onComplete,
  });
};

// Анимация появления при скролле
export const scrollReveal = (
  element: HTMLElement | string,
  options: {
    delay?: number;
    distance?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
  } = {}
) => {
  const { delay = 0, distance = 100, direction = 'up' } = options;

  const fromProps: any = { opacity: 0 };
  if (direction === 'up') fromProps.y = distance;
  if (direction === 'down') fromProps.y = -distance;
  if (direction === 'left') fromProps.x = distance;
  if (direction === 'right') fromProps.x = -distance;

  return gsap.fromTo(
    element,
    fromProps,
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );
};

// Анимация градиента
export const gradientShift = (element: HTMLElement | string) => {
  return gsap.to(element, {
    backgroundPosition: '200% 0',
    duration: 3,
    repeat: -1,
    ease: 'none',
  });
};

// Плавная анимация цвета
export const colorShift = (
  element: HTMLElement | string,
  fromColor: string,
  toColor: string,
  duration = 1
) => {
  return gsap.to(element, {
    backgroundColor: toColor,
    duration,
    ease: 'power2.inOut',
  });
};
