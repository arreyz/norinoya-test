import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, BookOpen, Star, Filter, ArrowUpRight, Play, Check, X,
  ShoppingBag, Tv, Video, HelpCircle, AlertCircle, Info, ChevronRight, ArrowLeft, ChevronDown
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
    <div className="relative flex flex-col gap-1 select-none w-full" onClick={(e) => e.stopPropagation()}>
      <span className="text-xs font-sans font-bold tracking-wide text-neutral-400 pl-0.5 mb-0.5">
        {label}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full h-9 px-3.5 bg-neutral-50/55 border border-neutral-200/70 hover:bg-neutral-50 hover:border-neutral-300 rounded-lg text-xs md:text-sm text-neutral-850 transition-all font-sans font-medium text-left outline-none cursor-pointer"
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
            className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[190px] bg-white border border-neutral-150 shadow-[0_12px_32px_rgba(0,0,0,0.08)] rounded-xl py-1.5 z-[100] max-h-60 overflow-y-auto"
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
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 sm:py-2 text-xs md:text-sm text-left transition-colors font-sans cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAFAFA] text-neutral-950 font-bold'
                      : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 font-medium'
                  }`}
                >
                  <span className="truncate flex-1">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-neutral-950 shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
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
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (!activeDropdown) return;
    const handleClose = () => setActiveDropdown(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [activeDropdown]);

  // Modal detailed states
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [activeVolumeNum, setActiveVolumeNum] = useState<number>(1);
  const [isPlayingShort, setIsPlayingShort] = useState<boolean>(false);
  const [selectedShort, setSelectedShort] = useState<any | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
    }
  }, [initialSelectedComicId]);

  const handleCloseModal = () => {
    setSelectedComic(null);
    if (onClearSelectedComicId) {
      onClearSelectedComicId();
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

      return matchesSearch && matchesCat && matchesPublisher && matchesStatus && matchesGenre && matchesAdaptation;
    });
  }, [allVolumePosts, searchTerm, selectedCategories, selectedPublishers, selectedStatuses, selectedGenres, selectedAdaptations]);

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
  };

  return (
    <div className="space-y-6" id="marketplace-search-section">
      {/* Search Header Banner */}
      <div className="text-center space-y-2.5 py-4">
        <h2 className="text-xl md:text-2xl font-extrabold font-sans tracking-tight text-neutral-950 leading-tight">
          Database Buku Komik &amp; Novel Indonesia
        </h2>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Menghadirkan data terbitan resmi buku komik (manga), light novel, novel dan adaptasi lainnya di Indonesia. Silahkan tulis judul yang ingin kalian cari.
        </p>
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
          <div className={`${isFiltersExpanded ? 'grid' : 'hidden'} md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-3.5 pt-1 md:pt-0`}>
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
              label="Penerbit Indonesia"
              value={selectedPublishers}
              options={[
                { value: 'all', label: 'Semua Penerbit' },
                { value: 'elex', label: 'Elex Media Komputindo' },
                { value: 'level', label: 'Elex Media Komputindo (Level Comic)' },
                { value: 'mnc', label: 'm&c!' },
                { value: 'akasha', label: 'm&c! (AKASHA)' },
                { value: 'clover', label: 'Penerbit Clover' },
                { value: 'haru', label: 'Penerbit Haru' },
                { value: 'phoenix', label: 'Phoenix Gramedia Indonesia' }
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
          </div>
        </div>

        {/* Active Filters Panel (Tag Pills) */}
        {(searchTerm || 
          !selectedCategories.includes('all') || 
          !selectedPublishers.includes('all') || 
          !selectedStatuses.includes('all') || 
          !selectedGenres.includes('all') || 
          !selectedAdaptations.includes('all')) && (
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
              }}
              className="text-xs font-mono font-bold hover:underline hover:text-red-600 text-red-500 ml-auto flex items-center gap-1 cursor-pointer leading-normal pl-2"
            >
              Reset Semua
            </button>
          </div>
        )}
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredVolumePosts.length > 0 ? (
            filteredVolumePosts.map((post) => {
              const { comic, volume } = post;
              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => openVolumeModal(comic, volume.volNumber)}
                  className="group bg-white border border-[#EFEFEF] p-2.5 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-neutral-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)] hover:translate-y-[-3px]"
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
                    <h4 className="text-xs font-sans font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                      {comic.title}
                    </h4>
                    
                    {/* Authors List (Minimal Parenthesized Layout with Comma Join) */}
                    {(comic.authorStory || comic.authorArt) && (
                      <p className="text-[10px] font-mono text-neutral-400 leading-tight truncate">
                        {getAuthorLabel(comic)}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[9.5px] text-neutral-500 font-sans line-clamp-1">
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

                    <div className="pt-1.5 mt-1 border-t border-neutral-50 flex items-center justify-between font-mono w-full">
                      <span className="font-extrabold text-neutral-950 font-sans text-xs shrink-0 leading-none">
                        Rp {volume.price.toLocaleString('id-ID')}
                      </span>
                      <span className="bg-amber-50 text-amber-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-200/40 leading-none shrink-0 shadow-[0_1px_2px_rgba(245,158,11,0.04)]">
                        Vol {volume.volNumber}
                      </span>
                    </div>
                  </div>
                </motion.div>
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

      {/* Advanced Fullscreen Detailed View */}
      <AnimatePresence>
        {selectedComic && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="min-h-screen bg-white text-neutral-950 flex flex-col pb-24 md:pb-12"
            >
              {/* Sticky Fullscreen Top-Navbar */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-4 px-4 sm:px-6 flex items-center justify-between z-30 shadow-xs">
                <button
                  onClick={handleCloseModal}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 text-neutral-900 transition-all cursor-pointer text-sm font-sans font-bold"
                >
                  <ArrowLeft className="w-4 h-4 text-neutral-900" />
                  <span>Kembali</span>
                </button>
                <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest truncate leading-normal">
                  Detail {selectedComic.category.replace('_', ' ')}
                </span>
                <span className="font-mono text-xs text-neutral-400 hidden sm:inline-block leading-normal">Norinoya Hub</span>
              </div>

              {/* Main Content Container with elegant wrap */}
              <div className="max-w-4xl w-full mx-auto flex-1 px-4 sm:px-6 py-6 space-y-6">
                
                {/* Title Header with Gradient */}
                <div className="bg-neutral-50/80 p-5 md:p-6 border border-neutral-200 rounded-2xl flex flex-col md:flex-row gap-6 items-start relative overflow-hidden shadow-xs">
                  <div className="aspect-[3/4] w-28 md:w-32 rounded bg-neutral-950 flex flex-col justify-between p-3.5 shadow-md shrink-0 relative overflow-hidden">
                    {selectedComic.coverImage && !imageErrors['modal-' + selectedComic.id] ? (
                      <img
                        src={selectedComic.coverImage}
                        alt={selectedComic.title}
                        onError={() => setImageErrors(prev => ({ ...prev, ['modal-' + selectedComic.id]: true }))}
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col justify-between p-3 border border-neutral-700">
                        <div className="my-auto text-center px-1">
                          <BookOpen className="w-8 h-8 text-neutral-500 stroke-[1.2] mx-auto mb-1.5 opacity-60" />
                          <h4 className="text-[10px] font-sans font-extrabold text-neutral-200 mt-1 line-clamp-3 leading-normal">
                            {selectedComic.title}
                          </h4>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                    
                    <span className="bg-white/95 text-neutral-900 border border-neutral-150 text-xs font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md self-start uppercase leading-none relative z-10 shadow-xs">
                      {selectedComic.category.replace('_', ' ')}
                    </span>
                    <div className="space-y-0.5 relative z-10">
                      <h3 className="text-xs font-sans font-bold text-white leading-tight line-clamp-2">{selectedComic.title}</h3>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono px-2 py-0.5 bg-neutral-150 text-neutral-800 rounded-md lowercase font-bold leading-normal">
                        ★ {selectedComic.rating} rating
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-neutral-150 text-neutral-800 rounded-md capitalize font-bold leading-normal">
                        {selectedComic.status}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-neutral-150 text-neutral-800 rounded-md font-bold leading-normal">
                        {selectedComic.demographic}
                      </span>
                      {selectedComic.readingRating && (
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-bold border leading-normal ${getReadingRatingStyle(selectedComic.readingRating).bg}`}>
                          {getReadingRatingStyle(selectedComic.readingRating).text}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl md:text-2xl font-sans font-extrabold text-neutral-950 tracking-tight leading-tight">
                      {selectedComic.title}
                    </h2>

                    <p className="text-xs text-neutral-500 font-mono leading-normal">
                      Penerbit Indonesia: <span className="text-neutral-950 font-bold">{selectedComic.publisherName}</span> | Original Publisher: <span className="text-neutral-950">{selectedComic.originalPublisher || 'N/A'}</span>
                    </p>

                    {(selectedComic.authorStory || selectedComic.authorArt) && (
                      <p className="text-xs text-neutral-550 font-mono">
                        Author: <span className="text-neutral-900 font-bold">{getAuthorLabel(selectedComic)}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {selectedComic.genres.map(g => (
                        <span key={g} className="text-xs bg-white text-neutral-800 px-2.5 py-1 rounded-md font-mono border border-neutral-200 leading-normal">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Grid details body */}
                <div className="grid md:grid-cols-12 gap-6">
                  {/* Left Detail Column */}
                  <div className="md:col-span-8 space-y-6">
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
                        <div className="border border-neutral-200 rounded-2xl p-5 space-y-5 bg-neutral-50/40 shadow-xs">
                          {/* Title and general metadata */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <div className="space-y-1">
                              <h5 className="font-extrabold text-[#030303] text-sm leading-snug font-sans">
                                Detail Jilid / Volume {activeVolObj.volNumber}
                              </h5>
                              <p className="text-xs text-neutral-500 font-mono leading-normal">
                                ISBN: {activeVolObj.isbn || 'Proses'} | Tebal: {activeVolObj.pages ? `${activeVolObj.pages} Hlm` : 'N/A'} | Tanggal Rilis RI: {activeVolObj.releaseDate}
                              </p>
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
                          </div>                          {/* Affiliate Direct Links */}
                          <div className="space-y-3">
                            <h6 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 leading-normal">
                              <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                              Link affiliate toko resmi (Dukungan bagi kreator)
                            </h6>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <a
                                href={activeVolObj.affiliateLinks.gramedia}
                                target="_blank"
                                rel="no-referrer"
                                className="px-3.5 py-2.5 bg-[#004e92] hover:bg-[#00386b] text-white text-xs font-mono font-bold rounded-xl flex items-center justify-between transition-all leading-normal"
                              >
                                <span>Gramedia Affiliate</span>
                                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                              </a>
                              <a
                                href={activeVolObj.affiliateLinks.shopee}
                                target="_blank"
                                rel="no-referrer"
                                className="px-3.5 py-2.5 bg-[#f53d2d] hover:bg-[#d82a1b] text-white text-xs font-mono font-bold rounded-xl flex items-center justify-between transition-all leading-normal"
                              >
                                <span>Shopee Affiliate</span>
                                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                              </a>
                              <a
                                href={activeVolObj.affiliateLinks.tokopedia}
                                target="_blank"
                                rel="no-referrer"
                                className="px-3.5 py-2.5 bg-[#03ac0e] hover:bg-[#028b08] text-white text-xs font-mono font-bold rounded-xl flex items-center justify-between transition-all leading-normal"
                              >
                                <span>Tokopedia Affiliate</span>
                                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                              </a>
                            </div>
                          </div>                           {/* Anime Platform Link (Jika ada) */}
                          {activeVolObj.animeAdaptation && activeVolObj.animeAdaptation.length > 0 && (
                            <div className="space-y-3 border-t border-neutral-100 pt-4">
                              <h6 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 leading-normal">
                                <Tv className="w-3.5 h-3.5" />
                                Link Adaptasi Anime Resmi (OTT Platform Legal)
                              </h6>
                              <div className="flex flex-wrap gap-1.5">
                                {activeVolObj.animeAdaptation.map(anime => (
                                  <a
                                    key={anime.platformName}
                                    href={anime.watchLink}
                                    target="_blank"
                                    rel="no-referrer"
                                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono rounded-lg flex items-center gap-2 leading-normal"
                                  >
                                    <Play className="w-3 h-3 fill-white text-white" />
                                    <span>Streaming di {anime.platformName}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Live Action Platform Link (Jika ada) */}
                          {activeVolObj.liveActionAdaptation && activeVolObj.liveActionAdaptation.length > 0 && (
                            <div className="space-y-3 border-t border-neutral-100 pt-4">
                              <h6 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 leading-normal">
                                <Video className="w-3.5 h-3.5" />
                                Link Adaptasi Live Action Resmi
                              </h6>
                              <div className="flex flex-wrap gap-1.5">
                                {activeVolObj.liveActionAdaptation.map(la => (
                                  <a
                                    key={la.platformName}
                                    href={la.watchLink}
                                    target="_blank"
                                    rel="no-referrer"
                                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono rounded-lg flex items-center gap-2 leading-normal"
                                  >
                                    <Play className="w-3 h-3 fill-white text-white" />
                                    <span>Tonton di {la.platformName}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Educational Preview Shorts Shelf (9:16 vertical, multiple items horizontally) */}
                          <div className="space-y-4 border-t border-neutral-150 pt-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1.5">
                              <div className="space-y-0.5">
                                <h6 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 leading-normal">
                                  <Video className="w-4 h-4 text-neutral-400" />
                                  Edukasi Bedah Buku &amp; Shorts @konotasi.sukasuka
                                </h6>
                                <p className="text-xs text-neutral-550 font-sans">Geser ke samping (scroll) untuk meninjau detail cetakan fisik berkualitas tinggi 📱</p>
                              </div>
                              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-150 self-start sm:self-auto">
                                4 Shorts Terkait
                              </span>
                            </div>

                            {/* Horizontal scroll container */}
                            <div className="flex gap-3.5 overflow-x-auto pb-3 pt-1 scrollbar-thin select-none snap-x snap-mandatory">
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
                                  className="w-[140px] sm:w-[155px] aspect-[9/16] shrink-0 border border-neutral-200 hover:border-neutral-450 bg-neutral-900 rounded-2xl overflow-hidden relative flex flex-col justify-end p-2.5 shadow-xs cursor-pointer snap-start group"
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
                  <div className="md:col-span-4 space-y-4 text-sm font-sans">
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
                  </div> </div>
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

    </div>
  );
}
