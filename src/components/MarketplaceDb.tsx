import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, BookOpen, Star, Filter, ArrowUpRight, Play, Check, X,
  ShoppingBag, Tv, Video, HelpCircle, AlertCircle, Info, ChevronRight, ArrowLeft, ChevronDown, Instagram, ShieldAlert
} from 'lucide-react';
import { COMICS_DATA } from '../data/mockData';
import { Comic, Volume } from '../types';

interface CustomSelectProps {
  label: string;
  value: string[];
  options: { value: string; label: string }[];
  onChange: (value: string[]) => void;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

function CustomSelect({ label, value, options, onChange, isOpen, onToggle }: CustomSelectProps) {
  const selectedOptions = options.filter(opt => value.includes(opt.value) && opt.value !== 'all');
  const displayText = selectedOptions.length === 0 
    ? (options.find(opt => opt.value === 'all')?.label || 'Semua')
    : selectedOptions.length === 1
      ? selectedOptions[0].label
      : `${selectedOptions[0].label} (+${selectedOptions.length - 1})`;

  return (
    <div className="flex flex-col gap-1 select-none w-full" onClick={(e) => e.stopPropagation()}>
      <span className="text-xs font-sans font-bold tracking-wide text-neutral-400 dark:text-neutral-500 pl-0.5 mb-0.5">
        {label}
      </span>
      <div className="relative w-full">
        <button
          type="button"
          onClick={onToggle}
          title={displayText}
          className="flex items-center justify-between w-full h-9 px-3.5 bg-neutral-50/55 dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-lg text-xs md:text-sm text-neutral-850 dark:text-neutral-100 transition-all font-sans font-medium text-left outline-none cursor-pointer"
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 shrink-0 select-none ml-1.5 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 shadow-[0_12px_32px_rgba(0,0,0,0.08)] rounded-xl py-1.5 z-[100] max-h-60 overflow-y-auto"
            >
              {options.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      if (opt.value === 'all') {
                        onChange(['all']);
                      } else {
                        let next = value.filter(v => v !== 'all');
                        if (next.includes(opt.value)) {
                          next = next.filter(v => v !== opt.value);
                        } else {
                          next.push(opt.value);
                        }
                        if (next.length === 0) {
                          next = ['all'];
                        }
                        onChange(next);
                      }
                    }}
                    className={`flex items-start justify-between w-full px-3.5 py-2.5 sm:py-2 text-xs md:text-sm text-left transition-colors font-sans cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAFAFA] dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-bold'
                        : 'text-neutral-700 dark:text-neutral-350 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 font-medium'
                    }`}
                  >
                    <span className="flex-1 pr-1.5 whitespace-normal break-words leading-snug py-0.5">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-neutral-950 dark:text-neutral-50 shrink-0 ml-1.5 mt-0.5" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface MarketplaceDbProps {
  initialSelectedComicId?: string | null;
  onClearSelectedComicId?: () => void;
}

export default function MarketplaceDb({ initialSelectedComicId, onClearSelectedComicId }: MarketplaceDbProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>(['all']);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all']);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['all']);
  const [selectedAdaptations, setSelectedAdaptations] = useState<string[]>(['all']);
  const [selectedReadingRatings, setSelectedReadingRatings] = useState<string[]>(['all']);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevan');

  const sortOptions = [
    { value: 'relevan', label: 'Paling Relevan' },
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'terpopuler', label: 'Terpopuler' },
    { value: 'harga_terendah', label: 'Harga Terendah' },
    { value: 'harga_tertinggi', label: 'Harga Tertinggi' },
    { value: 'alfabet_az', label: 'Alfabet A-Z' },
    { value: 'alfabet_za', label: 'Alfabet Z-A' },
  ];

  useEffect(() => {
    if (!activeDropdown) return;
    const handleClose = () => setActiveDropdown(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [activeDropdown]);

  // Modal detailed states
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [activeVolumeNum, setActiveVolumeNum] = useState<number>(1);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const scrollableContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveSlideIndex(0);
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = 0;
    }
  }, [selectedComic?.id, activeVolumeNum]);

  const [isPlayingShort, setIsPlayingShort] = useState<boolean>(false);
  const [selectedShort, setSelectedShort] = useState<any | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [unlockedComics, setUnlockedComics] = useState<Record<string, boolean>>({});

  const activeVolObj = selectedComic
    ? (selectedComic.volumes.find(v => v.volNumber === activeVolumeNum) || selectedComic.volumes[0])
    : null;

  const activeVolumeCover = selectedComic
    ? (activeVolObj?.coverImage || selectedComic.coverImage)
    : undefined;

  const carouselImages = selectedComic
    ? ([
        activeVolumeCover,
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80'
      ].filter(Boolean) as string[])
    : [];

  const carouselLabels = selectedComic
    ? [
        `Foto Depan Edisi Resmi Jilid ${activeVolumeNum}`,
        'Foto Samping (Punggung Buku / Spine)',
        'Foto Belakang (Halaman Ringkasan Blurb)',
        'Kondisi Kertas Mewah Setelah Bedah Isi',
        'Detail Potongan Presisi & Binding Jilid'
      ]
    : [];

  const getReadingRatingStyle = (rating?: string) => {
    switch (rating) {
      case 'Anak & Bimbingan Orang Tua':
        return {
          bg: 'bg-[rgba(65,163,76,0.06)] border-[rgba(65,163,76,0.35)] text-[#41a34c]',
          text: 'Anak & Bimbingan',
          color: '#41a34c'
        };
      case 'Remaja':
        return {
          bg: 'bg-[rgba(255,199,21,0.06)] border-[rgba(255,199,21,0.4)] text-[#d49f00]',
          text: 'Remaja',
          color: '#ffc715'
        };
      case 'Dewasa Ringan':
        return {
          bg: 'bg-[rgba(255,114,60,0.06)] border-[rgba(255,114,60,0.35)] text-[#ff6628]',
          text: 'Dewasa Ringan',
          color: '#ff723c'
        };
      case 'Dewasa Berat':
        return {
          bg: 'bg-[rgba(193,39,31,0.06)] border-[rgba(193,39,31,0.35)] text-[#c1271f]',
          text: 'Dewasa Berat',
          color: '#c1271f'
        };
      default:
        return {
          bg: 'bg-neutral-50 border-neutral-200 text-neutral-700',
          text: 'Remaja',
          color: '#737373'
        };
    }
  };

  const getAuthorLabel = (c: { authorStory?: string; authorArt?: string }) => {
    const story = c.authorStory;
    const art = c.authorArt;
    if (!story && !art) return '';
    if (story === art) return story ? `(${story})` : '';
    const list = [story, art].filter(Boolean);
    return `(${list.join(', ')})`;
  };

  useEffect(() => {
    if (initialSelectedComicId) {
      // Support either standard series id or formatted series-vol-X identifier
      const parts = initialSelectedComicId.split('-vol-');
      const realComicId = parts[0];
      const targetVol = parts[1] ? parseInt(parts[1], 10) : 1;

      const comic = COMICS_DATA.find(c => c.id === realComicId);
      if (comic) {
        setSelectedComic(comic);
        setActiveVolumeNum(comic.volumes.some(v => v.volNumber === targetVol) ? targetVol : (comic.volumes[0]?.volNumber || 1));
        setIsPlayingShort(false);
      }
    } else {
      setSelectedComic(null);
    }
  }, [initialSelectedComicId]);

  const handleCloseModal = () => {
    setSelectedComic(null);
    if (onClearSelectedComicId) {
      onClearSelectedComicId();
    }
    // Reset path hash safely
    if (window.location.hash.startsWith('#/database/')) {
      window.location.hash = '#database';
    }
  };

  // All genres present in database
  const allGenres = useMemo(() => [
    'Action',
    'Adventure',
    'Avant Garde',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Natural',
    'Psychological',
    'Romance',
    'Sci-Fi',
    'Slice of Life',
    'Sports',
    'Supernatural',
    'Thriller'
  ], []);

  // Map each individual comic and volume into a distinct volume posting
  interface VolumePost {
    id: string;
    comic: Comic;
    volume: Volume;
  }

  const allVolumePosts = useMemo<VolumePost[]>(() => {
    const posts: VolumePost[] = [];
    COMICS_DATA.forEach(comic => {
      comic.volumes.forEach(volume => {
        posts.push({
          id: `${comic.id}-vol-${volume.volNumber}`,
          comic,
          volume,
        });
      });
    });
    return posts;
  }, []);

  // Filter logic on volume posts
  const filteredVolumePosts = useMemo(() => {
    return allVolumePosts.filter(post => {
      const { comic, volume } = post;
      const combinedTitle = `${comic.title} Vol ${volume.volNumber}`;
      
      const matchesSearch = 
        combinedTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comic.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volume.cetakanInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (volume.isbn && volume.isbn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        comic.publisherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comic.authorStory && comic.authorStory.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (comic.authorArt && comic.authorArt.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = selectedCategories.includes('all') || selectedCategories.length === 0 || selectedCategories.includes(comic.category);
      const matchesPublisher = selectedPublishers.includes('all') || selectedPublishers.length === 0 || selectedPublishers.includes(comic.publisherId);
      const matchesStatus = selectedStatuses.includes('all') || selectedStatuses.length === 0 || selectedStatuses.includes(comic.status);
      const matchesGenre = selectedGenres.includes('all') || selectedGenres.length === 0 || comic.genres.some(g => {
        const comicNorm = g.toLowerCase().replace(/[_-]/g, ' ').trim();
        return selectedGenres.some(sg => {
          const selectNorm = sg.toLowerCase().replace(/[_-]/g, ' ').trim();
          return selectNorm === comicNorm;
        });
      });

      const matchesAdaptation = selectedAdaptations.includes('all') || selectedAdaptations.length === 0 || selectedAdaptations.some(sa => {
        if (sa === 'anime') {
          return !!(volume.animeAdaptation && volume.animeAdaptation.length > 0);
        }
        if (sa === 'live_action') {
          return !!(volume.liveActionAdaptation && volume.liveActionAdaptation.length > 0);
        }
        return false;
      });

      const matchesReadingRating = selectedReadingRatings.includes('all') || selectedReadingRatings.length === 0 || selectedReadingRatings.includes(comic.readingRating || 'Remaja');

      return matchesSearch && matchesCat && matchesPublisher && matchesStatus && matchesGenre && matchesAdaptation && matchesReadingRating;
    });
  }, [allVolumePosts, searchTerm, selectedCategories, selectedPublishers, selectedStatuses, selectedGenres, selectedAdaptations, selectedReadingRatings]);

  const sortedVolumePosts = useMemo(() => {
    const list = [...filteredVolumePosts];
    switch (sortBy) {
      case 'terbaru':
        return list.sort((a, b) => b.volume.releaseDate.localeCompare(a.volume.releaseDate));
      case 'terpopuler':
        return list.sort((a, b) => {
          const ratingDiff = b.comic.rating - a.comic.rating;
          if (ratingDiff !== 0) return ratingDiff;
          return a.comic.title.localeCompare(b.comic.title);
        });
      case 'harga_terendah':
        return list.sort((a, b) => a.volume.price - b.volume.price);
      case 'harga_tertinggi':
        return list.sort((a, b) => b.volume.price - a.volume.price);
      case 'alfabet_az':
        return list.sort((a, b) => {
          const titleA = `${a.comic.title} Vol ${a.volume.volNumber}`;
          const titleB = `${b.comic.title} Vol ${b.volume.volNumber}`;
          return titleA.localeCompare(titleB, 'id');
        });
      case 'alfabet_za':
        return list.sort((a, b) => {
          const titleA = `${a.comic.title} Vol ${a.volume.volNumber}`;
          const titleB = `${b.comic.title} Vol ${b.volume.volNumber}`;
          return titleB.localeCompare(titleA, 'id');
        });
      case 'relevan':
      default:
        return list.sort((a, b) => {
          const aFeat = a.comic.isFeatured ? 1 : 0;
          const bFeat = b.comic.isFeatured ? 1 : 0;
          if (bFeat !== aFeat) return bFeat - aFeat;
          const indexA = allVolumePosts.indexOf(a);
          const indexB = allVolumePosts.indexOf(b);
          return indexA - indexB;
        });
    }
  }, [filteredVolumePosts, sortBy, allVolumePosts]);

  const publisherLabels: Record<string, string> = {
    elex: 'Elex Media Komputindo',
    level: 'Elex Media Komputindo (Level Comic)',
    mnc: 'm&c!',
    akasha: 'm&c! (AKASHA)',
    clover: 'Penerbit Clover',
    haru: 'Penerbit Haru',
    phoenix: 'Phoenix Gramedia Indonesia'
  };

  const openVolumeModal = (comic: Comic, volNumber: number) => {
    setSelectedComic(comic);
    setActiveVolumeNum(volNumber);
    setIsPlayingShort(false);
    // Sync browser hash to allow proper back navigation and tab switching
    window.location.hash = `#/database/${comic.id}-vol-${volNumber}`;
  };

  return (
    <div className="space-y-6" id="marketplace-search-section">
      {!selectedComic && (
        <>
          {/* Visual Minimalist Landing Hero for Database */}
          <div className="text-center py-8 md:py-12 space-y-4 max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl border border-neutral-150 shadow-xs mb-6">
            <span className="inline-block px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono tracking-wider uppercase rounded-md leading-[16px]">
              TERBITAN RESMI INDONESIA
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-neutral-950 tracking-tight leading-tight uppercase font-black">
              Satu Tempat, Semua Judul
            </h2>
            <p className="text-sm md:text-base text-neutral-605 max-w-xl mx-auto leading-[24px]">
              Manga, light novel, sampai novel adaptasi. Semua data terbitan resmi Indonesia dikumpulkan dalam satu tempat buat kamu.
            </p>
          </div>

          {/* Ads Placeholder */}
          <div className="w-full max-w-3xl mx-auto bg-neutral-50/70 border border-dashed border-neutral-300 rounded-xl p-4 text-center space-y-1 mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block leading-[16px]">📢 SPONSORED ADSENSE</span>
            <div className="text-xs text-neutral-500 font-sans leading-[20px]">
              Iklan Google Adsense membantu kelangsungan server database buku Norinoya. Hubungi kami untuk penempatan banner premium.
            </div>
          </div>

      {/* Advanced Anilist style Search Filter Panel */}
      <div className="bg-white border border-[#EFEFEF] p-5 rounded-xl space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Filter className="w-4 h-4 text-neutral-800" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 leading-normal">
            Panel Pencarian Tingkat Lanjut
          </h3>
        </div>

        {/* Filters Grid */}
        <div className="flex flex-col gap-3.5">
          {/* Main search input, always visible + collapse filters button for mobile */}
          <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-end">
            <div className="flex-1 relative">
              <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-1 leading-normal">Cari Kata Kunci</label>
              <div className="relative select-text">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Ketik judul manga, light novel, atau kriteria lainnya..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-neutral-200 hover:bg-neutral-50/50 focus:bg-white rounded-lg outline-none h-9 font-sans transition-all focus:border-neutral-950 leading-normal"
                />
              </div>
            </div>

            {/* Advanced Filters Button on Mobile Only */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className={`w-full h-9 flex items-center justify-center gap-1.5 border rounded-lg text-xs font-mono font-bold transition-all ${
                  isFiltersExpanded 
                    ? 'bg-neutral-950 text-white border-neutral-950' 
                    : 'bg-white text-neutral-700 border-neutral-205 hover:bg-neutral-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{isFiltersExpanded ? 'Sembunyikan Filter' : 'Filter Kategori & Penerbit'}</span>
              </button>
            </div>
          </div>

          {/* Advanced select dropdowns - always open on desktop, expandable on mobile */}
          <div className={`${isFiltersExpanded ? 'grid' : 'hidden'} md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 md:grid-cols-3 gap-3.5 pt-1 md:pt-0`}>
            {/* Format */}
            <CustomSelect
              label="Format Buku"
              value={selectedCategories}
              options={[
                { value: 'all', label: 'Semua Format' },
                { value: 'manga', label: 'Komik (Manga)' },
                { value: 'light_novel', label: 'Light Novel' },
                { value: 'novel', label: 'Novel' }
              ]}
              onChange={(val) => {
                setSelectedCategories(val);
              }}
              isOpen={activeDropdown === 'category'}
              onToggle={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'category' ? null : 'category');
              }}
            />

            {/* Publisher */}
            <CustomSelect
              label="Penerbit Buku"
              value={selectedPublishers}
              options={[
                { value: 'all', label: 'Semua Penerbit' },
                { value: 'elex', label: 'Elex Media Komputindo' },
                { value: 'level', label: 'Elex Media Komputindo (Level Comic)' },
                { value: 'mnc', label: 'm&c!' },
                { value: 'akasha', label: 'm&c! (AKASHA)' },
                { value: 'clover', label: 'Penerbit Clover' },
                { value: 'haru', label: 'Penerbit Haru' },
                { value: 'phoenix', label: 'Phoenix Gramedia Indonesia' },
                { value: 'baca', label: 'Penerbit Baca' }
              ]}
              onChange={(val) => {
                setSelectedPublishers(val);
              }}
              isOpen={activeDropdown === 'publisher'}
              onToggle={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'publisher' ? null : 'publisher');
              }}
            />

            {/* Status */}
            <CustomSelect
              label="Status Publikasi"
              value={selectedStatuses}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'ongoing', label: 'Sedang Berjalan' },
                { value: 'completed', label: 'Tamat' }
              ]}
              onChange={(val) => {
                setSelectedStatuses(val);
              }}
              isOpen={activeDropdown === 'status'}
              onToggle={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'status' ? null : 'status');
              }}
            />

            {/* Genre */}
            <CustomSelect
              label="Genre Cerita"
              value={selectedGenres}
              options={[
                { value: 'all', label: 'Semua Genre' },
                ...allGenres.map(g => ({ value: g, label: g }))
              ]}
              onChange={(val) => {
                setSelectedGenres(val);
              }}
              isOpen={activeDropdown === 'genre'}
              onToggle={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'genre' ? null : 'genre');
              }}
            />

            {/* Adaptasi */}
            <CustomSelect
              label="Adaptasi"
              value={selectedAdaptations}
              options={[
                { value: 'all', label: 'Semua Adaptasi' },
                { value: 'anime', label: 'Anime' },
                { value: 'live_action', label: 'Live Action' }
              ]}
              onChange={(val) => {
                setSelectedAdaptations(val);
              }}
              isOpen={activeDropdown === 'adaptation'}
              onToggle={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'adaptation' ? null : 'adaptation');
              }}
            />

            {/* Rating Usia */}
            <CustomSelect
              label="Rating Usia"
              value={selectedReadingRatings}
              options={[
                { value: 'all', label: 'Semua Usia' },
                { value: 'Anak & Bimbingan Orang Tua', label: 'Anak & Bimbingan' },
                { value: 'Remaja', label: 'Remaja' },
                { value: 'Dewasa Ringan', label: 'Dewasa Ringan' },
                { value: 'Dewasa Berat', label: 'Dewasa Berat' }
              ]}
              onChange={(val) => {
                setSelectedReadingRatings(val);
              }}
              isOpen={activeDropdown === 'reading_rating'}
              onToggle={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === 'reading_rating' ? null : 'reading_rating');
              }}
            />
          </div>
        </div>

        {/* Active Filters Panel (Tag Pills) */}
        {(searchTerm || 
          !selectedCategories.includes('all') || 
          !selectedPublishers.includes('all') || 
          !selectedStatuses.includes('all') || 
          !selectedGenres.includes('all') || 
          !selectedAdaptations.includes('all') ||
          !selectedReadingRatings.includes('all')) && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-100">
            <span className="text-xs font-mono font-bold uppercase text-neutral-400 mr-1.5 shrink-0">
              Filter Aktif:
            </span>
            
            {/* Render Category tags */}
            {!selectedCategories.includes('all') && selectedCategories.map(cat => {
              const label = cat === 'manga' ? 'Komik (Manga)' : cat === 'light_novel' ? 'Light Novel' : 'Novel';
              return (
                <span key={`cat-${cat}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 text-xs font-sans font-medium rounded-full transition-colors select-none">
                  {label}
                  <button 
                    onClick={() => {
                      const next = selectedCategories.filter(v => v !== cat);
                      setSelectedCategories(next.length === 0 ? ['all'] : next);
                    }}
                    className="hover:bg-neutral-300 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              );
            })}

            {/* Render Publisher tags */}
            {!selectedPublishers.includes('all') && selectedPublishers.map(pub => {
              const label = publisherLabels[pub] || pub;
              return (
                <span key={`pub-${pub}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 text-xs font-sans font-medium rounded-full transition-colors select-none">
                  {label}
                  <button 
                    onClick={() => {
                      const next = selectedPublishers.filter(v => v !== pub);
                      setSelectedPublishers(next.length === 0 ? ['all'] : next);
                    }}
                    className="hover:bg-neutral-300 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              );
            })}

            {/* Render Status tags */}
            {!selectedStatuses.includes('all') && selectedStatuses.map(status => {
              const label = status === 'ongoing' ? 'Sedang Berjalan' : 'Tamat';
              return (
                <span key={`status-${status}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 text-xs font-sans font-medium rounded-full transition-colors select-none">
                  {label}
                  <button 
                    onClick={() => {
                      const next = selectedStatuses.filter(v => v !== status);
                      setSelectedStatuses(next.length === 0 ? ['all'] : next);
                    }}
                    className="hover:bg-neutral-300 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              );
            })}

            {/* Render Genre tags */}
            {!selectedGenres.includes('all') && selectedGenres.map(genre => {
              return (
                <span key={`genre-${genre}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 text-xs font-sans font-medium rounded-full transition-colors select-none">
                  {genre}
                  <button 
                    onClick={() => {
                      const next = selectedGenres.filter(v => v !== genre);
                      setSelectedGenres(next.length === 0 ? ['all'] : next);
                    }}
                    className="hover:bg-neutral-300 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              );
            })}

            {/* Render Adaptation tags */}
            {!selectedAdaptations.includes('all') && selectedAdaptations.map(ad => {
              const label = ad === 'anime' ? 'Anime' : 'Live Action';
              return (
                <span key={`ad-${ad}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 text-xs font-sans font-medium rounded-full transition-colors select-none">
                  {label}
                  <button 
                    onClick={() => {
                      const next = selectedAdaptations.filter(v => v !== ad);
                      setSelectedAdaptations(next.length === 0 ? ['all'] : next);
                    }}
                    className="hover:bg-neutral-300 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              );
            })}

            {/* Render Reading Rating tags */}
            {!selectedReadingRatings.includes('all') && selectedReadingRatings.map(rr => {
              const label = rr === 'Anak & Bimbingan Orang Tua' ? 'Anak & Bimbingan' : rr;
              return (
                <span key={`rr-${rr}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 text-xs font-sans font-medium rounded-full transition-colors select-none">
                  {label}
                  <button 
                    onClick={() => {
                      const next = selectedReadingRatings.filter(v => v !== rr);
                      setSelectedReadingRatings(next.length === 0 ? ['all'] : next);
                    }}
                    className="hover:bg-neutral-300 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              );
            })}

            {/* Dynamic Search Term Tag */}
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 text-xs font-sans font-medium rounded-full transition-colors select-none">
                Cari: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="hover:bg-neutral-300 rounded-full p-0.5 transition-colors cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            {/* Clear All active Tag */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategories(['all']);
                setSelectedPublishers(['all']);
                setSelectedStatuses(['all']);
                setSelectedGenres(['all']);
                setSelectedAdaptations(['all']);
                setSelectedReadingRatings(['all']);
              }}
              className="text-xs font-mono font-bold hover:underline hover:text-red-600 text-red-500 ml-auto flex items-center gap-1 cursor-pointer leading-normal pl-2"
            >
              Reset Semua
            </button>
          </div>
        )}
      </div>

      {/* Catalog Header Toolbar with product count and sorting selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-2 bg-[#FAFAFA] dark:bg-neutral-900 border border-[#EFEFEF] dark:border-neutral-800 rounded-xl p-4 shadow-3xs" id="catalog-sort-wrapper">
        <div className="space-y-1">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 leading-none">
            DATA TERBITAN RESMI
          </p>
          <h4 className="text-sm md:text-base font-sans font-black text-neutral-950 dark:text-neutral-50 leading-tight">
            Menampilkan <span className="text-[#03ac0e] font-black">{sortedVolumePosts.length}</span> Jilid Komik / Novel
          </h4>
        </div>
        
        {/* Style-different custom "Urutkan" selector */}
        <div className="relative select-none w-full sm:w-60" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setActiveDropdown(activeDropdown === 'sort' ? null : 'sort');
            }}
            className="flex items-center justify-between w-full h-[50px] px-4 bg-neutral-950 dark:bg-neutral-900 border border-neutral-900 dark:border-neutral-800 hover:bg-neutral-900 dark:hover:bg-neutral-850 rounded-xl shadow-md transition-all text-left outline-none cursor-pointer group"
          >
            <div className="flex flex-col items-start justify-center leading-none">
              <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mb-1">
                Urutkan Hasil
              </span>
              <span className="text-xs md:text-sm font-sans font-extrabold text-emerald-400 dark:text-emerald-400 tracking-wide font-black">
                {sortOptions.find(o => o.value === sortBy)?.label || 'Paling Relevan'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-neutral-300 dark:text-neutral-450 shrink-0 transition-transform duration-200 group-hover:text-emerald-400 ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {activeDropdown === 'sort' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -6 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-[calc(100%+6px)] w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[0_16px_40px_rgba(0,0,0,0.18)] rounded-2xl py-1.5 z-[110] overflow-hidden"
              >
                {sortOptions.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        setActiveDropdown(null);
                      }}
                      className={`flex items-center justify-between w-full px-4.5 py-3 text-xs md:text-sm text-left transition-colors font-sans cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-50 dark:bg-neutral-800 text-[#03ac0e] dark:text-emerald-400 font-extrabold font-sans'
                          : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 font-medium'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#03ac0e] dark:text-emerald-400 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {sortedVolumePosts.length > 0 ? (
            sortedVolumePosts.map((post) => {
              const { comic, volume } = post;
              return (
                <a
                  key={post.id}
                  href={`#/database/${comic.id}-vol-${volume.volNumber}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey) return;
                    e.preventDefault();
                    openVolumeModal(comic, volume.volNumber);
                  }}
                  className="block group"
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="h-full bg-white dark:bg-neutral-900 border border-[#EFEFEF] dark:border-neutral-800 p-2.5 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)] hover:translate-y-[-3px]"
                  >
                    {/* Book Jacket Art */}
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950 flex flex-col justify-between p-3 mb-2">
                      {(volume.coverImage || comic.coverImage) && !imageErrors[post.id] ? (
                        <img
                          src={volume.coverImage || comic.coverImage}
                          alt={`${comic.title} Vol ${volume.volNumber}`}
                          onError={() => setImageErrors(prev => ({ ...prev, [post.id]: true }))}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col justify-between p-3 border border-neutral-700">
                          <div className="my-auto text-center px-1">
                            <BookOpen className="w-8 h-8 text-neutral-500 stroke-[1.2] mx-auto mb-1.5 opacity-60" />
                            <span className="text-[8.5px] font-mono tracking-wider text-neutral-400 uppercase">
                              {comic.category.replace('_', ' ')}
                            </span>
                            <h4 className="text-[11px] font-sans font-extrabold text-neutral-200 mt-1 line-clamp-3 leading-normal">
                              {comic.title}
                            </h4>
                          </div>
                        </div>
                      )}
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-85" />

                      <div className="flex justify-between items-start w-full relative z-20">
                        <span className="bg-white/95 backdrop-blur-md text-neutral-900 border border-neutral-100 text-[9px] font-sans font-bold tracking-wider px-1.5 py-0.5 rounded uppercase leading-none shadow-xs">
                          {comic.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Meta details */}
                    <div className="space-y-1 px-1 text-left">
                      <h4 className="text-xs font-sans font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
                        {comic.title}
                      </h4>
                      
                      {/* Authors List (Minimal Parenthesized Layout with Comma Join) */}
                      {(comic.authorStory || comic.authorArt) && (
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-550 leading-tight truncate">
                          {getAuthorLabel(comic)}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 items-center">
                        <span className="text-[9.5px] text-neutral-500 dark:text-neutral-400 font-sans line-clamp-1">
                          {comic.genres.slice(0, 2).join(', ')}
                        </span>
                      </div>

                      {comic.readingRating && (
                        <div className="pt-0.5 select-none">
                          <span className={`text-[8.5px] sm:text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border leading-none inline-block ${getReadingRatingStyle(comic.readingRating).bg}`}>
                            {getReadingRatingStyle(comic.readingRating).text}
                          </span>
                        </div>
                      )}

                      <div className="pt-1.5 mt-1 border-t border-neutral-50 dark:border-neutral-800 flex items-center justify-between font-mono w-full">
                        <span className="font-extrabold text-neutral-950 dark:text-neutral-50 font-sans text-xs shrink-0 leading-none">
                          Rp {volume.price.toLocaleString('id-ID')}
                        </span>
                        <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-200/40 dark:border-amber-800/40 leading-none shrink-0 shadow-[0_1px_2px_rgba(245,158,11,0.04)]">
                          Vol {volume.volNumber}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </a>
              );
            })
          ) : (
            <div className="col-span-full p-12 border border-dashed border-neutral-250 text-center rounded-xl">
              <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h4 className="font-bold text-neutral-800 font-sans text-sm">Tidak ada database komik yang cocok</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-normal">Coba gunakan kata kunci lain atau ubah filter format penerbit.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
      </>
      )}

      {/* Advanced Fullscreen Detailed View */}
      <AnimatePresence>
        {selectedComic && (
          <div className="w-full bg-white dark:bg-neutral-950 flex flex-col min-h-screen">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full bg-white dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 flex flex-col transition-colors duration-200"
            >
              {/* Scrollable Content Viewport with horizontal scrolling forced to hidden */}
              <div 
                className="w-full"
              >
                {/* Static Top Header (instead of floating navbar) */}
                <div className="bg-white dark:bg-neutral-900 border-b border-[#EFEFEF] dark:border-neutral-800 py-3.5 px-4 sm:px-6 flex items-center justify-start z-30 shadow-xs">
                  <button
                    onClick={handleCloseModal}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-neutral-100 transition-all cursor-pointer text-sm font-sans font-bold shadow-3xs"
                  >
                    <ArrowLeft className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
                    <span>Kembali</span>
                  </button>
                </div>

                <div className="max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-28">
                  {/* Title Header with Gradient */}
                  <div className="bg-neutral-50/80 p-3 sm:p-5 md:p-6 border border-neutral-200 rounded-xl flex flex-col md:flex-row gap-4 md:gap-6 items-start relative overflow-hidden shadow-xs">
                  
                  {/* Left Column: Interactive Slide Carousel Portfolio Component */}
                  <div className="flex flex-col gap-3 shrink-0 w-full md:w-80">
                    <div className="relative aspect-[3/4] w-full max-w-[260px] mx-auto md:max-w-none rounded-xl overflow-hidden bg-neutral-950 flex flex-col justify-between p-3 border border-neutral-150 shadow-md group">
                      
                      {/* Active Slide Image */}
                      {carouselImages && carouselImages.length > 0 ? (
                        <img 
                          src={carouselImages[activeSlideIndex]} 
                          alt={`${selectedComic.title} - Jilid ${activeVolumeNum} - Slide ${activeSlideIndex + 1}`} 
                          referrerPolicy="no-referrer"
                          onClick={() => setIsLightboxOpen(true)}
                          className="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-neutral-450 rounded-2xl">
                          <BookOpen className="w-14 h-14 stroke-[1.2]" />
                        </div>
                      )}
                      
                      {/* Dark Overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none rounded-2xl" />

                      {/* Manual side previous / next arrow anchors */}
                      {carouselImages && carouselImages.length > 1 && (
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2.5 z-20 pointer-events-auto select-none">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSlideIndex((prev) => 
                                prev === 0 ? carouselImages.length - 1 : prev - 1
                              );
                            }}
                            className="w-7 h-7 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center select-none transition-colors border border-white/15 shadow-md cursor-pointer"
                          >
                            <Play className="w-2.5 h-2.5 fill-white text-white rotate-180" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSlideIndex((prev) => 
                                prev === carouselImages.length - 1 ? 0 : prev + 1
                              );
                            }}
                            className="w-7 h-7 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center select-none transition-colors border border-white/15 shadow-md cursor-pointer"
                          >
                            <Play className="w-2.5 h-2.5 fill-white text-white" />
                          </button>
                        </div>
                      )}

                      {/* No active target captions overlay for cleaner database view */}
                    </div>

                    {/* Miniature thumbnail row indicators (responsive) */}
                    {carouselImages && carouselImages.length > 1 && (
                      <div className="grid grid-cols-5 gap-1.5 select-none self-center w-full">
                        {carouselImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`aspect-square rounded-lg border overflow-hidden relative transition-all bg-neutral-900 cursor-pointer ${
                              activeSlideIndex === idx 
                                ? 'border-neutral-950 ring-2 ring-neutral-950 ring-offset-1 p-0.5 scale-102 font-bold' 
                                : 'border-neutral-200 opacity-65 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`thumbnail ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-md" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Combined Information Panel */}
                  <div className="space-y-4 flex-1 pt-1 text-left w-full">
                    
                    {/* Primary Comic and Volume title */}
                    <h2 className="text-xl md:text-2xl font-sans font-extrabold text-neutral-900 tracking-tight leading-snug">
                      {selectedComic.title} (Volume {activeVolumeNum})
                    </h2>

                    {/* Curator explanation text (Gambar 1 style) */}
                    <p className="text-xs text-neutral-550 leading-relaxed font-sans">
                      Item ini dikurasi langsung oleh tim <strong className="text-neutral-900">@konotasi.sukasuka</strong> setelah sesi bedah terbitan. Segel dibuka dengan sangat hati-hati, hanya dibaca sekali untuk pencatatan kualitas kertas, lalu langsung dibungkus rapi dalam sleeve plastik tahan kelembaban.
                    </p>

                    {/* Collector badge triggers (Gambar 1 style) */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] sm:text-xs bg-neutral-100 text-neutral-850 px-2.5 py-1 rounded font-mono border border-neutral-200 font-extrabold uppercase leading-normal">
                        📚 Edisi Kolektor / Reviewer
                      </span>
                    </div>

                    {/* Divider separating curator details and the original comic metadata */}
                    <div className="h-px bg-neutral-200 my-4" />

                    {/* Combined Metadata from Gambar 2: Ratings, Demographics, and Category Badges */}
                    <div className="space-y-3 pt-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-mono px-2.5 py-0.5 bg-neutral-150 text-neutral-800 rounded-md capitalize font-bold leading-normal">
                          {selectedComic.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-mono px-2.5 py-0.5 bg-neutral-150 text-neutral-800 rounded-md lowercase font-bold leading-normal animate-pulse">
                          ★ {selectedComic.rating} rating
                        </span>
                        <span className="text-xs font-mono px-2.5 py-0.5 bg-neutral-150 text-neutral-800 rounded-md capitalize font-bold leading-normal">
                          {selectedComic.status}
                        </span>
                        <span className="text-xs font-mono px-2.5 py-0.5 bg-neutral-150 text-neutral-800 rounded-md font-bold leading-normal">
                          {selectedComic.demographic}
                        </span>
                        {selectedComic.readingRating && (
                          <span className={`text-xs font-mono px-2.5 py-0.5 rounded-md font-bold border leading-normal ${getReadingRatingStyle(selectedComic.readingRating).bg}`}>
                            {getReadingRatingStyle(selectedComic.readingRating).text}
                          </span>
                        )}
                      </div>

                      {/* Publisher and Authors list text */}
                      <div className="text-xs font-mono text-neutral-550 space-y-1 mt-1 leading-normal">
                        <p>
                          Penerbit Buku: <span className="text-neutral-900 font-extrabold">{selectedComic.publisherName}</span> | Original Publisher: <span className="text-neutral-905">{selectedComic.originalPublisher || 'N/A'}</span>
                        </p>
                        {(selectedComic.authorStory || selectedComic.authorArt) && (
                          <p>
                            Author: <span className="text-neutral-900 font-extrabold">({getAuthorLabel(selectedComic).replace(/^\(|\)$/g, '')})</span>
                          </p>
                        )}
                      </div>

                      {/* Genre indicators pills */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {selectedComic.genres.map(g => (
                          <span key={g} className="text-[10px] sm:text-xs bg-white text-neutral-850 px-2.5 py-1 rounded-md font-mono border border-neutral-200 font-medium leading-normal hover:border-neutral-400 transition-colors">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Grid details body */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-full overflow-hidden">
                  {/* Left Detail Column */}
                  <div className="col-span-1 md:col-span-8 space-y-6 w-full max-w-full overflow-hidden">
                    {/* Synopsis */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1 leading-normal">Sinopsis Komik / LN</h4>
                      <p className="text-sm text-neutral-800 leading-relaxed font-sans">{selectedComic.synopsis}</p>
                    </div>

                    {/* Volume Selector Carousel */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 leading-normal">
                        PILIH VOLUME
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedComic.volumes.map(v => (
                          <button
                            key={v.volNumber}
                            onClick={() => {
                              setActiveVolumeNum(v.volNumber);
                              setIsPlayingShort(false);
                            }}
                            className={`w-10 h-10 rounded-xl border transition-all text-xs font-mono font-bold cursor-pointer ${
                              activeVolumeNum === v.volNumber
                                ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 active:bg-neutral-50'
                            }`}
                          >
                            {v.volNumber}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Volume details display box */}
                    {(() => {
                      const activeVolObj = selectedComic.volumes.find(v => v.volNumber === activeVolumeNum);
                      if (!activeVolObj) return null;

                      return (
                        <div className="border border-neutral-200 rounded-xl p-3.5 sm:p-5 space-y-4 sm:space-y-5 bg-neutral-50/40 shadow-xs">
                          {/* Title and general metadata */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <div className="space-y-1">
                              <h5 className="font-extrabold text-[#030303] text-sm leading-snug font-sans">
                                Detail Jilid / Volume {activeVolObj.volNumber}
                              </h5>
                              {/* Responsive tags that wrap perfectly on mobile screens without overflow */}
                              <div className="flex flex-wrap gap-1.5 pt-0.5" id="vol-meta-tags-grid">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                                  ISBN: {activeVolObj.isbn || 'Proses'}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                                  {activeVolObj.pages ? `${activeVolObj.pages} Hlm` : 'Tebal: N/A'}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                                  Rilis: {activeVolObj.releaseDate}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm font-extrabold font-mono px-3 py-1 bg-white border border-neutral-200 rounded-xl shrink-0 leading-normal">
                              Rp {activeVolObj.price.toLocaleString('id-ID')}
                            </span>
                          </div>

                          {/* Cetakan lama lama vs baru info bar */}
                          <div className="bg-white border border-neutral-200 p-4 rounded-xl flex items-start gap-3 shadow-xs">
                            <Info className="w-5 h-5 text-neutral-750 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="font-extrabold text-neutral-900 font-sans block text-xs leading-normal">Informasi Cetakan &amp; Fisik:</span>
                              <p className="text-neutral-600 leading-normal text-xs font-sans">{activeVolObj.cetakanInfo}</p>
                            </div>
                          </div>                          {/* Affiliate & OTT Adaptations with Age Censorship Sensor */}
                          {(() => {
                            const isAdult = selectedComic.readingRating === 'Dewasa Ringan' || selectedComic.readingRating === 'Dewasa Berat';
                            const isUnlocked = unlockedComics[selectedComic.id];
                            const hasAnime = !!(activeVolObj.animeAdaptation && activeVolObj.animeAdaptation.length > 0);
                            const hasLiveAction = !!(activeVolObj.liveActionAdaptation && activeVolObj.liveActionAdaptation.length > 0);
                            const hasOtt = hasAnime || hasLiveAction;

                            const linksContent = (
                              <div className="space-y-4">
                                {/* Affiliate Direct Links */}
                                {activeVolObj.affiliateLinks && (
                                  <div className="space-y-3">
                                    <h6 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 leading-normal">
                                      <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                                      Link affiliate toko resmi (Dukungan bagi kreator)
                                    </h6>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      {activeVolObj.affiliateLinks.gramedia && (
                                        <a
                                          href={activeVolObj.affiliateLinks.gramedia}
                                          target="_blank"
                                          rel="no-referrer"
                                          className="px-3.5 py-2.5 bg-[#004e92] hover:bg-[#00386b] text-white text-xs font-mono font-bold rounded-xl flex items-center justify-between transition-all leading-normal"
                                        >
                                          <span>Gramedia Affiliate</span>
                                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                                        </a>
                                      )}
                                      {activeVolObj.affiliateLinks.shopee && (
                                        <a
                                          href={activeVolObj.affiliateLinks.shopee}
                                          target="_blank"
                                          rel="no-referrer"
                                          className="px-3.5 py-2.5 bg-[#f53d2d] hover:bg-[#d82a1b] text-white text-xs font-mono font-bold rounded-xl flex items-center justify-between transition-all leading-normal"
                                        >
                                          <span>Shopee Affiliate</span>
                                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                                        </a>
                                      )}
                                      {activeVolObj.affiliateLinks.tokopedia && (
                                        <a
                                          href={activeVolObj.affiliateLinks.tokopedia}
                                          target="_blank"
                                          rel="no-referrer"
                                          className="px-3.5 py-2.5 bg-[#03ac0e] hover:bg-[#028b08] text-white text-xs font-mono font-bold rounded-xl flex items-center justify-between transition-all leading-normal"
                                        >
                                          <span>Tokopedia Affiliate</span>
                                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Anime Platform Link (Jika ada) */}
                                {hasAnime && (
                                  <div className="space-y-3 border-t border-neutral-100 pt-4">
                                    <h6 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 leading-normal">
                                      <Tv className="w-3.5 h-3.5 animate-pulse" />
                                      Link Adaptasi Anime Resmi (OTT Platform Legal)
                                    </h6>
                                    <div className="flex flex-wrap gap-1.5">
                                      {activeVolObj.animeAdaptation!.map(anime => (
                                        <a
                                          key={anime.platformName}
                                          href={anime.watchLink}
                                          target="_blank"
                                          rel="no-referrer"
                                          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white text-xs font-mono rounded-lg flex items-center gap-2 leading-normal transition-colors"
                                        >
                                          <Play className="w-3 h-3 fill-white text-white" />
                                          <span>Streaming di {anime.platformName}</span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Live Action Platform Link (Jika ada) */}
                                {hasLiveAction && (
                                  <div className="space-y-3 border-t border-neutral-100 pt-4">
                                    <h6 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 leading-normal">
                                      <Video className="w-3.5 h-3.5" />
                                      Link Adaptasi Live Action Resmi
                                    </h6>
                                    <div className="flex flex-wrap gap-1.5">
                                      {activeVolObj.liveActionAdaptation!.map(la => (
                                        <a
                                          key={la.platformName}
                                          href={la.watchLink}
                                          target="_blank"
                                          rel="no-referrer"
                                          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white text-xs font-mono rounded-lg flex items-center gap-2 leading-normal transition-colors"
                                        >
                                          <Play className="w-3 h-3 fill-white text-white" />
                                          <span>Tonton di {la.platformName}</span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Tampilkan info jika tidak ada platform OTT/Adaptasi sama sekali */}
                                {!hasOtt && (
                                  <div className="space-y-2.5 border-t border-neutral-100 pt-4">
                                    <h6 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 leading-normal">
                                      <Tv className="w-3.5 h-3.5 text-neutral-350" />
                                      Adaptasi OTT &amp; Layanan Streaming
                                    </h6>
                                    <div className="bg-neutral-50/70 border border-neutral-150 rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
                                      <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                                      <p className="text-[11px] font-sans leading-relaxed text-neutral-600">
                                        Saat ini belum tersedia adaptasi anime atau live action resmi di platform streaming OTT legal di Indonesia untuk jilid ini.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );

                            if (isAdult && !isUnlocked) {
                              return (
                                <div className="border border-red-200/60 rounded-2xl p-4 bg-red-50/5 relative overflow-hidden transition-all duration-300 shadow-inner min-h-[240px] flex flex-col justify-center">
                                  {/* Blurred target area container */}
                                  <div className="blur-md opacity-25 select-none pointer-events-none transition-all duration-300">
                                    {linksContent}
                                  </div>
                                  
                                  {/* Custom Warning Gated Overlay */}
                                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-white/90 backdrop-blur-xs z-10">
                                    <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100/80 flex items-center justify-center text-red-600 mb-2 shadow-xs">
                                      <ShieldAlert className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h6 className="font-sans font-black text-neutral-950 text-xs sm:text-sm tracking-tight mb-1">
                                      Ditujukan untuk Dewasa ({selectedComic.readingRating})
                                    </h6>
                                    <p className="font-sans text-neutral-550 text-[10.5px] sm:text-[11px] max-w-sm mb-3.5 leading-relaxed">
                                      {hasOtt
                                        ? "Bagian ini berisi tautan affiliate toko &amp; adaptasi OTT platform legal berating Dewasa. Konfirmasi usia untuk membukanya."
                                        : "Bagian ini berisi tautan affiliate toko resmi berating Dewasa. Konfirmasi usia untuk membukanya."
                                      }
                                    </p>
                                    <button
                                      onClick={() => setUnlockedComics(prev => ({ ...prev, [selectedComic.id]: true }))}
                                      className="px-5 py-2 bg-neutral-950 hover:bg-neutral-850 active:translate-y-px text-white text-xs font-sans font-black rounded-full transition-all shadow-md cursor-pointer hover:shadow-lg"
                                    >
                                      Saya Mengerti &amp; Konfirmasi
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            return linksContent;
                          })()}

                          {/* Educational Preview Shorts Shelf (9:16 vertical, multiple items horizontally) */}
                          <div className="space-y-4 border-t border-neutral-150 pt-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                              <div className="space-y-0.5">
                                <h6 className="text-[12px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 leading-normal">
                                  <Video className="w-4 h-4 text-red-500" />
                                  Highlight Review
                                </h6>
                                <p className="text-xs text-neutral-550 font-sans">Pilih video untuk meninjau detail cetakan fisik berkualitas tinggi 📱</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <a 
                                  href="https://instagram.com/norinoya.sukasuka" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:opacity-95 text-white font-mono font-bold text-[10px] sm:text-xs rounded-xl shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                                >
                                  <Instagram className="w-3.5 h-3.5 text-white" />
                                  <span>Instagram</span>
                                </a>
                                <a 
                                  href="https://tiktok.com/@norinoya.sukasuka" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-white font-mono font-bold text-[10px] sm:text-xs rounded-xl shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                                >
                                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>TikTok</span>
                                </a>
                              </div>
                            </div>

                            {/* Horizontal scroll container */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-3 pt-1 select-none">
                              {[
                                {
                                  id: 's1',
                                  title: `Full Bedah Detail Kertas Jilid ${activeVolObj.volNumber} - Serat Premium & Gak Gampang Lecak!`,
                                  views: '12.4K views',
                                  duration: '0:58',
                                  likes: '4.8K',
                                  thumbnail: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=320&auto=format&fit=crop&q=80',
                                  quote: '"Kertas bookpaper di edisi volume ini tebalnya pas, warnanya kuning gading tidak bikin mata cepat lelah waktu dibaca lama!"'
                                },
                                {
                                  id: 's2',
                                  title: 'Review Jujur Laminasi Sampul Baru: Doff Matte vs Glossy Mengkilap RI',
                                  views: '8.2K views',
                                  duration: '0:45',
                                  likes: '3.1K',
                                  thumbnail: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=320&auto=format&fit=crop&q=80',
                                  quote: '"Laminasi sampul barunya mewah banget, sidik jari gak gampang berbekas kotor, sayangnya tonalnya sedikit meredup dibanding edisi lama."'
                                },
                                {
                                  id: 's3',
                                  title: 'Uji Margin & Potongan Presisi Gambar dari Halaman Pembuka Sampai Akhir',
                                  views: '15.1K views',
                                  duration: '0:52',
                                  likes: '5.2K',
                                  thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=320&auto=format&fit=crop&q=80',
                                  quote: '"Potongan margin dari percetakan resmi sangat rapi! Gak ada teks gelembung dialog yang kepotong di lipatan jilid tengah."'
                                },
                                {
                                  id: 's4',
                                  title: 'Apakah Worth It Upgrade ke Edisi Tebal Bind-Up Gabungan Terbaru?',
                                  views: '24.8K views',
                                  duration: '0:59',
                                  likes: '9.2K',
                                  thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=320&auto=format&fit=crop&q=80',
                                  quote: '"Sangat worth it! Jilidannya kokoh dilapisi foam cadangan, awet disimpan puluhan tahun gak bakal menguning drastis."'
                                }
                              ].map((short) => (
                                <motion.div
                                  key={short.id}
                                  whileHover={{ y: -3, scale: 1.01 }}
                                  onClick={() => setSelectedShort(short)}
                                  className="w-full aspect-[9/16] border border-neutral-200 hover:border-neutral-450 bg-neutral-900 rounded-xl overflow-hidden relative flex flex-col justify-end p-2 sm:p-2.5 shadow-xs cursor-pointer group"
                                >
                                  {/* Background Image holding cover placeholder */}
                                  <img 
                                    src={short.thumbnail} 
                                    alt={short.title} 
                                    referrerPolicy="no-referrer"
                                    className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-[1.03] transition-transform duration-300"
                                  />
                                  
                                  {/* Dark bottom gradient overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 pointer-events-none" />
 
                                  {/* Badge at top Left */}
                                  <div className="absolute top-2 left-2 flex gap-1 items-center z-10">
                                    <span className="bg-red-600 animate-pulse w-1.5 h-1.5 rounded-full" />
                                    <span className="bg-black/60 text-white text-xs font-mono px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                                      SHORTS
                                    </span>
                                  </div>
 
                                  {/* Duration at top right */}
                                  <span className="absolute top-2 right-2 bg-black/60 text-white text-xs font-mono px-1 py-0.2 rounded font-bold z-10">
                                    {short.duration}
                                  </span>
 
                                  {/* Pulse Play Icon Center Anchor on Hover */}
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/20">
                                    <div className="w-9 h-9 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                      <Play className="w-4 h-4 fill-neutral-900 text-neutral-900 translate-x-0.5" />
                                    </div>
                                  </div>
 
                                  {/* Meta description at bottom */}
                                  <div className="relative z-10 space-y-1">
                                    <p className="text-xs font-sans font-bold text-white leading-tight line-clamp-3 group-hover:text-amber-300 transition-colors">
                                      {short.title}
                                    </p>
                                    <div className="flex justify-between items-center text-xs font-mono text-neutral-300 pt-0.5 border-t border-white/10">
                                      <span>{short.views}</span>
                                      <span className="text-[#03ac0e]">★ {short.likes}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                        </div>
                      );
                    })()}
                  </div>
 
                  {/* Right Metadata Column */}
                  <div className="col-span-1 md:col-span-4 space-y-4 text-sm font-sans w-full max-w-full overflow-hidden">
                    {/* General database stats */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4.5 space-y-3.5 shadow-xs">
                      <h5 className="font-extrabold text-neutral-900 border-b border-neutral-250 pb-2 uppercase text-xs font-mono tracking-wider leading-normal">
                        Spesifikasi Database
                      </h5>
                      <div className="space-y-3 text-sm leading-normal">
                        <div>
                          <span className="text-neutral-400 block text-xs font-mono leading-normal">JUDUL KANJI/INDONESIA:</span>
                          <span className="text-neutral-950 font-extrabold">{selectedComic.title}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-xs font-mono leading-normal">TAHUN MULAI TERBIT RI:</span>
                          <span className="text-neutral-950 font-semibold">{selectedComic.firstPublishedInId}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-xs font-mono leading-normal">DEMOGRAFI PEMBACA:</span>
                          <span className="text-neutral-950 font-semibold">{selectedComic.demographic}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-xs font-mono leading-normal">TOTAL VOLUMES (EST.):</span>
                          <span className="text-neutral-950 font-semibold">{selectedComic.totalVolumesKnown}</span>
                        </div>
                        {(selectedComic.authorStory || selectedComic.authorArt) && (
                          <div>
                            <span className="text-neutral-400 block text-xs font-mono leading-normal">AUTHOR:</span>
                            <span className="text-neutral-950 font-semibold">
                              {getAuthorLabel(selectedComic).replace(/^\(|\)$/g, '')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
 
                    {/* Ads placeholder inside modal */}
                    <div className="bg-neutral-50 border border-dashed border-neutral-250 rounded-2xl p-4 text-center space-y-1.5">
                      <span className="text-xs font-mono tracking-wider text-neutral-400 uppercase block leading-normal">PROMOTED AD</span>
                      <div className="bg-white border border-neutral-200 py-4.5 rounded-xl text-xs text-neutral-400 font-mono shadow-xs leading-normal">
                        Affiliate Promo Slot
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clean, Modular Footer for Detail Overlays */}
                <div className="mt-12 pt-8 border-t border-neutral-200/80 pb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-sans font-black tracking-wider uppercase text-neutral-900">Norinoya</span>
                        <span className="h-1 w-1 rounded-full bg-neutral-400"></span>
                        <span className="text-xs font-mono font-bold text-neutral-400">DATABASE DETAIL</span>
                      </div>
                      <p className="text-xs text-neutral-550 max-w-md font-sans leading-relaxed">
                        Data, kurasi, dan ulasan fisik disediakan murni untuk keperluan ulasan komunitas & edukasi legalitas komik Indonesia. Stop Buku Bajakan!
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <div className="flex items-center justify-between gap-4 py-1.5 px-3 bg-neutral-50 rounded-xl border border-neutral-100 min-w:[200px] sm:min-w-0">
                        <span className="text-[11px] font-mono font-bold text-neutral-700">@norinoya.sukasuka</span>
                        <div className="flex gap-1">
                          <a 
                            href="https://instagram.com/norinoya.sukasuka" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-7 h-7 rounded-lg bg-white border border-neutral-200 hover:border-pink-500 hover:bg-pink-50 text-neutral-500 hover:text-pink-600 transition-all flex items-center justify-center shadow-xs"
                            title="Instagram @norinoya.sukasuka"
                          >
                            <Instagram className="w-3.5 h-3.5" />
                          </a>
                          <a 
                            href="https://tiktok.com/@norinoya.sukasuka" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-7 h-7 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-500 hover:text-neutral-900 transition-all flex items-center justify-center shadow-xs"
                            title="TikTok @norinoya.sukasuka"
                          >
                            <svg className="w-3.5 h-3.5 fill-current text-neutral-500 hover:text-neutral-900 transition-colors" viewBox="0 0 24 24">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.97 2.05 1.64 3.34 1.85.01.88 0 1.77-.01 2.65-.96-.11-1.92-.48-2.73-1.03-.69-.47-1.25-1.11-1.63-1.85-.05 1.48-.03 2.94-.04 4.41-.07 2.58-.93 5.16-2.71 7.03-1.74 1.95-4.32 2.99-6.95 2.87-2.67-.03-5.26-1.24-6.85-3.39-1.75-2.25-2.22-5.4-1.25-8.13C2.15 6.01 4.7 3.86 7.6 3.5c1.47-.15 2.98.08 4.29.81-.01 1-.01 1.99-.02 2.99-.86-.54-1.9-.76-2.9-.61-1.39.21-2.61 1.15-3.19 2.44-.7 1.46-.57 3.29.35 4.62.91 1.34 2.53 2.1 4.14 2 1.4-.04 2.72-.78 3.44-1.97.48-.75.69-1.64.67-2.52.01-3.21 0-6.42.01-9.63-.08-.55-.38-.97-.87-1.23-.28-.15-.59-.22-.92-.22H12.525z"/>
                            </svg>
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 py-1.5 px-3 bg-neutral-50 rounded-xl border border-neutral-100 min-w-[200px] sm:min-w-0">
                        <span className="text-[11px] font-mono font-bold text-neutral-700">@konotasi.sukasuka</span>
                        <div className="flex gap-1">
                          <a 
                            href="https://instagram.com/konotasi.sukasuka" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-7 h-7 rounded-lg bg-white border border-neutral-200 hover:border-pink-500 hover:bg-pink-50 text-neutral-500 hover:text-pink-600 transition-all flex items-center justify-center shadow-xs"
                            title="Instagram @konotasi.sukasuka"
                          >
                            <Instagram className="w-3.5 h-3.5" />
                          </a>
                          <a 
                            href="https://tiktok.com/@konotasi.sukasuka" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-7 h-7 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-500 hover:text-neutral-900 transition-all flex items-center justify-center shadow-xs"
                            title="TikTok @konotasi.sukasuka"
                          >
                            <svg className="w-3.5 h-3.5 fill-current text-neutral-500 hover:text-neutral-900 transition-colors" viewBox="0 0 24 24">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.97 2.05 1.64 3.34 1.85.01.88 0 1.77-.01 2.65-.96-.11-1.92-.48-2.73-1.03-.69-.47-1.25-1.11-1.63-1.85-.05 1.48-.03 2.94-.04 4.41-.07 2.58-.93 5.16-2.71 7.03-1.74 1.95-4.32 2.99-6.95 2.87-2.67-.03-5.26-1.24-6.85-3.39-1.75-2.25-2.22-5.4-1.25-8.13C2.15 6.01 4.7 3.86 7.6 3.5c1.47-.15 2.98.08 4.29.81-.01 1-.01 1.99-.02 2.99-.86-.54-1.9-.76-2.9-.61-1.39.21-2.61 1.15-3.19 2.44-.7 1.46-.57 3.29.35 4.62.91 1.34 2.53 2.1 4.14 2 1.4-.04 2.72-.78 3.44-1.97.48-.75.69-1.64.67-2.52.01-3.21 0-6.42.01-9.63-.08-.55-.38-.97-.87-1.23-.28-.15-.59-.22-.92-.22H12.525z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2.5 text-[10px] font-mono text-neutral-400">
                    <span>© 2026 Norinoya Hub. All rights reserved.</span>
                    <span>Verified Official Indonesian Manga & Novel Release Database</span>
                  </div>
                </div>
              </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9:16 Immersive Smartphone Shorts Player Overlay */}
      <AnimatePresence>
        {selectedShort && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedShort(null)}
          >
            {/* Main Phone Shell Wrapper Container */}
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[340px] aspect-[9/16] bg-neutral-900 rounded-[36px] overflow-hidden border-8 border-neutral-800 shadow-2xl flex flex-col justify-between p-4 px-5 pb-6"
              style={{
                background: `linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.95)), url(${selectedShort.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Phone Speaker & Camera Notch Hole */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-2xl flex items-center justify-between px-3.5 z-50">
                <div className="w-11 h-1 bg-neutral-800 rounded-full" />
                <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full border border-neutral-850" />
              </div>

              {/* Player Top Utility Header */}
              <div className="flex justify-between items-center w-full pt-4 relative z-10 text-white font-mono text-xs font-bold">
                <span className="flex items-center gap-1 bg-red-650 px-1.5 py-0.5 rounded uppercase font-extrabold tracking-wider leading-none">
                  ● LIVE SHORTS
                </span>
                <span className="bg-black/40 px-2 py-0.5 rounded-full text-neutral-300 leading-none">
                  @konotasi.sukasuka
                </span>
              </div>

              {/* Simulated Center Player Ring Loop */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.15, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center animate-pulse"
                />
              </div>

              {/* Right Sidebar Icons Panel (TikTok Style!) */}
              <div className="absolute right-3.5 bottom-24 flex flex-col gap-4 items-center z-13 text-white">
                {/* Curator Avatar badge */}
                <div className="w-9 h-9 rounded-full border-2 border-amber-400 overflow-hidden relative shadow">
                  <div className="bg-neutral-950 flex items-center justify-center w-full h-full text-xs font-bold text-amber-450">KN</div>
                  <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold text-xs text-white select-none">+</div>
                </div>

                {/* Like Button */}
                <button 
                  onClick={() => alert("Simulasi Like Ditambahkan!")} 
                  className="flex flex-col items-center gap-0.5 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-black/50 hover:bg-neutral-800 flex items-center justify-center border border-white/10 transition-colors">
                    <span className="text-red-500 text-sm">❤</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-neutral-200">{selectedShort.likes}</span>
                </button>

                {/* Views Info */}
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center border border-white/10">
                    <span className="text-sky-400 text-xs font-bold font-mono">👁</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-neutral-300">9.5K</span>
                </div>

                {/* Audio sound button */}
                <button 
                  onClick={() => setIsMuted(prev => !prev)}
                  className="w-9 h-9 rounded-full bg-black/55 hover:bg-neutral-800 flex items-center justify-center border border-white/10 cursor-pointer"
                >
                  <span className="text-xs">{isMuted ? '🔇' : '🔊'}</span>
                </button>
              </div>

              {/* Bottom Interactive Content Container */}
              <div className="relative z-10 mt-auto space-y-3.5 text-left text-white pr-6">
                
                {/* Generative Interactive Dialogue Subtitles Bubble */}
                <div className="bg-black/90 backdrop-blur-md rounded-2xl p-3 border border-neutral-800 shadow-lg space-y-1.5 max-w-[215px]">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono font-bold text-[#03ac0e] bg-emerald-950 border border-emerald-900 px-1.5 py-0.2 rounded uppercase">
                      Curator Quote
                    </span>
                    <span className="text-xs text-neutral-400 font-mono italic">0:18 min</span>
                  </div>
                  <p className="text-xs text-neutral-50 font-sans italic leading-relaxed font-bold">
                    {selectedShort.quote}
                  </p>
                </div>

                {/* Sound wave music record spinning */}
                <div className="space-y-1">
                  <h4 className="font-sans font-black text-xs text-white leading-tight line-clamp-2">
                    {selectedShort.title}
                  </h4>
                  <p className="text-xs text-[#03ac0e] font-mono leading-none flex items-center gap-1">
                    <span>🎵 @konotasi.sukasuka - Original Sound (Curator Review)</span>
                  </p>
                </div>

                {/* Progress bar and controls */}
                <div className="space-y-2 pt-1">
                  <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: ['-100%', '0%'] }}
                      transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                      className="absolute inset-0 w-full bg-[#03ac0e] rounded-full"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setSelectedShort(null)}
                      className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      ✕ Tutup Player
                    </button>
                    <span className="text-xs text-neutral-450 font-mono font-bold">Simulasi Shorts Feed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox High-Resolution Immersive Zoom Overlay */}
      <AnimatePresence>
        {isLightboxOpen && selectedComic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/98 backdrop-blur-md z-[100] flex flex-col justify-between p-6 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar inside Lightbox */}
            <div className="flex justify-between items-center w-full max-w-5xl mx-auto text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">
                  Detail Cetakan Fisik Halaman
                </span>
                <h3 className="text-base sm:text-lg font-sans font-extrabold text-white leading-normal">
                  {selectedComic.title} (Vol. {activeVolumeNum})
                </h3>
              </div>
              <button 
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 border border-neutral-800 rounded-full flex items-center justify-center text-white bg-neutral-900 hover:bg-neutral-800 transition-colors uppercase font-mono text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Immersive centered Image wrapper */}
            <div className="my-auto w-full max-w-5xl mx-auto flex items-center justify-center relative">
              <img 
                src={carouselImages[activeSlideIndex]} 
                alt="lightbox-zoom"
                referrerPolicy="no-referrer"
                className="max-h-[70vh] md:max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-neutral-850"
              />
            </div>

            {/* Bottom Controls Indicator inside Lightbox */}
            <div className="w-full max-w-5xl mx-auto flex justify-between items-center text-white pt-2">
              <span className="font-mono text-xs text-neutral-400">
                Pencahayaan Alami Studio • 5500K
              </span>
              <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                Foto {activeSlideIndex + 1} / {carouselImages.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
