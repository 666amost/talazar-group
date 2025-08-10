/**
 * Brand configuration for Talazar Group multi-brand system
 * Defines colors, themes, and metadata for each brand
 */

// Define strict brand slug types
export type BrandSlug = 'puffy' | 'lava' | 'indomie';

// Define color scheme type
export type ColorScheme = Record<string, string>;

// Define service area type
export type ServiceArea = string;

export interface Brand {
  readonly name: string;
  readonly slug: BrandSlug;
  readonly description: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly logo: string;
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
    readonly image: string;
  };
  readonly cssVariables: ColorScheme;
  readonly serviceAreas: readonly ServiceArea[];
}

// Brand color schemes with CSS custom properties
const brandColors: Record<BrandSlug, ColorScheme> = {
  puffy: {
    "--brand-50": "253 242 248",   // Pink theme
    "--brand-100": "252 231 243", 
    "--brand-200": "251 207 232",
    "--brand-300": "249 168 212",
    "--brand-400": "244 114 182",
    "--brand-500": "236 72 153",
    "--brand-600": "219 39 119",
    "--brand-700": "190 24 93",
    "--brand-800": "157 23 77",
    "--brand-900": "131 24 67",
    "--brand-950": "80 7 36",
  },
  lava: {
    "--brand-50": "139 69 19",     // Chocolate brown theme
    "--brand-100": "160 82 45",
    "--brand-200": "101 67 33",
    "--brand-300": "139 69 19",
    "--brand-400": "160 82 45",
    "--brand-500": "139 69 19",
    "--brand-600": "101 67 33",
    "--brand-700": "92 51 23",
    "--brand-800": "74 42 19",
    "--brand-900": "55 30 13",
    "--brand-950": "35 20 9",
  },
  indomie: {
    "--brand-50": "254 242 242",   // Red theme
    "--brand-100": "254 226 226",
    "--brand-200": "254 202 202",
    "--brand-300": "252 165 165",
    "--brand-400": "248 113 113",
    "--brand-500": "239 68 68",
    "--brand-600": "220 38 38",
    "--brand-700": "185 28 28",
    "--brand-800": "153 27 27",
    "--brand-900": "127 29 29",
    "--brand-950": "69 10 10",
  },
} as const;

export const brands: Record<BrandSlug, Brand> = {
  puffy: {
    name: "Puffy Cotton Candy",
    slug: "puffy",
    description: "Artisanal cotton candy and premium sweet treats for your special events",
    primaryColor: "#ec4899", // Pink theme
    secondaryColor: "#fce7f3",
    logo: "/logos/logopuffy.png",
    hero: {
      title: "Premium Cotton Candy Experience",
      subtitle: "Handcrafted sweet treats that melt in your mouth - perfect for parties, events, and celebrations",
      image: "/images/puffy-hero.jpg",
    },
    cssVariables: brandColors.puffy,
    serviceAreas: ["Jakarta Selatan", "Jakarta Pusat", "Tangerang", "Bekasi"],
  },
  lava: {
    name: "Lava Choco Pop",
    slug: "lava",
    description: "Premium chocolate snacks and warm treats catering services",
    primaryColor: "#8B4513", // Chocolate brown theme
    secondaryColor: "#D2B48C",
    logo: "/logos/lava-logo_no.png",
    hero: {
      title: "Premium Chocolate Catering",
      subtitle: "Delicious chocolate snacks and warm treats delivered fresh to your events",
      image: "/images/lava-hero.jpg",
    },
    cssVariables: brandColors.lava,
    serviceAreas: ["Jakarta", "Bogor", "Depok", "Bekasi", "Tangerang"],
  },
  indomie: {
    name: "Indomie Party",
    slug: "indomie",
    description: "Fun instant noodle party catering for memorable gatherings",
    primaryColor: "#DC143C", // Red theme
    secondaryColor: "#FFB6C1",
    logo: "/logos/indomie-logo.png",
    hero: {
      title: "Instant Noodle Party Catering",
      subtitle: "Fun and interactive instant noodle experiences perfect for parties, team building, and celebrations",
      image: "/images/indomie-hero.jpg",
    },
    cssVariables: brandColors.indomie,
    serviceAreas: ["Greater Jakarta", "Bandung", "Surabaya", "Semarang"],
  },
} as const;

/**
 * Extract brand slug from URL path
 * @param pathname - URL pathname (e.g., "/puffy/services")
 * @returns Brand object or null if not found
 */
export function getBrandFromPath(pathname: string): Brand | null {
  const segments = pathname.split("/").filter(Boolean);
  const brandSlug = segments[0];
  
  if (brandSlug && isValidBrand(brandSlug)) {
    return brands[brandSlug as BrandSlug];
  }
  
  return null;
}

/**
 * Get brand by slug with type safety
 * @param slug - Brand slug
 * @returns Brand object or null if not found
 */
export function getBrandBySlug(slug: string): Brand | null {
  if (isValidBrand(slug)) {
    return brands[slug as BrandSlug];
  }
  return null;
}

/**
 * Get all available brands
 * @returns Array of all brand objects
 */
export function getAllBrands(): readonly Brand[] {
  return Object.values(brands) as readonly Brand[];
}

/**
 * Validate if a brand slug exists
 * @param slug - Brand slug to validate
 * @returns Boolean indicating if brand exists
 */
export function isValidBrand(slug: string): slug is BrandSlug {
  return slug in brands;
}
