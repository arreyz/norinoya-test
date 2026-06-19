import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, Heart, Repeat2, Share2, Search, Tag, Sparkles, 
  AlertCircle, ArrowLeft, Send, Shuffle, Check, CheckCircle, Bookmark, Copy, Globe, ShieldAlert,
  Video, Instagram, ChevronLeft, ChevronRight, BookOpen
} from 'lucide-react';
import { NEWS_UPDATES, COMICS_DATA } from '../data/mockData';
import { NewsUpdate } from '../types';
import { getAbsoluteDateTime } from '../utils/dateHelper';

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

const SHORTS_DATA = [
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
  },
  {
    id: 's5',
    title: 'Unboxing Oshi no Ko Vol 3, Bonus Postcard & Keychain Lucu!',
    views: '11.5K views',
    duration: '0:48',
    likes: '3.9K',
    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=320&auto=format&fit=crop&q=80',
    quote: '"Bonus postcard cetakannya super HD, bahannya tebel banget gak kaleng-kaleng!"'
  },
  {
    id: 's6',
    title: 'Kualitas Cetakan Blue Lock Elex Media vs Versi Jepang',
    views: '18.3K views',
    duration: '0:55',
    likes: '6.4K',
    thumbnail: 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=320&auto=format&fit=crop&q=80',
    quote: '"Lokalisasi Elex patut diacungi jempol, sound effect diterjemahkan rapi tanpa merusak panel!"'
  },
  {
    id: 's7',
    title: 'Rekomendasi Manga Slice of Life Terbaik Tahun Ini!',
    views: '9.7K views',
    duration: '0:50',
    likes: '2.8K',
    thumbnail: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=320&auto=format&fit=crop&q=80',
    quote: '"Ceritanya hangat banget, cocok dibaca sore hari sambil ngeteh santai."'
  }
];

interface NewsFeedProps {
  selectedNewsId?: string | null;
  setSelectedNewsId?: (id: string | null) => void;
}

export default function NewsFeed({ selectedNewsId, setSelectedNewsId }: NewsFeedProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [selectedShort, setSelectedShort] = useState<any | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shortLikes, setShortLikes] = useState<Record<string, boolean>>({});
  const shortsContainerRef = useRef<HTMLDivElement>(null);
  const detailsShortsContainerRef = useRef<HTMLDivElement>(null);

  const scrollShorts = (direction: 'left' | 'right') => {
    if (shortsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      shortsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollDetailsShorts = (direction: 'left' | 'right') => {
    if (detailsShortsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      detailsShortsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
  const [unlockedPosts, setUnlockedPosts] = useState<Record<string, boolean>>({});

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
    triggerToast('🔗 Link postingan disalin ke Clipboard!');
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
    <div className="space-y-4 overflow-x-hidden w-full max-w-full" id="news-feed-root">
      
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
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Cari info rilisan, hashtag, penerbit (@m&c, elex)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none transition-all focus:border-neutral-950 dark:focus:border-neutral-700 font-sans shadow-xs"
                />
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
                      ? 'bg-neutral-950 dark:bg-neutral-800 text-white border-neutral-950 dark:border-neutral-700 shadow-xs font-bold'
                      : 'bg-white dark:bg-neutral-900 text-neutral-603 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Twitter micro layout style */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <div className="bg-neutral-50/50 dark:bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 text-xs text-neutral-808 dark:text-neutral-300 font-sans font-bold text-left">
                    <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>Feed Terkini</span>
                  </div>
                  <div className="bg-neutral-100/60 dark:bg-neutral-950/20 p-2 px-3 rounded-lg border border-neutral-200/50 dark:border-neutral-800/55 text-[11px] text-neutral-500 dark:text-neutral-450 font-sans text-left flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse shrink-0" />
                    <span>Klik postingan untuk masuk thread lengkap!</span>
                  </div>
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredFeed.length > 0 ? (
                    filteredFeed.map((post, idx) => {
                      const postReplies = replies[post.id] || [];
                      const replyCount = postReplies.length;

                      return (
                        <motion.div layout key={post.id} className="space-y-4">
                          <motion.div
                            layout
                            onClick={() => setSelectedPost(post)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="bg-white dark:bg-neutral-900 border border-[#EFEFEF] dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 p-4 rounded-2xl space-y-3.5 shadow-xs cursor-pointer hover:shadow-md transition-all group relative"
                          >
                            <div className="flex items-start gap-3">
                              {/* User Profile Avatar */}
                              <div className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center font-mono font-bold bg-neutral-900 text-white text-xs shrink-0 shadow-xs relative">
                                N
                                <span className="absolute -bottom-1 -right-1 bg-sky-500 border-2 border-white dark:border-neutral-900 rounded-full w-4 h-4 flex items-center justify-center text-[7px] text-white font-sans font-black">✓</span>
                              </div>

                              <div className="space-y-1.5 flex-1 min-w-0 text-left">
                                {/* Name tags */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="font-extrabold text-neutral-950 dark:text-neutral-100 text-xs tracking-tight group-hover:underline">
                                    {post.displayName}
                                  </span>
                                  <span className="text-neutral-300 dark:text-neutral-700 text-xs">•</span>
                                  <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs flex items-center gap-1.5 flex-wrap">
                                    <span>{post.timestamp}</span>
                                    <span className="text-neutral-300 dark:text-neutral-700 font-sans">•</span>
                                    <span className="text-neutral-400 dark:text-neutral-500 text-[10.5px] font-sans" title="Waktu Posting">{getAbsoluteDateTime(post.timestamp)}</span>
                                  </span>
                                </div>

                                {/* DISPLAY BOLD POST TITLE IF AVAILABLE */}
                                {post.title && (
                                  <h4 className="font-black text-neutral-950 dark:text-neutral-50 text-sm md:text-base leading-snug tracking-tight font-sans">
                                    {post.title}
                                  </h4>
                                )}

                                {/* Paragraph content */}
                                <p className="text-sm text-neutral-605 dark:text-neutral-300 whitespace-pre-line leading-relaxed pb-0.5 select-text font-sans">
                                  {post.content}
                                </p>

                                {/* Inline simple poll preview if any */}
                                {polls[post.id] && (
                                  <div className="p-3 bg-neutral-50/60 dark:bg-neutral-950/20 rounded-xl border border-neutral-200 dark:border-neutral-800 mt-2 space-y-2">
                                    <span className="text-xs font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">🗳️ Polling Kalian!</span>
                                    <p className="font-sans font-bold text-xs text-neutral-900 dark:text-neutral-105 leading-tight">{polls[post.id].question}</p>
                                    <div className="space-y-1">
                                      {polls[post.id].options.map(opt => (
                                        <div key={opt.id} className="text-xs text-neutral-600 dark:text-neutral-400 flex justify-between items-center bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-lg px-2.5 py-1.5 gap-3 font-mono">
                                          <div className="relative flex-1 min-w-0 text-left">
                                            <p className="font-sans font-medium text-xs text-neutral-700 dark:text-neutral-300 truncate pr-4">
                                              {opt.label}
                                            </p>
                                            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-white dark:to-neutral-900 pointer-events-none" />
                                          </div>
                                          <span className="shrink-0 text-[11px] font-bold text-neutral-500 whitespace-nowrap">
                                            <span className="text-neutral-950 dark:text-neutral-50 font-extrabold pr-0.5">{opt.votes}</span> vote
                                          </span>
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
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2">
                                  <div className="self-start">
                                    <span className="inline-flex items-center gap-1 text-xs font-mono tracking-widest bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200 uppercase font-bold">
                                      <Tag className="w-2 h-2 text-neutral-505" />
                                      {post.category.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-x-2 gap-y-1">
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
                                </div>

                                {/* Optional Interactive Affiliate/Direct Link */}
                                {post.affiliateLink && (() => {
                                  const isAdultPost = post.readingRating === 'Dewasa Ringan' || post.readingRating === 'Dewasa Berat';
                                  const isPostUnlocked = unlockedPosts[post.id];

                                  const linkElement = (
                                    <a
                                      href={post.affiliateLink.url}
                                      target={post.affiliateLink.url.startsWith('http') ? '_blank' : '_self'}
                                      rel="no-referrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 rounded-xl shadow-xs"
                                    >
                                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                      <span>{post.affiliateLink.label} &rarr;</span>
                                    </a>
                                  );

                                  if (isAdultPost && !isPostUnlocked) {
                                    return (
                                      <div 
                                        onClick={(e) => e.stopPropagation()}
                                        className="mt-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800"
                                      >
                                        <div className="bg-red-50/15 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                                          <div className="flex items-center gap-2.5 text-left min-w-0 w-full sm:w-auto">
                                            <div className="w-8 h-8 rounded-full bg-red-105 dark:bg-red-950/45 border border-red-200/30 dark:border-red-900/40 flex items-center justify-center text-red-650 dark:text-red-400 shrink-0">
                                              <ShieldAlert className="w-4.5 h-4.5 text-red-600" />
                                            </div>
                                            <div className="min-w-0 font-sans">
                                              <p className="text-xs font-black text-neutral-900 dark:text-neutral-100 leading-snug">
                                                Ditujukan untuk Dewasa
                                              </p>
                                              <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 leading-none mt-0.5">
                                                Rating: {post.readingRating}
                                              </p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setUnlockedPosts(prev => ({ ...prev, [post.id]: true }));
                                            }}
                                            className="w-full sm:w-auto px-4 py-2 bg-neutral-950 dark:bg-neutral-800 hover:bg-neutral-850 dark:hover:bg-neutral-700 active:scale-97 text-white text-xs font-sans font-black rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs hover:shadow-sm text-center"
                                          >
                                            Saya Mengerti
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="mt-3.5 pt-3 flex border-t border-neutral-100 dark:border-neutral-800 justify-start animate-fade-in">
                                      {linkElement}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </motion.div>

                          {/* Render HIGHLIGHT REVIEW in between physical gap of news */}
                          {idx === 1 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white dark:bg-neutral-900 border border-[#EFEFEF] dark:border-neutral-800 p-4.5 rounded-2xl space-y-4 shadow-2xs"
                            >
                              <div className="flex justify-between items-center pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4 text-red-500 shrink-0" />
                                  <h4 className="font-extrabold text-neutral-950 dark:text-neutral-100 font-sans text-xs uppercase tracking-tight">
                                    Highlight Review
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      scrollShorts('left');
                                    }}
                                    className="w-7 h-7 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200/60 dark:border-neutral-750 active:scale-95 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg shadow-3xs cursor-pointer transition-all"
                                    title="Slide Left"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      scrollShorts('right');
                                    }}
                                    className="w-7 h-7 flex items-center justify-center bg-neutral-50 dark:bg-neutral-805 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200/60 dark:border-neutral-750 active:scale-95 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg shadow-3xs cursor-pointer transition-all"
                                    title="Slide Right"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>

                                  <div className="w-[1px] h-4 bg-neutral-200 dark:bg-neutral-800 mx-0.5 shrink-0" />

                                  <a 
                                    href="https://instagram.com/norinoya.sukasuka" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-7 h-7 flex items-center justify-center bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 hover:opacity-90 text-white rounded-lg shadow-2xs transition-all hover:scale-[1.05] cursor-pointer"
                                    title="Instagram"
                                  >
                                    <Instagram className="w-4 h-4 text-white" />
                                  </a>
                                </div>
                              </div>

                              <div 
                                ref={shortsContainerRef}
                                className="flex flex-row overflow-x-auto gap-3.5 pb-2.5 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                              >
                                {SHORTS_DATA.map((short) => (
                                  <motion.div
                                    key={short.id}
                                    whileHover={{ y: -2, scale: 1.01 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedShort(short);
                                    }}
                                    className="w-[125px] sm:w-[140px] shrink-0 aspect-[9/15] snap-start border border-neutral-150 hover:border-neutral-350 bg-neutral-900 rounded-2xl overflow-hidden relative flex flex-col justify-end p-2 sm:p-2.5 shadow-2xs cursor-pointer group"
                                  >
                                    <img 
                                      src={short.thumbnail} 
                                      alt={short.title} 
                                      referrerPolicy="no-referrer"
                                      className="absolute inset-0 w-full h-full object-cover opacity-72 group-hover:scale-[1.03] transition-transform duration-300"
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 pointer-events-none" />

                                    <div className="absolute top-2 left-2 flex gap-1 items-center z-10 bg-black/55 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
                                      <span className="bg-red-650 animate-pulse w-1 h-1 rounded-full" />
                                      <span className="text-white text-[7.5px] font-mono leading-none font-bold uppercase tracking-wider">
                                        SHORTS
                                      </span>
                                    </div>

                                    <div className="absolute top-2 right-2 bg-black/55 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 z-10">
                                      <span className="text-neutral-200 text-[7.5px] font-mono leading-none font-bold">
                                        {short.duration}
                                      </span>
                                    </div>

                                    <div className="relative z-10 space-y-0.5 text-left text-white mt-auto">
                                      <h4 className="font-sans font-bold text-[9.5px] leading-snug line-clamp-1 text-ellipsis overflow-hidden whitespace-nowrap text-white/95 group-hover:text-amber-300 transition-colors">
                                        {short.title}
                                      </h4>
                                      <div className="flex items-center justify-between text-[7.5px] font-mono text-neutral-350">
                                        <span>👁 {short.views}</span>
                                        <span>❤ {shortLikes[short.id] ? parseInt(short.likes) + 1 + 'K' : short.likes}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="p-8 border border-dashed border-neutral-250 dark:border-neutral-800 text-center rounded-2xl w-full">
                      <AlertCircle className="w-6 h-6 text-neutral-400 dark:text-neutral-500 mx-auto mb-2" />
                      <h4 className="font-bold text-neutral-800 dark:text-neutral-200 font-sans text-xs">Tidak ada berita ditemukan</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-450 mt-0.5">Coba sesuaikan filter kategori Anda atau gunakan kata kunci pencarian berbeda.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar recommendations / widget */}
              <div className="md:col-span-4 space-y-4">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl space-y-3.5 shadow-xs">
                  <div className="flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <h4 className="font-extrabold text-neutral-900 dark:text-neutral-100 font-sans text-xs uppercase tracking-tight">
                      Trending Terhangat
                    </h4>
                  </div>
                  <div className="space-y-3.5 divide-y divide-neutral-100 dark:divide-neutral-800">
                    <div 
                      onClick={() => setSearchTerm("EdukasiManga")}
                      className="text-sm cursor-pointer hover:bg-neutral-50/70 dark:hover:bg-neutral-950/40 p-2.5 rounded-xl border border-transparent hover:border-neutral-250 dark:hover:border-neutral-800 transition-all text-left space-y-1 block"
                    >
                      <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-400 dark:text-neutral-500 mb-0.5 leading-[16px]">
                        <span className="text-neutral-900 dark:text-neutral-100 font-extrabold">#1 Edukasi Kertas</span>
                        <span>•</span>
                        <span className="text-amber-600 dark:text-amber-550 font-bold">Populer</span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-350 line-clamp-2 leading-[20px] font-sans font-medium">
                        Mengapa volume komik premium harganya lebih mahal dibanding kertas koran biasa?
                      </p>
                      <div className="text-neutral-500 dark:text-neutral-450 font-mono text-[10px] font-bold uppercase tracking-wider pt-0.5">
                        1.2K Tweets • Baca Info
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setSearchTerm("Frieren")}
                      className="text-sm pt-3 cursor-pointer hover:bg-neutral-50/70 dark:hover:bg-neutral-950/40 p-2.5 rounded-xl border border-transparent hover:border-neutral-250 dark:hover:border-neutral-800 transition-all text-left space-y-1 block"
                    >
                      <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-400 dark:text-neutral-500 mb-0.5 leading-[16px]">
                        <span className="text-neutral-900 dark:text-neutral-100 font-extrabold">#2 Cetakan Ulang</span>
                        <span>•</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">Trending</span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-350 line-clamp-2 leading-[20px] font-sans font-medium">
                        Akasha Frieren Volume 1-4 Rilisan Baru Bebas Asam
                      </p>
                      <div className="text-neutral-500 dark:text-neutral-450 font-mono text-[10px] font-bold uppercase tracking-wider pt-0.5">
                        842 Tweets • Intip Thread
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Google Ads Banner Rectangle style */}
                <div className="bg-neutral-50 dark:bg-neutral-950/40 border border-dashed border-neutral-300 dark:border-neutral-850 p-4 rounded-2xl text-center space-y-2 shadow-xs">
                  <span className="text-xs font-mono tracking-widest text-neutral-400 dark:text-neutral-500 block uppercase font-bold">Google Advertisements Sponsor</span>
                  <div className="h-44 flex flex-col items-center justify-center border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl text-xs text-neutral-400 dark:text-neutral-500 font-mono p-3 uppercase leading-relaxed font-bold shadow-xs">
                    <span className="text-amber-500 text-lg">📢</span>
                    <span>300 x 250 Rect Ad Slot</span>
                    <span className="text-xs text-neutral-305 dark:text-neutral-600 mt-1">CPC AdSense Network</span>
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
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <button
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all font-sans font-bold text-xs cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
                <span>Kembali Ke Feed</span>
              </button>
              <div className="text-center">
                <h4 className="font-sans font-extrabold text-xs text-neutral-950 dark:text-neutral-100 leading-tight">Postingan Thread</h4>
                <p className="font-mono text-xs text-neutral-400 dark:text-neutral-450 capitalize uppercase tracking-wider">{selectedPost.category.replace('_', ' ')} News</p>
              </div>
              <div className="w-20 sm:block hidden"></div>
            </div>

            {/* MAIN TWITTER TWEET CARD */}
            <div className="bg-white dark:bg-neutral-900 border border-[#EFEFEF] dark:border-neutral-800 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm relative">
              
              {/* Profile Bar */}
              <div className="flex items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-11 h-11 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center font-mono font-bold bg-neutral-900 text-white text-sm shrink-0 shadow-xs relative">
                    N
                    <span className="absolute -bottom-1 -right-1 bg-sky-500 border border-white dark:border-neutral-900 rounded-full w-4.5 h-4.5 flex items-center justify-center text-xs text-white font-black font-sans shadow-xs">✓</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center min-w-0">
                      <span className="font-extrabold text-neutral-950 dark:text-neutral-100 text-sm tracking-tight leading-snug block break-words">
                        {selectedPost.displayName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Follow Button engagement bait */}
                <button
                  onClick={() => setIsFollowing({ ...isFollowing, [selectedPost.id]: !isFollowing[selectedPost.id] })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-black transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap ${
                    isFollowing[selectedPost.id]
                      ? 'bg-neutral-105 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700'
                      : 'bg-neutral-950 dark:bg-neutral-100 dark:text-neutral-905 hover:bg-neutral-850 dark:hover:bg-neutral-200 text-white'
                  }`}
                >
                  {isFollowing[selectedPost.id] ? 'Mengikuti' : 'Ikuti'}
                </button>
              </div>

              {/* DISPLAY BOLD POST TITLE IF AVAILABLE */}
              {selectedPost.title && (
                <h3 className="font-black text-neutral-950 dark:text-neutral-50 text-base md:text-xl leading-snug tracking-tight font-sans">
                  {selectedPost.title}
                </h3>
              )}

              {/* Core Tweet Body with fine display typography */}
              <p className="text-sm md:text-base text-neutral-605 dark:text-neutral-300 font-sans leading-relaxed font-normal whitespace-pre-line select-text break-words">
                {selectedPost.content}
              </p>

              {/* Attached Tweet Image */}
              {selectedPost.attachedImage && (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 aspect-[16/10] max-h-80 relative group">
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
              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="self-start">
                    <span className="inline-flex items-center gap-1 text-[8.5px] font-mono tracking-widest bg-neutral-100 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded border border-neutral-250 dark:border-neutral-800 uppercase font-bold">
                      <Tag className="w-2 h-2 text-neutral-500" />
                      {selectedPost.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {selectedPost.hashTags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-[10px] text-[#004e92] dark:text-sky-350 font-mono font-extrabold hover:underline cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono flex flex-wrap gap-1.5 items-center">
                  <span>{getAbsoluteDateTime(selectedPost.timestamp)}</span>
                  <span>•</span>
                  <span>Relatif: {selectedPost.timestamp}</span>
                  <span>•</span>
                  <span className="text-neutral-900 dark:text-neutral-200 font-bold flex items-center gap-1">
                    <Globe className="w-3 h-3 inline text-emerald-600" />
                    Publik
                  </span>
                </div>
              </div>

              {/* CORE INTERACTIVE ACTION BUTTON - Simplified to copy post link only as requested */}
              <div className="pt-3 pb-2">
                <button
                  onClick={() => handleCopyLink(selectedPost.id)}
                  className="w-full cursor-pointer flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-805 dark:hover:bg-neutral-700 text-white font-sans font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all duration-200 outline-none hover:shadow-md active:scale-[0.98] border border-transparent dark:border-neutral-750"
                >
                  <Copy className="w-4 h-4 shrink-0 text-neutral-200" />
                  <span>Salin Link Postingan</span>
                </button>
              </div>

              {/* DYNAMIC INTERACTIVE POLL WIDGET (Engagement Monster!) */}
              {polls[selectedPost.id] && (() => {
                const curPoll = polls[selectedPost.id];
                const totalVotes = curPoll.options.reduce((sum, o) => sum + o.votes, 0);
                const hasVoted = !!userVotes[selectedPost.id];
                
                return (
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 bg-neutral-50/50 dark:bg-neutral-950/20 space-y-3 mt-4 text-left">
                    <div className="flex justify-between items-center border-b border-neutral-150 dark:border-neutral-850 pb-1.5">
                      <span className="font-mono text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-1 text-sky-700 dark:text-sky-400">
                        ⚡ Polling Kalian!
                      </span>
                      <span className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 font-medium">Anonymous Vote</span>
                    </div>
                    
                    <h5 className="font-sans font-extrabold text-[#111] dark:text-neutral-100 text-xs leading-snug">
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
                                className="w-full text-left px-3.5 py-2.5 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-850 hover:border-neutral-350 dark:hover:border-neutral-700 rounded-xl text-xs font-sans font-bold text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                              >
                                {option.label}
                              </button>
                            ) : (
                              // Percentage bars after voting
                              <div className="w-full border border-neutral-200 dark:border-neutral-850 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 text-xs font-sans h-10 flex items-center px-3.5 justify-between relative shadow-xs gap-3">
                                {/* The colored background percentage bar with dynamic spring scale */}
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${optPercentage}%` }}
                                  transition={{ type: 'tween', duration: 0.6 }}
                                  className={`absolute left-0 top-0 bottom-0 ${
                                    isSelectedByMe ? 'bg-sky-105/85 dark:bg-sky-950/40 border-r border-sky-305 dark:border-sky-800' : 'bg-neutral-105 dark:bg-neutral-800 border-r border-neutral-200/50 dark:border-neutral-750'
                                  }`}
                                />
                                
                                <div className="relative flex-1 min-w-0 text-left z-10 flex items-center gap-1.5">
                                  {isSelectedByMe && <span className="text-[10px] text-sky-700 dark:text-sky-400 shrink-0">✓</span>}
                                  <span className="font-bold text-neutral-900 dark:text-neutral-150 truncate pr-3">
                                    {option.label}
                                  </span>
                                </div>
                                <span className="font-mono font-extrabold text-[11px] text-[#111] dark:text-neutral-300 relative z-10 shrink-0 whitespace-nowrap">
                                  {optPercentage}% <span className="text-neutral-400 dark:text-neutral-500 font-bold">({option.votes})</span>
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
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 bg-neutral-50/50 dark:bg-neutral-950/20 space-y-2.5 mt-4 text-left">
                <span className="font-mono text-[9px] font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest block border-b border-neutral-150 dark:border-neutral-850 pb-1.5">
                  ✨ Reaksi Kilat
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
                            ? 'bg-amber-100/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 font-extrabold'
                            : 'bg-white dark:bg-neutral-900 hover:bg-neutral-105 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <span className="text-base">{r.emoji}</span>
                        <span>{r.label}</span>
                        <span className="font-mono text-[10px] bg-neutral-50 dark:bg-neutral-850 px-1.5 py-0.2 rounded-md border border-neutral-100 dark:border-neutral-800 font-black text-neutral-700 dark:text-neutral-300">
                          {r.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* AD BANNER SLOT PLACEHOLDER INSIDE THE TWEET DETAIL VIEW FOR ARCHITECTURAL HONESTY */}
            <div className="text-[9px] bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-850 py-3.5 px-4 rounded-xl text-neutral-400 dark:text-neutral-500 font-mono text-center uppercase tracking-widest flex items-center justify-center gap-2 shadow-xs">
              <span className="text-amber-500">⚡</span>
              <span>Advertisements: 468x60 Banner Slot</span>
              <span className="text-amber-500">⚡</span>
            </div>

            {/* HIGHLIGHT REVIEW SECTION (IMAGE 2) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-900 border border-[#EFEFEF] dark:border-neutral-800 p-4.5 rounded-2xl space-y-4 shadow-2xs mt-4"
            >
              <div className="flex justify-between items-center pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-500 shrink-0" />
                  <h4 className="font-extrabold text-neutral-950 dark:text-neutral-100 font-sans text-xs uppercase tracking-tight">
                    Highlight Review
                  </h4>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollDetailsShorts('left');
                    }}
                    className="w-7 h-7 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200/60 dark:border-neutral-750 active:scale-95 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg shadow-3xs cursor-pointer transition-all"
                    title="Slide Left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollDetailsShorts('right');
                    }}
                    className="w-7 h-7 flex items-center justify-center bg-neutral-50 dark:bg-neutral-805 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200/60 dark:border-neutral-750 active:scale-95 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg shadow-3xs cursor-pointer transition-all"
                    title="Slide Right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="w-[1px] h-4 bg-neutral-200 dark:bg-neutral-800 mx-0.5 shrink-0" />

                  <a 
                    href="https://instagram.com/norinoya.sukasuka" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 flex items-center justify-center bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 hover:opacity-90 text-white rounded-lg shadow-2xs transition-all hover:scale-[1.05] cursor-pointer"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>

              <div 
                ref={detailsShortsContainerRef}
                className="flex flex-row overflow-x-auto gap-3.5 pb-2.5 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {SHORTS_DATA.map((short) => (
                  <motion.div
                    key={short.id}
                    whileHover={{ y: -2, scale: 1.01 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedShort(short);
                    }}
                    className="w-[115px] sm:w-[130px] shrink-0 aspect-[9/15] snap-start border border-neutral-150 hover:border-neutral-350 bg-neutral-900 rounded-2xl overflow-hidden relative flex flex-col justify-end p-2 sm:p-2.5 shadow-2xs cursor-pointer group"
                  >
                    <img 
                      src={short.thumbnail} 
                      alt={short.title} 
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-72 group-hover:scale-[1.03] transition-transform duration-300"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 pointer-events-none" />

                    <div className="absolute top-2 left-2 flex gap-1 items-center z-10 bg-black/55 backdrop-blur-md px-1 py-0.5 rounded border border-white/10">
                      <span className="bg-red-650 animate-pulse w-1 h-1 rounded-full" />
                      <span className="text-white text-[7.5px] font-mono leading-none font-bold uppercase tracking-wider">
                        SHORTS
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 bg-black/55 backdrop-blur-md px-1 py-0.5 rounded border border-white/10 z-10">
                      <span className="text-neutral-200 text-[7.5px] font-mono leading-none font-bold">
                        {short.duration}
                      </span>
                    </div>

                    <div className="relative z-10 space-y-0.5 text-left text-white mt-auto">
                      <h4 className="font-sans font-bold text-[9px] sm:text-[9.5px] leading-snug line-clamp-1 text-ellipsis overflow-hidden whitespace-nowrap text-white/95 group-hover:text-amber-300 transition-colors">
                        {short.title}
                      </h4>
                      <div className="flex items-center justify-between text-[7px] sm:text-[7.5px] font-mono text-neutral-350">
                        <span>👁 {short.views}</span>
                        <span>❤ {shortLikes[short.id] ? parseInt(short.likes) + 1 + 'K' : short.likes}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CATALOG AND THREAD RECOMMENDATIONS SECTION */}
            <div className="space-y-4 pt-4 border-t border-neutral-250 dark:border-neutral-800" id="details-recommendations-container">
              <div className="flex items-center gap-1.5 pb-1">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <h4 className="font-extrabold text-neutral-900 dark:text-neutral-105 font-sans text-xs uppercase tracking-tight">
                  Rekomendasi Lainnya
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Rekomendasi Berita / Utas */}
                <div className="bg-white dark:bg-neutral-900 border border-[#EFEFEF] dark:border-neutral-800 p-4 rounded-2xl space-y-3.5 shadow-2xs">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block border-b border-neutral-100 dark:border-neutral-800 pb-1.5 text-left">
                    📰 Utas Berita Terkait
                  </span>
                  <div className="space-y-3 divide-y divide-neutral-100 dark:divide-neutral-800">
                    {NEWS_UPDATES.filter(item => item.id !== selectedPost.id).slice(0, 2).map((item, index) => (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedPost(item)}
                        className={`group cursor-pointer ${index > 0 ? 'pt-3' : ''} block text-left`}
                      >
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 dark:text-neutral-500 mb-1">
                          <span className="text-neutral-900 dark:text-neutral-100 font-extrabold">@{item.username}</span>
                          <span>•</span>
                          <span>{item.timestamp}</span>
                        </div>
                        {item.title && (
                          <h5 className="font-bold text-neutral-950 dark:text-neutral-100 text-[11px] leading-tight mb-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-sans">
                            {item.title}
                          </h5>
                        )}
                        <p className="text-xs text-neutral-603 dark:text-neutral-400 line-clamp-2 leading-[18px] font-sans">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Rekomendasi Buku Populer */}
                <div className="bg-white dark:bg-neutral-900 border border-[#EFEFEF] dark:border-neutral-800 p-4 rounded-2xl space-y-3.5 shadow-2xs">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block border-b border-neutral-100 dark:border-neutral-800 pb-1.5 text-left">
                    📚 Rekomendasi Buku Katalog
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {COMICS_DATA.slice(0, 2).map((comic) => (
                      <div 
                        key={comic.id}
                        onClick={() => {
                          window.location.hash = `#/database/${comic.id}`;
                        }}
                        className="group cursor-pointer border border-neutral-150 hover:border-neutral-350 dark:border-neutral-800 dark:hover:border-neutral-750 p-2 rounded-xl flex flex-col gap-1.5 bg-neutral-50/50 dark:bg-neutral-950/20 hover:bg-neutral-50 dark:hover:bg-neutral-950/40 transition-all text-left"
                      >
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900">
                          <img 
                            src={comic.coverImage} 
                            alt={comic.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <h5 className="font-sans font-bold text-[11px] text-neutral-900 dark:text-neutral-100 line-clamp-1 truncate leading-none">
                          {comic.title}
                        </h5>
                        <p className="text-[9px] font-mono text-neutral-400">
                          {comic.status} ({comic.totalVolumesKnown.split(' ')[0]} Vol)
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
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

              {/* Close Button top right inside player */}
              <button 
                onClick={() => setSelectedShort(null)}
                className="absolute top-14 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-neutral-800 flex items-center justify-center border border-white/10 text-white font-bold text-sm cursor-pointer z-50"
              >
                ✕
              </button>

              {/* Right Sidebar Icons Panel (TikTok Style!) */}
              <div className="absolute right-3.5 bottom-24 flex flex-col gap-4 items-center z-10 text-white">
                {/* Curator Avatar badge */}
                <div className="w-9 h-9 rounded-full border-2 border-amber-400 overflow-hidden relative shadow">
                  <div className="bg-neutral-950 flex items-center justify-center w-full h-full text-xs font-bold text-amber-450">KN</div>
                  <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold text-xs text-white select-none">+</div>
                </div>

                {/* Like Button */}
                <button 
                  onClick={() => {
                    setShortLikes(prev => ({
                      ...prev,
                      [selectedShort.id]: !prev[selectedShort.id]
                    }));
                  }} 
                  className="flex flex-col items-center gap-0.5 group cursor-pointer bg-transparent border-none"
                >
                  <div className="w-9 h-9 rounded-full bg-black/50 hover:bg-neutral-800 flex items-center justify-center border border-white/10 transition-colors">
                    <span className={shortLikes[selectedShort.id] ? "text-red-500 text-sm" : "text-white text-sm"}>❤</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-neutral-200">
                    {shortLikes[selectedShort.id] ? parseInt(selectedShort.likes) + 1 + 'K' : selectedShort.likes}
                  </span>
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
                      className="absolute left-0 top-0 bottom-0 w-full bg-white rounded-full"
                    />
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
