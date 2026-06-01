import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Heart, ArrowRight, Instagram, Video, Star, Sparkles, 
  HelpCircle, MessageCircle, AlertCircle, ShoppingCart, ShieldAlert, Scale,
  Home, Newspaper
} from 'lucide-react';

// Sub-components
import ViewportWrapper from './components/ViewportWrapper';
import NewsFeed from './components/NewsFeed';
import MarketplaceDb from './components/MarketplaceDb';
import KonotasiStore from './components/KonotasiStore';
import AboutSection from './components/AboutSection';

// Data
import { COMICS_DATA, PRE_OWNED_ITEMS, NEWS_UPDATES } from './data/mockData';

export default function App() {
  // Tabs: 'home' | 'news' | 'database' | 'store' | 'about'
  const [activeTab, setActiveTab] = useState<'home' | 'news' | 'database' | 'store' | 'about'>('home');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [selectedComicId, setSelectedComicId] = useState<string | null>(null);
  const [selectedShort, setSelectedShort] = useState<any | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

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
    <ViewportWrapper>
      <div className="bg-white min-h-screen text-neutral-950 selection:bg-neutral-900 selection:text-white flex flex-col justify-between font-sans">
        
        {/* Dynamic Minimal Navbar */}
        <header className="border-b border-neutral-100 bg-white sticky top-0 z-30 py-3 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          {/* Logo & social handler */}
          <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-3">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-8 h-8 rounded bg-neutral-950 text-white font-sans font-black flex items-center justify-center text-[16px] transition-transform group-hover:scale-105 duration-150 shadow-sm">
                N
              </div>
              <span className="font-sans text-[16px] md:text-[20px] font-extrabold tracking-tight text-neutral-950 leading-none uppercase">
                NORINOYA <span className="text-[12px] text-neutral-400 font-mono font-medium lowercase tracking-normal pl-0.5 hidden xs:inline">app</span>
              </span>
            </div>

            <div className="flex items-center gap-2 border-l border-neutral-200 pl-3.5 text-[12px] font-mono text-neutral-500">
              <span className="hidden sm:inline">Kurator ulasan</span>
              <a 
                href="https://instagram.com/norinoya.sukasuka" 
                target="_blank" 
                rel="no-referrer"
                className="hover:text-neutral-950 font-bold transition-colors underline text-[12px]"
              >
                @norinoya.sukasuka
              </a>
            </div>
          </div>

          {/* Nav Items - Hidden on mobile, sticky bottom navigation handles it inside Viewport */}
          <nav className="hidden md:flex items-center justify-center gap-1.5 bg-neutral-50 border border-neutral-200/50 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 text-[12px] font-mono font-bold rounded transition-all cursor-pointer outline-none focus:outline-none select-none ${
                activeTab === 'home'
                  ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/20'
                  : 'text-neutral-500 hover:text-neutral-950 border border-transparent'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-3.5 py-1.5 text-[12px] font-mono font-bold rounded transition-all cursor-pointer outline-none focus:outline-none select-none ${
                activeTab === 'news'
                  ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/20'
                  : 'text-neutral-500 hover:text-neutral-950 border border-transparent'
              }`}
            >
              News
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3.5 py-1.5 text-[12px] font-mono font-bold rounded transition-all cursor-pointer outline-none focus:outline-none select-none ${
                activeTab === 'database'
                  ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/20'
                  : 'text-neutral-500 hover:text-neutral-950 border border-transparent'
              }`}
            >
              Database
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`px-3.5 py-1.5 text-[12px] font-mono font-bold rounded transition-all cursor-pointer outline-none focus:outline-none select-none ${
                activeTab === 'store'
                  ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/20'
                  : 'text-neutral-500 hover:text-neutral-950 border border-transparent'
              }`}
            >
              Sale
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3.5 py-1.5 text-[12px] font-mono font-bold rounded transition-all cursor-pointer outline-none focus:outline-none select-none ${
                activeTab === 'about'
                  ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/20'
                  : 'text-neutral-500 hover:text-neutral-950 border border-transparent'
              }`}
            >
              Legal
            </button>
          </nav>
        </header>

        {/* Global Google ads banner at top page (Optional - hide on database tab because database doesn't have ads as requested) */}
        {activeTab !== 'database' && (
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
                    Satu Portal Untuk Komik & Novel Resmi Indonesia
                  </span>
                  <h1 className="text-3xl md:text-4xl font-sans font-extrabold text-neutral-950 tracking-tight leading-tight">
                    Membaca Sehat Baik Untuk Masa Depan.
                  </h1>
                  <p className="text-sm md:text-base text-neutral-605 max-w-xl mx-auto leading-[24px]">
                    Sistem integrasi ulasan media ulasan dari <strong>@konotasi.sukasuka</strong> dengan sistem pencarian manga canggih terinspirasi AniList, mengarahkan Anda ke checkout resmi Gramedia, Shopee, & Tokopedia.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5">
                    <button
                      onClick={() => setActiveTab('database')}
                      className="px-4.5 py-2.5 bg-neutral-950 text-white hover:bg-neutral-800 active:scale-95 duration-100 text-xs font-mono font-bold tracking-tight rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Cari Database Jilid &rarr;
                    </button>
                    <button
                      onClick={() => setActiveTab('store')}
                      className="px-4.5 py-2.5 bg-white text-neutral-950 hover:bg-neutral-50 active:scale-95 duration-100 border border-neutral-200 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Komik Bekas Review
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
                        Database &amp; Marketplace Komik Terpopuler
                      </h2>
                      <button
                        onClick={() => setActiveTab('database')}
                        className="text-xs font-mono font-bold hover:underline text-neutral-500 flex items-center gap-0.5 cursor-pointer leading-[16px]"
                      >
                        Lihat Semua ({COMICS_DATA.length}) &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {COMICS_DATA.slice(0, 2).map(comic => (
                        <div
                          key={comic.id}
                          onClick={() => {
                            setActiveTab('database');
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
                                <span className="text-xs font-mono text-amber-500 flex items-center gap-0.5 leading-[16px]">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {comic.rating}
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

                          <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-400 leading-[16px]">
                            <span>{comic.status} ({comic.totalVolumesKnown.split(' ')[0]} Vol)</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab('database');
                              }}
                              className="text-neutral-950 font-bold hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0"
                            >
                              Beli Affiliate &rarr;
                            </button>
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
                          Berita Terbaru (Twitter Feed)
                        </h4>
                        <button
                          onClick={() => {
                            setSelectedNewsId(null);
                            setActiveTab('news');
                          }}
                          className="text-xs font-mono font-bold text-neutral-500 hover:underline leading-[16px]"
                        >
                          Semua Stream
                        </button>
                      </div>

                      <div className="space-y-3.5 divide-y divide-neutral-100">
                        {NEWS_UPDATES.slice(0, 2).map((feed, idx) => (
                          <div 
                            key={feed.id} 
                            onClick={() => {
                              setSelectedNewsId(feed.id);
                              setActiveTab('news');
                            }}
                            className={`text-sm ${idx > 0 ? 'pt-3' : ''} leading-[20px] cursor-pointer hover:bg-neutral-50/70 p-2.5 rounded-xl border border-transparent hover:border-neutral-250 transition-all`}
                          >
                            <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-400 mb-0.5 leading-[16px]">
                              <span className="text-neutral-900 font-extrabold">@{feed.username}</span>
                              <span>•</span>
                              <span>{feed.timestamp}</span>
                            </div>
                            <p className="text-neutral-600 line-clamp-2 leading-[20px] font-sans">
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
                          Sisa Jual Bekas Review
                        </h4>
                        <button
                          onClick={() => setActiveTab('store')}
                          className="text-xs font-mono font-bold text-neutral-500 hover:underline leading-[16px]"
                        >
                          Toko Bekas
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {PRE_OWNED_ITEMS.slice(0, 3).map(item => (
                          <div 
                            key={item.id} 
                            onClick={() => setActiveTab('store')}
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
                              <div className="text-xs text-neutral-500 font-mono leading-[16px]">
                                Vol. {item.volumeNumber} • Kondisi {item.conditionRating}
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

                    {/* Instagram/TikTok Promos banner */}
                    <div className="bg-neutral-900 text-white p-4 rounded-xl space-y-2">
                      <div className="flex gap-1.5 items-center">
                        <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                        <span className="text-xs font-mono tracking-widest font-extrabold uppercase text-neutral-300 leading-[16px]">MedSos Partner</span>
                      </div>
                      <p className="text-sm text-neutral-305 font-sans leading-[20px]">
                        Ulasan komparatif kertas cetakan lama vs kertas bookpaper premium di sosmed kami:
                      </p>
                      <a
                        href="https://instagram.com/norinoya.sukasuka"
                        target="_blank"
                        rel="no-referrer"
                        className="text-xs font-mono font-black border-b border-white hover:border-violet-300 block w-max leading-[16px]"
                      >
                        @norinoya.sukasuka
                      </a>
                    </div>

                  </div>
                </div>

                {/* PREVIEW KOMIK RILISAN BARU (Bentuk seperti post marketplace database!) */}
                <div className="space-y-4 border-t border-neutral-200 pt-6">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                    <h2 className="text-base font-bold font-sans uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      rilisan terbaru
                    </h2>
                    <button
                      onClick={() => setActiveTab('database')}
                      className="text-xs font-mono font-bold hover:underline text-neutral-500 flex items-center gap-0.5 cursor-pointer leading-[16px] bg-transparent border-0"
                    >
                      lihat database &rarr;
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
                      }
                    ].map((item) => {
                      const { comic, volume } = item;
                      if (!comic || !volume) return null;
                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ y: -3 }}
                          onClick={() => {
                            setSelectedComicId(`${comic.id}-vol-${volume.volNumber}`);
                            setActiveTab('database');
                          }}
                          className="group bg-white border border-[#EFEFEF] p-2.5 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-neutral-350 hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)]"
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
                <div className="space-y-4 border-t border-neutral-200 pt-6">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                    <h2 className="text-base font-bold font-sans uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                      <Video className="w-5 h-5 text-red-500" />
                      Sorotan Bedah Buku @konotasi.sukasuka (Video 9:16)
                    </h2>
                    <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-150">
                      Interaktif
                    </span>
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
                  onNavigateToDatabase={(comicId) => {
                    setSelectedComicId(comicId);
                    setActiveTab('database');
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
        <footer className="border-t border-neutral-205 mt-16 bg-neutral-50 py-12 px-6 sm:px-8 pb-24 md:pb-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-start">
            
            {/* Branding details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-neutral-900 text-white font-sans font-black flex items-center justify-center text-base">
                  N
                </div>
                <span className="font-sans font-bold text-neutral-950 text-base tracking-tight leading-none">
                  Norinoya
                </span>
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
                  <li><button onClick={() => setActiveTab('database')} className="hover:text-black font-medium cursor-pointer">Database Komik</button></li>
                  <li><button onClick={() => setActiveTab('news')} className="hover:text-black font-medium cursor-pointer">Twitter Bulletin</button></li>
                  <li><button onClick={() => setActiveTab('store')} className="hover:text-black font-medium cursor-pointer">Toko Bekas Review</button></li>
                </ul>
              </div>

              <div className="space-y-2">
                <h6 className="text-xs font-mono tracking-wider font-extrabold text-neutral-400 uppercase leading-[16px]">Kebijakan Hukum</h6>
                <ul className="text-sm space-y-2 leading-[20px]">
                  <li><button onClick={() => setActiveTab('about')} className="hover:text-black font-medium cursor-pointer">UU Hak Cipta</button></li>
                  <li><button onClick={() => setActiveTab('about')} className="hover:text-black font-medium cursor-pointer">Sistem Affiliate</button></li>
                  <li><button onClick={() => setActiveTab('about')} className="hover:text-black font-medium cursor-pointer">Aturan Konsumen</button></li>
                </ul>
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <h6 className="text-xs font-mono tracking-wider font-extrabold text-neutral-400 uppercase leading-[16px]">Media Sosial</h6>
                <div className="flex gap-3 pt-1">
                  <a href="https://instagram.com/norinoya.sukasuka" target="_blank" rel="no-referrer" className="text-neutral-500 hover:text-pink-600 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://tiktok.com/@norinoya.sukasuka" target="_blank" rel="no-referrer" className="text-neutral-500 hover:text-slate-900 transition-colors">
                    <Video className="w-5 h-5" />
                  </a>
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
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl z-40 flex items-center justify-around py-2.5 px-3 mb-safe">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl select-none transition-all flex-1 cursor-pointer outline-none focus:outline-none ${
              activeTab === 'home'
                ? 'text-neutral-950 font-extrabold bg-neutral-100/90'
                : 'text-neutral-400 hover:text-neutral-950'
            }`}
          >
            <Home className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-xs font-sans font-bold leading-none tracking-tight">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('news')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl select-none transition-all flex-1 cursor-pointer outline-none focus:outline-none ${
              activeTab === 'news'
                ? 'text-neutral-950 font-extrabold bg-neutral-100/90'
                : 'text-neutral-400 hover:text-neutral-950'
            }`}
          >
            <Newspaper className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-xs font-sans font-bold leading-none tracking-tight">News</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl select-none transition-all flex-1 cursor-pointer outline-none focus:outline-none ${
              activeTab === 'database'
                ? 'text-neutral-950 font-extrabold bg-neutral-100/90'
                : 'text-neutral-400 hover:text-neutral-950'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-xs font-sans font-bold leading-none tracking-tight">Database</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl select-none transition-all flex-1 cursor-pointer outline-none focus:outline-none ${
              activeTab === 'store'
                ? 'text-neutral-950 font-extrabold bg-neutral-100/90'
                : 'text-neutral-400 hover:text-neutral-950'
            }`}
          >
            <ShoppingCart className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-xs font-sans font-bold leading-none tracking-tight">Sale</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl select-none transition-all flex-1 cursor-pointer outline-none focus:outline-none ${
              activeTab === 'about'
                ? 'text-neutral-950 font-extrabold bg-neutral-100/90'
                : 'text-neutral-400 hover:text-neutral-950'
            }`}
          >
            <Scale className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-xs font-sans font-bold leading-none tracking-tight">Legal</span>
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

      </div>
    </ViewportWrapper>
  );
}
