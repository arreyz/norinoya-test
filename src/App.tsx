import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Heart, ArrowRight, Instagram, Video, Star, Sparkles, 
  HelpCircle, MessageCircle, AlertCircle, Tag, ShieldAlert, User,
  Home, Newspaper, ArrowUp, Sun, Moon, Clock
} from 'lucide-react';

// Sub-components
import ViewportWrapper from './components/ViewportWrapper';
import NewsFeed from './components/NewsFeed';
import MarketplaceDb from './components/MarketplaceDb';
import KonotasiStore from './components/KonotasiStore';
import AboutSection from './components/AboutSection';
import { formatLiveClock, getAbsoluteDateTime, getTierDetails } from './utils/dateHelper';
// @ts-ignore
import logoUrl from './assets/logo.svg';

// Data
import { COMICS_DATA, PRE_OWNED_ITEMS, NEWS_UPDATES } from './data/mockData';

export default function App() {
  // Tabs: 'home' | 'news' | 'database' | 'store' | 'about'
  const [activeTab, setActiveTab] = useState<'home' | 'news' | 'database' | 'store' | 'about'>('home');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [selectedComicId, setSelectedComicId] = useState<string | null>(null);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [selectedShort, setSelectedShort] = useState<any | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showToTop, setShowToTop] = useState<boolean>(false);
  const [cookieChoice, setCookieChoice] = useState<string | null>(null);
  const [liveTime, setLiveTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Navigation handlers that reset sub-states (selections) for each tab
  const handleNavHome = () => {
    setSelectedNewsId(null);
    setSelectedComicId(null);
    setSelectedSaleId(null);
    setActiveTab('home');
    window.location.hash = '#home';
  };

  const handleNavNews = () => {
    setSelectedNewsId(null);
    setActiveTab('news');
    window.location.hash = '#news';
  };

  const handleNavDatabase = () => {
    setSelectedComicId(null);
    setActiveTab('database');
    window.location.hash = '#database';
  };

  const handleNavStore = () => {
    setSelectedSaleId(null);
    setActiveTab('store');
    window.location.hash = '#store';
  };

  const handleNavAbout = () => {
    setActiveTab('about');
    window.location.hash = '#about';
  };

  // Dark mode state & effect integration
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('norinoya-dark-mode');
    return saved === 'true';
  });

  React.useEffect(() => {
    localStorage.setItem('norinoya-dark-mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Hash state synchronization
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#home' || hash === '#') {
        setActiveTab('home');
      } else if (hash.startsWith('#/database/')) {
        const comicId = hash.replace('#/database/', '');
        setActiveTab('database');
        setSelectedComicId(comicId);
      } else if (hash === '#database' || hash === '#/database' || hash === '#/database/') {
        setActiveTab('database');
        setSelectedComicId(null);
      } else if (hash.startsWith('#/sale/')) {
        const saleId = hash.replace('#/sale/', '');
        setActiveTab('store');
        setSelectedSaleId(saleId);
      } else if (hash === '#store' || hash === '#sale' || hash === '#/store' || hash === '#/sale' || hash === '#/store/' || hash === '#/sale/') {
        setActiveTab('store');
        setSelectedSaleId(null);
      } else if (hash === '#news' || hash === '#/news' || hash === '#/news/') {
        setActiveTab('news');
        setSelectedNewsId(null);
      } else if (hash.startsWith('#news')) {
        setActiveTab('news');
      } else if (hash === '#about') {
        setActiveTab('about');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  React.useEffect(() => {
    const saved = localStorage.getItem('norinoya-cookie-consent');
    if (saved) {
      setCookieChoice(saved);
    } else {
      setCookieChoice('none');
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('norinoya-cookie-consent', 'accepted');
    setCookieChoice('accepted');
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('norinoya-cookie-consent', 'declined');
    setCookieChoice('declined');
  };

  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.currentTarget as HTMLElement | Window;
      let scrollTop = 0;
      if (target instanceof Window) {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      } else {
        scrollTop = (target as HTMLElement).scrollTop;
      }
      if (scrollTop > 250) {
        setShowToTop(true);
      } else {
        setShowToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also watch for any simulated scrolling frame container inside our ViewportWrapper
    const intervalId = setInterval(() => {
      const scrollingEls = document.querySelectorAll('.overflow-auto, [class*="overflow-y-auto"]');
      scrollingEls.forEach(el => {
        el.removeEventListener('scroll', handleScroll);
        el.addEventListener('scroll', handleScroll, { passive: true });
      });
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollingContainers = document.querySelectorAll('.overflow-auto, [class*="overflow-y-auto"]');
    scrollingContainers.forEach((el) => {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  React.useEffect(() => {
    window.scrollTo({ top: 0 });
    const scrollingContainers = document.querySelectorAll('.overflow-auto, [class*="overflow-y-auto"]');
    scrollingContainers.forEach((el) => {
      el.scrollTop = 0;
    });
  }, [activeTab, selectedNewsId, selectedComicId]);

  const getAuthorLabel = (comic: any) => {
    const story = comic.authorStory || '';
    const art = comic.authorArt || '';
    if (story === art) return story ? `(${story})` : '';
    const list = [story, art].filter(Boolean);
    return `(${list.join(', ')})`;
  };

  const getReadingRatingStyle = (rating?: string) => {
    switch (rating) {
      case 'Anak & Bimbingan Orang Tua':
      case 'Anak & Bimbingan':
        return {
          bg: 'bg-[rgba(65,163,76,0.06)] border-[rgba(65,163,76,0.35)] text-[#41a34c]',
          text: 'Anak & Bimbingan'
        };
      case 'Remaja':
        return {
          bg: 'bg-[rgba(255,199,21,0.06)] border-[rgba(255,199,21,0.4)] text-[#d49f00]',
          text: 'Remaja'
        };
      case 'Dewasa Ringan':
        return {
          bg: 'bg-[rgba(255,114,60,0.06)] border-[rgba(255,114,60,0.35)] text-[#ff6628]',
          text: 'Dewasa Ringan'
        };
      case 'Dewasa Berat':
        return {
          bg: 'bg-[rgba(193,39,31,0.06)] border-[rgba(193,39,31,0.35)] text-[#c1271f]',
          text: 'Dewasa Berat'
        };
      default:
        return {
          bg: 'bg-neutral-50 border-neutral-200 text-neutral-700',
          text: 'Remaja'
        };
    }
  };

  return (
      <div className="bg-white dark:bg-neutral-950 min-h-screen text-neutral-950 dark:text-neutral-50 selection:bg-neutral-900 dark:selection:bg-neutral-100 selection:text-white dark:selection:text-neutral-900 flex flex-col justify-between font-sans transition-colors duration-200">
        
        {/* Dynamic Minimal Navbar */}
        <header className="border-b border-neutral-100 dark:border-neutral-850 bg-white dark:bg-neutral-900 sticky top-0 z-[50] py-3 px-4 sm:px-6 flex items-center justify-between shadow-xs transition-colors duration-200">
          {/* Logo & social handler */}
          <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-3">
            <div 
              className="flex items-center gap-2 cursor-pointer group select-none"
              onClick={handleNavHome}
            >
              <img 
                src={logoUrl} 
                alt="Norinoya Logo" 
                className="h-[36px] md:h-[40px] w-auto object-contain transition-transform group-hover:scale-[1.02] duration-100" 
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Mobile Dark Mode Toggle */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg border border-neutral-200/50 dark:border-neutral-700 transition-all active:scale-95 shadow-3xs cursor-pointer"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Nav Items - Hidden on mobile, sticky bottom navigation handles it inside Viewport */}
          <nav className="hidden md:flex items-center justify-center gap-1.5 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/50 dark:border-neutral-700/50 p-1 rounded-lg shrink-0">
            <button
              onClick={handleNavHome}
              className={`px-3 py-1.5 text-[12px] font-mono font-bold rounded transition-all cursor-pointer outline-none focus:outline-none select-none flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-xs border border-neutral-200/20 dark:border-neutral-700'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white border border-transparent'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>
            <button
              onClick={handleNavNews}
              className={`px-3 py-1.5 text-[12px] font-mono font-bold rounded transition-all cursor-pointer outline-none focus:outline-none select-none flex items-center gap-1.5 ${
                activeTab === 'news'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-xs border border-neutral-200/20 dark:border-neutral-700'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white border border-transparent'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Berita</span>
            </button>
            <button
              onClick={handleNavDatabase}
              className={`px-3 py-1.5 text-[12px] font-mono font-bold rounded transition-all cursor-pointer outline-none focus:outline-none select-none flex items-center gap-1.5 ${
                activeTab === 'database'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-xs border border-neutral-200/20 dark:border-neutral-700'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white border border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Katalog</span>
            </button>
            <button
              onClick={handleNavStore}
              className={`px-3 py-1.5 text-[12px] font-mono font-bold rounded transition-all cursor-pointer outline-none focus:outline-none select-none flex items-center gap-1.5 ${
                activeTab === 'store'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-xs border border-neutral-200/20 dark:border-neutral-700'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white border border-transparent'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Preloved</span>
            </button>
          </nav>

          {/* Desktop Utilities - Right Side */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg cursor-pointer border border-neutral-200/50 dark:border-neutral-700 transition-all shadow-3xs"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500 animate-pulse" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>
        </header>

        {/* Global Google ads banner at top page */}
        {(activeTab !== 'database' || !selectedComicId) && (
          <div className="bg-neutral-50 py-2.5 border-b border-neutral-100 flex justify-center items-center select-none text-center">
            <div className="text-[12px] font-mono tracking-wide text-neutral-400 font-bold flex items-center justify-center gap-2 leading-[16px]">
              <span>📢 SPONSORED DISPLAY ADSENSE</span>
              <span className="w-1.5 h-3 bg-neutral-200"></span>
              <span>728 x 90 TOP BANNER SLOT</span>
            </div>
          </div>
        )}

        {/* Dynamic Content Body with Smooth Fade-in Animations */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 pb-20 md:pb-6 bg-neutral-50/40">
          <AnimatePresence mode="wait">
            
            {/* Tab: HOME (Unified Hub) */}
            {activeTab === 'home' && (
              <motion.div
                key="home-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Visual Minimalist Landing Hero */}
                <div className="text-center py-8 md:py-12 space-y-4 max-w-3xl mx-auto border-b border-neutral-200 pb-8 bg-white p-6 md:p-8 rounded-xl border border-neutral-150 shadow-xs">
                  <span className="inline-block px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono tracking-wider uppercase rounded-md leading-[16px]">
                    Satu portal untuk komik, light novel & novel jepang terbitan resmi Indonesia
                  </span>
                  <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-neutral-950 tracking-tight leading-tight uppercase font-black">
                    NORINOYA
                  </h1>
                  <p className="text-sm md:text-base text-neutral-605 max-w-xl mx-auto leading-[24px]">
                    Mulai dari baca ulasan <strong>@konotasi.sukasuka</strong>, cari judul yang kamu incar, sampai beli di toko resmi Indonesia. Semuanya ada di sini.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5">
                    <button
                      onClick={handleNavDatabase}
                      className="px-4.5 py-2.5 bg-neutral-950 text-white hover:bg-neutral-800 active:scale-95 duration-100 text-xs font-mono font-bold tracking-tight rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Lihat Database &rarr;
                    </button>
                    <button
                      onClick={handleNavNews}
                      className="px-4.5 py-2.5 bg-white text-neutral-950 hover:bg-neutral-50 active:scale-95 duration-100 border border-neutral-200 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Lihat Feed
                    </button>
                  </div>
                </div>

                {/* Grid Overview Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Spotlight Sliders: Comic Databases Shortcut */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                      <h2 className="text-base font-bold font-sans uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-neutral-800" />
                        Database Terpopuler
                      </h2>
                      <button
                        onClick={handleNavDatabase}
                        className="text-xs font-mono font-bold hover:underline text-neutral-500 flex items-center gap-0.5 cursor-pointer leading-[16px]"
                      >
                        Lihat Semua ({COMICS_DATA.length}) &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {COMICS_DATA.slice(0, 6).map(comic => (
                        <div
                          key={comic.id}
                          onClick={() => {
                            setSelectedComicId(comic.id);
                            setActiveTab('database');
                            window.location.hash = `#/database/${comic.id}`;
                          }}
                          className="border border-neutral-200 bg-white p-3.5 rounded-xl space-y-3 flex flex-col justify-between hover:border-neutral-350 transition-all shadow-xs group cursor-pointer text-left"
                        >
                          <div className="space-y-3">
                            {/* Comic cover visual thumbnail */}
                            <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-neutral-900 border border-neutral-100">
                              {comic.coverImage ? (
                                <img
                                  src={comic.coverImage}
                                  alt={comic.title}
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <BookOpen className="w-8 h-8 text-neutral-500 stroke-[1.2]" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-mono tracking-tight bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-md leading-[16px] capitalize">
                                  {comic.category.replace('_', ' ')}
                                </span>
                              </div>
                              <h3 className="font-extrabold text-neutral-900 text-sm font-sans tracking-tight leading-[18px]">
                                {comic.title}
                              </h3>
                              <p className="text-sm text-neutral-550 line-clamp-2 leading-[18px]">
                                {comic.synopsis}
                              </p>
                            </div>
                          </div>

                          <div className="pt-2.5 border-t border-neutral-100 flex items-center text-xs font-mono text-neutral-400 leading-[16px]">
                            <span>{comic.status} ({comic.totalVolumesKnown.split(' ')[0]} Vol)</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Google Ads In-Feed Banner Container */}
                    <div className="bg-white border border-dashed border-neutral-300 rounded-lg p-3 text-center">
                      <span className="text-xs font-mono tracking-widest text-neutral-400 block mb-0.5 uppercase">📢 GOOGLE NATIVE FEED SPONSOR</span>
                      <div className="text-xs text-neutral-500 font-mono">
                        Responsive AdSense Spot - High Density In-feed Frame
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Widget Highlights (Twitter-like updates + preowned shortcuts) */}
                  <div className="md:col-span-4 space-y-4">
                    {/* Twitter News widget */}
                    <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-3.5 shadow-xs">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                        <h4 className="font-extrabold text-neutral-900 font-sans text-xs uppercase tracking-tight">
                          feed terbaru
                        </h4>
                        <button
                          onClick={handleNavNews}
                          className="text-xs font-mono font-bold text-neutral-500 hover:underline leading-[16px] cursor-pointer bg-transparent border-0"
                        >
                          Lihat Semua
                        </button>
                      </div>

                      <div className="space-y-3.5 divide-y divide-neutral-100">
                        {NEWS_UPDATES.slice(0, 3).map((feed, idx) => (
                          <div 
                            key={feed.id} 
                            onClick={() => {
                              setSelectedNewsId(feed.id);
                              setActiveTab('news');
                              window.location.hash = '#news';
                            }}
                            className={`text-sm ${idx > 0 ? 'pt-3' : ''} leading-[20px] cursor-pointer hover:bg-neutral-50/70 p-2.5 rounded-xl border border-transparent hover:border-neutral-250 transition-all`}
                          >
                            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] text-neutral-450 dark:text-neutral-500 mb-0.5 leading-[16px]">
                              <span className="text-neutral-900 dark:text-neutral-200 font-extrabold">@{feed.username}</span>
                              <span className="text-neutral-300 dark:text-neutral-700">•</span>
                              <span className="text-neutral-500 dark:text-neutral-400 font-bold">{feed.timestamp}</span>
                              <span className="text-neutral-300 dark:text-neutral-700">•</span>
                              <span className="text-neutral-450 dark:text-neutral-500 text-[10px]" title="Waktu Posting">{getAbsoluteDateTime(feed.timestamp)}</span>
                            </div>
                            {feed.title && (
                              <h5 className="font-extrabold text-neutral-950 dark:text-neutral-100 text-xs mt-1 mb-0.5 leading-snug font-sans">
                                {feed.title}
                              </h5>
                            )}
                            <p className="text-neutral-603 dark:text-neutral-300 line-clamp-2 leading-[20px] font-sans">
                              {feed.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pre-owned widget */}
                    <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-3.5 shadow-xs">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                        <h4 className="font-extrabold text-neutral-900 font-sans text-xs uppercase tracking-tight">
                          Preloved Sale
                        </h4>
                        <button
                          onClick={handleNavStore}
                          className="text-xs font-mono font-bold text-neutral-500 hover:underline leading-[16px] cursor-pointer bg-transparent border-0"
                        >
                          Lihat Semua
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {PRE_OWNED_ITEMS.slice(0, 3).map(item => (
                          <div 
                            key={item.id} 
                            onClick={() => {
                              setSelectedSaleId(item.id);
                              setActiveTab('store');
                              window.location.hash = `#/sale/${item.id}`;
                            }}
                            className="flex items-start gap-3 p-2 hover:bg-neutral-50/70 active:bg-neutral-100 rounded-xl border border-neutral-200 transition-all cursor-pointer bg-white group shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                          >
                            {/* Product Thumbnail */}
                            <div className="w-12 h-16 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-100 shrink-0 relative flex items-center justify-center">
                              {item.coverImage ? (
                                <img 
                                  src={item.coverImage} 
                                  alt={item.comicTitle}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                               />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 font-mono">Cover</div>
                              )}
                              {item.isSoldOut && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white uppercase tracking-tighter px-1 rounded bg-red-600/90 font-mono scale-90 leading-[16px]">Habis</span>
                                </div>
                              )}
                            </div>

                            {/* Details Info */}
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <h5 className="font-extrabold text-neutral-950 text-sm leading-[18px] tracking-tight group-hover:text-neutral-800 transition-colors truncate">
                                {item.comicTitle}
                              </h5>
                              <div className="text-xs text-neutral-500 font-mono leading-[16px] flex items-center gap-1">
                                <span>Vol. {item.volumeNumber}</span>
                                <span>•</span>
                                <span className="font-extrabold text-[#03ac0e]">{getTierDetails(item.conditionRating).label}</span>
                              </div>
                              <div className="flex items-baseline gap-1.5 pt-0.5">
                                <span className="text-sm font-black text-neutral-950 font-sans">
                                  Rp {item.salePrice.toLocaleString('id-ID')}
                                </span>
                                <span className="text-xs text-neutral-450 line-through font-mono leading-[16px]">
                                  {item.originalPrice.toLocaleString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>



                  </div>
                </div>

                {/* PREVIEW KOMIK RILISAN BARU (Bentuk seperti post marketplace database!) */}
                <div className="space-y-4 pt-6">
                  <div className="flex justify-between items-center py-3 border-t border-b border-neutral-200">
                    <h2 className="text-base font-bold font-sans uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      rilisan terbaru
                    </h2>
                    <button
                      onClick={handleNavDatabase}
                      className="text-xs font-mono font-bold hover:underline text-neutral-500 flex items-center gap-0.5 cursor-pointer leading-[16px] bg-transparent border-0"
                    >
                      Lihat Semua &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[
                      {
                        id: 'naruto-bindup-vol-3',
                        comicId: 'naruto-bindup',
                        comic: COMICS_DATA.find(c => c.id === 'naruto-bindup')!,
                        volume: COMICS_DATA.find(c => c.id === 'naruto-bindup')!.volumes.find(v => v.volNumber === 3)!
                      },
                      {
                        id: 'frieren-manga-vol-3',
                        comicId: 'frieren-manga',
                        comic: COMICS_DATA.find(c => c.id === 'frieren-manga')!,
                        volume: COMICS_DATA.find(c => c.id === 'frieren-manga')!.volumes.find(v => v.volNumber === 3)!
                      },
                      {
                        id: 'solo-leveling-ln-vol-2',
                        comicId: 'solo-leveling-ln',
                        comic: COMICS_DATA.find(c => c.id === 'solo-leveling-ln')!,
                        volume: COMICS_DATA.find(c => c.id === 'solo-leveling-ln')!.volumes.find(v => v.volNumber === 2)!
                      },
                      {
                        id: 'fuden-shigusa-ln-vol-2',
                        comicId: 'fuden-shigusa-ln',
                        comic: COMICS_DATA.find(c => c.id === 'fuden-shigusa-ln')!,
                        volume: COMICS_DATA.find(c => c.id === 'fuden-shigusa-ln')!.volumes.find(v => v.volNumber === 2)!
                      },
                      {
                        id: 'blue-lock-manga-vol-1',
                        comicId: 'blue-lock-manga',
                        comic: COMICS_DATA.find(c => c.id === 'blue-lock-manga')!,
                        volume: COMICS_DATA.find(c => c.id === 'blue-lock-manga')!.volumes.find(v => v.volNumber === 1)!
                      },
                      {
                        id: 'namiya-novel-vol-1',
                        comicId: 'namiya-novel',
                        comic: COMICS_DATA.find(c => c.id === 'namiya-novel')!,
                        volume: COMICS_DATA.find(c => c.id === 'namiya-novel')!.volumes.find(v => v.volNumber === 1)!
                      }
                    ].map((item, index) => {
                      const { comic, volume } = item;
                      if (!comic || !volume) return null;
                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ y: -3 }}
                          onClick={() => {
                            setSelectedComicId(`${comic.id}-vol-${volume.volNumber}`);
                            setActiveTab('database');
                            window.location.hash = `#/database/${comic.id}-vol-${volume.volNumber}`;
                          }}
                          className={`group bg-white border border-[#EFEFEF] p-2.5 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-neutral-350 hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)] ${
                            index === 5 ? 'sm:hidden' : ''
                          }`}
                        >
                          {/* Book Jacket Art */}
                          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950 flex flex-col justify-between p-3 mb-2 border border-neutral-100">
                            {volume.coverImage || comic.coverImage ? (
                              <img
                                src={volume.coverImage || comic.coverImage}
                                alt={`${comic.title} Vol ${volume.volNumber}`}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-neutral-500" />
                              </div>
                            )}
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-85" />

                            <div className="flex justify-between items-start w-full relative z-20">
                              <span className="bg-white/95 backdrop-blur-md text-neutral-900 border border-neutral-100 text-[9.5px] font-sans font-bold tracking-wider px-1.5 py-0.5 rounded uppercase leading-none shadow-xs">
                                {comic.category.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          {/* Meta details */}
                          <div className="space-y-1 px-1 text-left">
                            <h4 className="text-xs font-sans font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                              {comic.title}
                            </h4>
                            
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
                    })}
                  </div>
                </div>

                {/* SHORT KONOTASI HIGHLIGHT (9:16 aspect ratio) */}
                <div className="space-y-4 pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-3 border-t border-b border-neutral-200">
                    <h2 className="text-base font-bold font-sans uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                      <Video className="w-5 h-5 text-red-500" />
                      Highlight Review
                    </h2>
                    <div className="flex items-center gap-2 shrink-0">
                      <a 
                        href="https://instagram.com/norinoya.sukasuka" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 hover:opacity-90 text-white rounded-lg shadow-sm transition-all hover:scale-[1.05] cursor-pointer"
                        title="Instagram"
                      >
                        <Instagram className="w-5 h-5 text-white" />
                      </a>
                      <a 
                        href="https://tiktok.com/@norinoya.sukasuka" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-9 h-9 flex items-center justify-center bg-black border border-neutral-800 hover:bg-neutral-900 text-white rounded-lg shadow-sm transition-all hover:scale-[1.05] cursor-pointer"
                        title="TikTok"
                      >
                        <svg className="w-5 h-5 fill-neutral-200" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.5-.48-.36-.9-.79-1.25-1.27-.04.41-.05.82-.05 1.24-.03 2.12-.01 4.24-.03 6.36-.08 1.66-.49 3.39-1.52 4.69-1.28 1.66-3.4 2.53-5.49 2.51-2.22-.05-4.43-.99-5.74-2.81-1.46-1.95-1.56-4.75-.43-6.84 1.05-1.99 3.23-3.23 5.46-3.22.18 0 .37.01.55.03v4.11c-.55-.17-1.15-.17-1.7-.01-.94.24-1.71 1.05-1.91 2-.28 1.18.17 2.5 1.14 3.19.86.63 2.1.66 2.94.02.73-.52.95-1.46.96-2.31V3.41c-.04-1.13.25-2.29.98-3.15.53-.61 1.25-1.07 2.03-1.24z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        id: 's1',
                        title: 'Full Bedah Detail Kertas Naruto Bindup Vol 1, Tekstur Mewah!',
                        views: '12.4K views',
                        duration: '0:58',
                        likes: '4.8K',
                        thumbnail: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=320&auto=format&fit=crop&q=80',
                        quote: '"Kertas bookpaper di Naruto Bindup tebal banget, warnanya kuning gading nyaman buat mata!"'
                      },
                      {
                        id: 's2',
                        title: 'Review Jujur Laminasi Sampul m&c! Akasha Frieren Vol 1',
                        views: '8.2K views',
                        duration: '0:45',
                        likes: '3.1K',
                        thumbnail: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=320&auto=format&fit=crop&q=80',
                        quote: '"Detil cover metalik Akasha Frieren mewah parah, sidik jari gak gampang kotor!"'
                      },
                      {
                        id: 's3',
                        title: 'Uji Margin Spy x Family Vol 1, Potongan Presisi & Rapih',
                        views: '15.1K views',
                        duration: '0:52',
                        likes: '5.2K',
                        thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=320&auto=format&fit=crop&q=80',
                        quote: '"Gak ada potongan margin gelembung dialog yang kepotong di lipatan jilid tengah!"'
                      },
                      {
                        id: 's4',
                        title: 'Novel Terjemahan Solo Leveling Vol 1, Apakah Bagus?',
                        views: '24.8K views',
                        duration: '0:59',
                        likes: '9.2K',
                        thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=320&auto=format&fit=crop&q=80',
                        quote: '"Bahan novel premium dilapisi foam cadangan, kokoh dikoleksi bertahun-tahun."'
                      }
                    ].map((short) => (
                      <motion.div
                        key={short.id}
                        whileHover={{ y: -4, scale: 1.01 }}
                        onClick={() => setSelectedShort(short)}
                        className="aspect-[9/16] border border-neutral-150 hover:border-neutral-350 bg-neutral-900 rounded-2xl overflow-hidden relative flex flex-col justify-end p-3 shadow-xs cursor-pointer group"
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
                        <div className="absolute top-2.5 left-2.5 flex gap-1 items-center z-10 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10">
                          <span className="bg-red-650 animate-pulse w-1.5 h-1.5 rounded-full" />
                          <span className="text-white text-[9.5px] font-mono leading-none font-bold uppercase tracking-wider">
                            SHORTS
                          </span>
                        </div>

                        {/* Time duration badge at top right */}
                        <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10 z-10">
                          <span className="text-neutral-200 text-[9.5px] font-mono leading-none font-bold">
                            {short.duration}
                          </span>
                        </div>

                        {/* Text and interaction counts */}
                        <div className="relative z-10 space-y-1.5 text-left text-white mt-auto">
                          <h4 className="font-sans font-bold text-xs leading-snug line-clamp-2 text-white/95 group-hover:text-amber-300 transition-colors">
                            {short.title}
                          </h4>
                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300">
                            <span>👁 {short.views}</span>
                            <span>❤ {short.likes}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Ad block next to bottom of Home */}
                <div className="w-full bg-white border border-dashed border-neutral-300 rounded-xl p-4 text-center space-y-1">
                  <span className="text-xs font-mono tracking-widest text-neutral-400 block uppercase leading-[16px]">📢 GOOGLE AD RESPONSIVE</span>
                  <div className="text-sm text-neutral-550 font-mono leading-[20px]">
                    970 x 90 Large Leaderboard Ad Slot — Google AdSense
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: News Feed */}
            {activeTab === 'news' && (
              <motion.div
                key="news-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Twitter News component */}
                <NewsFeed selectedNewsId={selectedNewsId} setSelectedNewsId={setSelectedNewsId} />
              </motion.div>
            )}

            {/* Tab: DATABASE SEARCH (Anilist-inspired) */}
            {activeTab === 'database' && (
              <motion.div
                key="database-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Anilist style comic search component */}
                <MarketplaceDb 
                  initialSelectedComicId={selectedComicId} 
                  onClearSelectedComicId={() => setSelectedComicId(null)}
                />
              </motion.div>
            )}

            {/* Tab: STORE (Curated Pre-owned review items) */}
            {activeTab === 'store' && (
              <motion.div
                key="store-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Pre-owned book store component */}
                <KonotasiStore 
                  selectedSaleId={selectedSaleId}
                  onClearSelectedSaleId={() => setSelectedSaleId(null)}
                  onNavigateToDatabase={(comicId) => {
                    setSelectedComicId(comicId);
                    window.location.hash = `#/database/${comicId}`;
                  }}
                />
              </motion.div>
            )}

            {/* Tab: ABOUT / PENERBIT / HUKUM INDONESIA */}
            {activeTab === 'about' && (
              <motion.div
                key="about-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Legal compliance legal page component */}
                <AboutSection />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Global Footer (Informative, design-inspired) */}
        <footer className="border-t border-neutral-205 dark:border-neutral-850 mt-16 bg-neutral-50 dark:bg-neutral-900 py-12 px-6 sm:px-8 pb-24 md:pb-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-start">
            
            {/* Branding details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 select-none">
                <img 
                  src={logoUrl} 
                  alt="Norinoya Logo" 
                  className="h-[32px] w-auto object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-sm text-neutral-500 max-w-sm font-sans leading-[20px]">
                Platform kurasi, database buku, komik dan light novel resmi di Indonesia, terafiliasi dengan program referral Gramedia, Tokopedia, Shopee. <strong>Stop Buku Bajakan!</strong>
              </p>
            </div>

            {/* Hub menu */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-neutral-700">
              <div className="space-y-2">
                <h6 className="text-xs font-mono tracking-wider font-extrabold text-neutral-400 uppercase leading-[16px]">Fitur Utama</h6>
                <ul className="text-sm space-y-2 leading-[20px]">
                  <li><button onClick={handleNavNews} className="hover:text-black font-medium cursor-pointer">Feed</button></li>
                  <li><button onClick={handleNavDatabase} className="hover:text-black font-medium cursor-pointer">Database</button></li>
                  <li><button onClick={handleNavStore} className="hover:text-black font-medium cursor-pointer">Sale</button></li>
                </ul>
              </div>

              <div className="space-y-2">
                <h6 className="text-xs font-mono tracking-wider font-extrabold text-neutral-400 uppercase leading-[16px]">Kebijakan Hukum</h6>
                <ul className="text-sm space-y-2 leading-[20px]">
                  <li>
                    <button 
                      onClick={() => { 
                        handleNavAbout(); 
                        setTimeout(() => { 
                          document.getElementById('privacy-policy')?.scrollIntoView({ behavior: 'smooth' }); 
                        }, 150); 
                      }} 
                      className="hover:text-black font-medium cursor-pointer transition-colors"
                    >
                      Privacy Policy
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 col-span-2 sm:col-span-1">
                <h6 className="text-xs font-mono tracking-wider font-extrabold text-neutral-400 uppercase leading-[16px]">Media Sosial</h6>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 py-1.5 px-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-xs font-mono font-bold text-neutral-700">@norinoya.sukasuka</span>
                    <div className="flex gap-1.5">
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
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.97 2.05 1.64 3.34 1.85.01.88 0 1.77-.01 2.65-.96-.11-1.92-.48-2.73-1.03-.69-.47-1.25-1.11-1.63-1.85-.05 1.48-.03 2.94-.04 4.41-.07 2.58-.93 5.16-2.71 7.03-1.74 1.95-4.32 2.99-6.95 2.87-2.67-.03-5.26-1.24-6.85-3.39-1.75-2.25-2.22-5.4-1.25-8.13C2.15 6.01 4.7 3.86 7.6 3.5c1.47-.15 2.98.08 4.29.81-.01 1-.01 1.99-.02 2.99-.86-.54-1.9-.76-2.9-.61-1.39.21-2.61 1.15-3.19 2.44-.7 1.46-.57 3.29.35 4.62.91 1.34 2.53 2.1 4.14 2 1.4-.04 2.72-.78 3.44-1.97.48-.75.69-1.64.67-2.52.01-3.21 0-6.42.01-9.63-.08-.55-.38-.97-.87-1.23-.28-.15-.59-.22-.92-.22H12.525z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-1.5 px-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-xs font-mono font-bold text-neutral-700">@konotasi.sukasuka</span>
                    <div className="flex gap-1.5">
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
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.97 2.05 1.64 3.34 1.85.01.88 0 1.77-.01 2.65-.96-.11-1.92-.48-2.73-1.03-.69-.47-1.25-1.11-1.63-1.85-.05 1.48-.03 2.94-.04 4.41-.07 2.58-.93 5.16-2.71 7.03-1.74 1.95-4.32 2.99-6.95 2.87-2.67-.03-5.26-1.24-6.85-3.39-1.75-2.25-2.22-5.4-1.25-8.13C2.15 6.01 4.7 3.86 7.6 3.5c1.47-.15 2.98.08 4.29.81-.01 1-.01 1.99-.02 2.99-.86-.54-1.9-.76-2.9-.61-1.39.21-2.61 1.15-3.19 2.44-.7 1.46-.57 3.29.35 4.62.91 1.34 2.53 2.1 4.14 2 1.4-.04 2.72-.78 3.44-1.97.48-.75.69-1.64.67-2.52.01-3.21 0-6.42.01-9.63-.08-.55-.38-.97-.87-1.23-.28-.15-.59-.22-.92-.22H12.525z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="max-w-7xl mx-auto border-t border-neutral-200 mt-10 pt-6 text-center text-xs font-mono text-neutral-400 flex flex-col sm:flex-row justify-between items-center gap-4 leading-[16px]">
            <span>© 2026 Norinoya Hub. Diposisikan murni untuk ulasan komunitas & edukasi legalitas komik Indonesia.</span>
            <span>Made with precision</span>
          </div>
        </footer>

        {/* Mobile Sticky Bottom Navigation */}
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl z-[60] flex items-center justify-around py-2.5 px-3 mb-safe">
          <button
            onClick={handleNavHome}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl select-none transition-all flex-1 cursor-pointer outline-none focus:outline-none ${
              activeTab === 'home'
                ? 'text-neutral-950 font-extrabold bg-neutral-100/90'
                : 'text-neutral-400 hover:text-neutral-950'
            }`}
          >
            <Home className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-xs font-sans font-bold leading-none tracking-tight">Beranda</span>
          </button>
          
          <button
            onClick={handleNavNews}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl select-none transition-all flex-1 cursor-pointer outline-none focus:outline-none ${
              activeTab === 'news'
                ? 'text-neutral-950 font-extrabold bg-neutral-100/90'
                : 'text-neutral-400 hover:text-neutral-950'
            }`}
          >
            <Newspaper className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-xs font-sans font-bold leading-none tracking-tight">Berita</span>
          </button>

          <button
            onClick={handleNavDatabase}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl select-none transition-all flex-1 cursor-pointer outline-none focus:outline-none ${
              activeTab === 'database'
                ? 'text-neutral-950 font-extrabold bg-neutral-100/90'
                : 'text-neutral-400 hover:text-neutral-950'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-xs font-sans font-bold leading-none tracking-tight">Katalog</span>
          </button>

          <button
            onClick={handleNavStore}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl select-none transition-all flex-1 cursor-pointer outline-none focus:outline-none ${
              activeTab === 'store'
                ? 'text-neutral-950 font-extrabold bg-neutral-100/90'
                : 'text-neutral-400 hover:text-neutral-950'
            }`}
          >
            <Tag className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-xs font-sans font-bold leading-none tracking-tight">Preloved</span>
          </button>
        </div>

        {/* Animated Simulated Shorts Modal Player (Unified with MarketplaceDb design!) */}
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
                    ● SPECIAL SHORTS
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
                    className="flex flex-col items-center gap-0.5 group cursor-pointer bg-transparent border-none"
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
                    <span className="text-xs font-bold font-mono text-neutral-300">{selectedShort.views.split(' ')[0]}</span>
                  </div>

                  {/* Audio sound button */}
                  <button 
                    onClick={() => setIsMuted(prev => !prev)}
                    className="w-9 h-9 rounded-full bg-black/55 hover:bg-neutral-800 flex items-center justify-center border border-white/10 cursor-pointer text-white"
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
                      <span className="text-xs text-neutral-400 font-mono italic">{selectedShort.duration}</span>
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
                        className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono font-bold rounded-lg cursor-pointer transition-colors text-white"
                      >
                        ✕ Tutup Player
                      </button>
                      <span className="text-xs text-neutral-400 font-mono font-bold">Simulasi Bersuara</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cookie Consent Banner */}
        <AnimatePresence>
          {cookieChoice === 'none' && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ delay: 1, duration: 0.4, ease: 'easeOut' }}
              className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-[110] bg-neutral-900 border border-neutral-800 text-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 font-sans"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-lg shrink-0 select-none">
                  🍪
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs tracking-wider uppercase text-neutral-350">Informasi Cookie &amp; Privasi</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans mt-0.5">
                    Norinoya menggunakan kuki lokal (cookies) dan <code>localStorage</code> untuk mengingat status pembatasan bacaan dewasa dan merawat preferensi navigasi Anda secara anonim. Kami tidak melacak data sensitif pribadi Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1 sm:justify-end">
                <button
                  onClick={() => {
                    handleNavAbout();
                    setTimeout(() => {
                      document.getElementById('privacy-policy')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }}
                  className="px-3 py-1.5 hover:underline text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-left mr-auto sm:mr-0 font-bold"
                >
                  Kebijakan Privasi
                </button>
                <button
                  onClick={handleDeclineCookies}
                  className="px-3.5 py-1.5 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Tolak
                </button>
                <button
                  onClick={handleAcceptCookies}
                  className="px-4 py-1.5 bg-[#03ac0e] hover:bg-emerald-600 active:scale-95 rounded-lg text-xs text-black font-sans font-black tracking-wide transition-all cursor-pointer shadow-sm text-center"
                >
                  Setuju
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Back to Top Button */}
        <AnimatePresence>
          {showToTop && (
            <motion.button
              id="to-top-button"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToTop}
              className="fixed bottom-[88px] right-4 md:bottom-8 md:right-8 z-[100] bg-white/95 backdrop-blur-md border border-neutral-200/80 text-neutral-800 p-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:bg-neutral-50 hover:text-neutral-950 focus:outline-none flex items-center justify-center cursor-pointer font-bold group"
              title="Kembali ke atas"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

      </div>
  );
}
