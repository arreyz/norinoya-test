export interface Creator {
  name: string;
  role: 'Author' | 'Illustrator' | 'Author & Illustrator';
}

export interface Volume {
  volNumber: number;
  releaseDate: string;
  coverImage?: string;
  isbn?: string;
  pages?: number;
  cetakanInfo: string; // e.g. "Cetakan I: 2024 (Edisi Baru kertas premium) | Cetakan Lama: 2004 (Kertas koran)"
  price: number; // in IDR
  affiliateLinks: {
    gramedia: string;
    shopee: string;
    tokopedia: string;
  };
  animeAdaptation?: {
    platformName: string;
    watchLink: string;
    platformLogo?: string;
  }[];
  liveActionAdaptation?: {
    platformName: string;
    watchLink: string;
    platformLogo?: string;
  }[];
  reviewShort?: {
    platform: 'tiktok' | 'instagram';
    videoId: string;
    views: string;
    title: string;
    duration: string;
  };
}

export interface Comic {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  category: 'manga' | 'light_novel' | 'novel';
  coverImage?: string;
  rating: number; // e.g. 8.9
  status: 'ongoing' | 'completed';
  demographic: 'Shonen' | 'Shojo' | 'Seinen' | 'Josei' | 'General';
  genres: string[];
  publisherId: 'elex' | 'mnc' | 'level' | 'gramedia' | 'akasha' | 'clover' | 'haru' | 'phoenix';
  publisherName: string;
  originalPublisher?: string;
  totalVolumesKnown: string; // e.g., "74 Volumes" or "Ongoing (Currently 15 in ID)"
  firstPublishedInId: string; // e.g., "2023"
  isFeatured?: boolean;
  volumes: Volume[];
  readingRating?: 'Anak & Bimbingan Orang Tua' | 'Remaja' | 'Dewasa Ringan' | 'Dewasa Berat';
  authorStory?: string;
  authorArt?: string;
}

export interface PreOwnedItem {
  id: string;
  comicTitle: string;
  volumeNumber: number;
  originalPrice: number;
  salePrice: number;
  conditionRating: string; // e.g., "9.8/10 (Mulus, sekali baca)"
  notes: string;
  shopeeUrl: string;
  tokopediaUrl: string;
  isSoldOut?: boolean;
  coverImage?: string;
  carouselImages?: string[]; // Slide images
  carouselLabels?: string[]; // Labels for each image slide (e.g. "Cover Depan", "Punggung Buku (Spine)", "Cover Belakang", "Halaman Kertas")
  linkedComicId?: string; // Links to details in COMICS_DATA
}

export interface NewsUpdate {
  id: string;
  username: string; // e.g., "norinoya_feed"
  displayName: string; // e.g., "Norinoya Feed"
  timestamp: string; // e.g., "2 jam yang lalu"
  content: string;
  category: 'rilisan' | 'cetakan_ulang' | 'promo' | 'edukasi' | 'breaking';
  hashTags: string[];
  attachedImage?: string;
  affiliateLink?: {
    label: string;
    url: string;
  };
}
