import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, Heart, Repeat2, Share2, Search, Tag, Sparkles, 
  AlertCircle, ArrowLeft, Send, Shuffle, Check, CheckCircle, Bookmark, Copy, Globe 
} from 'lucide-react';
import { NEWS_UPDATES } from '../data/mockData';
import { NewsUpdate } from '../types';

// Anime-themed anonymous handles to make anonymous posting engaging!
const ANIME_HANDLES = [
  { name: 'Wibu_Ganteng', handle: 'wibu_premium', letter: 'W', color: 'bg-indigo-600 text-white' },
  { name: 'Kolektor_Manga_Mulus', handle: 'kertas_acid_free', letter: 'K', color: 'bg-emerald-600 text-white' },
  { name: 'Pecinta_Light_Novel', handle: 'ln_enjoyer_ri', letter: 'P', color: 'bg-amber-600 text-white' },
  { name: 'Anya_Spy_Fans', handle: 'anya_waku_waku', letter: 'A', color: 'bg-rose-500 text-white' },
  { name: 'Frieren_Melankolis', handle: 'frieren_elf_sedih', letter: 'F', color: 'bg-sky-500 text-white' },
  { name: 'WibuWarkop', handle: 'kopihitam_wibu', letter: 'W', color: 'bg-teal-600 text-white' },
  { name: 'OtakuMulus', handle: 'buku_segel_enjoyer', letter: 'O', color: 'bg-purple-600 text-white' },
];

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface Poll {
  question: string;
  options: PollOption[];
}

interface QuickReaction {
  id: string;
  emoji: string;
  label: string;
  count: number;
}

interface AnonymousReply {
  id: string;
  authorName: string;
  authorHandle: string;
  avatarLetter: string;
  avatarColor: string;
  timestamp: string;
  content: string;
  likes: number;
}

const DEFAULT_POLLS: Record<string, Poll> = {
  'news-1': {
    question: 'Apakah kamu akan "double-buy" (beli lagi) Frieren versi kertas premium baru ini?',
    options: [
      { id: 'opt-1-1', label: 'Ya! Demi kerapihan rak buku & koleksi jangka panjang', votes: 142 },
      { id: 'opt-1-2', label: 'Ragu, mungkin jual edisi lama dulu di Konotasi Store', votes: 58 },
      { id: 'opt-1-3', label: 'Tidak, baca sekali saja edisi lama sudah cukup', votes: 89 },
    ]
  },
  'news-2': {
    question: 'Mana yang mau kamu amankan lebih dulu minggu ini?',
    options: [
      { id: 'opt-2-1', label: 'Spy x Family Vol 11 (Anya & Bond!)', votes: 215 },
      { id: 'opt-2-2', label: 'Blue Lock Vol 15 Reguler', votes: 110 },
      { id: 'opt-2-3', label: 'Dua-duanya dong, dompet siap tiris', votes: 184 },
    ]
  },
  'news-3': {
    question: 'Menurutmu, idealnya harga komik premium di Indonesia berkisar berapa?',
    options: [
      { id: 'opt-3-1', label: 'Rp 35.000 - Rp 40.000 (Standar pas di dompet)', votes: 312 },
      { id: 'opt-3-2', label: 'Rp 45.000 - Rp 50.000 (Asal bookpaper mulus & tebal)', votes: 245 },
      { id: 'opt-3-3', label: 'Lebih dari Rp 80.000 (Khusus Hardcover/Bindup premium)', votes: 93 },
    ]
  },
  'news-4': {
    question: 'Seberapa sering kamu berburu komik seken bekas ulasan?',
    options: [
      { id: 'opt-4-1', label: 'Sering banget, cari diskon rilis mulus', votes: 76 },
      { id: 'opt-4-2', label: 'Jarang, lebih suka bau buku baru bersegela', votes: 154 },
      { id: 'opt-4-3', label: 'Kalo ada judul incaran terbitan premium aja sih', votes: 98 },
    ]
  }
};

const DEFAULT_REACTIONS: Record<string, QuickReaction[]> = {
  'news-1': [
    { id: 'fire', emoji: '🔥', label: 'Hype!', count: 48 },
    { id: 'heart_eyes', emoji: '😍', label: 'Mau Banget', count: 32 },
    { id: 'sad', emoji: '😭', label: 'Dompet Menangis', count: 19 },
    { id: 'party', emoji: '🎉', label: 'Akhirnya!', count: 41 }
  ],
  'news-2': [
    { id: 'fire', emoji: '🔥', label: 'Gas Beli', count: 28 },
    { id: 'heart', emoji: '❤️', label: 'Suka', count: 44 },
    { id: 'thinking', emoji: '🤔', label: 'Mikir Dulu', count: 12 },
    { id: 'baper', emoji: '🌸', label: 'Anya Imut', count: 52 }
  ],
  'news-3': [
    { id: 'mind_blown', emoji: '🤯', label: 'Baru Tahu', count: 85 },
    { id: 'glasses', emoji: '🤓', label: 'Edukatiiif', count: 104 },
    { id: 'thumbs_up', emoji: '👍', label: 'Sangat Setuju', count: 62 },
    { id: 'save', emoji: '💾', label: 'Simpan Info', count: 41 }
  ],
  'news-4': [
    { id: 'shock', emoji: '😮', label: 'Murah Banget', count: 19 },
    { id: 'cart', emoji: '🛒', label: 'Siap Checkout', count: 25 },
    { id: 'cry', emoji: '🥺', label: 'Ketinggalan', count: 14 },
    { id: 'smile', emoji: '😊', label: 'Pantau Terus', count: 30 }
  ]
};

const DEFAULT_REPLIES: Record<string, AnonymousReply[]> = {
  'news-1': [
    {
      id: 'rep-1-1',
      authorName: 'Erlang_Nezuko',
      authorHandle: 'erlang_gzz',
      avatarLetter: 'E',
      avatarColor: 'bg-indigo-500 text-white',
      timestamp: '15 menit yang lalu',
      content: 'NAH INI DIA! Yang edisi lama dulu gampang kuning sekutu rayap karena emang Akasha awal-awal belum serajin sekarang ganti bookpaper premium. Cetakan baru auto khilaf beli ulang.',
      likes: 12
    },
    {
      id: 'rep-1-2',
      authorName: 'MangaEnjoyerID',
      authorHandle: 'manga_wibu_mulus',
      avatarLetter: 'M',
      avatarColor: 'bg-emerald-500 text-white',
      timestamp: '1 jam yang lalu',
      content: 'Frieren anime ratingnya tinggi banget, manganya emang layak dibuat edisi super awet bebas asam. Makasih infonya min!! Cetakan lama saya mau saya museumkan aja wkwk.',
      likes: 8
    }
  ],
  'news-2': [
    {
      id: 'rep-2-1',
      authorName: 'SpyFamilyHusband',
      authorHandle: 'loid_forger_indo',
      avatarLetter: 'L',
      avatarColor: 'bg-amber-500 text-white',
      timestamp: '30 menit yang lalu',
      content: 'Anya Vol 11 akhirnya terbit jugaaa! Siap gas gramedia besok sore abis gajian 🔥 Tutup mata dapet cashback shopee wkwk.',
      likes: 5
    },
    {
      id: 'rep-2-2',
      authorName: 'IsagiEgoist',
      authorHandle: 'egoist_bola',
      avatarLetter: 'I',
      avatarColor: 'bg-blue-500 text-white',
      timestamp: '1 jam yang lalu',
      content: 'Blue Lock Vol 15 reg akhirnya keluar dari gua, mau liat gol Isagi yang paling gila di arc ini.',
      likes: 14
    }
  ],
  'news-3': [
    {
      id: 'rep-3-1',
      authorName: 'KolektorGarisKeras',
      authorHandle: 'manga_pedia_id',
      avatarLetter: 'K',
      avatarColor: 'bg-rose-500 text-white',
      timestamp: '4 jam yang lalu',
      content: 'Info super edukatif! Memang bener bgt, komik terbitan jadul bener2 kuning pekat dan gampang rapuh. Untung sekarang publisher lokal makin melek kualitas kertas premium bebas asam.',
      likes: 24
    },
    {
      id: 'rep-3-2',
      authorName: 'Booknerd_Rizal',
      authorHandle: 'rizal_baca_terus',
      avatarLetter: 'R',
      avatarColor: 'bg-sky-500 text-white',
      timestamp: '8 jam yang lalu',
      content: 'Makanya saya ga pernah pelit keluar uang 45rb buat akasha/bindup, karena kerasa kualitasnya di tangan pas dibaca tidak gampang lecek maupun robek.',
      likes: 15
    }
  ],
  'news-4': [
    {
      id: 'rep-4-1',
      authorName: 'Fajar_Gamer_Book',
      authorHandle: 'fajar_gaming_book',
      avatarLetter: 'F',
      avatarColor: 'bg-purple-500 text-white',
      timestamp: '1 jam yang lalu',
      content: 'Yah telat Solo Leveling-nya udah sold out padahal pengen banget itu harganya miring mulus seken ulasan 😭 Rilisan berikutnya mantau grup wa aja lah biar cepet.',
      likes: 3
    }
  ]
};

interface NewsFeedProps {
  selectedNewsId?: string | null;
  setSelectedNewsId?: (id: string | null) => void;
}

export default function NewsFeed({ selectedNewsId, setSelectedNewsId }: NewsFeedProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Core Twitter Likes & Shares (Global Feed State)
  const [likes, setLikes] = useState<Record<string, number>>({
    'news-1': 148,
    'news-2': 94,
    'news-3': 282,
    'news-4': 44,
  });
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  const [shares, setShares] = useState<Record<string, number>>({
    'news-1': 19,
    'news-2': 32,
    'news-3': 85,
    'news-4': 8,
  });
  const [hasShared, setHasShared] = useState<Record<string, boolean>>({});

  // 1. Detailed X View States (synchronized with parent state if provided)
  const [localSelectedPost, setLocalSelectedPost] = useState<NewsUpdate | null>(null);

  const selectedPost = useMemo(() => {
    if (selectedNewsId !== undefined) {
      if (selectedNewsId === null) return null;
      return NEWS_UPDATES.find(post => post.id === selectedNewsId) || null;
    }
    return localSelectedPost;
  }, [selectedNewsId, localSelectedPost]);

  const setSelectedPost = (post: NewsUpdate | null) => {
    if (setSelectedNewsId) {
      setSelectedNewsId(post ? post.id : null);
    } else {
      setLocalSelectedPost(post);
    }
  };
  
  // 2. Poll State (Unique to each post)
  const [polls, setPolls] = useState<Record<string, Poll>>(DEFAULT_POLLS);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({}); // Mapping: postId -> optionId voted

  // 3. Quick Reactions State
  const [reactions, setReactions] = useState<Record<string, QuickReaction[]>>(DEFAULT_REACTIONS);
  const [userReactions, setUserReactions] = useState<Record<string, Record<string, boolean>>>({}); // postId -> reactionId -> hasClicked

  // 4. Replies Thread State (Persists in session for high engagement!)
  const [replies, setReplies] = useState<Record<string, AnonymousReply[]>>(DEFAULT_REPLIES);

  // 5. Typing Anonymous Reply Variables
  const [anonHandleIndex, setAnonHandleIndex] = useState<number>(0);
  const [replyInput, setReplyInput] = useState<string>('');
  const [replyDisplayName, setReplyDisplayName] = useState<string>(''); // custom name option
  const [isFollowing, setIsFollowing] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newVal = !hasLiked[id];
    setHasLiked({ ...hasLiked, [id]: newVal });
    setLikes({ ...likes, [id]: likes[id] + (newVal ? 1 : -1) });
  };

  const handleShare = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newVal = !hasShared[id];
    setHasShared({ ...hasShared, [id]: newVal });
    setShares({ ...shares, [id]: shares[id] + (newVal ? 1 : -1) });
    if (newVal) {
      triggerToast('🔁 Postingan ini berhasil di-Repost ke feed Anda!');
    }
  };

  const handleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newVal = !bookmarks[id];
    setBookmarks({ ...bookmarks, [id]: newVal });
    triggerToast(newVal ? '🔖 Ditambahkan ke Bookmark Anda' : '🔖 Dihapus dari Bookmark');
  };

  const handleVote = (postId: string, optionId: string) => {
    if (userVotes[postId]) return; // prevent voting twice

    setUserVotes({ ...userVotes, [postId]: optionId });
    
    // Increment votes
    const updatedPoll = { ...polls[postId] };
    updatedPoll.options = updatedPoll.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    setPolls({ ...polls, [postId]: updatedPoll });
    triggerToast('🗳️ Suara Anda berhasil dikirim secara anonim!');
  };

  const handleReactionClick = (postId: string, reactionId: string) => {
    const postUserReactions = userReactions[postId] || {};
    const hasReacted = postUserReactions[reactionId];
    
    // Toggle reaction
    const updatedUserReactionsForPost = { ...postUserReactions, [reactionId]: !hasReacted };
    setUserReactions({ ...userReactions, [postId]: updatedUserReactionsForPost });

    const postReactions = reactions[postId] || [];
    const updatedReactions = postReactions.map(r => {
      if (r.id === reactionId) {
        return { ...r, count: r.count + (!hasReacted ? 1 : -1) };
      }
      return r;
    });

    setReactions({ ...reactions, [postId]: updatedReactions });
    triggerToast(!hasReacted ? `Ditambahkan reaksi ${reactionId.toUpperCase()}!` : `Dihapus reaksi ${reactionId.toUpperCase()}`);
  };

  const handlePostReplySubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    const chosenAnon = ANIME_HANDLES[anonHandleIndex];
    const finalDisplayName = replyDisplayName.trim() || chosenAnon.name;
    const finalHandleName = chosenAnon.handle;

    const newReplyObj: AnonymousReply = {
      id: `anon-user-reply-${Date.now()}`,
      authorName: finalDisplayName,
      authorHandle: finalHandleName,
      avatarLetter: chosenAnon.letter,
      avatarColor: chosenAnon.color,
      timestamp: 'Baru saja',
      content: replyInput,
      likes: 0
    };

    const currentPostReplies = replies[postId] || [];
    setReplies({
      ...replies,
      [postId]: [newReplyObj, ...currentPostReplies]
    });

    setReplyInput('');
    triggerToast('💬 Balasan anonim Anda diposting di Thread ini!');
  };

  const toggleLikeReply = (postId: string, replyId: string) => {
    const currentPostReplies = replies[postId] || [];
    const updatedReplies = currentPostReplies.map(r => {
      if (r.id === replyId) {
        return { ...r, likes: r.likes + 1 };
      }
      return r;
    });
    setReplies({ ...replies, [postId]: updatedReplies });
    triggerToast('❤️ Menyukai komentar!');
  };

  const handleCopyLink = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(`https://norinoya.moe/news/${id}`);
    triggerToast('🔗 Link Twitter postingan disalin ke Clipboard!');
  };

  const randomizeHandle = () => {
    const nextIdx = (anonHandleIndex + 1) % ANIME_HANDLES.length;
    setAnonHandleIndex(nextIdx);
    triggerToast(`🎭 Identitas Anda berganti: @${ANIME_HANDLES[nextIdx].handle}`);
  };

  const categories = [
    { value: 'all', label: 'Semua Berita' },
    { value: 'rilisan', label: 'Rilisan Baru' },
    { value: 'cetakan_ulang', label: 'Cetakan Ulang' },
    { value: 'edukasi', label: 'Edukasi Kertas/Komik' },
    { value: 'promo', label: 'Promo @konotasi' }
  ];

  const filteredFeed = NEWS_UPDATES.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.hashTags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4" id="news-feed-root">
      
      {/* Dynamic Toast Alert Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-950 font-mono text-white text-[11px] font-bold px-5 py-2.5 rounded-2xl z-50 shadow-2xl flex items-center gap-2 border border-neutral-800"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedPost ? (
          /* ================================= FEED VIEW ================================= */
          <motion.div
            key="feed-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Search and Quick Categories */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-b border-neutral-200 pb-4">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cari info rilisan, hashtag, penerbit (@m&c, elex)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white hover:bg-neutral-50/50 focus:bg-white border border-neutral-200 rounded-xl outline-none transition-all focus:border-neutral-950 font-sans shadow-xs"
                />
              </div>
              
              {/* AdSense Top Header banner for news section */}
              <div className="text-xs bg-neutral-100 text-neutral-500 rounded-xl px-3 py-1.5 font-mono uppercase tracking-widest text-center self-stretch md:self-auto border border-neutral-200 shadow-xs">
                ADSENSE AD SLOT: 728x90 LEADERSHIP
              </div>
            </div>

            {/* category quick tags */}
            <div className="flex overflow-x-auto gap-1.5 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap whitespace-nowrap scrollbar-none [scrollbar-width:none]">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all cursor-pointer inline-block shrink-0 ${
                    selectedCategory === cat.value
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs font-bold'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 active:bg-neutral-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Twitter micro layout style */}
            <div className="grid md:grid-cols-12 gap-5">
              <div className="md:col-span-8 space-y-4">
                <div className="bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-sans">
                  <span className="flex items-center gap-1.5 font-medium ml-1">
                    <Globe className="w-3.5 h-3.5 text-neutral-500" />
                    Feed Berita Komik Terintegrasi (Klik postingan balasan untuk masuk thread diskusi!)
                  </span>
                  <span className="font-mono text-xs text-neutral-400 font-bold uppercase tracking-wider">Twitter-style list</span>
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredFeed.length > 0 ? (
                    filteredFeed.map((post) => {
                      const postReplies = replies[post.id] || [];
                      const replyCount = postReplies.length;

                      return (
                        <motion.div
                          key={post.id}
                          layout
                          onClick={() => setSelectedPost(post)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="bg-white border border-[#EFEFEF] hover:border-neutral-400 p-4 rounded-2xl space-y-3.5 shadow-xs cursor-pointer hover:shadow-md transition-all group relative"
                        >
                          <div className="flex items-start gap-3">
                            {/* User Profile Avatar */}
                            <div className="w-10 h-10 border border-neutral-200 rounded-full flex items-center justify-center font-mono font-bold bg-neutral-900 text-white text-xs shrink-0 shadow-xs relative">
                              N
                              <span className="absolute -bottom-1 -right-1 bg-sky-500 border-2 border-white rounded-full w-4 h-4 flex items-center justify-center text-[7px] text-white font-sans font-black">✓</span>
                            </div>

                            <div className="space-y-1.5 flex-1 text-left">
                              {/* Name tags */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-extrabold text-neutral-950 text-xs tracking-tight group-hover:underline">
                                  {post.displayName}
                                </span>
                                <span className="text-neutral-500 font-mono text-xs">@{post.username}</span>
                                <span className="text-neutral-300 text-xs">•</span>
                                <span className="text-neutral-500 font-mono text-xs">{post.timestamp}</span>
                              </div>

                              {/* Paragraph content */}
                              <p className="text-sm text-neutral-800 whitespace-pre-line leading-relaxed pb-0.5 select-text font-sans">
                                {post.content}
                              </p>

                              {/* Inline simple poll preview if any */}
                              {polls[post.id] && (
                                <div className="p-3 bg-neutral-50/60 rounded-xl border border-neutral-200 mt-2 space-y-2">
                                  <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block">🗳️ Anon X-Poll</span>
                                  <p className="font-sans font-bold text-xs text-neutral-900 leading-tight">{polls[post.id].question}</p>
                                  <div className="space-y-1">
                                    {polls[post.id].options.map(opt => (
                                      <div key={opt.id} className="text-xs text-neutral-600 flex justify-between items-center bg-white border border-neutral-100 rounded-lg px-2.5 py-1 font-mono">
                                        <span>{opt.label.substring(0, 32)}...</span>
                                        <span className="font-bold text-neutral-950">{opt.votes} vote</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Attached Image with tap-to-expand */}
                              {post.attachedImage && (
                                <div className="mt-2.5 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 aspect-[16/10] max-h-64 relative group/img">
                                  <img
                                    src={post.attachedImage}
                                    alt="Visual Rilisan"
                                    referrerPolicy="no-referrer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveImage(post.attachedImage || null);
                                    }}
                                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover/img:scale-[1.01]"
                                  />
                                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-xs font-mono px-2.5 py-1 rounded-xl pointer-events-none select-none shadow-xs">
                                    Zoom 🔍
                                  </div>
                                </div>
                              )}

                              {/* Category and Tags */}
                              <div className="flex flex-wrap gap-1.5 items-center pt-2">
                                <span className="inline-flex items-center gap-1 text-xs font-mono tracking-widest bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200 uppercase font-bold">
                                  <Tag className="w-2 h-2 text-neutral-505" />
                                  {post.category.replace('_', ' ')}
                                </span>
                                {post.hashTags.map(tag => (
                                  <span 
                                    key={tag} 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSearchTerm(tag);
                                    }}
                                    className="text-xs text-[#004e92] font-mono font-bold hover:underline cursor-pointer"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>

                              {/* Optional Interactive Affiliate/Direct Link */}
                              {post.affiliateLink && (
                                <div className="mt-3.5 pt-3 flex border-t border-neutral-100 justify-start">
                                  <a
                                    href={post.affiliateLink.url}
                                    target={post.affiliateLink.url.startsWith('http') ? '_blank' : '_self'}
                                    rel="no-referrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-400 bg-neutral-50 hover:bg-neutral-100 transition-colors text-xs font-mono font-bold text-neutral-900 rounded-xl shadow-xs"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    <span>{post.affiliateLink.label} &rarr;</span>
                                  </a>
                                </div>
                              )}

                              {/* Action buttons with Micro indicators */}
                              <div className="flex items-center gap-6 text-neutral-550 pt-3 border-t border-neutral-100 mt-4 justify-between max-w-md">
                                <button className="flex items-center gap-1.5 hover:text-neutral-950 text-xs transition-colors cursor-pointer font-bold">
                                  <MessageCircle className="w-4 h-4 text-neutral-600" />
                                  <span className="font-mono">{replyCount > 0 ? `${replyCount} Komentar` : 'Tanggapi'}</span>
                                </button>
                                
                                <button 
                                  onClick={(e) => handleShare(post.id, e)}
                                  className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                                    hasShared[post.id] ? 'text-green-600 font-extrabold' : 'hover:text-green-600 font-bold'
                                  }`}
                                >
                                  <Repeat2 className="w-4 h-4" />
                                  <span className="font-mono">{shares[post.id]}</span>
                                </button>

                                <button 
                                  onClick={(e) => handleLike(post.id, e)}
                                  className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                                    hasLiked[post.id] ? 'text-red-600 font-extrabold' : 'hover:text-red-500 font-bold'
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${hasLiked[post.id] ? 'fill-red-600 text-red-600' : 'text-neutral-600'}`} />
                                  <span className="font-mono">{likes[post.id]}</span>
                                </button>

                                <button 
                                  onClick={(e) => handleBookmark(post.id, e)}
                                  className={`flex items-center gap-1.5 text-xs hover:text-blue-600 transition-colors cursor-pointer font-bold ${
                                    bookmarks[post.id] ? 'text-blue-600' : ''
                                  }`}
                                >
                                  <Bookmark className={`w-4 h-4 ${bookmarks[post.id] ? 'fill-blue-600 text-blue-600' : 'text-neutral-600'}`} />
                                  <span className="sr-only">Bookmark</span>
                                </button>

                                <button 
                                  onClick={(e) => handleCopyLink(post.id, e)}
                                  className="flex items-center hover:text-neutral-950 text-xs transition-colors cursor-pointer font-bold p-1"
                                >
                                  <Share2 className="w-4 h-4 text-neutral-600" />
                                </button>
                              </div>

                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="p-8 border border-dashed border-neutral-250 text-center rounded-2xl w-full">
                      <AlertCircle className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                      <h4 className="font-bold text-neutral-800 font-sans text-xs">Tidak ada berita ditemukan</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">Coba sesuaikan filter kategori Anda atau gunakan kata kunci pencarian berbeda.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar recommendations / widget */}
              <div className="md:col-span-4 space-y-4">
                <div className="bg-white border border-neutral-200 p-4 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="font-extrabold font-sans text-xs text-neutral-950 uppercase tracking-widest">
                      Trending Terhangat
                    </h3>
                  </div>
                  <div className="space-y-3.5">
                    <div className="text-xs space-y-1 text-left">
                      <span className="text-neutral-400 font-mono uppercase text-xs font-bold tracking-wider">#1 Edukasi Kertas • Populer</span>
                      <p className="font-bold text-neutral-950 cursor-pointer hover:underline text-xs leading-snug" onClick={() => {setSearchTerm("EdukasiManga")}}>
                        Mengapa volume komik premium harganya lebih mahal dibanding kertas koran biasa?
                      </p>
                      <p className="text-neutral-500 font-mono text-xs font-bold uppercase tracking-wider">1.2K Tweets • Baca Info</p>
                    </div>
                    <div className="border-t border-neutral-150 my-1"></div>
                    <div className="text-xs space-y-1 text-left">
                      <span className="text-neutral-400 font-mono uppercase text-xs font-bold tracking-wider">#2 Cetakan Ulang • Trending</span>
                      <p className="font-bold text-neutral-950 cursor-pointer hover:underline text-xs leading-snug" onClick={() => {setSearchTerm("Frieren")}}>
                        Akasha Frieren Volume 1-4 Rilisan Baru Bebas Asam
                      </p>
                      <p className="text-neutral-500 font-mono text-xs font-bold uppercase tracking-wider">842 Tweets • Intip Thread</p>
                    </div>
                  </div>
                </div>

                {/* Sidebar Google Ads Banner Rectangle style */}
                <div className="bg-neutral-50 border border-dashed border-neutral-300 p-4 rounded-2xl text-center space-y-2 shadow-xs">
                  <span className="text-xs font-mono tracking-widest text-neutral-400 block uppercase font-bold">Google Advertisements Sponsor</span>
                  <div className="h-44 flex flex-col items-center justify-center border border-neutral-200 bg-white rounded-xl text-xs text-neutral-400 font-mono p-3 uppercase leading-relaxed font-bold shadow-xs">
                    <span className="text-amber-500 text-lg">📢</span>
                    <span>300 x 250 Rect Ad Slot</span>
                    <span className="text-xs text-neutral-305 mt-1">CPC AdSense Network</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ================================= TWITTER-STYLE DETAIL VIEW (NO LOGIN ENGAGEMENT ENGINE) ================================= */
          <motion.div
            key="details-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5 text-left max-w-2xl mx-auto focus:outline-none"
          >
            {/* Thread Back Navigation Bar */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <button
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-350 hover:bg-neutral-100 rounded-xl text-neutral-900 transition-all font-sans font-bold text-xs cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-900" />
                <span>Kembali Ke Feed</span>
              </button>
              <div className="text-center">
                <h4 className="font-sans font-extrabold text-xs text-neutral-950 leading-tight">Postingan Thread</h4>
                <p className="font-mono text-xs text-neutral-400 capitalize uppercase tracking-wider">{selectedPost.category.replace('_', ' ')} News</p>
              </div>
              <div className="w-20 sm:block hidden"></div>
            </div>

            {/* MAIN TWITTER TWEET CARD */}
            <div className="bg-white border border-[#EFEFEF] p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm relative">
              
              {/* Profile Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 border border-neutral-200 rounded-full flex items-center justify-center font-mono font-bold bg-neutral-900 text-white text-sm shrink-0 shadow-xs relative">
                    N
                    <span className="absolute -bottom-1 -right-1 bg-sky-500 border border-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-xs text-white font-black font-sans shadow-xs">✓</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold text-neutral-950 text-sm tracking-tight leading-none block">
                        {selectedPost.displayName}
                      </span>
                      <span className="bg-sky-50 text-sky-700 text-xs font-mono font-bold tracking-wider px-1 py-0.5 rounded border border-sky-100 uppercase">OFFICIAL</span>
                    </div>
                    <span className="text-neutral-400 font-mono text-xs block pt-0.5">@{selectedPost.username}</span>
                  </div>
                </div>

                {/* Follow Button engagement bait */}
                <button
                  onClick={() => setIsFollowing({ ...isFollowing, [selectedPost.id]: !isFollowing[selectedPost.id] })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-black transition-all cursor-pointer shadow-xs ${
                    isFollowing[selectedPost.id]
                      ? 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                      : 'bg-neutral-950 hover:bg-neutral-850 text-white'
                  }`}
                >
                  {isFollowing[selectedPost.id] ? 'Mengikuti' : 'Ikuti'}
                </button>
              </div>

              {/* Core Tweet Body with fine display typography */}
              <p className="text-sm md:text-base text-neutral-950 font-serif leading-relaxed font-normal whitespace-pre-line select-text">
                {selectedPost.content}
              </p>

              {/* Attached Tweet Image */}
              {selectedPost.attachedImage && (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 aspect-[16/10] max-h-80 relative group">
                  <img
                    src={selectedPost.attachedImage}
                    alt="Visual Rilisan Premium"
                    referrerPolicy="no-referrer"
                    onClick={() => setActiveImage(selectedPost.attachedImage || null)}
                    className="w-full h-full object-cover cursor-zoom-in"
                  />
                </div>
              )}

              {/* Tags & Time stamp metadata bar */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="inline-flex items-center gap-1 text-[8.5px] font-mono tracking-widest bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-250 uppercase font-bold">
                    <Tag className="w-2 h-2 text-neutral-500" />
                    {selectedPost.category.replace('_', ' ')}
                  </span>
                  {selectedPost.hashTags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-[10px] text-[#004e92] font-mono font-extrabold hover:underline cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="text-[10px] text-neutral-400 font-mono flex flex-wrap gap-1 items-center">
                  <span>10:42 PM</span>
                  <span>•</span>
                  <span>30 Mei 2026</span>
                  <span>•</span>
                  <span className="text-neutral-900 font-bold flex items-center gap-1">
                    <Globe className="w-3 h-3 inline text-emerald-600" />
                    Semua Orang Dapat Membaca
                  </span>
                </div>
              </div>

              {/* STATS COUNT BAR */}
              <div className="border-t border-b border-neutral-150 py-2.5 flex items-center gap-4 text-[11px] font-mono font-medium text-neutral-500 font-bold">
                <span>
                  <strong className="text-neutral-950 font-extrabold">{shares[selectedPost.id]}</strong> Repost
                </span>
                <span>
                  <strong className="text-neutral-950 font-extrabold">{likes[selectedPost.id]}</strong> Suka
                </span>
                <span>
                  <strong className="text-neutral-950 font-extrabold">2.4K</strong> Tayangan
                </span>
              </div>

              {/* CORE INTERACTIVE TWEET ACTION BUTTONS */}
              <div className="flex justify-around items-center text-neutral-500 pt-1 pb-1">
                <button className="p-2 cursor-pointer rounded-full hover:bg-neutral-100 text-neutral-650 hover:text-neutral-950 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare(selectedPost.id)}
                  className={`p-2 cursor-pointer rounded-full hover:bg-green-50 transition-colors ${
                    hasShared[selectedPost.id] ? 'text-green-600' : 'hover:text-green-600'
                  }`}
                >
                  <Repeat2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleLike(selectedPost.id)}
                  className={`p-2 cursor-pointer rounded-full hover:bg-red-50 transition-colors ${
                    hasLiked[selectedPost.id] ? 'text-red-600' : 'hover:text-red-650'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${hasLiked[selectedPost.id] ? 'fill-red-600 text-red-600' : ''}`} />
                </button>
                <button
                  onClick={() => handleBookmark(selectedPost.id)}
                  className={`p-2 cursor-pointer rounded-full hover:bg-blue-50 transition-colors ${
                    bookmarks[selectedPost.id] ? 'text-blue-600' : 'hover:text-blue-600'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${bookmarks[selectedPost.id] ? 'fill-blue-600 text-blue-600' : ''}`} />
                </button>
                <button
                  onClick={() => handleCopyLink(selectedPost.id)}
                  className="p-2 cursor-pointer rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* DYNAMIC INTERACTIVE POLL WIDGET (Engagement Monster!) */}
              {polls[selectedPost.id] && (() => {
                const curPoll = polls[selectedPost.id];
                const totalVotes = curPoll.options.reduce((sum, o) => sum + o.votes, 0);
                const hasVoted = !!userVotes[selectedPost.id];
                
                return (
                  <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50/50 space-y-3 mt-4 text-left">
                    <div className="flex justify-between items-center border-b border-neutral-150 pb-1.5">
                      <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1 text-sky-700">
                        ⚡ POLLING PENDAPAT WIBU
                      </span>
                      <span className="font-mono text-[9px] text-neutral-400 font-medium">Anonymous Vote</span>
                    </div>
                    
                    <h5 className="font-sans font-extrabold text-[#111] text-xs leading-snug">
                      {curPoll.question}
                    </h5>

                    <div className="space-y-2">
                      {curPoll.options.map(option => {
                        const optPercentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        const isSelectedByMe = userVotes[selectedPost.id] === option.id;

                        return (
                          <div key={option.id} className="relative">
                            {!hasVoted ? (
                              // Clickable voting buttons before casting vote
                              <button
                                onClick={() => handleVote(selectedPost.id, option.id)}
                                className="w-full text-left px-3.5 py-2.5 bg-white hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-350 rounded-xl text-xs font-sans font-bold text-neutral-800 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                              >
                                {option.label}
                              </button>
                            ) : (
                              // Percentage bars after voting
                              <div className="w-full border border-neutral-200 rounded-xl overflow-hidden bg-white text-xs font-sans h-10 flex items-center px-3.5 justify-between relative shadow-xs">
                                {/* The colored background percentage bar with dynamic spring scale */}
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${optPercentage}%` }}
                                  transition={{ type: 'tween', duration: 0.6 }}
                                  className={`absolute left-0 top-0 bottom-0 ${
                                    isSelectedByMe ? 'bg-sky-100/80 border-r border-sky-305' : 'bg-neutral-100 border-r border-neutral-200/50'
                                  }`}
                                />
                                
                                <span className="font-bold relative z-10 text-neutral-900 leading-none truncate pr-2 flex items-center gap-1.5">
                                  {isSelectedByMe && <span className="text-[10px] text-sky-700">✓</span>}
                                  {option.label}
                                </span>
                                <span className="font-mono font-extrabold text-[11px] text-[#111] relative z-10 pr-0.5">
                                  {optPercentage}% ({option.votes})
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-1.5 flex justify-between font-mono text-[9px] text-neutral-400 font-bold">
                      <span>Rilis Data: Norinoya Analytics</span>
                      <span>Total: {totalVotes} Suara • {hasVoted ? 'Terima kasih atas suaramu!' : 'Klik salah satu opsi untuk voting!'}</span>
                    </div>
                  </div>
                );
              })()}

              {/* DELIGHTFUL REACTION PILLS WIDGET */}
              <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50/50 space-y-2.5 mt-4 text-left">
                <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest block border-b border-neutral-150 pb-1.5">
                  ✨ Berikan Reaksi Kilat (Tanpa Login)
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(reactions[selectedPost.id] || []).map((r) => {
                    const postUserReacts = userReactions[selectedPost.id] || {};
                    const isClicked = postUserReacts[r.id];
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleReactionClick(selectedPost.id, r.id)}
                        className={`px-3 py-1.5 rounded-xl border transition-all text-xs font-sans font-bold cursor-pointer flex items-center gap-1.5 shadow-xs select-none active:scale-90 duration-100 ${
                          isClicked
                            ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-extrabold'
                            : 'bg-white hover:bg-neutral-105 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        <span className="text-base">{r.emoji}</span>
                        <span>{r.label}</span>
                        <span className="font-mono text-[10px] bg-neutral-50 px-1.5 py-0.2 rounded-md border border-neutral-100 font-black">
                          {r.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* AD BANNER SLOT PLACEHOLDER INSIDE THE TWEET DETAIL VIEW FOR ARCHITECTURAL HONESTY */}
            <div className="text-[9px] bg-neutral-50 border border-neutral-200 py-3.5 px-4 rounded-xl text-neutral-400 font-mono text-center uppercase tracking-widest flex items-center justify-center gap-2 shadow-xs">
              <span className="text-amber-500">⚡</span>
              <span>Advertisements: 468x60 Banner Slot Underneath Tweet Thread</span>
              <span className="text-amber-500">⚡</span>
            </div>

            {/* ANONYMOUS REPLY TEXT EDITOR (ENGAGEMENT ENGINE!) */}
            <div className="bg-white border border-neutral-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm text-left">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <h4 className="font-sans font-extrabold text-xs text-neutral-900 tracking-tight">
                    Tulis Balasan Terenkripsi Anonim
                  </h4>
                </div>
                {/* Randomize Identity Button */}
                <button
                  type="button"
                  onClick={randomizeHandle}
                  className="px-2.5 py-1.5 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-[9px] font-mono font-bold flex items-center gap-1 text-indigo-700 cursor-pointer shadow-xs active:scale-95 duration-100"
                >
                  <Shuffle className="w-3 h-3 text-indigo-705" />
                  <span>Random Handle</span>
                </button>
              </div>

              {/* Editor form */}
              <form onSubmit={(e) => handlePostReplySubmit(selectedPost.id, e)} className="space-y-3">
                
                {/* Auto Chosen Avatar preview bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="flex items-center gap-2.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200/60 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${ANIME_HANDLES[anonHandleIndex].color}`}>
                      {ANIME_HANDLES[anonHandleIndex].letter}
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-neutral-400 font-mono leading-none block">Daftar Anon:</span>
                      <span className="text-xs font-extrabold text-neutral-900 block font-sans">
                        @{ANIME_HANDLES[anonHandleIndex].handle}
                      </span>
                    </div>
                  </div>

                  {/* Optional Custom Display Name field with simple feedback */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Ubah nama samaran (Opsional)..."
                      value={replyDisplayName}
                      onChange={(e) => setReplyDisplayName(e.target.value)}
                      maxLength={24}
                      className="w-full px-3 py-2 text-[11px] bg-white border border-neutral-200 rounded-xl outline-none font-mono focus:border-neutral-950 shadow-xs"
                    />
                  </div>
                </div>

                {/* Main reply input body */}
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder={`Balas sebagai ${replyDisplayName || ANIME_HANDLES[anonHandleIndex].name}... sertakan opini komikmu dng sopan!`}
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    maxLength={280}
                    required
                    className="w-full px-3.5 py-3 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-950 font-sans shadow-xs"
                  />
                  <div className="absolute bottom-2.5 right-2.5 text-[9px] text-neutral-400 font-mono select-none pointer-events-none">
                    {replyInput.length}/280 haraap
                  </div>
                </div>

                {/* Action button */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[9px] text-neutral-400 font-mono leading-relaxed">
                    🔐 Komentar disimpan di tab Browser Anda.
                  </span>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 duration-100 text-white font-sans text-xs font-black rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm shadow-indigo-100 transition-transform"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Balasan</span>
                  </button>
                </div>
              </form>
            </div>

            {/* TWITTER COMMENTS THREAD / DISCUSSION SECTION */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between border-b border-neutral-150 pb-2">
                <h4 className="font-sans font-extrabold text-xs text-neutral-950 tracking-tight">
                  Diskusi Komunitas ({ (replies[selectedPost.id] || []).length } Balasan)
                </h4>
                <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Urut: Terbaru</span>
              </div>

              <div className="space-y-2.5">
                {(replies[selectedPost.id] || []).length > 0 ? (
                  (replies[selectedPost.id] || []).map((reply) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-50/50 p-3.5 rounded-2xl border border-neutral-200 flex gap-3 items-start shadow-xs hover:border-neutral-300 transition-all font-sans"
                    >
                      {/* Commenter Avatar */}
                      <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 shadow-xs ${reply.avatarColor}`}>
                        {reply.avatarLetter}
                      </div>

                      {/* Content column */}
                      <div className="space-y-1.5 flex-1 text-left">
                        <div className="flex flex-wrap justify-between items-start">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-neutral-900 text-[11px] tracking-tight">
                              {reply.authorName}
                            </span>
                            <span className="text-neutral-500 font-mono text-[9.5px]">@{reply.authorHandle}</span>
                            <span className="text-neutral-300 text-[10px]">•</span>
                            <span className="text-neutral-505 font-mono text-[9.5px]">{reply.timestamp}</span>
                          </div>
                        </div>

                        {/* Content text */}
                        <p className="text-xs text-neutral-800 leading-relaxed font-sans select-text">
                          {reply.content}
                        </p>

                        {/* Thread interaction box */}
                        <div className="flex items-center gap-4 text-neutral-500 pt-1.5 mt-1 border-t border-neutral-100/60 max-w-xs">
                          <button
                            onClick={() => toggleLikeReply(selectedPost.id, reply.id)}
                            className="flex items-center gap-1 text-[9.5px] font-mono hover:text-red-500 transition-colors cursor-pointer group"
                          >
                            <Heart className="w-3.5 h-3.5 group-hover:scale-110 duration-100 text-neutral-600 group-hover:text-red-500 transition-transform" />
                            <span>{reply.likes} Suka</span>
                          </button>
                          
                          <span className="text-[9px] text-neutral-400 font-mono">• Terenkripsi</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 border border-dashed border-neutral-200 text-center rounded-2xl bg-neutral-50/50">
                    <MessageCircle className="w-6 h-6 text-neutral-300 mx-auto mb-1.5" />
                    <p className="font-sans font-bold text-neutral-800 text-[11px]">Belum ada balasan di Thread ini</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5 font-sans">Jadilah yang pertama menuangkan pendapatmu di atas!</p>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox / Fullscreen Image viewer with smooth spring exit */}
      <AnimatePresence>
        {activeImage && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out select-none"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative max-w-4xl w-full flex flex-col items-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button top right */}
              <button
                onClick={() => setActiveImage(null)}
                className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 text-sm font-bold shadow-md"
              >
                ✕
              </button>
              
              <img
                src={activeImage}
                alt="Fullscreen visual"
                referrerPolicy="no-referrer"
                className="max-h-[75vh] md:max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl border border-neutral-800"
              />
              
              <p className="text-[10px] font-mono text-neutral-400 mt-4 bg-neutral-900/80 backdrop-blur-xs py-1 px-3 border border-neutral-800 rounded-full pointer-events-none select-none">
                Klik di luar gambar untuk kembali
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
