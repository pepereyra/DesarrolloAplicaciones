// src/data/banners.js
export const banners = [
  {
    id: 1,
    image: new URL('../assets/banners/banner1.webp', import.meta.url).href,
    alt: 'Beauty Week - Hasta 40% OFF y hasta 12 cuotas sin interés',
    href: '/search?q=belleza',
    bgColor: '#6F2A8D' // Morado de Beauty Week
  },
  {
    id: 2,
    image: new URL('../assets/banners/banner2.webp', import.meta.url).href,
    alt: 'Especial Indumentaria - Lo nuevo en moda hasta 20% OFF',
    href: '/search?q=ropa',
    bgColor: '#A4C8E4' // Azul claro de moda
  },
  {
    id: 3,
    image: new URL('../assets/banners/banner3.webp', import.meta.url).href,
    alt: 'Oportunidades únicas en cuotas sin interés',
    href: '/promociones',
    bgColor: '#E8A5E8' // Rosa/morado claro
  },
  {
    id: 4,
    image: new URL('../assets/banners/banner4.webp', import.meta.url).href,
    alt: 'Especial Pantallas - Hasta 40% OFF y hasta 12 cuotas',
    href: '/search?q=tecnologia',
    bgColor: '#5A9BD4' // Azul de tecnología
  },
  {
    id: 5,
    image: new URL('../assets/banners/banner5.webp', import.meta.url).href,
    alt: 'Indumentaria Deportiva - Entrená cómodo hasta 20% OFF',
    href: '/search?q=deportes',
    bgColor: '#90C695' // Verde deportivo
  }
];