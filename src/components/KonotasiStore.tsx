import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, BadgeCheck, CheckCircle, Tag, ShoppingCart, 
  ExternalLink, Sparkles, HelpCircle, AlertCircle, ArrowLeft, BookOpen, ShoppingBag, Info
} from 'lucide-react';
import { PRE_OWNED_ITEMS, COMICS_DATA } from '../data/mockData';
import { PreOwnedItem } from '../types';

interface KonotasiStoreProps {
  onNavigateToDatabase?: (comicId: string) => void;
}

export default function KonotasiStore({ onNavigateToDatabase }: KonotasiStoreProps) {
  const [selectedItem, setSelectedItem] = useState<PreOwnedItem | null>(null);
  const [successCheckedOut, setSuccessCheckedOut] = useState<boolean>(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const modalLinkedComic = selectedItem && selectedItem.linkedComicId
    ? COMICS_DATA.find(c => c.id === selectedItem.linkedComicId)
    : null;

  const getAuthorLabel = (c: { authorStory?: string; authorArt?: string } | null | undefined) => {
    if (!c) return '';
    const story = c.authorStory;
    const art = c.authorArt;
    if (!story && !art) return '';
    if (story === art) return story ? `(${story})` : '';
    const list = [story, art].filter(Boolean);
    return `(${list.join(', ')})`;
  };

  const getReadingRatingStyle = (rating?: string) => {
    switch (rating) {
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
    <div className="space-y-5" id="konotasi-market-root">
      {/* Intro Header & Banner Ads Unit */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-neutral-200 pb-4">
        <div className="space-y-1">
          <span className="inline-block px-1.5 py-0.5 bg-neutral-950 text-white font-mono text-xs uppercase rounded">
            Curated Pre-Owned Store
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-neutral-950">
            Komik Bekas Review @konotasi.sukasuka
          </h2>
          <p className="text-xs text-neutral-550 max-w-xl font-sans">
            Buku yang dijual di sini adalah aset asli ulasan kami. Kondisi mulus, original, dan dikurasi dengan rating fisik jujur di bawah ini.
          </p>
        </div>

        {/* Ad block next to header */}
        <div className="text-xs bg-neutral-50 px-3 py-1.5 border border-dashed border-neutral-300 rounded-xl font-mono text-neutral-400 text-center uppercase self-stretch md:self-auto shrink-0 md:w-56 leading-relaxed flex items-center justify-center">
          Google AdSense Banner
        </div>
      </div>

      {/* Conditions Guarantee Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="border border-neutral-200 p-3 rounded-xl flex items-start gap-2.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <BadgeCheck className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
          <div className="space-y-0.5 whitespace-normal">
            <h4 className="text-xs font-bold text-neutral-900 font-sans">Garansi Original 100%</h4>
            <p className="text-xs text-neutral-500 font-sans leading-snug">Buku diperoleh langsung dari Gramedia/Tokopedia resmi publisher.</p>
          </div>
        </div>
        <div className="border border-neutral-200 p-3 rounded-xl flex items-start gap-2.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <Tag className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
          <div className="space-y-0.5 whitespace-normal">
            <h4 className="text-xs font-bold text-neutral-900 font-sans">Harga Kawan Reviewer</h4>
            <p className="text-xs text-neutral-500 font-sans leading-snug">Diskon s/d 40% karena segel telah dibuka untuk keperluan ulasan.</p>
          </div>
        </div>
        <div className="border border-neutral-200 p-3 rounded-xl flex items-start gap-2.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <ShieldAlert className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
          <div className="space-y-0.5 whitespace-normal">
            <h4 className="text-xs font-bold text-neutral-900 font-sans">Rating Fisik Akurat</h4>
            <p className="text-xs text-neutral-500 font-sans leading-snug">Kami memberikan ulasan kondisi detail per volume tanpa ditutup-tutupi.</p>
          </div>
        </div>
      </div>

      {/* List of Books - Compact aspect-[3/4] book grid like databases */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" id="konotasi-books-grid">
        {PRE_OWNED_ITEMS.map((item) => {
          const discountPercent = Math.round((1 - item.salePrice / item.originalPrice) * 100);
          const linkedComic = item.linkedComicId 
            ? COMICS_DATA.find(c => c.id === item.linkedComicId) 
            : null;
          return (
            <motion.div
              key={item.id}
              layout
              onClick={() => {
                setSelectedItem(item);
                setSuccessCheckedOut(false);
                setActiveSlideIndex(0);
              }}
              className="group bg-white border border-[#EFEFEF] p-2.5 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-neutral-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)] hover:translate-y-[-3px]"
            >
              {/* Cover with 3:4 aspect ratio (identical style with database!) */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950 flex flex-col justify-between p-3 mb-2 shadow-xs border border-neutral-100/55">
                {item.coverImage && !imageErrors[item.id] ? (
                  <img
                    src={item.coverImage}
                    alt={item.comicTitle}
                    onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col justify-center items-center p-3">
                    <BookOpen className="w-8 h-8 text-neutral-500 stroke-[1.2] mb-1.5 opacity-60" />
                    <h5 className="text-[10px] font-sans font-bold text-neutral-350 text-center line-clamp-3 px-1 leading-normal">
                      {item.comicTitle}
                    </h5>
                  </div>
                )}
                
                {/* Gradient bottom overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-85" />
 
                {/* Badges */}
                <div className="flex justify-between items-start w-full relative z-20">
                  <span className="bg-white/95 backdrop-blur-md text-neutral-900 border border-neutral-100 text-[9px] font-sans font-bold tracking-wider px-1.5 py-0.5 rounded uppercase leading-none shadow-xs">
                    {linkedComic ? linkedComic.category.replace('_', ' ') : 'Manga'}
                  </span>
                  {item.isSoldOut ? (
                    <span className="bg-neutral-900/90 text-white text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded shadow-xs">
                      HABIS
                    </span>
                  ) : discountPercent > 0 ? (
                    <span className="bg-red-500 text-white text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded shadow-xs uppercase">
                      -{discountPercent}%
                    </span>
                  ) : null}
                </div>
              </div>
 
              {/* Title & Price Metadata */}
              <div className="px-1 py-0.5 space-y-1 text-left flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-neutral-900 group-hover:text-blue-600 transition-colors text-xs leading-snug line-clamp-1">
                    {item.comicTitle}
                  </h3>
                  {linkedComic && (linkedComic.authorStory || linkedComic.authorArt) && (
                    <p className="text-[10px] font-mono text-neutral-400 leading-tight truncate">
                      {getAuthorLabel(linkedComic)}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[9.5px] text-neutral-500 font-sans line-clamp-1">
                      {linkedComic ? linkedComic.genres.slice(0, 2).join(', ') : item.notes}
                    </span>
                  </div>
                  <div className="pt-0.5 flex gap-1.5 items-center select-none flex-wrap">
                    <span className="text-[8.5px] sm:text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border border-neutral-200 bg-neutral-50 text-neutral-600 leading-none inline-block">
                      ★ {item.conditionRating}
                    </span>
                    {linkedComic?.readingRating && (
                      <span className={`text-[8.5px] sm:text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border leading-none inline-block ${getReadingRatingStyle(linkedComic.readingRating).bg}`}>
                        {getReadingRatingStyle(linkedComic.readingRating).text}
                      </span>
                    )}
                  </div>
                </div>
 
                <div className="pt-1.5 mt-1 border-t border-neutral-50 flex items-center justify-between font-mono w-full">
                  <div className="flex flex-col items-start leading-none shrink-0">
                    {item.originalPrice > item.salePrice && (
                      <span className="text-[9.5px] text-neutral-400 line-through font-mono mb-0.5 leading-none">
                        Rp {item.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="font-extrabold text-neutral-950 font-sans text-xs leading-none">
                      Rp {item.salePrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="bg-amber-50 text-amber-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-200/40 leading-none shrink-0 shadow-[0_1px_2px_rgba(245,158,11,0.04)]">
                    Vol {item.volumeNumber}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Advanced Fullscreen Detailed View */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="min-h-screen bg-white text-neutral-950 flex flex-col pb-24 md:pb-12"
            >
              {/* Sticky Fullscreen Top-Navbar */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3.5 px-4 sm:px-6 flex items-center justify-between z-30 shadow-xs">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 text-neutral-905 transition-all cursor-pointer text-xs font-sans font-bold"
                >
                  <ArrowLeft className="w-4 h-4 text-neutral-900" />
                  <span>Kembali ke Store</span>
                </button>
                <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest truncate">
                  Detail Item Buku Kurasi
                </span>
                <span className="font-mono text-xs text-[#03ac0e] font-bold hidden sm:inline-block">Kurasi @konotasi.sukasuka</span>
              </div>

              {/* Main Content Container */}
              <div className="max-w-4xl w-full mx-auto flex-1 px-4 sm:px-6 py-6 space-y-6">
                
                {/* Title Header with Gradient */}
                <div className="bg-neutral-50/80 p-4 md:p-6 border border-neutral-200 rounded-2xl flex flex-col md:flex-row gap-5 items-start relative overflow-hidden shadow-xs">
                  
                  {/* Slide Carousel Portfolio Component */}
                  <div className="flex flex-col gap-3.5 shrink-0 w-full md:w-80">
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-950 flex flex-col justify-between p-3.5 border border-neutral-100 shadow-md group">
                      
                      {/* Active Slide Image */}
                      {selectedItem.carouselImages && selectedItem.carouselImages.length > 0 ? (
                        <img 
                           src={selectedItem.carouselImages[activeSlideIndex]} 
                          alt={`${selectedItem.comicTitle} - Slide ${activeSlideIndex + 1}`} 
                          referrerPolicy="no-referrer"
                          onClick={() => setIsLightboxOpen(true)}
                          className="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      ) : selectedItem.coverImage ? (
                        <img 
                          src={selectedItem.coverImage} 
                          alt={selectedItem.comicTitle} 
                          referrerPolicy="no-referrer"
                          onClick={() => setIsLightboxOpen(true)}
                          className="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-zoom-in"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-neutral-400 rounded-2xl">
                          <BookOpen className="w-14 h-14 stroke-[1.2]" />
                        </div>
                      )}
                      
                      {/* Dark Overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none rounded-2xl" />

                      {/* Header indicators */}
                      <div className="flex justify-between items-start w-full relative z-10 select-none">
                        <span className="bg-white/95 text-neutral-950 border border-neutral-200 text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded-md uppercase shadow-xs">
                          Foto {activeSlideIndex + 1} / {(selectedItem.carouselImages || [1]).length}
                        </span>
                        <span className="bg-[#d82a1b] text-white text-xs font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md uppercase shadow-xs">
                          ★ {selectedItem.conditionRating}
                        </span>
                      </div>

                      {/* Manual side previous / next arrow anchors */}
                      {selectedItem.carouselImages && selectedItem.carouselImages.length > 1 && (
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2.5 z-20 pointer-events-auto select-none">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSlideIndex((prev) => 
                                prev === 0 ? selectedItem.carouselImages!.length - 1 : prev - 1
                              );
                            }}
                            className="w-7 h-7 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center font-bold text-xs select-none transition-colors border border-white/15 shadow-md cursor-pointer"
                          >
                            &larr;
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSlideIndex((prev) => 
                                prev === selectedItem.carouselImages!.length - 1 ? 0 : prev + 1
                              );
                            }}
                            className="w-7 h-7 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center font-bold text-xs select-none transition-colors border border-white/15 shadow-md cursor-pointer"
                          >
                            &rarr;
                          </button>
                        </div>
                      )}

                      {/* Active target captions */}
                      <div className="relative z-10 mt-auto text-left space-y-0.5">
                        <span className="text-xs font-mono font-extrabold text-[#03ac0e] bg-white text-neutral-950 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider leading-none shadow-xs">
                          {selectedItem.carouselLabels ? selectedItem.carouselLabels[activeSlideIndex] : 'Review Photo'}
                        </span>
                        <p className="text-xs text-neutral-300 font-mono leading-none truncate pt-1">Klik gambar untuk zoom full-screen 🔍</p>
                      </div>
                    </div>

                    {/* Miniature thumbnail row indicators */}
                    {selectedItem.carouselImages && selectedItem.carouselImages.length > 1 && (
                      <div className="grid grid-cols-5 gap-1.5 select-none">
                        {selectedItem.carouselImages.map((img, idx) => (
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

                  <div className="space-y-2 flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono px-1.5 py-0.5 bg-neutral-150 text-neutral-800 rounded capitalize font-bold">
                        Kondisi: {selectedItem.conditionRating} / 10
                      </span>
                      {selectedItem.isSoldOut ? (
                        <span className="text-xs font-mono px-1.5 py-0.5 bg-red-100 text-red-800 rounded font-bold uppercase">
                          HABIS TERJUAL
                        </span>
                      ) : (
                        <span className="text-xs font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold uppercase">
                          STOK TERSEDIA
                        </span>
                      )}
                      <span className="text-xs font-mono px-1.5 py-0.5 bg-amber-50 text-amber-900 rounded font-bold uppercase border border-amber-200/50">
                        Hemat {Math.round((1 - selectedItem.salePrice / selectedItem.originalPrice) * 100)}%
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-sans font-extrabold text-neutral-950 tracking-tight leading-tight">
                      {selectedItem.comicTitle} (Volume {selectedItem.volumeNumber})
                    </h2>

                    <p className="text-xs text-neutral-500 font-mono leading-relaxed max-w-xl">
                      Item ini dikurasi langsung oleh tim <strong>@konotasi.sukasuka</strong> setelah sesi bedah terbitan. Segel dibuka dengan sangat hati-hati, hanya dibaca sekali untuk pencatatan kualitas kertas, lalu langsung dibungkus rapi dalam sleeve plastik tahan kelembaban.
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs bg-neutral-100 text-neutral-850 px-2 py-1 rounded font-mono border border-neutral-200 font-bold uppercase">
                        📚 Edisi Kolektor / Reviewer
                      </span>
                      <span className="text-xs bg-neutral-100 text-neutral-850 px-2 py-1 rounded font-mono border border-neutral-200 font-bold uppercase">
                        ✨ Kondisi {selectedItem.conditionRating} Mulus
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid details body */}
                <div className="grid md:grid-cols-12 gap-6">
                  {/* Left Detail Column */}
                  <div className="md:col-span-8 space-y-6">
                    {/* Notes & Physical State */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-150 pb-1 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-neutral-450" />
                        Catatan Kurator &amp; Kondisi Buku
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans bg-amber-50/20 border border-amber-100/50 p-3.5 rounded-xl">
                        {selectedItem.notes}
                      </p>
                    </div>

                    {/* Authenticity Pledge Card */}
                    <div className="bg-neutral-50/50 border border-neutral-200 rounded-2xl p-4 flex gap-3 items-start shadow-xs">
                      <ShieldAlert className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h5 className="font-extrabold text-neutral-950 text-xs">Jaminan Transparansi Fisik Norinoya</h5>
                        <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                          Kami tidak menyembunyikan kekurangan. Jika ada tekukan tipis, noda kertas bawaan pabrik, atau lipatan kecil, kurator kami akan menuliskan rincian tersebut di atas dan menyajikan penyesuaian diskon harga yang sangat menguntungkan Anda.
                        </p>
                      </div>
                    </div>

                    {/* Store Affiliate and Simulated Direct Checkouts */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-150 pb-1 flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-neutral-450" />
                        Amankan Produk &amp; Checkout Resmi
                      </h4>

                      {selectedItem.isSoldOut ? (
                        <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 text-center space-y-1 shadow-xs">
                          <h5 className="font-bold text-xs uppercase font-mono">Buku Telah Terjual</h5>
                          <p className="text-xs text-red-650 font-sans">Unit ulasan ini telah laku dibeli. nantikan rilisan pre-owned menarik lainnya setelah ulasan komik terbaru kami rilis!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-xs text-neutral-550 font-sans leading-relaxed">
                            Pilih toko e-commerce resmi kami untuk checkout yang 100% aman dilindungi escrow asuransi pengiriman marketplace utama:
                          </p>
                          
                          {/* Redesigned Button with Free Ongkir and Potensi Diskon tags */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <a
                              href={selectedItem.tokopediaUrl}
                              target="_blank"
                              rel="no-referrer"
                              className="px-4 py-3 bg-[#03ac0e] hover:bg-[#028b08] text-white rounded-xl flex flex-col justify-center transition-all shadow active:scale-[0.99] select-none text-left"
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="text-xs font-mono font-bold">Beli via Tokopedia</span>
                                <ExternalLink className="w-4 h-4 shrink-0" />
                              </div>
                              <span className="text-xs text-[#f2fcf1] font-sans font-medium mt-0.5 block leading-none">
                                🚚 Potensi Diskon s.d 15% + Gratis Ongkir Standard
                              </span>
                            </a>
                            
                            <a
                              href={selectedItem.shopeeUrl}
                              target="_blank"
                              rel="no-referrer"
                              className="px-4 py-3 bg-[#f53d2d] hover:bg-[#d82a1b] text-white rounded-xl flex flex-col justify-center transition-all shadow active:scale-[0.99] select-none text-left"
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="text-xs font-mono font-bold">Beli via Shopee</span>
                                <ExternalLink className="w-4 h-4 shrink-0" />
                              </div>
                              <span className="text-xs text-[#fff5f4] font-sans font-medium mt-0.5 block leading-none">
                                ⚡ Potensi Cashback s.d 20K + Koin Gratis Ongkir XTRA
                              </span>
                            </a>
                          </div>

                          {/* Detailed Affiliate Link Disclaimer explicitly defined */}
                          <p className="text-xs text-neutral-500 font-mono italic leading-[15px] border-l-2 border-neutral-300 pl-2 mt-2 select-text">
                            <strong>🚨 Pengungkapan Affiliate Toko:</strong> Tautan Tokopedia &amp; Shopee di atas merupakan partner komersial resmi Norinoya. Tim kami akan memperoleh komisi rujukan kecil dari pihak marketplace jika Anda menyelesaikan pembelian sukses dalam sesi ini, tanpa membebani biaya tambahan sepeser pun. Terimakasih telah berkontribusi melestarikan kelangsungan tinjauan ulasan Norinoya!
                          </p>

                          {/* Built-in local Simulation Box */}
                          <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl space-y-3 shadow-xs">
                            <div className="flex justify-between items-center border-b border-neutral-150 pb-2">
                              <div>
                                <h6 className="font-extrabold text-neutral-900 text-xs">Simulasi Pengiriman Langsung Norinoya</h6>
                                <p className="text-xs text-neutral-500 font-mono">Simulasi pengiriman instan</p>
                              </div>
                              <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-150">
                                Aktif
                              </span>
                            </div>

                            {!successCheckedOut ? (
                              <div className="space-y-2 text-xs">
                                <p className="text-neutral-600 leading-relaxed text-xs font-sans">
                                  Gunakan simulator ini jika Anda ingin tim kurasi menyiapkan buku lebih awal, mengoleskan anti-static dust repeller, dan membungkus ganda sebelum Anda checkout via link marketplace resmi di atas.
                                </p>
                                <button
                                  onClick={() => setSuccessCheckedOut(true)}
                                  className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-transform"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  Booking Slot Kurasi Sekarang
                                </button>
                              </div>
                            ) : (
                              <div className="text-center py-3 space-y-2 bg-white border border-neutral-200 rounded-xl p-3">
                                <CheckCircle className="w-7 h-7 text-[#03ac0e] mx-auto animate-bounce" />
                                <div className="space-y-0.5">
                                  <p className="font-extrabold text-neutral-950 text-xs">Simulasi Booking Berhasil!</p>
                                  <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                                    Slot pembungkusan ganda telah diprioritaskan! Anda dapat melanjutkan checkout di Tokopedia atau Shopee resmi di atas. Beritahu kurator kami via e-commerce jika Anda telah memesan simulator ini.
                                  </p>
                                </div>
                                <button
                                  onClick={() => setSuccessCheckedOut(false)}
                                  className="text-xs underline font-mono text-neutral-400 hover:text-neutral-950 transition-colors"
                                >
                                  Atur Ulang Simulasi
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Database connection section */}
                      {selectedItem.linkedComicId && (
                        <div className="bg-neutral-900 text-white rounded-2xl p-4.5 space-y-3 shadow-md border border-neutral-800">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider font-mono">Daftar Rilisan &amp; Database Norinoya</h5>
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                            Buku edisi kurasi di atas tergabung dalam seri ulasan <strong>{selectedItem.comicTitle}</strong>. Ingin membandingkan semua edisi rilisannya lengkap? Cari tahu komparasi fisik versi reguler cetakan kertas koran lama vs edisi premium tebal jilid gabungan (bind-up) terbaru di database lengkap kami!
                          </p>
                          <button
                            onClick={() => {
                              if (onNavigateToDatabase && selectedItem.linkedComicId) {
                                onNavigateToDatabase(selectedItem.linkedComicId);
                                setSelectedItem(null); // Close modal
                              }
                            }}
                            className="w-full py-2.5 bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1.5 text-center cursor-pointer shadow transition-all active:scale-[0.99]"
                          >
                            <span>Daftar Lengkap Edisi {selectedItem.comicTitle} di Database &rarr;</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Metadata Column */}
                  <div className="md:col-span-4 space-y-4 text-xs font-sans">
                    {/* General specification statistics */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-xs">
                      <h5 className="font-extrabold text-neutral-900 border-b border-neutral-250 pb-1.5 uppercase text-xs font-mono tracking-widest">
                        Rincian Spesifikasi
                      </h5>
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <span className="text-neutral-400 block text-xs font-mono">JUDUL BUKU KANJI/RI:</span>
                          <span className="text-neutral-900 font-extrabold">{selectedItem.comicTitle}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-xs font-mono">VOLUME ITEM:</span>
                          <span className="text-neutral-900 font-extrabold">Jilid {selectedItem.volumeNumber}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-xs font-mono">KONDISI KURATOR:</span>
                          <span className="text-neutral-900 font-extrabold">{selectedItem.conditionRating} / 10</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-xs font-mono">HARGA RESMI KOMIK BARU:</span>
                          <span className="text-neutral-450 line-through">Rp {selectedItem.originalPrice.toLocaleString('id-ID')}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-xs font-mono">HARGA PRE-OWNED DISKON:</span>
                          <span className="text-neutral-950 font-black text-xs">Rp {selectedItem.salePrice.toLocaleString('id-ID')}</span>
                        </div>
                        {modalLinkedComic && (modalLinkedComic.authorStory || modalLinkedComic.authorArt) && (
                          <div>
                            <span className="text-neutral-400 block text-xs font-mono">AUTHOR:</span>
                            <span className="text-neutral-900 font-extrabold pb-0.5">
                              {getAuthorLabel(modalLinkedComic).replace(/^\(|\)$/g, '')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quality statement widget */}
                    <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl p-3.5 space-y-2">
                      <span className="text-xs font-mono tracking-widest text-neutral-450 uppercase block text-center mb-0.5">STANDAR PACKING</span>
                      <p className="text-xs text-neutral-500 font-sans leading-relaxed text-center">
                        Setiap pengiriman buku bekas dari Norinoya dilapisi karton tebal padat, bubble wrap tebal, dan selotip fragile merah. Dijamin aman dari benturan ekspedisi.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox High-Resolution Immersive Zoom Overlay */}
      <AnimatePresence>
        {isLightboxOpen && selectedItem && (
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
                <span className="font-mono text-xs text-neutral-400 block tracking-widest uppercase">DETAIL FOTO KURASI NORINOYA</span>
                <h4 className="font-sans font-extrabold text-sm">
                  {selectedItem.comicTitle} (Vol. {selectedItem.volumeNumber})
                </h4>
              </div>
              <button 
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 border border-neutral-800 rounded-full flex items-center justify-center text-white bg-neutral-905 hover:bg-neutral-850 transition-colors uppercase font-mono text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Immersive Image Display Frame */}
            <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-center items-center py-4 relative">
              <img 
                src={selectedItem.carouselImages ? selectedItem.carouselImages[activeSlideIndex] : selectedItem.coverImage} 
                alt="lightbox-zoom"
                referrerPolicy="no-referrer"
                className="max-h-[70vh] md:max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-neutral-800"
                onClick={(e) => e.stopPropagation()}
              />
              <p className="text-white text-xs font-mono font-bold tracking-wide mt-4 bg-neutral-900 border border-neutral-850 px-3.5 py-1.5 rounded-lg text-center">
                📷 {selectedItem.carouselLabels ? selectedItem.carouselLabels[activeSlideIndex] : 'Review Detail Image'}
              </p>
            </div>

            {/* Navigation assist info */}
            <div className="text-center font-mono text-xs text-neutral-500 pb-2">
              Klik di luar foto atau klik tombol silang (✕) untuk kembali ke detail buku.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
