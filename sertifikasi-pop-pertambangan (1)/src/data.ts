import { ModuleItem, ExamQuestion } from "./types";

export const popModules: ModuleItem[] = [
  {
    id: "modul-1",
    title: "Dasar Keselamatan Pertambangan",
    category: "Dasar K3",
    description: "Memahami regulasi dasar K3 Pertambangan, hak dan kewajiban pekerja, serta peran strategis Pengawas Operasional.",
    ringkasan: "Keselamatan Pertambangan (KP) terbagi menjadi dua aspek utama: Keselamatan dan Kesehatan Kerja (K3) serta Keselamatan Operasi (KO) Pertambangan. Pengawas pertama wajib memahami filosofi pemeliharaan kesehatan pekerja tambang serta pencegahan kecelakaan kerja.",
    materiDetail: [
      "Perbedaan mendasar K3 Pertambangan (keselamatan pekerja, kesehatan kerja) dengan KO Pertambangan (keselamatan instalasi alat, kelayakan sarana, evaluasi teknis).",
      "Kewajiban Pengawas Operasional: Bertanggung jawab kepada KTT atas keselamatan pekerja bawahannya, melakukan inspeksi berkala, serta melaksanakan investigasi insiden.",
      "Dasar Hukum Utama: Undang-Undang No. 1 Tahun 1970 tentang Keselamatan Kerja dan Kepmen ESDM No. 1827 K/30/MEM/2018 Lampiran I-IV.",
      "Hak dan Kewajiban Pekerja Tambang: Mengajukan keberatan bekerja jika kondisi membahayakan, mendapatkan APD standar, serta wajib mematuhi aturan K3 perusahaan."
    ],
    casestudy: {
      title: "Inspeksi Kelayakan Area Kerja Front Tambang",
      description: "Hujan deras mengguyur pit semalaman. Pagi hari pukul 05:30 WIB, Anda menginspeksi front pemuatan batubara. Terlihat tanggul pengaman (safety berm) di tepi tebing mengalami pengikisan akibat limpasan air, dan lebar jalan masuk menyempit hingga kurang dari 1.5 kali lebar dump truck terbesar.",
      question: "Sebagai Pengawas Operasional Pertama, apa tindakan taktis awal Anda demi menjamin keselamatan kru sebelum shift dimulai? Jelaskan dasar keputusannya.",
      guide: "Fokus pada penghentian pekerjaan sementara (stop work authority), pemasangan barricade/safety line, pembetulan tanggul menggunakan grader/dozer, serta pelaporan formal ke KTT/Superintendent."
    },
    keyRegulations: [
      "UU No. 1 Tahun 1970 tentang Keselamatan Kerja",
      "Kepmen ESDM No. 1827 K/30/MEM/2018 Lampiran I"
    ]
  },
  {
    id: "modul-2",
    title: "SMKP Minerba (Sistem Manajemen)",
    category: "Regulasi & Kebijakan",
    description: "Implementasi Sistem Manajemen Keselamatan Pertambangan berdasarkan regulasi nasional ESDM.",
    ringkasan: "SMKP Minerba wajib diterapkan oleh pemegang IUP/IUPK untuk mengendalikan risiko keselamatan kerja dan operasi secara sistematis. SMKP terdiri atas 7 elemen utama yang saling terkait membentuk siklus PDCA.",
    materiDetail: [
      "7 Elemen SMKP Minerba: (1) Kebijakan, (2) Perencanaan, (3) Organisasi & Personil, (4) Implementasi, (5) Pemantauan, Evaluasi & Tindak Lanjut, (6) Dokumentasi, (7) Tinjauan Manajemen.",
      "Tugas Utama Pengawas dalam SMKP: Mengawal pelaksanaan Standard Operating Procedure (SOP) di level kru pelaksana harian.",
      "Sanksi Kelalaian: Pembiaran kecelakaan kerja atau tidak menerapkan audit SMKP tahunan dapat berujung sanksi administratif hingga pencabutan izin operasional IUP."
    ],
    casestudy: {
      title: "Audit Kepatuhan Prosedur Kerja di Workshop Alat Berat",
      description: "Anda menemukan mekanik senior melakukan perbaikan sistem hidrolik Shovel tanpa memasang ganjal ban atau mengaktifkan tag out (LOTO). Alasan mekanik tersebut adalah 'pekerjaan hanya memakan waktu 5 menit'.",
      question: "Bagaimana Anda merespons situasi ini berdasarkan pedoman Elemen Implementasi SMKP? Mengapa kepatuhan LOTO bersifat non-negosiasi?",
      guide: "Stop pekerjaan segera. Berikan edukasi LOTO (Lockout, Tagout, Tryout). Lakukan analisis unsafe act, sampaikan dalam safety brief harian, serta catat insiden penyimpangan di lembar observasi keselamatan."
    },
    keyRegulations: [
      "Kepmen ESDM No. 1827 K/30/MEM/2018 Lampiran IV",
      "Permen ESDM No. 26 Tahun 2018"
    ]
  },
  {
    id: "modul-3",
    title: "Pengelolaan Risiko Pertambangan",
    category: "Keahlian Lapangan",
    description: "Metodologi identifikasi bahaya, penilaian risiko, menetapkan pengendalian hierarchy, serta menyusun JSA.",
    ringkasan: "Manajemen risiko secara terstruktur menggunakan IBPR (Identifikasi Bahaya dan Penilaian Risiko) merupakan instrumen wajib pengawas operasional untuk meminimalkan kecelakaan. Hierarchy of Control harus digunakan secara ketat.",
    materiDetail: [
      "Konsep Bahaya (Hazard) vs Risiko (Risk): Bahaya adalah sumber potensi cedera (misal lereng labil), sedangkan Risiko adalah peluang kejadian dampak buruk (misal excavator tertimbun longsor).",
      "Hierarchy of Control (Hierarki Pengendalian): (1) Eliminasi, (2) Substitusi, (3) Rekayasa Engineering, (4) Administrasi, (5) Alat Pelindung Diri (APD).",
      "Pembuatan JSA (Job Safety Analysis): Langkah kerja, bahaya potensial di tiap langkah, dan rekomendasi langkah kontrol aman."
    ],
    casestudy: {
      title: "Menilai Risiko Operasi di Dekat Lereng Highwall",
      description: "Ditemukan retakan mikro (crack) di kepala lereng setinggi 40 meter di atas area kerja excavator loader. Supervisor produksi menginginkan batubara segera di-loading karena kapal tongkang sudah merapat di port.",
      question: "Lakukan analisis risiko taktis! Di tingkat hierarki pengendalian mana tindakan Anda berada? Berikan solusi mitigasi terstruktur bagi kru.",
      guide: "Gunakan mitigasi berupa Eliminasi (menjauhkan alat dari jangkauan jatuhan) atau Rekayasa (pemberian bench/tanggul di bawah lereng instrumen monitoring crack). Atur jarak operasional minimal."
    },
    keyRegulations: [
      "Kepmen ESDM No. 1827 K/30/MEM/2018 Lampiran II",
      "ISO 31000 Manajemen Risiko"
    ]
  },
  {
    id: "modul-4",
    title: "Investigasi Kecelakaan Tambang",
    category: "Prosedur Darurat & Hukum",
    description: "Langkah penanganan awal kecelakaan, menjaga TKP, melakukan wawancara saksi, merekonstruksi data, dan laporan tertulis.",
    ringkasan: "Kecelakaan tambang harus diinvestigasi untuk menemukan 'Root Cause' (Akar Masalah), bukan mencari kambing hitam. Investigasi menghasilkan rekomendasi pencegahan agar kejadian serupa tidak berulang.",
    materiDetail: [
      "Kriteria Kecelakaan Tambang: Benar terjadi, Cidera akibat kegiatan usaha pertambangan, Terjadi di wilayah IUP/WIUP, Terjadi pada jam kerja, Terjadi karena hubungan kerja.",
      "Tindakan Pertama di Tempat Kejadian (TPTK): Mengamankan korban, mengisolasi area kejadian (memasang garis polisi/barricade), menghentikan operasi sementara.",
      "Wawancara Saksi: Lakukan wawancara saksi awal sesegera mungkin secara individu, gunakan pertanyaan terbuka (5W+1H)."
    ],
    casestudy: {
      title: "Near Miss Serius Tabrakan Dump Truck",
      description: "Saat papasan di jalan hauling jalur semul, Dump Truck OHT HD465 tergelincir ke kanan menabrak bumper roda belakang light vehicle (LV) pengawas tambang. Tidak ada cedera, namun LV mengalami kerusakan parah.",
      question: "Sebutkan 4 langkah TPTK (Tindakan Pertama TKP) yang wajib Anda lakukan seketika setelah menerima info radio insiden ini. Bagaimana Anda merancang alur investigasinya?",
      guide: "Langkah: 1) Pastikan kondisi kru aman, lakukan rescue jika ada syok. 2) Amankan TKP & pasang Yellow/Red line. 3) Ambil dokumentasi visual, posisi setir, bekas rem, kondisi cuaca. 4) Wawancarai kedua driver secara terpisah."
    },
    keyRegulations: [
      "Undang-Undang No. 3 Tahun 2020 (Revisi UU No. 4/2009)",
      "Kepmen ESDM No. 1827 K/30/MEM/2018"
    ]
  },
  {
    id: "modul-5",
    title: "Kepemimpinan Pengawas Tambang",
    category: "Manajerial & Leadership",
    description: "Peran, wewenang, dan akuntabilitas hukum seorang pengawas operasional dalam menggerakkan kepatuhan kru.",
    ringkasan: "Seorang POP memegang posisi kunci sebagai penghubung kebijakan manajemen dengan realita lapangan. Pengabdian keselamatan berada sepenuhnya pada tangan pengawas melalui aktivitas safety leadership harian.",
    materiDetail: [
      "Pengawas sebagai Role Model: Konsistensi berperilaku aman di lapangan memengaruhi psikologi keselamatan seluruh anggota regu kerja.",
      "Akuntabilitas Hukum secara Pidana: Kelalaian pengawas dalam memastikan ketaatan kru yang berujung pada cedera berat atau kematian dapat berkonsekuensi tuntutan pidana.",
      "Pelaksanaan Toolbox Meeting (P5M): Pelaksanaan briefing harian berdurasi 5-10 menit secara efektif, edukatif, dan interaktif."
    ],
    casestudy: {
      title: "Meningkatkan Ketaatan Penggunaan APD Kru",
      description: "Beberapa kru operator tambang paruh baya enggan mengenakan kacamata safety saat shift malam karena mengklaim bahwa menggunakan kacamata mengurangi jarak pandang dan membuat mata cepat lelah.",
      question: "Sebagai pemimpin yang persuasif namun berkomitmen tinggi pada regulasi, metode leadership apa yang Anda jalankan untuk memecahkan keengganan kru tanpa menimbulkan konflik?",
      guide: "Lakukan dialog dua arah (Empathy Leadership). Cari kacamata dengan spesifikasi anti-glass reflect atau anti-fog. Jelaskan secara tegas risiko cedera mata dan tuntutan hukum POP."
    },
    keyRegulations: [
      "Kepmen ESDM No. 1827 K/30/MEM/2018 Lampiran I"
    ]
  },
  {
    id: "modul-6",
    title: "Peraturan Perundangan Pertambangan",
    category: "Regulasi & Kebijakan",
    description: "Membedah aturan undang-undang Minerba, pengawasan teknis tata kelola tambang, dan izin usaha pertambangan.",
    ringkasan: "Regulasi pertambangan bertujuan menjamin usaha konservasi bahan galian, keselamatan lingkungan dan keselamatan manusia. POP wajib hafal hirarki kewenangan Kepala Teknik Tambang (KTT).",
    materiDetail: [
      "Kedudukan Kepala Teknik Tambang (KTT): Pemimpin teknis tertinggi di lapangan yang diakui secara resmi oleh Inspektur Tambang.",
      "Sanksi Hukum: Penghentian sementara sebagian atau seluruh kegiatan usaha akibat ketidaksesuaian dokumen lingkungan hidup atau keselamatan kerja.",
      "UU Minerba Terbaru (UU No. 3 Tahun 2020): Mengatur tata ruang pertambangan, kewajiban reklamasi pascatambang, dan program pengembangan masyarakat."
    ],
    casestudy: {
      title: "Ketidaksesuaian Batasan Area Kontraktor Tambang",
      description: "Anda mendapati operator sub-kontraktor melakukan pembersihan lahan (land clearing) 5 meter di luar batas patok IUP resmi milik perusahaan Anda.",
      question: "Sebagai kepasrahan hukum POP, apa langkah prosedural Anda terhadap sub-kontraktor tersebut? Apa ancaman hukumannya?",
      guide: "Segera stop aktivitas clearing. Laporkan koordinat GPS terbaru ke bagian survey pertambangan & KTT. Pelanggaran batas IUP terancam pidana kurungan dan denda administratif milyaran rupiah."
    },
    keyRegulations: [
      "UU No. 3 Tahun 2020 tentang Perubahan Atas UU No. 4 Tahun 2009",
      "PP No. 96 Tahun 2021"
    ]
  },
  {
    id: "modul-7",
    title: "Pengelolaan Lingkungan Pertambangan",
    category: "Keahlian Lapangan",
    description: "Penanganan Air Asam Tambang (AAT), reklamasi progresif, pengelolaan tumpukan topsoil, dan limbah B3.",
    ringkasan: "Pertambangan berwawasan lingkungan menuntut pengolahan sisa batuan secara berkelanjutan. Pengawas wajib mencegah timbulnya pencemaran tanah dan perairan sekitar areal kerja pertambangan.",
    materiDetail: [
      "Air Asam Tambang (AAT/Acid Mine Drainage): Terjadi akibat reaksi kimia mineral sulfida (seperti pirit) dengan oksigen dan air. Pencegahan dilakukan dengan memisahkan batu PAF (Potential Acid Forming) dan NPAF.",
      "Pengelolaan Tanah Pucuk (Topsoil Management): Penyimpanan tanah subur secara mandiri dengan tinggi tumpukan maksimal agar sirkulasi mikroorganisme tanah tetap aktif guna reklamasi.",
      "Pengelolaan Limbah B3 (Bahan Berbahaya dan Beracun): Penampungan oli bekas di TPS B3 berizin, pelabelan drum, penyediaan spill kit di dekat tangki solar."
    ],
    casestudy: {
      title: "Ceceran Oli Bekas di Area Pit/Workshop",
      description: "Ditemukan ceceran oli pelumas bekas bervolume 50 Liter merembes ke tanah gembur dekat parit tambang akibat drum penyimpanan sub-kontraktor bocor dan tidak dilengkapi secondary containment (bund wall).",
      question: "Langkah darurat lingkungan apa yang pertama dilakukan? Bagaimana menyelesaikan masalah regulasi tumpahan limbah B3 ini?",
      guide: "Lakukan lokalisir rembesan menggunakan absorbent / pasir. Pindahkan sisa oli ke drum yang utuh. Kumpulkan tanah terkontaminasi untuk diolah di bioremediasi berizin. Tegur subkontraktor dan instruksikan pembuatan secondary containment."
    },
    keyRegulations: [
      "UU No. 32 Tahun 2009 tentang Perlindungan & Pengelolaan Lingkungan Hidup",
      "Kepmen ESDM No. 1827 K/30/MEM/2018 Lampiran V"
    ]
  },
  {
    id: "modul-8",
    title: "Keadaan Darurat Pertambangan",
    category: "Prosedur Darurat & Hukum",
    description: "Sistem tanggap darurat (Emergency Response), rute evakuasi, penempatan posko ERT, pertolongan pertama.",
    ringkasan: "Saat terjadi bencana tambang (longsor lereng tebing, kebakaran instalasi, tabrakan fatal), respons cepat pengawas menyelamatkan nyawa kru. Pengawas harus fasih melaksanakan alur komunikasi darurat.",
    materiDetail: [
      "Kategori Keadaan Darurat: Skala kecil (lokal), Skala Menengah (melibatkan seluruh departemen), Skala Besar (nasional/bencana eksternal).",
      "Alur Protokol Darurat: Penemuan insiden -> Pelaporan Radio Darurat (Frekuensi Channel Khusus) -> Aktivasi Sirene -> Panggilan Emergency Response Team (ERT) -> Evakuasi Teratur.",
      "Penyediaan Sarana Tanggap Darurat: Alat Pemadam Api Ringan (APAR) bermeteran isi, kotak P3K lengkap di setiap unit operasional."
    ],
    casestudy: {
      title: "Kebakaran Genset Utama Pit Tambang",
      description: "Genset penyedia listrik pompa air utama di area sump pit terbakar hebat karena konsleting kelistrikan. Terjadi kepanikan di antara 3 mekanik yang bertugas di dekat lokasi.",
      question: "Sebagai pimpinan lapangan terdekat, bagaimana Anda mengontrol situasi darurat, memandu penyelamatan, dan mengoptimalkan evakuasi secara tenang?",
      guide: "Langkah: 1) Instruksikan segera menjauhi genset. 2) Hubungi pusat kendali darurat informasikan lokasi, status, korban. 3) Matikan master sirkuit solar (eliminasi asupan bahan bakar). 4) Gunakan APAR tipe CO2/Powder (jangan air)."
    },
    keyRegulations: [
      "Kepmen ESDM No. 1827 K/30/MEM/2018 Lampiran III",
      "SOP Tanggap Darurat Perusahaan"
    ]
  }
];

export const examQuestions: ExamQuestion[] = [
  {
    id: "q-1",
    module: "Dasar Keselamatan Pertambangan",
    question: "Manakah yang merupakan kriteria utama dari 'Kecelakaan Tambang' sesuai dengan ketentuan Kepmen ESDM Nomor 1827 K/30/MEM/2018?",
    options: [
      "Terjadi di jalan raya umum di luar konsesi tambang, mencederai karyawan yang sedang cuti.",
      "Benar terjadi, mencederai pekerja tambang, terjadi pada jam kerja, di dalam wilayah IUP/WIUP, dan terdapat hubungan kerja.",
      "Kecelakaan yang menimpa keluarga pekerja tambang di dalam mess perumahan.",
      "Terjadi akibat bencana alam banjir nasional yang melanda kota terdekat dari area tambang."
    ],
    answerIndex: 1,
    explanation: "Kecelakaan Tambang memiliki 5 unsur mutlak: (1) Benar terjadi, (2) Cedera pekerja tambang/orang yang diberi izin, (3) Di dalam wilayah IUP/WIUP, (4) Terjadi pada jam kerja, dan (5) Hubungan kerja."
  },
  {
    id: "q-2",
    module: "Dasar Keselamatan Pertambangan",
    question: "Berdasarkan UU No 1 Tahun 1970, siapa yang bertugas melakukan pengawasan secara langsung terhadap kondisi keselamatan di tempat kerja?",
    options: [
      "Operator Alat Berat saja yang mengawasi diri sendiri.",
      "Keluarga pekerja di rumah.",
      "Pengawas Operasional / Direktur yang ditunjuk secara tertulis.",
      "Inspektur Tambang dari jarak jauh tanpa berkunjung."
    ],
    answerIndex: 2,
    explanation: "Undang-Undang Keselamatan Kerja menetapkan pengawas operasional/pimpinan kerja di lapangan memikul kewajiban mengawasi kepatuhan personil harian."
  },
  {
    id: "q-3",
    module: "SMKP Minerba",
    question: "Sistem Manajemen Keselamatan Pertambangan (SMKP) wajib diaudit secara berkala oleh perusahaan tambang. Audit ini bertujuan untuk...",
    options: [
      "Mencari-cari kesalahan operator demi memberikan sanksi PHK.",
      "Mengukur efektivitas penerapan elemen-elemen SMKP, kepatuhan hukum, dan merancang perbaikan terus menerus.",
      "Memastikan keuntungan finansial perusahaan naik 200%.",
      "Membuat laporan fiktif agar KTT mendapatkan bonus tahunan."
    ],
    answerIndex: 1,
    explanation: "Audit SMKP mengukur tingkat kepatuhan dan efektivitas implementasi 7 elemen keselamatan pertambangan secara objektif demi perbaikan berkelanjutan (continuous improvement)."
  },
  {
    id: "q-4",
    module: "SMKP Minerba",
    question: "Elemen berapakah di SMKP Minerba yang membahas mengenai kewenangan, peran, tugas, dan tanggung jawab Kepala Teknik Tambang (KTT)?",
    options: [
      "Elemen I (Kebijakan)",
      "Elemen III (Organisasi dan Personil)",
      "Elemen VI (Dokumentasi)",
      "Elemen VII (Tinjauan Manajemen)"
    ],
    answerIndex: 1,
    explanation: "Elemen III (Organisasi dan Personil) memaparkan struktur kepemimpinan pertambangan, hak/tanggung jawab personil kunci termasuk KTT, PTL, dan Pengawas Operasional."
  },
  {
    id: "q-5",
    module: "Pengelolaan Risiko",
    question: "Berdasarkan hirarki pengendalian risiko (Hierarchy of Control), tindakan mengganti jenis bahan kimia berbahaya yang digunakan untuk pembersihan alat di workshop dengan cairan biodegradable adalah contoh...",
    options: [
      "Eliminasi",
      "Substitusi",
      "Rekayasa Engineering",
      "Alat Pelindung Diri (APD)"
    ],
    answerIndex: 1,
    explanation: "Substitusi melibatkan penggantian material, zat, atau peralatan berbahaya dengan material/alat yang memiliki tingkat bahaya lebih rendah."
  },
  {
    id: "q-6",
    module: "Pengelolaan Risiko",
    question: "Mengapa APD ditempatkan pada tingkat terakhir dalam hierarki pengendalian risiko?",
    options: [
      "Karena APD harganya paling murah dibanding rekayasa engineering.",
      "Karena APD tidak menghilangkan sumber bahaya, melainkan hanya meminimalkan dampak jika terkena paparan.",
      "Karena semua pekerja tidak suka mengenakan APD.",
      "Karena APD mudah diganti saat mengalami kerusakan."
    ],
    answerIndex: 1,
    explanation: "APD diposisikan paling akhir karena hanya mengandalkan perilaku individu untuk melindungi diri, dan sama sekali tidak melikuidasi atau menurunkan tingkat bahaya aktual di tempat kerja."
  },
  {
    id: "q-7",
    module: "Investigasi Kecelakaan",
    question: "Seketika setelah menerima laporan kecelakaan di area timbunan disposal tambang, tindakan pertama yang wajib dipastikan oleh Pengawas Operasional (TPTK) adalah...",
    options: [
      "Menghubungi media massa untuk melapor situasi.",
      "Menghitung jumlah kerugian material alat berat secara rinci.",
      "Memastikan keselamatan personel dari bahaya susulan, menolong korban, serta melokalisir/mengamankan TKP.",
      "Langsung melanjutkan produksi batubara agar target harian tercapai."
    ],
    answerIndex: 2,
    explanation: "Prioritas nomor satu TPTK adalah menghentikan paparan bahaya lanjutan, mengamankan korban, memasang tali pembatas, serta menghentikan seluruh aktivitas kerja di area terpengaruh kecelakaan."
  },
  {
    id: "q-8",
    module: "Investigasi Kecelakaan",
    question: "Dalam melakukan wawancara saksi selama proses penyidikan kecelakaan, teknik yang paling tepat digunakan adalah...",
    options: [
      "Membentak saksi agar tertekan dan mengakui kesalahan temannya.",
      "Mengajukan pertanyaan terbuka dengan empati, secara individual, guna mengumpulkan kronologi faktual.",
      "Mewawancarai saksi secara berkelompok agar mereka saling berdebat satu sama lain.",
      "Menginstruksikan saksi untuk melupakan kejadian agar tidak sedih."
    ],
    answerIndex: 1,
    explanation: "Saksi diwawancarai secara individu, sesegera mungkin di ruangan tenang menggunakan pertanyaan terbuka agar mereka merekonstruksi insiden berdasarkan ingatan murni tanpa dipengaruhi persepsi kelompok."
  },
  {
    id: "q-9",
    module: "Kepemimpinan Pengawas",
    question: "Mengapa seorang Pengawas Operasional Pertama (POP) dapat dituntut hukuman pidana apabila terjadi kecelakaan fatal di area pengawasannya?",
    options: [
      "Karena POP adalah pemilik asli modal saham perusahaan tambang.",
      "Karena POP memiliki tanggung jawab delegasi dari KTT untuk mengawasi keselamatan anak buah di regu kerjanya (akuntabilitas keselamatan).",
      "Karena pimpinan serikat pekerja tidak menyukai pribadi pengawas tersebut.",
      "Ketentuan hukum pidana hanya berlaku bagi pengawas yang tidak memakai seragam resmi."
    ],
    answerIndex: 1,
    explanation: "Secara hukum, Pengawas Operasional memikul tanggung jawab pidana murni (personal criminal liability) bila terbukti lalai melaksanakan fungsi kendali lingkungan kerja yang aman bagi anak buahnya."
  },
  {
    id: "q-10",
    module: "Kepemimpinan Pengawas",
    question: "Agenda Pertemuan Keselamatan Pertambangan (Safety Meeting) harian (P5M) yang ideal dilaksanakan dengan durasi dan fokus...",
    options: [
      "1 jam membahas laporan keuangan bulanan perusahaan.",
      "5-10 menit sebelum shift untuk mengulas kondisi fisik tim, potensi bahaya spesifik hari itu, dan refresh SOP kerja.",
      "Tanpa batas waktu hingga semua orang mengantuk di front tambang.",
      "Cukup 1 menit berteriak menyuruh kru bekerja tanpa briefing terarah."
    ],
    answerIndex: 1,
    explanation: "P5M (Pembicaraan 5 Menit) harus ringkas, interaktif, memantau kondisi personil (fatigue fit-to-work), dan mengidentifikasi hazard di area kerja spesifik yang akan dimasuki hari itu."
  },
  {
    id: "q-11",
    module: "Peraturan Perundangan",
    question: "Siapakah pejabat struktural tertinggi di area pertambangan yang memegang tanggung jawab penuh terhadap operasional keselamatan dan diakui secara administratif oleh pemerintah?",
    options: [
      "Direktur Keuangan Perusahaan kontainer.",
      "Kepala Teknik Tambang (KTT).",
      "Mandor Lapangan dari sub-kontraktor level 3.",
      "Petugas Pos Penjaga Gerbang."
    ],
    answerIndex: 1,
    explanation: "Kepala Teknik Tambang (KTT) adalah pemimpin operasional teknis lapangan tertinggi yang bertanggung jawab langsung atas implementasi K3, KO, dan lingkungan kepada Inspektur Tambang."
  },
  {
    id: "q-12",
    module: "Peraturan Perundangan",
    question: "Berapa jarak minimum dari tebing pit / kaki lereng tambang yang diperbolehkan untuk mendirikan shelter istirahat tanpa analisis rekayasa lereng khusus?",
    options: [
      "1 meter saja.",
      "Sesuai ketentuan, harus berada di luar zona bahaya jatuhan/runtuhan batuan tebing (safety factor minimum 1.5 kali tinggi tebing).",
      "Tepat di tepi tebing yang retak agar mudah melihat pemandangan.",
      "Jarak tidak penting asalkan shelter terbuat dari material seng baja."
    ],
    answerIndex: 1,
    explanation: "Mendirikan bangunan darurat atau meletakkan aset di daerah terdampak runtuhan lereng dilarang total, kecuali dipasang pengaman berupa catch bench maupun tanggul tangkapan batu yang dihitung oleh tim geoteknik."
  },
  {
    id: "q-13",
    module: "Pengelolaan Lingkungan",
    question: "Mineral sulfida (seperti pirit) yang terkandung di sisa kupasan batuan jika bereaksi dengan oksigen dan air hujan akan menghasilkan...",
    options: [
      "Gas metana murni yang ramah lingkungan.",
      "Air Asam Tambang (AAT) yang memiliki pH sangat rendah dan merusak habitat air sekitar tambang.",
      "Pupuk urea organik penumbuh kelapa sawit.",
      "Minyak pelumas diesel alami."
    ],
    answerIndex: 1,
    explanation: "Reaksi oksidasi mineral sulfida menghasilkan air asam tambang (Acid Mine Drainage) dengan tingkat keasaman ekstrim (pH < 4) bertenaga merusak ekologi sungai jika tidak dinetralisir di settling pond menggunakan kapur tohor."
  },
  {
    id: "q-14",
    module: "Pengelolaan Lingkungan",
    question: "Mengapa tinggi tumpukan tanah penutup subur (Topsoil/tanah pucuk) dibatasi maksimal 2 hingga 4 meter saat penumpukan sementara di stockpile tambang?",
    options: [
      "Agar tidak terlihat mencolok dari luar konsesi.",
      "Supaya dozer dapat naik dengan mudah di atasnya.",
      "Untuk menjaga kesuburan sirkulasi oksigen mikroorganisme aerob di dalam tanah guna kesuksesan reklamasi di masa depan.",
      "Agar tumpukan tidak terhempas angin badai tropis."
    ],
    answerIndex: 2,
    explanation: "Pembatasan ketinggian tumpukan tanah pucuk mencegah terjadinya pemadatan berlebih dan kondisi anaerob (minim oksigen) yang membunuh bakteri penyubur dan benih tanaman alami di dalam lapisan tanah tersebut."
  },
  {
    id: "q-15",
    module: "Keadaan Darurat Tambang",
    question: "Apabila terjadi kebakaran hebat pada papan sirkuit kelistrikan di dalam kabin Excavator besar, APAR bertipe manakah yang sama sekali TIDAK boleh digunakan?",
    options: [
      "APAR Air (Water Type)",
      "APAR Karbon Dioksida (CO2 Type)",
      "APAR Bubuk Kimia Kering (Dry Chemical Powder Type)",
      "APAR Gas Clean Agent"
    ],
    answerIndex: 0,
    explanation: "Kebakaran kelistrikan (Kelas C) dilarang menggunakan APAR air karena air bersifat konduktor listrik yang berpotensi mencederai petugas pemadam akibat sengatan arus sirkuit yang masih aktif."
  },
  {
    id: "q-16",
    module: "Keadaan Darurat Tambang",
    question: "Sirene tanda evakuasi darurat tambang dibunyikan dengan pola nada bervariasi terputus-putus. Sebagai pengawas lapangan, langkah yang tepat mengarahkan anggota tim adalah...",
    options: [
      "Menginstruksikan kru untuk tetap bekerja santai menyelesaikan target pemuatan.",
      "Menyuruh semua kru berlarian panik menyelamatkan diri sendiri ke segala arah tanpa kumpul.",
      "Mengarahkan kru mematikan mesin alat, mengamankan dokumen darurat, lalu berjalan tertib menyusuri rambu rute ke Muster Point (Titik Kumpul).",
      "Melompat dari lubang pit ke lereng bukit curam."
    ],
    answerIndex: 2,
    explanation: "Evakuasi harus terorganisir. Pengawas memandu kru mematikan alat secara aman (shutdown), memastikan jalur evakuasi steril, dan berkumpul di Muster Point untuk melakukan headcount."
  },
  {
    id: "q-17",
    module: "Dasar Keselamatan Pertambangan",
    question: "Apa tujuan utama dilaksanakannya Penyelidikan Kecelakaan kerja oleh tim investigasi pertambangan?",
    options: [
      "Menghukum korban kecelakaan agar jera.",
      "Menemukan akar masalah (root cause) insiden dan merumuskan saran kontrol aman agar peristiwa serupa tidak terulang kembali.",
      "Menghindari asuransi kecelakaan kerja keluar.",
      "Membatalkan rencana operasional harian tambang selamanya."
    ],
    answerIndex: 1,
    explanation: "Fokus utama investigasi kecelakaan kerja K3 pertambangan selalu mengidentifikasi kegagalan sistem pengawasan, kontribusi tindakan & kondisi bahaya guna menyusun tindakan pencegahan agar kecelakaan sejenis tidak berulang."
  },
  {
    id: "q-18",
    module: "SMKP Minerba",
    question: "Buku Tambang (Mine Book) diisi oleh KTT atau Pengawas Operasional bertugas atas seizin KTT. Buku ini adalah dokumen legal pertambangan yang mencatat...",
    options: [
      "Daftar kehadiran makan siang seluruh kru tambang.",
      "Catatan teknis khusus, perintah perbaikan dari Inspektur Tambang, instruksi urgen KTT, dan temuan kondisi bahaya kritis.",
      "Pencapaian laba komersial bulanan.",
      "Rencana liburan akhir tahun staf manajemen."
    ],
    answerIndex: 1,
    explanation: "Buku Tambang adalah bukti otentik pengawasan negara terhadap operasional pertambangan. Setiap catatan atau instruksi di dalamnya memegang kekuatan hukum formal yang harus segera ditindaklanjuti."
  },
  {
    id: "q-19",
    module: "Pengelolaan Risiko",
    question: "Kapan JSA (Job Safety Analysis) wajib ditinjau kembali atau direvisi sebelum mulai bekerja?",
    options: [
      "Setahun sekali saja tanpa melihat kondisi lapangan.",
      "Jika terjadi modifikasi langkah kerja, pengenalan alat baru, pergantian lingkungan sirkuit kerja, atau pasca terjadinya insiden near miss.",
      "Hanya jika diperintahkan oleh Direktur non-teknis.",
      "Saat ada kru baru yang tidak suka JSA tersebut."
    ],
    answerIndex: 1,
    explanation: "JSA adalah dokumen hidup. Review JSA mutlak dilakukan apabila ada perubahan material/metode kerja (job scope), perubahan kondisi lingkungan (cuaca, shift malam) atau terjadi insiden penyimpangan di tugas tersebut."
  },
  {
    id: "q-20",
    module: "Keadaan Darurat Tambang",
    question: "Kecelakaan tambang dikategorikan sebagai 'Cidera Berat' apabila korban menurut rekomendasi medis tidak dapat kembali bekerja penuh dalam waktu...",
    options: [
      "Lebih dari 1 hari kerja.",
      "Lebih dari 3 minggu (21 hari kerja) atau mengalami cacat fungsi tubuh permanen.",
      "Tepat 12 jam saja.",
      "Kurang dari 5 hari kerja tanpa rawat inap."
    ],
    answerIndex: 1,
    explanation: "Menurut kriteria hukum pertambangan, cedera berat dicirikan oleh: korban tidak mampu bekerja kembali dalam waktu lebih dari 3 minggu (21 hari kerja), patah tulang, atau amputasi fungsi organ tubuh tertentu."
  }
];
