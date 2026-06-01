import { Comic, PreOwnedItem, NewsUpdate } from '../types';

export const COMICS_DATA: Comic[] = [
  {
    id: 'naruto-bindup',
    title: 'Naruto Bind Up Edition',
    slug: 'naruto-bind-up',
    coverImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=80',
    synopsis: 'Naruto Uzumaki adalah seorang ninja remaja yang nakal namun bercita-cita tinggi untuk menjadi Hokage, pemimpin desa terkuat dan ninja terhebat di desanya. Edisi Bind-Up (3-in-1) ini menggabungkan 3 volume reguler menjadi 1 buku tebal premium untuk koleksi retro terbaik dengan kualitas cetakan mutakhir.',
    category: 'manga',
    rating: 9.3,
    status: 'ongoing',
    demographic: 'Shonen',
    genres: ['Action', 'Fantasy', 'Adventure', 'Ninja'],
    publisherId: 'elex',
    publisherName: 'Elex Media Komputindo',
    originalPublisher: 'Shueisha',
    totalVolumesKnown: '24 Volumes (Edisi Bindup)',
    firstPublishedInId: '2023',
    isFeatured: true,
    readingRating: 'Remaja',
    authorStory: 'Masashi Kishimoto',
    authorArt: 'Masashi Kishimoto',
    volumes: [
      {
        volNumber: 1,
        releaseDate: '15 Nov 2023',
        isbn: '978-623-00-5112-9',
        pages: 580,
        cetakanInfo: 'Cetakan I: Nov 2023 (Kertas Bookpaper 55g, Cover Laminasi Doff). Cetakan Lama (Volume 1-3 reguler): Dirilis tahun 2004 memakai Kertas Koran kuning buram.',
        price: 95000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/naruto-bind-up-edition-01',
          shopee: 'https://shopee.co.id/search?keyword=naruto+bind+up+1+elex',
          tokopedia: 'https://www.tokopedia.com/search?q=naruto+bind+up+1+elex'
        },
        animeAdaptation: [
          { platformName: 'Netflix', watchLink: 'https://www.netflix.com/title/70205012' },
          { platformName: 'Bstation', watchLink: 'https://www.bilibili.tv/id/media/1054707' }
        ],
        reviewShort: {
          platform: 'tiktok',
          videoId: 'naruto1_impression',
          views: '45.2K',
          title: 'Naruto Bindup: Apakah Worth It Dibeli Tahun Ini?',
          duration: '0:58'
        }
      },
      {
        volNumber: 2,
        releaseDate: '24 Jan 2024',
        isbn: '978-623-00-5220-1',
        pages: 560,
        cetakanInfo: 'Cetakan I: Jan 2024 (Edisi Kertas Premium Bookpaper). Mengcover volume reguler 4, 5, dan 6.',
        price: 95000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/naruto-bind-up-edition-02',
          shopee: 'https://shopee.co.id/search?keyword=naruto+bind+up+2+elex',
          tokopedia: 'https://www.tokopedia.com/search?q=naruto+bind+up+2+elex'
        },
        animeAdaptation: [
          { platformName: 'Netflix', watchLink: 'https://www.netflix.com/title/70205012' }
        ]
      },
      {
        volNumber: 3,
        releaseDate: '27 Mar 2024',
        isbn: '978-623-00-5345-1',
        pages: 572,
        cetakanInfo: 'Cetakan I: Mar 2024. Meliputi Ujian Chunin yang legendaris, pertarungan Lee vs Gaara!',
        price: 95000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/naruto-bind-up-edition-03',
          shopee: 'https://shopee.co.id/search?keyword=naruto+bind+up+3+elex',
          tokopedia: 'https://www.tokopedia.com/search?q=naruto+bind+up+3+elex'
        },
        animeAdaptation: [
          { platformName: 'Bstation', watchLink: 'https://www.bilibili.tv/id/media/1054707' }
        ],
        reviewShort: {
          platform: 'instagram',
          videoId: 'naruto3_考试篇',
          views: '12.8K',
          title: 'Ujian Chunin Masih Merupakan Arc Shonen Terbaik?',
          duration: '1:12'
        }
      }
    ]
  },
  {
    id: 'frieren-manga',
    title: 'Frieren: After the End',
    slug: 'frieren-after-the-end',
    coverImage: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=400&auto=format&fit=crop&q=80',
    synopsis: 'Manga fantasi melankolis yang menceritakan kehidupan elf penyihir bernama Frieren setelah kelompok pahlawannya sukses mengalahkan Raja Iblis. Sebagai mahluk brentang umur ribuan tahun, ia belajar memahami arti waktu, penyesalan, dan emosianal kemanusiaan melintasi perjalanan nostalgianya bersejarah.',
    category: 'manga',
    rating: 9.6,
    status: 'ongoing',
    demographic: 'Seinen',
    genres: ['Adventure', 'Fantasy', 'Drama', 'Slice of Life'],
    publisherId: 'akasha',
    publisherName: 'm&c! (AKASHA)',
    originalPublisher: 'Shogakukan',
    totalVolumesKnown: '13 Volumes (Ongoing in Japan)',
    firstPublishedInId: '2022',
    isFeatured: true,
    readingRating: 'Dewasa Ringan',
    authorStory: 'Kanehito Yamada',
    authorArt: 'Tsukasa Abe',
    volumes: [
      {
        volNumber: 1,
        releaseDate: '10 Feb 2022',
        isbn: '978-623-03-0665-6',
        pages: 192,
        cetakanInfo: 'Cetakan I: Feb 2022. Cetakan IV (Terbaru): Des 2023. Kertas Bookpaper Premium, diterbitkan di bawah lini Akasha untuk pembaca dewasa.',
        price: 45000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/akasha-frieren-after-the-end-01',
          shopee: 'https://shopee.co.id/search?keyword=frieren+after+the+end+1+akasha',
          tokopedia: 'https://www.tokopedia.com/search?q=frieren+after+the+end+1+akasha'
        },
        animeAdaptation: [
          { platformName: 'Crunchyroll', watchLink: 'https://www.crunchyroll.com/series/GG5H5X0JV/frieren-beyond-journeys-end' },
          { platformName: 'Netflix', watchLink: 'https://www.netflix.com/title/81726714' },
          { platformName: 'Bstation', watchLink: 'https://www.bilibili.tv/id/media/2088825' }
        ],
        reviewShort: {
          platform: 'tiktok',
          videoId: 'frieren1_review',
          views: '88.5K',
          title: 'Manga Frieren Menghancurkan Ekspektasi Fantasi Biasa!',
          duration: '1:30'
        }
      },
      {
        volNumber: 2,
        releaseDate: '12 May 2022',
        isbn: '978-623-03-0740-0',
        pages: 192,
        cetakanInfo: 'Cetakan I: Mei 2022. Edisi ber-cover metalik elegan khas lini Akasha.',
        price: 45000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/akasha-frieren-after-the-end-02',
          shopee: 'https://shopee.co.id/search?keyword=frieren+after+the+end+2',
          tokopedia: 'https://www.tokopedia.com/search?q=frieren+after+the+end+2'
        },
        animeAdaptation: [
          { platformName: 'Crunchyroll', watchLink: 'https://www.crunchyroll.com/series/GG5H5X0JV' }
        ]
      },
      {
        volNumber: 3,
        releaseDate: '15 Sep 2022',
        isbn: '978-623-03-0850-6',
        pages: 200,
        cetakanInfo: 'Cetakan I: Sep 2022. Memperkenalkan Stark si petarung pengecut namun berhati emas.',
        price: 45000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/akasha-frieren-after-the-end-03',
          shopee: 'https://shopee.co.id/search?keyword=frieren+after+the+end+3',
          tokopedia: 'https://www.tokopedia.com/search?q=frieren+after+the+end+3'
        }
      }
    ]
  },
  {
    id: 'solo-leveling-ln',
    title: 'Solo Leveling (Light Novel)',
    slug: 'solo-leveling-light-novel',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    synopsis: 'Novel fenomenal asal Korea Selatan. Di dunia di mana Gerbang (Gate) menghubungkan dunia manusia dengan monster, pemburu terlemah Sung Jin-Woo mendapatkan kemampuan rahasia sistem peningkatan level yang tak terbatas, menaikkannya dari peringkat E terbawah hingga melampaui batas dewa.',
    category: 'light_novel',
    rating: 9.4,
    status: 'completed',
    demographic: 'General',
    genres: ['Action', 'Fantasy', 'System', 'Overpowered'],
    publisherId: 'mnc',
    publisherName: 'm&c! (Novel)',
    originalPublisher: 'D&C Media',
    totalVolumesKnown: '8 novel utama (Selesai)',
    firstPublishedInId: '2021',
    isFeatured: false,
    readingRating: 'Remaja',
    authorStory: 'Chugong',
    authorArt: 'DUBU (Redice Studio)',
    volumes: [
      {
        volNumber: 1,
        releaseDate: '15 Dec 2021',
        isbn: '978-623-03-0599-4',
        pages: 312,
        cetakanInfo: 'Cetakan I: Des 2021. Edisi novel terjemahan resmi berformat buku novel regular dengan kertas berkualitas tinggi. Berbeda total dari manhwa (webtoon bergambar)-nya.',
        price: 135000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/novel-solo-leveling-vol-1-terjemahan',
          shopee: 'https://shopee.co.id/search?keyword=novel+solo+leveling+1',
          tokopedia: 'https://www.tokopedia.com/search?q=novel+solo+leveling+1'
        },
        animeAdaptation: [
          { platformName: 'Crunchyroll', watchLink: 'https://www.crunchyroll.com/series/G79H23MD0/solo-leveling' },
          { platformName: 'Netflix', watchLink: 'https://www.netflix.com/title/81722047' }
        ],
        reviewShort: {
          platform: 'instagram',
          videoId: 'sololvl_novel_review',
          views: '22.4K',
          title: 'Lebih Bagus Novel atau Webtoon-nya? Kupas Tuntas Solo Leveling Vol 1',
          duration: '1:05'
        }
      },
      {
        volNumber: 2,
        releaseDate: '30 Mar 2022',
        isbn: '978-623-03-0711-2',
        pages: 320,
        cetakanInfo: 'Cetakan I: Mar 2022. Menelusuri ancaman Red Gate dan kebangkitan pasukan bayangan pertama Jin-Woo.',
        price: 135000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/novel-solo-leveling-vol-2-terjemahan',
          shopee: 'https://shopee.co.id/search?keyword=novel+solo+leveling+2',
          tokopedia: 'https://www.tokopedia.com/search?q=novel+solo+leveling+2'
        }
      }
    ]
  },
  {
    id: 'fuden-shigusa-ln',
    title: 'Spy x Family',
    slug: 'spy-x-family',
    coverImage: 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?w=400&auto=format&fit=crop&q=80',
    synopsis: 'Manga komedi keluarga modern tentang Twilight, mata-mata nomor satu yang diharuskan membuat keluarga palsu demi misi perdamaian dunia. Ia mengadopsi Anya (anak yatim berkemampuan membaca pikiran) dan menikahi Yor (pembunuh bayaran profesional) tanpa mengetahui identitas rahasia satu sama lain.',
    category: 'manga',
    rating: 9.1,
    status: 'ongoing',
    demographic: 'Shonen',
    genres: ['Comedy', 'Action', 'Spy', 'Slice of Life'],
    publisherId: 'elex',
    publisherName: 'Elex Media Komputindo',
    originalPublisher: 'Shueisha',
    totalVolumesKnown: '12 Volumes (Ongoing in Indonesia)',
    firstPublishedInId: '2020',
    isFeatured: true,
    readingRating: 'Anak & Bimbingan Orang Tua',
    authorStory: 'Tatsuya Endo',
    authorArt: 'Tatsuya Endo',
    volumes: [
      {
        volNumber: 1,
        releaseDate: '15 Oct 2020',
        isbn: '978-623-00-1922-8',
        pages: 212,
        cetakanInfo: 'Cetakan I: Okt 2020. Cetakan VI: Mar 2023. Versi lokal sangat laris manis, kertas bookpaper halus tahan lama.',
        price: 45000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/spy-x-family-vol-1',
          shopee: 'https://shopee.co.id/search?keyword=spy+x+family+1',
          tokopedia: 'https://www.tokopedia.com/search?q=spy+x+family+1'
        },
        animeAdaptation: [
          { platformName: 'Netflix', watchLink: 'https://www.netflix.com/title/81499641' },
          { platformName: 'iQIYI', watchLink: 'https://www.iq.com/album/spy-x-family-2022-1988gqgipax' }
        ]
      },
      {
        volNumber: 2,
        releaseDate: '15 Dec 2020',
        isbn: '978-623-00-2051-4',
        pages: 196,
        cetakanInfo: 'Cetakan I: Des 2020. Pembentukan struktur keluarga inti dan pengenalan Yor Briar.',
        price: 45000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/spy-x-family-vol-2',
          shopee: 'https://shopee.co.id/search?keyword=spy+x+family+2',
          tokopedia: 'https://www.tokopedia.com/search?q=spy+x+family+2'
        }
      }
    ]
  },
  {
    id: 'blue-lock-manga',
    title: 'Blue Lock',
    slug: 'blue-lock',
    coverImage: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400&auto=format&fit=crop&q=80',
    synopsis: 'Setelah kegagalan berskala nasional di Piala Dunia 2018, asosiasi sepak bola Jepang merekrut pelatih misterius Ego Jinpachi untuk melatih striker-striker muda berbakat di dalam fasilitas penjara elite bernama Blue Lock. Tujuannya hanya satu: menciptakan striker egois mutlak yang akan membawa Jepang juara!',
    category: 'manga',
    rating: 8.9,
    status: 'ongoing',
    demographic: 'Shonen',
    genres: ['Sports', 'Thriller', 'Drama'],
    publisherId: 'elex',
    publisherName: 'Elex Media Komputindo',
    originalPublisher: 'Kodansha',
    totalVolumesKnown: '26 Volumes (Ongoing)',
    firstPublishedInId: '2021',
    isFeatured: false,
    readingRating: 'Remaja',
    authorStory: 'Muneyuki Kaneshiro',
    authorArt: 'Yusuke Nomura',
    volumes: [
      {
        volNumber: 1,
        releaseDate: '10 Jan 2022',
        isbn: '978-623-00-3023-0',
        pages: 208,
        cetakanInfo: 'Cetakan I: Jan 2022. Cetakan III: Feb 2024. Sangat populer di kalangan pencinta anime olahraga, cetakan baru memiliki perbaikan font dialog.',
        price: 45000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/blue-lock-01-elex',
          shopee: 'https://shopee.co.id/search?keyword=blue+lock+1+elex',
          tokopedia: 'https://www.tokopedia.com/search?q=blue+lock+1+elex'
        },
        animeAdaptation: [
          { platformName: 'Netflix', watchLink: 'https://www.netflix.com/title/81617511' },
          { platformName: 'iQIYI', watchLink: 'https://www.iq.com/album/blue-lock-2022-1o8m8b5e28p' }
        ]
      }
    ]
  },
  {
    id: 'namiya-novel',
    title: 'Keajaiban Toko Kelontong Namiya',
    slug: 'keajaiban-toko-kelontong-namiya',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80',
    synopsis: 'Novel best-seller karya Keigo Higashino. Mengisahkan tiga pemuda berandalan yang bersembunyi di toko kelontong tua tak berpenghuni. Ketika sepucuk surat misterius dari masa lalu masuk melalui celah pintu toko kelontong, mereka terhubung dengan keajaiban bimbingan nasehat yang menyentuh hati sanubari.',
    category: 'novel',
    rating: 9.6,
    status: 'completed',
    demographic: 'General',
    genres: ['Drama', 'Mystery', 'Fantasy', 'Slice of Life'],
    publisherId: 'haru',
    publisherName: 'Penerbit Haru',
    originalPublisher: 'Kadokawa',
    totalVolumesKnown: '1 Novel Utama (Selesai)',
    firstPublishedInId: '2020',
    isFeatured: true,
    readingRating: 'Remaja',
    authorStory: 'Keigo Higashino',
    authorArt: 'Keigo Higashino',
    volumes: [
      {
        volNumber: 1,
        releaseDate: '15 Dec 2020',
        isbn: '978-602-53-8581-9',
        pages: 400,
        cetakanInfo: 'Cetakan I: Des 2020. Cetakan VI: Jan 2025. Dilengkapi jaket cover doff premium berpola malam hari yang syahdu dan kertas bookpaper tebal kualitas ekspor.',
        price: 99000,
        affiliateLinks: {
          gramedia: 'https://www.gramedia.com/products/keajaiban-toko-kelontong-namiya',
          shopee: 'https://shopee.co.id/search?keyword=keajaiban+toko+kelontong+namiya',
          tokopedia: 'https://www.tokopedia.com/search?q=keajaiban+toko+kelontong+namiya'
        },
        liveActionAdaptation: [
          { platformName: 'Netflix', watchLink: 'https://www.netflix.com/title/80998877' }
        ]
      }
    ]
  }
];

export const PRE_OWNED_ITEMS: PreOwnedItem[] = [
  {
    id: 'po-naruto-1',
    comicTitle: 'Naruto Bind Up Edition',
    volumeNumber: 1,
    originalPrice: 95000,
    salePrice: 65000,
    conditionRating: '9.6/10',
    notes: 'Koleksi pribadi bekas bahan konten review @konotasi.sukasuka. Hanya pernah dibuka segel sekali, tidak ada tekukan, ada pembatas buku bawaan, halaman masih sangat putih bersih.',
    shopeeUrl: 'https://shopee.co.id/norinoya.sukasuka',
    tokopediaUrl: 'https://tokopedia.com/konotasi.sukasuka',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    carouselImages: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80'
    ],
    carouselLabels: [
      'Foto Depan (Jaket Cover Doff)',
      'Foto Samping (Punggung Buku / Spine)',
      'Foto Belakang (Blurb & Ringkasan)',
      'Kondisi Kertas Bookpaper (Bebas Asam/Yellowing)',
      'Bonus Pembatas Buku Pembeli Pertama'
    ],
    linkedComicId: 'naruto-bindup',
    isSoldOut: false
  },
  {
    id: 'po-frieren-1',
    comicTitle: 'Akasha: Frieren After the End',
    volumeNumber: 1,
    originalPrice: 45000,
    salePrice: 32000,
    conditionRating: '9.8/10',
    notes: 'Sangat mulus mirip baru, dibuka untuk sesi foto perbandingan kertas laminasi. Sampul tidak lecek sama sekali.',
    shopeeUrl: 'https://shopee.co.id/norinoya.sukasuka',
    tokopediaUrl: 'https://tokopedia.com/konotasi.sukasuka',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
    carouselImages: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80'
    ],
    carouselLabels: [
      'Foto Depan (Edisi Akasha Logam Metalik)',
      'Foto Spine (Punggung Buku Vertikal)',
      'Foto Belakang (Sinopsis Jilid 1)',
      'Kondisi Halaman Dalam & Ilustrasi Pembuka',
      'Detail Ketebalan Jaket Sampul'
    ],
    linkedComicId: 'frieren-manga',
    isSoldOut: false
  },
  {
    id: 'po-solo-1',
    comicTitle: 'Novel Solo Leveling',
    volumeNumber: 1,
    originalPrice: 135000,
    salePrice: 89000,
    conditionRating: '9.2/10',
    notes: 'Kertas bookpaper bersih, ada coretan tipis pembatas bab pertama (tidak mengganggu). Cetakan pertama.',
    shopeeUrl: 'https://shopee.co.id/norinoya.sukasuka',
    tokopediaUrl: 'https://tokopedia.com/konotasi.sukasuka',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80',
    carouselImages: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511108690759-009324a90311?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80'
    ],
    carouselLabels: [
      'Foto Depan (Jaket Tebal Hitam)',
      'Foto Samping (Ketebalan 312 Halaman)',
      'Foto Belakang (Informasi Penerjemah)',
      'Kondisi Kertas Novel Bab 1 (Ada Coretan Tipis)',
      'Foto Sudut Pojok Buku (Sedikit Benturan)'
    ],
    linkedComicId: 'solo-leveling-ln',
    isSoldOut: true
  }
];

export const NEWS_UPDATES: NewsUpdate[] = [
  {
    id: 'news-1',
    username: 'norinoya_feed',
    displayName: 'Norinoya Release Feed',
    timestamp: 'Just now',
    content: '🚨 ANNOUNCEMENT RE-PRINT: Manga "Frieren: After the End" volume 1 & 2 terbitan m&c! Akasha dikonfirmasi akan dicetak ulang menggunakan kertas premium murni akhir bulan ini! Pastikan nantikan link gramedia official di situs ini.',
    category: 'cetakan_ulang',
    hashTags: ['Frieren', 'mcAkasha', 'Mangaindo'],
    attachedImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    affiliateLink: {
      label: 'Cek Database Frieren',
      url: '/database?search=Frieren'
    }
  },
  {
    id: 'news-2',
    username: 'norinoya_feed',
    displayName: 'Norinoya Release Feed',
    timestamp: '2 hours ago',
    content: '📚 RILIS HARI INI: Tanggal 30 Mei 2026, Elex Media menerbitkan beberapa komik hot minggu ini. Antara lain Spy x Family Vol 11, Blue Lock Edisi Reguler Vol 15. Klik tab database di atas untuk checkout via Tokopedia & Gramedia affiliate.',
    category: 'rilisan',
    hashTags: ['ElexMedia', 'RilisanBaru', 'MangaIndo'],
    attachedImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    affiliateLink: {
      label: 'Beli via Gramedia Affiliate',
      url: 'https://www.gramedia.com/categories/komik'
    }
  },
  {
    id: 'news-3',
    username: 'konotasi_pedia',
    displayName: 'Konotasi Edukasi',
    timestamp: '1 day ago',
    content: '💡 EDUKASI TENTANG KERTAS KOMIK: Mengapa komik cetakan lama (sebelum 2012) gampang kuning sekutu rayap? Itu karena penggunaan kertas koran berunsur asam tinggi (acidic pulp). Format terbitan premium (seperti Naruto Bindup dan Akasha) sekarang beralih ke Bookpaper Bebas Asam (Acid-Free paper) demi keawetan puluhan tahun! 📖✨',
    category: 'edukasi',
    hashTags: ['EdukasiManga', 'KonotasiShorts', 'GramediaAffiliate']
  },
  {
    id: 'news-4',
    username: 'norinoya_deals',
    displayName: 'Norinoya Bekas Murah',
    timestamp: '2 days ago',
    content: '🏷️ STOK BEKAS REVIEW MASUK: Baru saja diupload 3 unit komik bekas curated review @konotasi.sukasuka termasuk Naruto Bind Up Ed. 1 kondisi 9.6/10. Langsung check out sebelum disabet pemburu lainnya!',
    category: 'promo',
    hashTags: ['KomikPreOwned', 'KonotasiSukaSuka']
  }
];
