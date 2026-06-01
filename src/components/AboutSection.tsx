import React from 'react';
import { ShieldCheck, Scale, FileText, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 bg-white border border-neutral-200 rounded-xl max-w-4xl mx-auto space-y-6"
      id="about-container"
    >
      {/* Banner info */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-800 text-xs font-mono tracking-wider uppercase rounded-md leading-[16px]">
          Kebijakan Hukum &amp; Tentang Kami
        </span>
        <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-neutral-950 tracking-tight leading-tight">
          Transparansi &amp; Dukungan Industri Kreatif Resmi
        </h1>
        <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto leading-[24px]">
          Norinoya dirancang khusus sebagai wadah kurasi informasi komik/light novel berlisensi resmi di Indonesia, menjembatani ulasan komunitas dari akun media sosial <strong>@konotasi.sukasuka</strong> dengan pembelian produk yang sah.
        </p>
      </div>

      {/* Ads Placeholder */}
      <div className="w-full bg-neutral-50 border border-dashed border-neutral-300 rounded-xl p-4 text-center space-y-1">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block leading-[16px]">📢 SPONSORED ADSENSE</span>
        <div className="text-sm text-neutral-500 font-sans leading-[20px]">
          Iklan Google Adsense membantu kelangsungan server Norinoya. Hubungi kami untuk kerja sama penempatan banner.
        </div>
      </div>

      {/* Key Declarations */}
      <div className="grid md:grid-cols-2 gap-4 pt-2">
        {/* Kebijakan Affiliate */}
        <div className="space-y-2.5 p-5 border border-neutral-250 rounded-xl bg-neutral-50/20">
          <div className="flex items-center gap-2.5 text-neutral-900 font-bold">
            <ShieldCheck className="w-5 h-5 text-neutral-855 shrink-0" />
            <h3 className="font-sans text-base leading-[24px]">Kebijakan Transparansi Affiliate</h3>
          </div>
          <p className="text-sm text-neutral-600 leading-[20px]">
            Sesuai UU No. 8 Tahun 1999 tentang Perlindungan Konsumen serta etika periklanan digital, kami menyatakan bahwa seluruh link pembelian berlabel <strong>"Affiliate"</strong> (Gramedia, Shopee, Tokopedia) mengadopsi program referral resmi. Norinoya menerima persentase komisi kecil dari transaksi tanpa membebankan biaya tambahan sepeser pun kepada pembeli.
          </p>
        </div>

        {/* Perlindungan Hak Cipta */}
        <div className="space-y-2.5 p-5 border border-neutral-250 rounded-xl bg-neutral-50/20">
          <div className="flex items-center gap-2.5 text-neutral-900 font-bold">
            <Scale className="w-5 h-5 text-neutral-855 shrink-0" />
            <h3 className="font-sans text-base leading-[24px]">Kepatuhan UU Hak Cipta No 28/2014</h3>
          </div>
          <p className="text-sm text-neutral-600 leading-[20px]">
            Norinoya berkomitmen memerangi pembajakan karya intelektual. Kami <strong>pantang luar biasa</strong> menyediakan atau mengarahkan ke link baca manga bajakan (seperti scanlation ilegal, situs web mirror, dsb). Seluruh komik/novel didatabasekan hanya dari penerbit resmi Indonesia (PT Elex Media Komputindo, m&c!, dsb) beserta link streaming OTT legal (Netflix, Crunchyroll, dll).
          </p>
        </div>
      </div>

      {/* Detailed Legal Disclaimer */}
      <div className="space-y-4 pt-5 border-t border-neutral-200">
        <h2 className="text-base font-bold font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
          <FileText className="w-5 h-5 text-neutral-700 shrink-0" />
          Keterangan Hukum Tambahan (Disclaimer)
        </h2>
        <div className="text-sm text-neutral-600 space-y-3 leading-[20px]">
          <p>
            1. <strong>Merek Dagang &amp; Hak Cipta Cover:</strong> Semua gambar sampul (cover artwork), cuplikan panel review, serta rujukan karakter komik sepenuhnya dimiliki oleh para ilustrator, kreator Jepang/internasional, dan penerbit berlisensi asli. Norinoya memanfaatkan visual tersebut murni untuk keperluan ulasan (fair use/pendidikan edukatif) guna mempromosikan pembelian cetakan fisik yang legal di Indonesia.
          </p>
          <p>
            2. <strong>Jual Beli Pre-Owned Curated @konotasi.sukasuka:</strong> Barang-barang bekas yang dipajang di tab marketplace bekas adalah komik yang dibeli mandiri oleh tim review dan digunakan sebagai properti konten. Transaksi jual beli dijalankan secara personal melalui platform e-commerce terpercaya (Shopee/Tokopedia) demi keamanan transaksi bersama, tunduk pada hukum jual beli barang pribadi secara perdata Indonesia.
          </p>
          <p>
            3. <strong>Sistem Tanpa Forum / Akun Login:</strong> Demi menjaga kualitas ulasan, integritas data, dan menghindari penyebaran ujaran kebencian atau spam link bajakan di Indonesia, Norinoya diputuskan berjalan <strong>secara statis informatif tanpa adanya sistem registrasi akun atau komentar publik</strong>. Percakapan dua arah sepenuhnya diakomodasi di media sosial resmi kita: <a href="https://instagram.com/norinoya.sukasuka" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-neutral-950 font-mono text-sm">@norinoya.sukasuka</a> and <a href="https://tiktok.com/@norinoya.sukasuka" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-neutral-950 font-mono text-sm">TikTok @norinoya.sukasuka</a>.
          </p>
        </div>
      </div>

      {/* Footer support call */}
      <div className="p-6 bg-neutral-950 text-white rounded-xl flex flex-col md:flex-row justify-between items-center gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <h4 className="font-extrabold text-base font-sans flex items-center justify-center md:justify-start gap-2 leading-[24px]">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            Dukung Ekosistem Manga Indonesia
          </h4>
          <p className="text-xs text-neutral-400 max-w-md leading-[16px]">
            Membeli produk orisinal berarti mendukung kelangsungan hidup mangaka lokal maupun global, serta penerjemah dan editor di penerbit kesayangan kita.
          </p>
        </div>
        <a
          href="https://instagram.com/norinoya.sukasuka"
          target="_blank"
          rel="no-referrer"
          className="px-4 py-2.5 bg-white text-neutral-950 text-xs font-mono font-bold tracking-wider rounded-lg transition-transform active:scale-95 duration-100 hover:bg-neutral-100 inline-block text-center shrink-0 leading-[16px]"
        >
          FOLLOW INSTAGRAM
        </a>
      </div>
    </motion.div>
  );
}
