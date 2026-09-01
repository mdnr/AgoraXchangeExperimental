export interface Variant {
  id: string;
  name: string;
  /** Hex color shown in the picker swatch. */
  color: string;
  subtitle: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  badge?: string;
  featured?: boolean;
  inStock: boolean;
  heroImage: string;
  images: ProductImage[];
  /** Path to the GLB/glTF model hosted in /public (or a CDN later). */
  model3d: string;
  /** Optional absolute height/scale adjustments per model. */
  modelScale?: number;
  modelPosition?: [number, number, number];
  specifications: Specification[];
  features: Feature[];
  variants: Variant[];
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "aurora-headphones",
    name: "Aurora Pro Headphones",
    tagline: "Immersive studio-grade wireless audio",
    description:
      "Crafted from aerospace-grade aluminium and memory foam, the Aurora Pro delivers reference-quality sound with adaptive noise cancellation and a 40-hour battery. Precision-tuned drivers render every detail, while the feather-light design keeps you comfortable through the longest sessions.",
    price: 349,
    currency: "USD",
    category: "Audio",
    badge: "Best Seller",
    featured: true,
    inStock: true,
    heroImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    images: [
      {
        src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        alt: "Aurora Pro headphones studio view",
      },
      {
        src: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
        alt: "Aurora Pro headphones side view",
      },
      {
        src: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
        alt: "Aurora Pro headphones detail",
      },
    ],
    model3d: "/models/headphones.glb",
    modelScale: 2.2,
    modelPosition: [0, 0, 0],
    specifications: [
      { label: "Driver", value: "50mm dynamic, beryllium-coated" },
      { label: "Frequency Response", value: "5Hz – 40kHz" },
      { label: "Battery Life", value: "40 hours (ANC on)" },
      { label: "Noise Cancellation", value: "Adaptive Hybrid ANC" },
      { label: "Connectivity", value: "Bluetooth 5.4, USB-C" },
      { label: "Weight", value: "254 g" },
    ],
    features: [
      {
        title: "Aerospace materials",
        description: "CNC-milled aluminium frame with memory-foam earcups for lasting comfort.",
      },
      {
        title: "Adaptive ANC",
        description: "Hybrid noise cancellation that adapts to your environment in real time.",
      },
      {
        title: "40-hour battery",
        description: "All-day playback with 10-minute fast charge for 5 hours of use.",
      },
    ],
    variants: [
      { id: "v1", name: "Midnight Black", color: "#1a1a1a", subtitle: "Classic" },
      { id: "v2", name: "Graphite", color: "#3a3a3a", subtitle: "Premium" },
      { id: "v3", name: "Rose Gold", color: "#b76e79", subtitle: "Limited" },
    ],
  },
  {
    id: "p2",
    slug: "pulse-smartwatch",
    name: "Pulse X Smartwatch",
    tagline: "Precision health tracking in a refined case",
    description:
      "The Pulse X fuses a sapphire-glass display with cutting-edge biometrics. Track heart rate, blood oxygen, and sleep with hospital-grade accuracy, all wrapped in a sapphire-crystal glass and polished steel body weighing just 38 grams.",
    price: 399,
    currency: "USD",
    category: "Wearables",
    featured: true,
    inStock: true,
    heroImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    images: [
      {
        src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
        alt: "Pulse X smartwatch face view",
      },
      {
        src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
        alt: "Pulse X smartwatch on wrist",
      },
    ],
    model3d: "/models/smartwatch.glb",
    modelScale: 2.6,
    modelPosition: [0, 0, 0],
    specifications: [
      { label: "Display", value: "1.4\" sapphire AMOLED" },
      { label: "Sensors", value: "ECG, PPG, SpO2, skin temp" },
      { label: "Battery", value: "7 days" },
      { label: "Water Resistance", value: "5 ATM" },
      { label: "Weight", value: "38 g" },
      { label: "OS", value: "PulseOS 3" },
    ],
    features: [
      {
        title: "Clinical-grade sensors",
        description: "ECG and SpO2 monitoring you can trust for daily health insights.",
      },
      {
        title: "Sapphire display",
        description: "Scratch-resistant crystal with a vibrant always-on AMOLED panel.",
      },
      {
        title: "7-day battery",
        description: "A full week of tracking on a single charge.",
      },
    ],
    variants: [
      { id: "v1", name: "Space Black", color: "#141414", subtitle: "Classic" },
      { id: "v2", name: "Silver", color: "#c0c0c0", subtitle: "Premium" },
      { id: "v3", name: "Navy", color: "#2c3e50", subtitle: "Steel" },
    ],
  },
  {
    id: "p3",
    slug: "echo-speaker",
    name: "Echo Sound Speaker",
    tagline: "Room-filling 360° sound, beautifully minimal",
    description:
      "The Echo Sound delivers deep, room-filling audio from a single cylindrical silhouette. Its dual passive radiators and down-firing woofer produce surprising bass, while the touch-lit grille blends into any modern space.",
    price: 199,
    currency: "USD",
    category: "Audio",
    inStock: true,
    heroImage:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80",
    images: [
      {
        src: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80",
        alt: "Echo Sound speaker on table",
      },
      {
        src: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
        alt: "Echo Sound speaker detail",
      },
    ],
    model3d: "/models/speaker.glb",
    modelScale: 1.9,
    modelPosition: [0, 0, 0],
    specifications: [
      { label: "Output", value: "60W, 360° sound" },
      { label: "Frequency Response", value: "45Hz – 20kHz" },
      { label: "Connectivity", value: "Bluetooth 5.2, AUX" },
      { label: "Battery", value: "24 hours" },
      { label: "Water Resistance", value: "IPX7" },
      { label: "Weight", value: "940 g" },
    ],
    features: [
      {
        title: "360° soundstage",
        description: "A single full-range driver radiates sound evenly in every direction.",
      },
      {
        title: "Deep bass",
        description: "Dual passive radiators deliver punchy low-end without a subwoofer.",
      },
      {
        title: "IPX7 portable",
        description: "Splash-proof and dust-proof for worry-free use anywhere.",
      },
    ],
    variants: [
      { id: "v1", name: "Charcoal", color: "#2b2b2b", subtitle: "Classic" },
      { id: "v2", name: "Frost White", color: "#f0f0f0", subtitle: "Bright" },
      { id: "v3", name: "Copper", color: "#b87333", subtitle: "Limited" },
    ],
  },
  {
    id: "p4",
    slug: "lumen-table-lamp",
    name: "Lumen Desk Lamp",
    tagline: "Architectural illumination for focused work",
    description:
      "The Lumen Desk Lamp pairs a sculptural aluminium arm with a circular diffused panel to deliver flicker-free, colour-tunable light. Perfectly weighted joints hold any position, making it a staple for desks, studios, and bedside tables.",
    price: 149,
    currency: "USD",
    category: "Home",
    inStock: true,
    heroImage:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    images: [
      {
        src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
        alt: "Lumen desk lamp glowing",
      },
      {
        src: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=1200&q=80",
        alt: "Lumen desk lamp close up",
      },
    ],
    model3d: "/models/lamp.glb",
    modelScale: 1.6,
    modelPosition: [0, 0, 0],
    specifications: [
      { label: "Colour Temp", value: "2700K – 6500K" },
      { label: "Brightness", value: "0 – 800 lumens" },
      { label: "CRI", value: ">95" },
      { label: "Flicker", value: "Flicker-free, PWM-free" },
      { label: "Controls", value: "Touch, dimming, timer" },
      { label: "Weight", value: "1.2 kg" },
    ],
    features: [
      {
        title: "Tunable white",
        description: "Seamlessly shift from warm to cool light to match your task and mood.",
      },
      {
        title: "High-fidelity colour",
        description: "A 95+ CRI rating renders true colours for creative work.",
      },
      {
        title: "Precision balance",
        description: "Counterweighted aluminium arm stays exactly where you place it.",
      },
    ],
    variants: [
      { id: "v1", name: "Matte Black", color: "#1e1e1e", subtitle: "Classic" },
      { id: "v2", name: "Arctic White", color: "#e8e8e8", subtitle: "Bright" },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}

export function formatPrice(product: Pick<Product, "price" | "currency">): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
    maximumFractionDigits: 0,
  }).format(product.price);
}
