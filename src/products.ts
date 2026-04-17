
export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  oldPrice?: number;
  available: boolean;
  image: string;
  description: string;
  characteristics: {
    color?: string;
    width?: number; // in cm
    height?: number;
    depth?: number;
    material?: string;
    style?: string;
    hasThermostat?: boolean;
    installationType?: string;
    [key: string]: any;
  };
  rating: number;
  reviewsCount: number;
  tags: string[];
  popularity: number;
  sourceUrl?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Кухонная мойка OMOIKIRI Bosen 44-U",
    category: "Кухня",
    subcategory: "Мойки",
    brand: "OMOIKIRI",
    price: 15900,
    available: true,
    image: "https://picsum.photos/seed/sink1/400/400",
    description: "Компактная мойка из искусственного гранита. Оптимальна для небольших кухонь.",
    characteristics: {
      color: "чёрный",
      width: 44,
      material: "искусственный гранит",
      installationType: "под столешницу"
    },
    rating: 4.8,
    reviewsCount: 124,
    tags: ["чёрная мойка", "компактная", "гранит"],
    popularity: 95
  },
  {
    id: "2",
    name: "Смеситель Ganzer GZ77021B с термостатом",
    category: "Ванная",
    subcategory: "Смесители",
    brand: "Ganzer",
    price: 12450,
    available: true,
    image: "https://picsum.photos/seed/tap1/400/400",
    description: "Термостатический смеситель для ванны и душа. Поддерживает стабильную температуру воды.",
    characteristics: {
      color: "чёрный",
      hasThermostat: true,
      material: "латунь",
      installationType: "настенный"
    },
    rating: 4.9,
    reviewsCount: 56,
    tags: ["термостат", "чёрный смеситель", "душевой"],
    popularity: 88
  },
  {
    id: "3",
    name: "Раковина-чаша Creavit Ultra",
    category: "Ванная",
    subcategory: "Раковины",
    brand: "Creavit",
    price: 8900,
    available: true,
    image: "https://picsum.photos/seed/sink2/400/400",
    description: "Накладная раковина-чаша в современном стиле.",
    characteristics: {
      color: "белый",
      width: 60,
      material: "керамика",
      installationType: "накладная"
    },
    rating: 4.7,
    reviewsCount: 89,
    tags: ["чаша", "современный стиль", "белая"],
    popularity: 70
  },
  {
    id: "4",
    name: "Плитка Equipe Artisan Graphite",
    category: "Плитка",
    subcategory: "Настенная плитка",
    brand: "Equipe",
    price: 3400,
    available: true,
    image: "https://picsum.photos/seed/tile1/400/400",
    description: "Глянцевая плитка с эффектом ручной работы. Глубокий серый цвет.",
    characteristics: {
      color: "графит",
      material: "керамика",
      style: "лофт"
    },
    rating: 4.9,
    reviewsCount: 42,
    tags: ["бетон", "графит", "лофт"],
    popularity: 82
  },
  {
    id: "5",
    name: "Мойка Blanco Subline 500-U",
    category: "Кухня",
    subcategory: "Мойки",
    brand: "Blanco",
    price: 28000,
    available: true,
    image: "https://picsum.photos/seed/sink3/400/400",
    description: "Премиальная мойка из Silgranit. Высокая прочность и долговечность.",
    characteristics: {
      color: "чёрный",
      width: 60,
      material: "Silgranit",
      installationType: "под столешницу"
    },
    rating: 5.0,
    reviewsCount: 210,
    tags: ["премиум", "blanco", "чёрный"],
    popularity: 100
  },
  {
    id: "6",
    name: "Смеситель для ванны Grohe Grohtherm 800",
    category: "Ванная",
    subcategory: "Смесители",
    brand: "Grohe",
    price: 18500,
    available: true,
    image: "https://picsum.photos/seed/tap2/400/400",
    description: "Классический термостат от Grohe. Немецкое качество и надежность.",
    characteristics: {
      color: "хром",
      hasThermostat: true,
      material: "латунь"
    },
    rating: 4.9,
    reviewsCount: 340,
    tags: ["grohe", "термостат", "хром"],
    popularity: 98
  }
];
