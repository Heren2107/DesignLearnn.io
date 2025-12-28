// Comprehensive course data with levels, quizzes, case studies, and instructor info

const coursesData = [
  {
    id: 1,
    title: "Graphic Design Fundamental",
    category: "Graphic Design",
    level: "Pemula",
    price: 299000,
    rating: 4.9,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    description: "Pelajari dasar-dasar design grafis, teori warna, tipografi, dan komposisi yang kuat untuk membangun fondasi design Anda.",
    instructor: {
      name: "Siti Naima",
      role: "Graphic Design Specialist",
      bio: "5+ tahun pengalaman di industri advertising dan branding internasional. Pernah bekerja untuk brand-brand Fortune 500.",
      image: "siti naima.jpeg"
    },
    whatYouLearn: [
      "Prinsip-prinsip dasar design dan estetika visual",
      "Teori warna dan psikologi warna dalam design",
      "Tipografi dan pemilihan font yang tepat",
      "Komposisi dan balance dalam layout design",
      "Penggunaan tool design profesional (Adobe suite basics)"
    ],
    levels: [
      {
        levelNumber: 1,
        title: "Color Theory & Basic Principles",
        description: "Memahami dasar teori warna dan prinsip design visual",
        duration: "2 minggu",
        quiz: [
          { question: "Apa yang dimaksud dengan color harmony?", options: ["Kombinasi warna yang serasi", "Perpaduan warna random", "Satu warna saja", "Warna pastel"], correct: 0 },
          { question: "RGB adalah model warna untuk apa?", options: ["Cetak (print)", "Digital (screen)", "Kombinasi keduanya", "Tidak ada"], correct: 1 },
          { question: "Warna komplementer adalah?", options: ["Warna yang sama", "Warna berlawanan di color wheel", "Warna primer", "Warna sekunder"], correct: 1 },
          { question: "Apa fungsi white space dalam design?", options: ["Mengisi kosong", "Memberikan breathing room & fokus", "Tidak penting", "Untuk background"], correct: 1 },
          { question: "Prinsip balance dalam design ada berapa jenis?", options: ["1", "2", "3", "4"], correct: 1 },
          { question: "Apa itu visual hierarchy?", options: ["Urutan penting elemen visual", "Warna terang", "Font besar", "Gambar besar"], correct: 0 },
          { question: "Font serif cocok untuk?", options: ["Web modern", "Buku & dokumen formal", "Iklan casual", "Semua"], correct: 1 },
          { question: "Dalam RGB, kombinasi berapa menghasilkan warna putih?", options: ["0,0,0", "255,255,255", "128,128,128", "200,200,200"], correct: 1 },
          { question: "Contrast dalam design berfungsi untuk?", options: ["Membuat indah", "Membedakan elemen dan menarik perhatian", "Mengisi ruang", "Tidak ada fungsi"], correct: 1 },
          { question: "Palet warna monochromatic terdiri dari?", options: ["Satu warna dengan variasi tone", "Tiga warna primer", "Semua warna", "Warna gelap saja"], correct: 0 }
        ],
        caseStudy: {
          title: "Redesign Brand Color Palette",
          description: "Ambil sebuah brand lokal dan redesign color palette mereka berdasarkan prinsip teori warna dan psikologi warna yang telah dipelajari.",
          requirements: [
            "Analisis brand existing dan target audience mereka",
            "Identifikasi masalah dengan palette saat ini",
            "Buat 3 alternatif color palette baru",
            "Jelaskan reasoning di balik setiap pilihan warna",
            "Buat mockup aplikasi palette pada brand assets (logo, packaging, website)"
          ]
        }
      },
      {
        levelNumber: 2,
        title: "Typography Mastery",
        description: "Menjadi ahli dalam pemilihan dan penggunaan tipografi",
        duration: "2 minggu",
        quiz: [
          { question: "Perbedaan font serif dan sans-serif?", options: ["Ukuran berbeda", "Serif punya kail, sans-serif tidak", "Tidak ada perbedaan", "Serif untuk cetak, sans-serif digital"], correct: 1 },
          { question: "Apa itu kerning?", options: ["Ukuran font", "Jarak antar huruf", "Tebal font", "Jarak antar baris"], correct: 1 },
          { question: "Leading adalah istilah untuk?", options: ["Font berat", "Jarak antar baris", "Spasi karakter", "Alignment teks"], correct: 1 },
          { question: "Berapa jumlah font ideal dalam satu design?", options: ["1", "2-3", "5+", "Semaksimal mungkin"], correct: 1 },
          { question: "Font display cocok digunakan untuk?", options: ["Body text", "Heading & judul", "Paragraf panjang", "Semua"], correct: 1 },
          { question: "Apa itu font hierarchy?", options: ["Font terindah", "Urutan ukuran font dari besar ke kecil", "Font berwarna", "Font ekspensif"], correct: 1 },
          { question: "Untuk readability panjang karakter per baris ideal berapa?", options: ["30-40", "50-75", "100+", "200+"], correct: 1 },
          { question: "Contrast tipografi paling efektif dicapai dengan?", options: ["Warna berbeda", "Ukuran & weight berbeda", "Font sama", "Italic saja"], correct: 1 },
          { question: "Apa fungsi font weight dalam design?", options: ["Mengisi ruang", "Menciptakan emphasis dan hierarchy", "Membuat teks lebih panjang", "Dekorasi"], correct: 1 },
          { question: "Kerning negatif adalah?", options: ["Jarak antar huruf yang lebar", "Jarak antar huruf yang rapat", "Huruf yang hilang", "Error kerning"], correct: 1 }
        ],
        caseStudy: {
          title: "Create Typography System",
          description: "Buat typography system lengkap untuk sebuah startup tech baru dengan brand personality modern dan energik.",
          requirements: [
            "Pilih 2 font yang harmonis (heading + body)",
            "Tentukan font sizes untuk heading (H1-H6) dan body text",
            "Tentukan line heights yang optimal untuk readability",
            "Buat font pairing guidelines",
            "Terapkan pada mockup website dengan berbagai ukuran screen"
          ]
        }
      },
      {
        levelNumber: 3,
        title: "Composition & Layout",
        description: "Menguasai prinsip komposisi dan layout yang efektif",
        duration: "2 minggu",
        quiz: [
          { question: "Rule of thirds adalah prinsip komposisi yang membagi?", options: ["2 bagian", "3 bagian", "4 bagian", "9 bagian"], correct: 3 },
          { question: "Golden ratio dalam design bernilai berapa?", options: ["1.414", "1.618", "2.718", "3.142"], correct: 1 },
          { question: "Apa fungsi grid system dalam design?", options: ["Dekorasi", "Konsistensi & organization", "Pembatas", "Tidak penting"], correct: 1 },
          { question: "Alignment dalam layout ada berapa tipe utama?", options: ["1", "2", "4", "5"], correct: 2 },
          { question: "Proximity prinsip design adalah?", options: ["Warna dekat", "Elemen terkait ditempatkan dekat", "Ukuran sama", "Bentuk sama"], correct: 1 },
          { question: "Apa itu negative space atau white space?", options: ["Ruang kosong yang tidak berguna", "Area kosong yang dirancang dengan sengaja", "Background putih", "Latar belakang terang"], correct: 1 },
          { question: "Gestalt principle grouping adalah?", options: ["Memisahkan elemen", "Mengelompokkan elemen yang sejenis", "Memperbesar elemen", "Pewarnaan elemen"], correct: 1 },
          { question: "Dalam F-pattern layout, mata user bergerak kemana?", options: ["Diagonal", "Horizontal-horizontal-vertikal", "Melingkar", "Acak"], correct: 1 },
          { question: "Aspect ratio 16:9 biasanya untuk?", options: ["Poster", "Instagram", "Video & widescreen", "Foto"], correct: 2 },
          { question: "Modular design system penting untuk?", options: ["Satu project", "Skala & konsistensi brand", "Warna saja", "Typography saja"], correct: 1 }
        ],
        caseStudy: {
          title: "Design Magazine Layout",
          description: "Desain layout majalah digital dengan 10 halaman yang menggunakan prinsip komposisi, grid system, dan visual hierarchy.",
          requirements: [
            "Buat grid system yang konsisten",
            "Design cover dengan rule of thirds",
            "Buat minimal 8 halaman isi dengan variasi layout",
            "Implementasikan proximity dan grouping principles",
            "Pastikan readability di semua ukuran"
          ]
        }
      },
      {
        levelNumber: 4,
        title: "Visual Communication",
        description: "Komunikasi visual yang efektif dan persuasif",
        duration: "2 minggu",
        quiz: [
          { question: "Apa itu semiotics dalam design?", options: ["Seni menggambar", "Ilmu tanda dan makna", "Kombinasi warna", "Pemilihan font"], correct: 1 },
          { question: "Icon design paling efektif ketika?", options: ["Indah", "Mudah dipahami dan recognizable", "Unik", "Kompleks"], correct: 1 },
          { question: "Apa perbedaan sign, symbol, dan icon?", options: ["Tidak ada perbedaan", "Sign literal, symbol abstrak, icon universal", "Semua sama", "Berdasarkan warna"], correct: 1 },
          { question: "Consistency dalam visual language berfungsi untuk?", options: ["Menghemat waktu", "Membangun recognition & trust", "Membuat murah", "Tidak penting"], correct: 1 },
          { question: "Ilustrasi vs fotografi - kapan gunakan ilustrasi?", options: ["Selalu", "Tidak pernah", "Untuk konsep, ide abstrak, atau branding unik", "Hanya untuk entertainment"], correct: 2 },
          { question: "Storytelling dalam visual design adalah?", options: ["Hanya untuk animasi", "Menyampaikan narasi melalui visual", "Tidak relevan", "Hanya untuk advertising"], correct: 1 },
          { question: "Apa itu visual metaphor?", options: ["Kata indah", "Representasi visual dari konsep abstrak", "Gambar biasa saja", "Tidak ada"], correct: 1 },
          { question: "Dalam iconography, simplification penting karena?", options: ["Menghemat space", "Kemudahan recognition & comprehension", "Membuat cepat", "Trend saja"], correct: 1 },
          { question: "Visual hierarchy membantu user untuk?", options: ["Memilih warna", "Tahu apa yang harus dilihat pertama", "Menggambar", "Tidak berguna"], correct: 1 },
          { question: "Brand imagery consistency adalah?", options: ["Optional", "Penting untuk recognition & positioning", "Hanya untuk logo", "Tidak perlu"], correct: 1 }
        ],
        caseStudy: {
          title: "Create Brand Visual System",
          description: "Buat lengkap visual communication system untuk sebuah brand lifestyle yang baru.",
          requirements: [
            "Desain icon set minimal 20 icon yang konsisten",
            "Buat illustration style guidelines",
            "Kembangkan fotografi direction & mood",
            "Buat mockup aplikasi pada berbagai touchpoint brand",
            "Dokumentasi visual guidelines yang lengkap"
          ]
        }
      },
      {
        levelNumber: 5,
        title: "Advanced Design Projects",
        description: "Proyek design profesional tingkat lanjut dengan kompleksitas tinggi",
        duration: "4 minggu",
        quiz: [
          { question: "Design thinking process dimulai dengan?", options: ["Prototyping", "Empathize & understand user", "Implementation", "Testing"], correct: 1 },
          { question: "Apa itu iterative design?", options: ["Design sekali", "Proses perbaikan berulang berdasarkan feedback", "Design cepat", "Design tanpa planning"], correct: 1 },
          { question: "Dalam design process, prototype berfungsi untuk?", options: ["Produk final", "Testing ide & gather feedback", "Dokumentasi saja", "Portfolio"], correct: 1 },
          { question: "A/B testing dalam design adalah?", options: ["Testing dua orang", "Membandingkan dua versi untuk optimasi", "Tidak relevan", "Hanya untuk web"], correct: 1 },
          { question: "Apa itu design sprint?", options: ["Berlari sambil design", "Proses intensive untuk solve problem cepat", "Tidak ada", "Marathon saja"], correct: 1 },
          { question: "Kolaborasi tim design paling efektif dengan?", options: ["Bekerja sendiri", "Communication & feedback loop yang jelas", "Meeting terus", "Email saja"], correct: 1 },
          { question: "Aksesibilitas dalam design adalah?", options: ["Hanya untuk orang tua", "Memastikan design usable untuk semua", "Extra cost", "Trend saja"], correct: 1 },
          { question: "Apa yang harus dipertimbangkan dalam responsive design?", options: ["Hanya desktop", "Desktop, tablet, mobile dengan adaptasi", "Mobile saja", "Tidak penting"], correct: 1 },
          { question: "Design system scale ke?", options: ["Satu project", "Beberapa project", "Seluruh organisasi & multiple product", "Tidak perlu"], correct: 2 },
          { question: "Future skill design profesional yang penting adalah?", options: ["Hanya software", "Kombinasi design, tech, psychology & business", "Tidak ada", "Hanya kreatif"], correct: 1 }
        ],
        caseStudy: {
          title: "Redesign Real-World Product",
          description: "Pilih produk/service lokal yang sudah ada dan lakukan redesign komprehensif menggunakan design thinking process.",
          requirements: [
            "Research & user interview minimal 5 user",
            "Identifikasi pain points & opportunities",
            "Buat wireframe & prototype interaktif",
            "Design final visual dengan brand guidelines",
            "Presentasi lengkap dengan justifikasi design decisions",
            "Prototype digital bisa ditest user"
          ]
        }
      }
    ]
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    category: "UI/UX",
    level: "Menengah",
    price: 449000,
    rating: 4.95,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    description: "Kuasai prinsip UX research, wireframing, prototyping, dan design system modern untuk membuat produk digital yang user-centric.",
    instructor: {
      name: "Hardiansyah Tri Dharma",
      role: "UI/UX Designer & Product Manager",
      bio: "Product designer di startup tech dengan pengalaman 10+ tahun merancang aplikasi mobile dan web yang digunakan jutaan user.",
      image: "hardiansyahtd.jpeg"
    },
    whatYouLearn: [
      "UX research methodologies dan user interview techniques",
      "User personas, user journey mapping, dan empathy mapping",
      "Information architecture dan wireframing",
      "Prototyping tools dan interaction design",
      "Usability testing dan iteration",
      "Design systems dan component libraries"
    ],
    levels: [
      {
        levelNumber: 1,
        title: "UX Research Fundamentals",
        description: "Dasar-dasar UX research dan user understanding",
        duration: "2 minggu",
        quiz: [
          { question: "UX research bertujuan untuk?", options: ["Membuat design indah", "Memahami user needs & behaviors", "Menghemat biaya", "Trend saja"], correct: 1 },
          { question: "Qualitative research adalah?", options: ["Data angka", "Data deskriptif & insights mendalam", "Statistik", "Hanya survey"], correct: 1 },
          { question: "Apa itu user persona?", options: ["Actor dalam drama", "Representasi fiktif user target", "Tidak penting", "Hanya untuk besar company"], correct: 1 },
          { question: "User interview paling efektif dengan?", options: ["Banyak pertanyaan", "Open-ended questions & active listening", "Pertanyaan yes/no", "Chat singkat"], correct: 1 },
          { question: "Empathy map digunakan untuk?", options: ["Membuat design indah", "Memahami user secara holistik", "Mengisi waktu", "Tidak perlu"], correct: 1 },
          { question: "Apa itu user scenario?", options: ["Skenario film", "Kondisi/konteks user menggunakan produk", "Tidak ada", "Hanya untuk game"], correct: 1 },
          { question: "Quantitative research gunakan?", options: ["Cerita", "Data numerik & statistik", "Foto", "Video saja"], correct: 1 },
          { question: "Segmentasi user penting untuk?", options: ["Tidak penting", "Targeting persona yang tepat", "Marketing saja", "Hanya big data"], correct: 1 },
          { question: "Pain points adalah?", options: ["Kebebasan user", "Masalah/frustrasi user dalam menggunakan produk", "Warna terang", "Tidak ada"], correct: 1 },
          { question: "Research bias adalah?", options: ["Pendapat pribadi yang tidak mempengaruhi", "Kesalahan sistematis dalam penelitian", "Metode penelitian", "Tidak ada"], correct: 1 }
        ],
        caseStudy: {
          title: "Conduct Full UX Research",
          description: "Lakukan penelitian UX lengkap untuk sebuah kategori produk lokal yang Anda pilih.",
          requirements: [
            "Lakukan minimal 5-7 user interviews",
            "Buat minimal 3 user personas dengan detail",
            "Identifikasi pain points & opportunities",
            "Buat user journey map untuk primary persona",
            "Dokumentasi research findings dengan insight yang actionable"
          ]
        }
      },
      {
        levelNumber: 2,
        title: "Information Architecture & Wireframing",
        description: "Struktur informasi dan low-fidelity prototyping",
        duration: "2 minggu",
        quiz: [
          { question: "Information Architecture adalah?", options: ["Design indah", "Struktur organisasi informasi & navigasi", "Database", "Dekorasi"], correct: 1 },
          { question: "Wireframe adalah?", options: ["Desain final dengan warna", "Sketsa struktur & layout tanpa visual style", "Prototype interaktif", "Kode"], correct: 1 },
          { question: "Perbedaan wireframe, mockup, prototype adalah?", options: ["Tidak ada", "Wireframe struktur, mockup visual, prototype interaktif", "Semua sama", "Hanya nama berbeda"], correct: 1 },
          { question: "Navigation structure paling umum adalah?", options: ["Random", "Hierarchical, flat, atau hybrid", "Tidak penting", "Hanya satu jenis"], correct: 1 },
          { question: "Card-based design berguna untuk?", options: ["Tidak berguna", "Organize & present information modular", "Hanya fashion", "Trend saja"], correct: 1 },
          { question: "Breadcrumb navigation adalah?", options: ["Makanan", "Menunjukkan posisi user dalam hierarchy", "Tidak penting", "Hanya desktop"], correct: 1 },
          { question: "Apa fungsi wireframe dalam design process?", options: ["Akhir produk", "Communicate struktur sebelum design visual", "Portfolio", "Dokumentasi saja"], correct: 1 },
          { question: "Low-fidelity prototype berguna untuk?", options: ["Produk final", "Quick testing & iteration ideas", "Marketing", "Tidak perlu"], correct: 1 },
          { question: "Mobile-first approach adalah?", options: ["Hanya untuk mobile", "Design mobile terlebih dahulu, kemudian scale up", "Tidak ada", "Trend marketing"], correct: 1 },
          { question: "Responsive grid system untuk mobile adalah?", options: ["Bebas", "12 column atau 8 column yang flexible", "Tidak perlu", "Hanya desktop"], correct: 1 }
        ],
        caseStudy: {
          title: "Design Mobile App Information Architecture",
          description: "Buat information architecture & wireframe lengkap untuk aplikasi mobile pada kategori produk pilihan Anda.",
          requirements: [
            "Analisis competitor apps dan best practices",
            "Buat user flow untuk main tasks",
            "Design wireframe minimal 15 screens",
            "Dokumentasi navigasi structure dengan rationale",
            "Create interactive wireframe prototype"
          ]
        }
      },
      {
        levelNumber: 3,
        title: "High-Fidelity Design & Visual Design",
        description: "Desain visual berkualitas tinggi dan interactive mockup",
        duration: "2 minggu",
        quiz: [
          { question: "High-fidelity mockup adalah?", options: ["Wireframe", "Design visual lengkap mendekati produk final", "Sketch", "Concept"], correct: 1 },
          { question: "Design system components berguna untuk?", options: ["Dekorasi", "Konsistensi & reusability across products", "Marketing", "Portfolio saja"], correct: 1 },
          { question: "Atomic design methodology membagi komponen menjadi?", options: ["2 level", "Atoms, molecules, organisms, templates, pages", "Tidak ada", "Random"], correct: 1 },
          { question: "Apa itu design token?", options: ["Koin desain", "Variable visual yang dapat reuse", "File", "Hanya color"], correct: 1 },
          { question: "Micro-interaction dalam design adalah?", options: ["Interaksi kecil", "Detail interaktif yang meningkatkan UX", "Tidak penting", "Hanya animasi"], correct: 1 },
          { question: "Apa itu design specification atau handoff?", options: ["Cerita design", "Dokumentasi detail untuk developer", "Tidak perlu", "Hanya visual"], correct: 1 },
          { question: "Accessibility dalam UI design penting untuk?", options: ["Hanya color blind", "Semua user termasuk disabilities", "Extra cost", "Optional"], correct: 1 },
          { question: "Dark mode dalam design adalah?", options: ["Hanya estetika", "Opsi visual & accessibility consideration", "Trend saja", "Marketing"], correct: 1 },
          { question: "Hover, focus, active states dalam design?", options: ["Tidak perlu", "Essential untuk interactive feedback", "Hanya desktop", "Designer tidak butuh"], correct: 1 },
          { question: "Loading state & empty state design adalah?", options: ["Tidak penting", "Critical untuk user experience", "Hanya untuk developer", "Dapat diabaikan"], correct: 1 }
        ],
        caseStudy: {
          title: "Create Complete Design System",
          description: "Buat design system lengkap dengan komponen reusable untuk produk digital yang Anda desain.",
          requirements: [
            "Design 30+ UI components dengan variants",
            "Buat color, typography, spacing, & icon system",
            "Document component usage guidelines",
            "Apply design system pada minimal 10 screens",
            "Create handoff documentation untuk developer"
          ]
        }
      },
      {
        levelNumber: 4,
        title: "Advanced Prototyping & Interaction",
        description: "Prototyping interaktif dan advanced animation",
        duration: "2 minggu",
        quiz: [
          { question: "Prototyping tools modern yang populer?", options: ["Hanya Sketch", "Figma, Framer, Adobe XD, etc", "Hanya PowerPoint", "Tidak ada"], correct: 1 },
          { question: "Interaction design adalah?", options: ["Hanya button", "Merancang bagaimana user berinteraksi dengan produk", "Visual design", "Koding"], correct: 1 },
          { question: "Animation dalam UX berguna untuk?", options: ["Dekorasi saja", "Feedback, guidance, & visual continuity", "Membuat lambat", "Tidak perlu"], correct: 1 },
          { question: "Micromotion adalah?", options: ["Film kecil", "Animasi kecil yang enhance UX", "Tidak ada", "Hanya CSS"], correct: 1 },
          { question: "Timing function dalam animasi adalah?", options: ["Jam", "Easing curve yang define motion speed", "Tidak penting", "Developer job"], correct: 1 },
          { question: "Gesture-based interaction adalah?", options: ["Tanpa sentuhan", "Interaksi melalui gesture (swipe, tap, dll)", "Hanya tikus", "Mobile saja"], correct: 1 },
          { question: "State management dalam prototyping adalah?", options: ["Hanya visual", "Manage kondisi UI berdasarkan user action", "Tidak penting", "Developer saja"], correct: 1 },
          { question: "Flow-based prototyping adalah?", options: ["Satu screen", "Simulate alur user dengan multiple screen & interaction", "Tidak ada", "Hanya video"], correct: 1 },
          { question: "Prototype fidelity level ada berapa?", options: ["1", "3 (low, medium, high)", "5", "Tidak ada"], correct: 1 },
          { question: "Design QA dalam prototyping adalah?", options: ["Tidak perlu", "Testing prototype untuk consistency & logic", "Marketing", "Hanya code"], correct: 1 }
        ],
        caseStudy: {
          title: "Build Interactive Prototype",
          description: "Buat prototype interaktif lengkap dengan micro-interaction dan animation untuk sebuah fitur produk digital.",
          requirements: [
            "Buat flow interactive dengan minimal 20 screens",
            "Implement micro-interaction & animation yang meaningful",
            "Test prototype dengan 3-5 user & gather feedback",
            "Iterasi berdasarkan user feedback",
            "Create presentation menjelaskan design decisions"
          ]
        }
      },
      {
        levelNumber: 5,
        title: "Product Design & UX Strategy",
        description: "Strategi produk dan design thinking di level enterprise",
        duration: "4 minggu",
        quiz: [
          { question: "Product strategy adalah?", options: ["Hanya marketing", "Long-term plan yang align design, business, & user", "Tidak penting", "Creative saja"], correct: 1 },
          { question: "User-centered design adalah?", options: ["Hanya riset", "Menempatkan user needs di center dari design process", "Designer job", "Tidak relevan"], correct: 1 },
          { question: "Metrics & KPI dalam design adalah?", options: ["Tidak perlu", "Cara measure design effectiveness", "Hanya business", "Creative tidak perlu"], correct: 1 },
          { question: "Design thinking framework ada berapa tahap?", options: ["2", "5 (Empathize, Define, Ideate, Prototype, Test)", "10", "Tidak ada"], correct: 1 },
          { question: "Scoping dalam design project adalah?", options: ["Tidak penting", "Define deliverables, timeline, & constraints", "Hanya PM job", "Creative freedom saja"], correct: 1 },
          { question: "Stakeholder management dalam design adalah?", options: ["Tidak perlu", "Manage expectations & align semua pihak", "Hanya client", "Sales job"], correct: 1 },
          { question: "Design research for innovation adalah?", options: ["Tidak berguna", "Uncover opportunities & inform innovation", "Hanya existing product", "Marketing"], correct: 1 },
          { question: "Handoff & collaboration dengan developer adalah?", options: ["Selesai design", "Ongoing communication & support", "Tidak perlu design", "One-time meeting"], correct: 1 },
          { question: "Design leadership skill yang penting adalah?", options: ["Hanya menggambar bagus", "Communication, mentoring, strategic thinking", "Senior level saja", "Tidak ada"], correct: 1 },
          { question: "Future of UX Design mencakup?", options: ["Statis saja", "AI, voice, AR/VR, dan emerging tech", "Tidak ada perubahan", "Hanya web"], correct: 1 }
        ],
        caseStudy: {
          title: "End-to-End Product Design",
          description: "Lakukan design komprehensif dari ideation hingga high-fidelity prototype untuk produk baru yang Anda buat.",
          requirements: [
            "Conduct market research & competitive analysis",
            "User research dengan minimal 10 user interviews",
            "Create product strategy & vision",
            "Design complete user flow & journey",
            "Build high-fidelity prototype dengan interaction",
            "Conduct usability testing dengan 5 user",
            "Final presentation dengan business case & ROI projection"
          ]
        }
      }
    ]
  },
  {
    id: 3,
    title: "Web Design Essentials",
    category: "Web Design",
    level: "Pemula",
    price: 349000,
    rating: 4.85,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    description: "Buat website yang indah dan fungsional dengan prinsip design responsif, user experience terbaik, dan web performance optimization.",
    instructor: {
      name: "Usi Rahmadhanti",
      role: "Web & Motion Designer",
      bio: "Creative director yang passionate dalam menciptakan pengalaman digital yang memorable. Spesialis dalam web design responsif dan motion graphics.",
      image: "usi.jpeg"
    },
    whatYouLearn: [
      "Prinsip responsive web design untuk semua device",
      "Modern web design trends dan best practices",
      "Navigation & CTA optimization untuk conversion",
      "Performance optimization & page speed",
      "Accessibility compliance (WCAG)",
      "Web animation & motion design",
      "SEO-friendly design practices"
    ],
    levels: [
      {
        levelNumber: 1,
        title: "Responsive Design Foundation",
        description: "Dasar responsive design dan mobile-first thinking",
        duration: "2 minggu",
        quiz: [
          { question: "Responsive design adalah?", options: ["Hanya desktop", "Design yang adapt ke berbagai screen size", "Hanya mobile", "Tidak ada"], correct: 1 },
          { question: "Mobile-first approach berarti?", options: ["Hanya mobile", "Design mobile dulu, kemudian scale up", "Mobile terakhir", "Tidak perlu"], correct: 1 },
          { question: "Viewport meta tag berguna untuk?", options: ["Dekorasi", "Control layout di berbagai device", "Tidak perlu", "Hanya mobile"], correct: 1 },
          { question: "Breakpoint dalam design adalah?", options: ["Error", "Screen width threshold untuk design change", "Tidak penting", "Hanya pixel"], correct: 1 },
          { question: "Fluid layout adalah?", options: ["Tetap", "Layout yang flexible berdasarkan container", "Tidak ada", "Hanya responsive"], correct: 1 },
          { question: "Touch target size ideal minimum berapa pixel?", options: ["20px", "44px atau 48px", "10px", "Bebas"], correct: 1 },
          { question: "Apa itu flexible typography?", options: ["Hanya besar", "Font size yang scale responsif", "Tidak perlu", "Designer saja"], correct: 1 },
          { question: "Image optimization untuk responsive adalah?", options: ["Hanya memperkecil", "Use appropriate format & size untuk screen", "Tidak penting", "Hanya jpeg"], correct: 1 },
          { question: "CSS media queries digunakan untuk?", options: ["Dekorasi", "Apply style based on device characteristics", "Tidak perlu", "Hanya warna"], correct: 1 },
          { question: "Progressive enhancement dalam web adalah?", options: ["Hanya fitur baru", "Start basic, add enhancement untuk capable browser", "Tidak penting", "Semua sama"], correct: 1 }
        ],
        caseStudy: {
          title: "Design Responsive Website",
          description: "Desain website responsif lengkap untuk bisnis lokal pilihan Anda dengan design yang menarik di mobile dan desktop.",
          requirements: [
            "Research website kompetitor dan best practices",
            "Buat wireframe untuk mobile, tablet, desktop",
            "Design visual mockup untuk 3 breakpoint",
            "Implement responsive design principles",
            "Test pada real device untuk quality assurance",
            "Document responsive strategy & breakpoint"
          ]
        }
      },
      {
        levelNumber: 2,
        title: "Modern Web Design & UX",
        description: "Tren modern dan UX best practices untuk web",
        duration: "2 minggu",
        quiz: [
          { question: "Minimalism dalam web design adalah?", options: ["Kosong", "Fokus essential elements, eliminate clutter", "Tidak indah", "Trend saja"], correct: 1 },
          { question: "Neumorphism dalam design adalah?", options: ["Platform baru", "Blend skeuomorphism & flat design", "Tidak ada", "Hanya app"], correct: 1 },
          { question: "Hero section berguna untuk?", options: ["Tidak penting", "Grab attention & communicate main message", "Dekorasi", "Hanya homepage"], correct: 1 },
          { question: "CTA button paling effective design adalah?", options: ["Kecil", "High contrast, clear text, obvious action", "Tersembunyi", "Random"], correct: 1 },
          { question: "Scroll behavior dalam modern web adalah?", options: ["Top to bottom", "Parallax, lazy load, infinite scroll, etc", "Tidak ada", "Hanya desktop"], correct: 1 },
          { question: "Glassmorphism trend adalah?", options: ["Kaca", "Frosted glass effect dengan transparency", "Tidak ada", "Hanya design"], correct: 1 },
          { question: "Gradient dalam modern web design trend?", options: ["Tidak", "Yes, subtle gradient untuk depth", "Tidak indah", "Hanya retro"], correct: 1 },
          { question: "Variable font dalam web adalah?", options: ["Teks dinamis", "Single font file dengan multiple weight & style", "Tidak ada", "Hanya CSS"], correct: 1 },
          { question: "Dark mode website design adalah?", options: ["Hanya estetika", "Accessibility & user preference option", "Trend saja", "Tidak perlu"], correct: 1 },
          { question: "Above-the-fold content adalah?", options: ["Di atas", "Visible content tanpa scroll", "Tidak penting", "Designer job"], correct: 1 }
        ],
        caseStudy: {
          title: "Redesign Website with Modern Trends",
          description: "Ambil website existing dan redesign menggunakan tren modern web design sambil mempertahankan brand identity.",
          requirements: [
            "Audit website existing untuk UX issues",
            "Apply minimal 3 modern design trend",
            "Improve CTA & conversion points",
            "Enhance visual hierarchy & readability",
            "Create high-fidelity mockup & prototype",
            "Compare before-after design improvements"
          ]
        }
      },
      {
        levelNumber: 3,
        title: "E-commerce & Conversion Design",
        description: "Design untuk e-commerce dan optimization conversion",
        duration: "2 minggu",
        quiz: [
          { question: "E-commerce design principle utama adalah?", options: ["Terlihat mewah", "Easy browsing, smooth checkout, trust building", "Hanya indah", "Mobile saja"], correct: 1 },
          { question: "Product page layout penting element?", options: ["Hanya foto", "Image, description, price, review, CTA", "Tidak penting", "Text saja"], correct: 1 },
          { question: "Trust signals dalam e-commerce adalah?", options: ["Tidak ada", "Review, certification, guarantee, security badge", "Dekorasi", "Tidak perlu"], correct: 1 },
          { question: "Checkout flow optimal step berapa?", options: ["1 langkah", "3-4 langkah maksimal", "Sebanyak mungkin", "Tidak penting"], correct: 1 },
          { question: "Cart abandonment rate optimal berapa?", options: ["90%", "30-40% adalah normal", "0%", "Tidak penting"], correct: 1 },
          { question: "Product filtering & search penting untuk?", options: ["Dekorasi", "Help user find product easily", "Tidak perlu", "Hanya besar store"], correct: 1 },
          { question: "Payment method diversity berguna untuk?", options: ["Tidak perlu", "Increase conversion dengan user preference", "Sama saja", "Ribet"], correct: 1 },
          { question: "Product image carousel best practice?", options: ["Otomatis", "Manual control, multiple angle, zoom", "Hanya satu foto", "Video saja"], correct: 1 },
          { question: "Reviews & rating display penting karena?", options: ["Dekorasi", "Build trust & influence purchase decision", "Tidak penting", "Hanya marketing"], correct: 1 },
          { question: "Email confirmation & order tracking dalam design?", options: ["Tidak penting", "Reduce anxiety & build confidence", "Backend saja", "Designer tidak perlu"], correct: 1 }
        ],
        caseStudy: {
          title: "Design E-commerce Website",
          description: "Desain complete e-commerce website untuk produk fisik atau digital pilihan Anda dengan focus pada conversion.",
          requirements: [
            "Design product catalog dengan filter & search",
            "Create product detail page yang convert",
            "Design complete checkout flow",
            "Implement trust signals & social proof",
            "Design mobile-specific e-commerce UX",
            "Create email & post-purchase experience design"
          ]
        }
      },
      {
        levelNumber: 4,
        title: "Web Animation & Interaction",
        description: "Animation dan interaction design untuk web",
        duration: "2 minggu",
        quiz: [
          { question: "Web animation berguna untuk?", options: ["Hanya indah", "Engagement, feedback, visual continuity", "Membuat lambat", "Tidak perlu"], correct: 1 },
          { question: "CSS animation vs JavaScript animation?", options: ["Sama", "CSS efficient, JS flexible", "Hanya CSS", "Hanya JavaScript"], correct: 1 },
          { question: "Scroll animation berguna untuk?", options: ["Tidak perlu", "Engage user & enhance storytelling", "Membuat bingung", "Hanya desktop"], correct: 1 },
          { question: "Entrance animation best practice?", options: ["Random", "Brief, not distracting, purpose-driven", "Panjang", "Tidak ada"], correct: 1 },
          { question: "Loading animation berguna untuk?", options: ["Hanya indah", "Reduce perceived load time", "Tidak perlu", "Hanya mobile"], correct: 1 },
          { question: "Parallax effect dalam web adalah?", options: ["Tidak ada", "Multiple layers moving at different speed", "Hanya game", "Trend"], correct: 1 },
          { question: "SVG animation advantage adalah?", options: ["Sama seperti image", "Scalable, lightweight, interactive", "Tidak ada", "Hanya besar"], correct: 1 },
          { question: "Performance optimization untuk animation?", options: ["Tidak perlu", "Use transform & opacity, avoid layout shift", "Hanya CSS", "Tidak ada"], correct: 1 },
          { question: "Accessibility dalam animation adalah?", options: ["Tidak penting", "Respect prefers-reduced-motion setting", "Optional", "Design saja"], correct: 1 },
          { question: "Micro-interaction animation timing ideal?", options: ["Panjang", "100-300ms untuk subtle feedback", "Instan", "Tidak ada"], correct: 1 }
        ],
        caseStudy: {
          title: "Create Animated Landing Page",
          description: "Buat landing page dengan web animation & micro-interaction yang engaging untuk product atau service pilihan.",
          requirements: [
            "Design landing page dengan hero section animated",
            "Implement scroll-triggered animation",
            "Create micro-interaction untuk button & form",
            "Add loading animation & page transition",
            "Optimize animation performance",
            "Ensure accessibility dengan prefers-reduced-motion"
          ]
        }
      },
      {
        levelNumber: 5,
        title: "Web Performance & Advanced Topics",
        description: "Web performance, SEO, dan advanced web technologies",
        duration: "4 minggu",
        quiz: [
          { question: "Web vitals penting untuk?", options: ["Hanya programmer", "User experience & SEO ranking", "Design tidak perlu", "Random"], correct: 1 },
          { question: "Largest Contentful Paint (LCP) ideal berapa?", options: ["5s", "2.5s atau kurang", "Tidak penting", "Bebas"], correct: 1 },
          { question: "Cumulative Layout Shift (CLS) adalah?", options: ["Tidak ada", "Visual stability measure", "Hanya mobile", "Developer saja"], correct: 1 },
          { question: "First Input Delay (FID) ideal berapa?", options: ["2s", "100ms atau kurang", "Tidak penting", "Tidak ada"], correct: 1 },
          { question: "SEO-friendly design element adalah?", options: ["Tidak ada", "Semantic HTML, fast load, mobile-friendly", "Hanya marketing", "Designer tidak perlu"], correct: 1 },
          { question: "Image optimization strategy adalah?", options: ["Hanya kecil", "Choose format, compress, lazy load, responsive", "Tidak penting", "Bebas"], correct: 1 },
          { question: "CSS & JavaScript optimization untuk?", options: ["Tidak perlu", "Reduce file size & improve load speed", "Hanya backend", "Design saja"], correct: 1 },
          { question: "PWA (Progressive Web App) advantage?", options: ["Hanya aplikasi", "App-like experience, offline capability", "Tidak ada", "Hanya web"], correct: 1 },
          { question: "Dark mode implementation dalam design workflow?", options: ["Separate design", "Plan untuk both light & dark variant", "Tidak perlu", "Frontend saja"], correct: 1 },
          { question: "Design handoff untuk web development berisi?", options: ["Hanya visual", "Spec, component, animation, asset, guideline", "Tidak perlu", "Visual saja"], correct: 1 }
        ],
        caseStudy: {
          title: "Build High-Performance Website",
          description: "Desain & optimize website untuk performa maksimal dengan score tinggi di Google Lighthouse.",
          requirements: [
            "Design website responsif & accessible",
            "Optimize untuk Core Web Vitals",
            "Implement lazy loading & image optimization",
            "Optimize CSS & JavaScript",
            "Setup comprehensive design handoff",
            "Achieve 90+ score di Lighthouse",
            "Document performance optimization strategy"
          ]
        }
      }
    ]
  }
  
];

