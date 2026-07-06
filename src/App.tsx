import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, ShieldCheck, GraduationCap, Calendar, MapPin, 
  Plus, LogIn, UserPlus, LogOut, Download, Trash2, 
  Share2, Edit3, ArrowLeft, CheckCircle, AlertCircle, 
  FileText, Database, User, Search, Copy, Check,
  Clock, Phone, Mail, Globe, RefreshCw, Sliders, QrCode, Info, X, Sparkles
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { Certificate, User as UserType, CertificateTemplate } from './types';
import CertificatePreview from './components/CertificatePreview';
import PricingModal from './components/PricingModal';
import TemplatesModal from './components/TemplatesModal';
import CabinetView from './components/CabinetView';
import VerifyView from './components/VerifyView';

const PRESETS = [
  {
    name: "Ingliz Tili Kursi",
    orgName: "MUBINA EDUCATION ACADEMY",
    certTitle: "DIPLOM",
    certId: "ENG-502091",
    recipientName: "TOHIROV JAXONGIR BEKALIYEVICH",
    courseDescription: "CHET TILLARINI MUVAFFAQIYATLI O'ZLASHTIRGANLIK VA SINOV IMTIHONLARIDAN MUVOFIQ O'TGANLIK TO'G'RISIDA",
    courseDescriptionShort: 'O\'quvchi ingliz tili (CEFR B2 Intermediate Level) intensiv dasturi bo\'yicha 6 oylik (144 soatlik) o\'quv kursini a\'lo baholar bilan muvaffaqiyatli yakunladi.',
    date: "2026-06-25",
    signee: "ALIMOV AKMAL FAXRIDDINOVICH",
    location: "Toshkent shahri, Chilonzor tumani",
    template: "gold" as CertificateTemplate
  },
  {
    name: "Frontend Dasturlash Kursi",
    orgName: "MUBINA TECH ACADEMY",
    certTitle: "SERTIFIKAT",
    certId: "IT-990812",
    recipientName: "SADULLAYEV ELBEK MAXMUDOVICH",
    courseDescription: "ZAMONAVIY AXBOROT TEXNOLOGIYALARI VA FRONTEND DASTURLASH YO'NALISHI BO'YICHA O'QUV KURSLARINI MUVAFFAQIYATLI TUGATGANLIK TO'G'RISIDA",
    courseDescriptionShort: 'Muvaffaqiyatli ravishda (HTML, CSS, JavaScript, React, Tailwind CSS va TypeScript) o\'quv kursini (120 soatli amaliy darslar bilan) to\'liq yakunladi va yuqori natija ko\'rsatdi.',
    date: "2026-06-12",
    signee: "KARIMOV NODIRBEK ULUG\'BEKOVICH",
    location: "Samarqand shahri, Registon ko'chasi",
    template: "green" as CertificateTemplate
  }
];

export default function App() {
  // Navigation & Authentication state
  const [user, setUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('sertifikat_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState<'home' | 'login' | 'register' | 'dashboard' | 'editor' | 'verify'>('home');

  // Modal open states for unified page interaction
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  
  // App lists and loading states
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);

  // Certificate Form (Editor) state
  const [orgName, setOrgName] = useState('MUBINA EDUCATION ACADEMY');
  const [certTitle, setCertTitle] = useState('DIPLOM');
  const [certId, setCertId] = useState('ENG-502091');
  const [recipientName, setRecipientName] = useState('TOHIROV JAXONGIR BEKALIYEVICH');
  const [courseDescription, setCourseDescription] = useState('CHET TILLARINI MUVAFFAQIYATLI O\'ZLASHTIRGANLIK VA SINOV IMTIHONLARIDAN MUVOFIQ O\'TGANLIK TO\'G\'RISIDA');
  const [courseDescriptionShort, setCourseDescriptionShort] = useState('O\'quvchi ingliz tili (CEFR B2 Intermediate Level) intensiv dasturi bo\'yicha 6 oylik (144 soatlik) o\'quv kursini a\'lo baholar bilan muvaffaqiyatli yakunladi.');
  const [date, setDate] = useState('2026-06-25');
  const [signee, setSignee] = useState('ALIMOV AKMAL FAXRIDDINOVICH');
  const [location, setLocation] = useState('Toshkent shahri, Chilonzor tumani');
  const [template, setTemplate] = useState<CertificateTemplate>('gold');
  const [recipientFont, setRecipientFont] = useState<string>('serif');

  // Authentication forms state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Verification Portal state
  const [verifyInputCode, setVerifyInputCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifiedCert, setVerifiedCert] = useState<Certificate | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // UI Helpers
  const [editorSaving, setEditorSaving] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [editorSuccess, setEditorSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  // Check URL parameters for direct verification link (e.g. ?code=093-060250)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const path = window.location.pathname;

    if (code) {
      setView('verify');
      setVerifyInputCode(code);
      handleVerify(code);
    } else if (path === '/verify' || path.startsWith('/verify/')) {
      setView('verify');
    }
  }, []);

  // Fetch certificates when user changes
  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    if (!user) {
      setCertificates([]);
      return;
    }
    setLoadingCerts(true);
    try {
      const url = `/api/certificates?userId=${user.id}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoadingCerts(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sertifikat_user');
    setCertificates([]);
  };

  // Certificate Verification Handler
  const handleVerify = async (codeToVerify?: string) => {
    const targetCode = codeToVerify || verifyInputCode;
    if (!targetCode.trim()) return;

    setVerifyLoading(true);
    setVerifyError(null);
    setVerifiedCert(null);

    try {
      const res = await fetch(`/api/certificates/${targetCode.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setVerifiedCert(data);
      } else {
        // Fallback to active editor values if it matches the current preview ID
        if (targetCode.trim() === certId.trim()) {
          setVerifiedCert({
            id: 'active-preview-draft',
            userId: 'active-user',
            orgName,
            certId,
            recipientName,
            courseDescription,
            certTitle,
            courseDescriptionShort,
            date,
            signee,
            location,
            template,
            createdAt: new Date().toISOString()
          });
        } else {
          setVerifyError('Sertifikat topilmadi yoki haqiqiy emas');
        }
      }
    } catch (err) {
      // Fallback in case of network or server offline
      if (targetCode.trim() === certId.trim()) {
        setVerifiedCert({
          id: 'active-preview-draft',
          userId: 'active-user',
          orgName,
          certId,
          recipientName,
          courseDescription,
          certTitle,
          courseDescriptionShort,
          date,
          signee,
          location,
          template,
          createdAt: new Date().toISOString()
        });
      } else {
        setVerifyError('Tekshirish jarayonida xatolik yuz berdi');
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  const resetVerification = () => {
    setVerifyInputCode('');
    setVerifiedCert(null);
    setVerifyError(null);
  };

  // Save/Update certificate to DB
  const handleSaveCertificate = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setEditorError(null);
    setEditorSuccess(null);
    setEditorSaving(true);

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          orgName,
          certTitle,
          certId,
          recipientName,
          courseDescription,
          courseDescriptionShort,
          date,
          signee,
          location,
          template,
          recipientFont,
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setEditorError(data.error || 'Sertifikatni saqlab bo\'lmadi');
      } else {
        setEditorSuccess('Sertifikat muvaffaqiyatli saqlandi!');
        fetchCertificates();
      }
    } catch (err) {
      setEditorError('Serverga bog\'lanishda xatolik yuz berdi');
    } finally {
      setEditorSaving(false);
    }
  };

  // Export/Download as high-res PNG image
  const handleDownload = async (certName?: string) => {
    const el = document.getElementById('certificate-print-area');
    if (!el) {
      alert('Sertifikat yuklash elementi topilmadi');
      return;
    }

    const nameForFile = certName || recipientName || 'sertifikat';
    setExportingId(certId || 'active');

    try {
      // Auto-save certificate to personal cabinet on download if user is logged in
      if (user) {
        try {
          await fetch('/api/certificates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              orgName,
              certTitle,
              certId,
              recipientName,
              courseDescription,
              courseDescriptionShort,
              date,
              signee,
              location,
              template,
              recipientFont,
            })
          });
          fetchCertificates();
        } catch (saveErr) {
          console.error('Auto-save on download failed:', saveErr);
        }
      }

      // High resolution scaling (2.5x) using html-to-image
      const imgData = await toPng(el, {
        pixelRatio: 2.5,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Sertifikat_${nameForFile.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Sertifikat rasmga o\'tkazishda muammo yuz berdi. Iltimos qaytadan urining.');
    } finally {
      setExportingId(null);
    }
  };

  // Delete certificate
  const handleDeleteCertificate = async (id: string) => {
    if (!user) return;
    if (!confirm('Sertifikatni rostdan ham o\'chirmoqchimisiz?')) return;

    try {
      const res = await fetch(`/api/certificates/${id}?userId=${user.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCertificates();
      } else {
        const data = await res.json();
        alert(data.error || 'Sertifikatni o\'chirib bo\'lmadi');
      }
    } catch (err) {
      alert('Xatolik yuz berdi');
    }
  };

  // Copy shareable verification link
  const handleCopyLink = (code: string) => {
    const shareUrl = `${window.location.origin}/verify?code=${code}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedId(code);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1e293b] flex flex-col font-sans select-none antialiased">
      {/* 1. Header Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm px-6 py-3.5 flex justify-between items-center">
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Award className="w-5.5 h-5.5 stroke-[2]" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-1">
              SERTIFIKAT <span className="text-blue-600">ONLINE</span>
            </span>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold leading-none mt-0.5">
              RASMIY PORTAL
            </p>
          </div>
        </div>

        {/* Middle Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-500">
          <button 
            onClick={() => setView('home')} 
            className={`hover:text-blue-600 transition-colors py-1 cursor-pointer ${view === 'home' ? 'text-blue-600 font-extrabold border-b-2 border-blue-600' : ''}`}
          >
            Bosh sahifa
          </button>
          <button 
            onClick={() => setView('editor')} 
            className={`hover:text-blue-600 transition-colors py-1 cursor-pointer ${view === 'editor' ? 'text-blue-600 font-extrabold border-b-2 border-blue-600' : ''}`}
          >
            Sertifikat yaratish
          </button>
          <button 
            onClick={() => {
              setView('verify');
              resetVerification();
            }} 
            className={`hover:text-blue-600 transition-colors py-1 cursor-pointer ${view === 'verify' ? 'text-blue-600 font-extrabold border-b-2 border-blue-600' : ''}`}
          >
            Sertifikatni tekshirish
          </button>
          <button 
            onClick={() => setView('cabinet')} 
            className={`hover:text-blue-600 transition-colors py-1 cursor-pointer ${view === 'cabinet' ? 'text-blue-600 font-extrabold border-b-2 border-blue-600' : ''}`}
          >
            Mening kabinetim
          </button>
          <button onClick={() => setIsTemplatesModalOpen(true)} className="hover:text-blue-600 transition-colors cursor-pointer">Shablonlar</button>
          <button onClick={() => setIsPricingModalOpen(true)} className="hover:text-blue-600 transition-colors cursor-pointer">Narxlar</button>
        </div>

        {/* Right Authentication Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('cabinet')}
                className="hidden md:flex flex-col items-end hover:opacity-80 transition-opacity"
              >
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-0.5 font-sans">Kabinet</span>
                <span className="text-xs font-black text-slate-800">{user.fullName}</span>
              </button>
              <button 
                onClick={handleLogout}
                title="Tizimdan chiqish"
                className="bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 p-2 rounded-lg transition-colors border border-slate-200/50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-slate-600 hover:text-slate-900 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Kirish
              </button>
              <button 
                onClick={() => setIsRegisterModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Ro'yxatdan o'tish
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 2. Main content rendering with view state */}
      <div className="flex-grow">
        {view === 'home' && (
          <div className="flex flex-col animate-scaleIn">
            {/* Hero Banner Section */}
            <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-[#1e3a8a] text-white py-14 px-6 md:px-12 relative overflow-hidden text-left">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 text-left">
                  <span className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-4 shadow-sm">
                    <Award className="w-3.5 h-3.5" />
                    <span>Sertifikat yaratish va QR onlayn tekshiruv platformasi</span>
                  </span>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase leading-tight font-sans text-white">
                    Sertifikatingizni <br className="hidden md:inline" /> yarating va ulashing!
                  </h1>
                  <p className="text-blue-100 text-xs md:text-sm leading-relaxed max-w-xl font-medium opacity-90">
                    O'z sertifikatingizni bir necha daqiqada yarating, yuklab oling va tekshirish uchun xavfsiz onlayn QR kod bilan ulashing. Barchasi mutlaqo sodda va oson.
                  </p>
                </div>

                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 flex flex-col justify-between items-start text-left hover:bg-white/15 transition-all">
                    <div>
                      <div className="bg-white/15 p-2 rounded-xl text-blue-200 mb-3 inline-block">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">Sertifikat yaratish</h3>
                      <p className="text-blue-200 text-[11px] leading-relaxed mb-4">
                        Tahrirlovchi formaga ma'lumotlarni kiritish orqali sertifikat yarating.
                      </p>
                    </div>
                    <button 
                      onClick={() => setView('editor')}
                      className="text-xs font-bold uppercase tracking-wider bg-white text-blue-800 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors shadow-sm self-stretch text-center cursor-pointer"
                    >
                      Yaratishni boshlash
                    </button>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 flex flex-col justify-between items-start text-left hover:bg-white/15 transition-all">
                    <div>
                      <div className="bg-white/15 p-2 rounded-xl text-emerald-300 mb-3 inline-block">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">Tekshiruv tizimi</h3>
                      <p className="text-blue-200 text-[11px] leading-relaxed mb-4">
                        Sertifikat raqami yoki QR-kod orqali haqiqiylikni tasdiqlang.
                      </p>
                    </div>
                    <button 
                      onClick={() => setView('verify')}
                      className="text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm self-stretch text-center border border-emerald-500/30 cursor-pointer"
                    >
                      Tekshirish
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Quick Info Cards Section */}
            <section className="py-12 px-6 max-w-7xl mx-auto w-full">
              <h2 className="text-center text-lg md:text-2xl font-black uppercase tracking-wider text-slate-800 mb-8">
                Platforma afzalliklari va qadamlar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm text-left">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mb-4 w-11 h-11 flex items-center justify-center border border-blue-100">
                    <span className="font-extrabold">1</span>
                  </div>
                  <h4 className="text-sm font-extrabold uppercase tracking-wider mb-2 text-slate-800">Ma'lumotlarni to'ldiring</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Ism-familiya, kurs nomi, sanani kiritib, professional andozalardan (ko'k, oltin yoki yashil) birini tanlang.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm text-left">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mb-4 w-11 h-11 flex items-center justify-center border border-blue-100">
                    <span className="font-extrabold">2</span>
                  </div>
                  <h4 className="text-sm font-extrabold uppercase tracking-wider mb-2 text-slate-800">QR Onlayn Havola</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Tizim har bir sertifikat uchun alohida QR kod yaratadi. Skanerlanganda portal orqali haqiqiylik tasdiqlanadi.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm text-left">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mb-4 w-11 h-11 flex items-center justify-center border border-blue-100">
                    <span className="font-extrabold">3</span>
                  </div>
                  <h4 className="text-sm font-extrabold uppercase tracking-wider mb-2 text-slate-800">Yuklab olish & Boshqarish</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Sertifikatni darhol yuqori sifatli PNG rasm ko'rinishida yuklab oling va unga shaxsiy kabinetingizda kirish imkoniyatiga ega bo'ling.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {view === 'editor' && (
          <main id="workspace-panel" className="p-4 md:p-6 max-w-[1400px] w-full mx-auto flex flex-col gap-6">
            {editorSuccess && (
              <div className="bg-green-50 text-green-700 border border-green-200 rounded-2xl p-4 text-xs font-bold flex items-center gap-2 shadow-sm animate-scaleIn text-left">
                <span className="text-green-600">✓</span>
                <span>{editorSuccess}</span>
              </div>
            )}

            {editorError && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-2xl p-4 text-xs font-bold flex items-center gap-2 shadow-sm animate-scaleIn text-left">
                <span className="text-red-600">⚠</span>
                <span>{editorError}</span>
              </div>
            )}

            {/* Uzbek Preset Suggestions */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-sm flex flex-col gap-2.5 text-left animate-scaleIn">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">★</span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Tezkor Namunalar (Xatosiz professional andozalar)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase leading-tight">
                Sertifikatda barcha yozuvlar grammatik va imlo jihatdan xatosiz chiqishi uchun tayyor andozani bir marta bosish orqali yuklang:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setOrgName(preset.orgName);
                      setCertTitle(preset.certTitle);
                      setCertId(preset.certId);
                      setRecipientName(preset.recipientName);
                      setCourseDescription(preset.courseDescription);
                      setCourseDescriptionShort(preset.courseDescriptionShort);
                      setDate(preset.date);
                      setSignee(preset.signee);
                      setLocation(preset.location);
                      setTemplate(preset.template);
                      setEditorSuccess(`"${preset.name}" andozasi muvaffaqiyatli yuklandi!`);
                      setTimeout(() => setEditorSuccess(null), 3000);
                    }}
                    className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-800 p-3 rounded-xl transition-all text-left flex items-start gap-2.5 text-xs font-bold cursor-pointer"
                  >
                    <span className="text-blue-500 font-extrabold mt-0.5 font-sans">📄</span>
                    <div>
                      <p className="font-extrabold text-slate-800">{preset.name}</p>
                      <p className="text-[9.5px] text-slate-400 font-medium mt-0.5 line-clamp-1">{preset.orgName}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* PANEL 1: EDITOR FORM */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4 text-left animate-scaleIn">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <span>⚙</span>
                    <span>Sertifikat Ma'lumotlari</span>
                  </h3>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Tahrirlovchi</span>
                </div>

                <form className="flex flex-col gap-3.5" onSubmit={e => e.preventDefault()}>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Tashkilot (Markaz) Nomi</label>
                    <input 
                      id="org-name-input"
                      type="text" 
                      value={orgName}
                      onChange={e => setOrgName(e.target.value)}
                      placeholder="Markaz yoki Tashkilot nomi"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Sertifikat Sarlavhasi</label>
                      <input 
                        type="text" 
                        value={certTitle}
                        onChange={e => setCertTitle(e.target.value)}
                        placeholder="SERTIFIKAT yoki DIPLOM"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight">Sertifikat Raqami (ID)</label>
                        <button
                          type="button"
                          onClick={() => {
                            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                            const num = Math.floor(100000 + Math.random() * 900000);
                            const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
                            setCertId(`${prefix}-${num}`);
                          }}
                          className="text-[9px] text-blue-600 hover:text-blue-800 font-bold uppercase tracking-tight hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                          <span>⚡</span> Yangi ID
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={certId}
                        onChange={e => setCertId(e.target.value)}
                        placeholder="093-060250"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50 font-mono tracking-wider uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Kurs Nomi (Katta Matn)</label>
                    <textarea 
                      value={courseDescription}
                      onChange={e => setCourseDescription(e.target.value)}
                      placeholder="KURS TAVSIFI..."
                      rows={2}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold uppercase focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50 resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Ism Familiya (Bitiruvchi F.I.Sh.)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="text" 
                        value={recipientName}
                        onChange={e => setRecipientName(e.target.value)}
                        placeholder="ABDIRIMOVA SHOIRA KASIMBOYEVNA"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-black focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50 text-[#0f172a]"
                      />
                      <div>
                        <span className="block text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Ism-familiya Shriftini Tanlang:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                          {[
                            { id: 'serif', name: 'Klassik (Serif)', fontClass: 'font-serif' },
                            { id: 'sans', name: 'Zamonaviy (Sans)', fontClass: 'font-sans' },
                            { id: 'mono', name: 'Kompelyutor (Mono)', fontClass: 'font-mono' },
                            { id: 'signature', name: 'Elegant Dastxat', fontClass: 'font-signature' },
                            { id: 'caveat', name: 'Qo\'lyozma', fontClass: 'font-caveat' }
                          ].map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setRecipientFont(f.id)}
                              className={`px-2 py-1.5 rounded-lg border text-xs font-bold transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                                recipientFont === f.id
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <span className="text-[9px] opacity-75 mb-0.5 uppercase tracking-wider">{f.name.split(' ')[0]}</span>
                              <span className={`${f.fontClass} text-[14px] truncate max-w-full leading-none`}>
                                Aa
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Batafsil / Qisqa Kurs Izohi</label>
                    <textarea 
                      value={courseDescriptionShort}
                      onChange={e => setCourseDescriptionShort(e.target.value)}
                      placeholder="Kurs davomiyligi, shartnoma raqami kabi batafsil izohlar..."
                      rows={2}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Berilgan Sana</label>
                      <input 
                        type="date" 
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Joylashuv (Shahar/Tuman)</label>
                      <input 
                        type="text" 
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="Qoraqalpog'iston Respublikasi..."
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Imzo chekuvchi (Rahbar Ismi)</label>
                    <input 
                      type="text" 
                      value={signee}
                      onChange={e => setSignee(e.target.value)}
                      placeholder="RADJAPOVA SEVARA RASHIDOVNA"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50"
                    />
                  </div>

                  {/* Form Action Controls */}
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-1 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => {
                        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                        const num = Math.floor(100000 + Math.random() * 900000);
                        const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
                        setOrgName('');
                        setCertTitle('SERTIFIKAT');
                        setCertId(`${prefix}-${num}`);
                        setRecipientName('');
                        setCourseDescription('');
                        setCourseDescriptionShort('');
                        setDate(new Date().toISOString().split('T')[0]);
                        setLocation('');
                        setSignee('');
                      }}
                      className="py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      Tozalash
                    </button>
                    <button 
                      type="button"
                      onClick={handleSaveCertificate}
                      disabled={editorSaving}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center shadow-sm flex items-center justify-center gap-1.5"
                    >
                      {editorSaving ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="text-xs">💾 Saqlash</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* PANEL 2: LIVE CERTIFICATE PREVIEW */}
              <div className="lg:col-span-8 flex flex-col gap-4 animate-scaleIn">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-left">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <span>Sertifikat Ko'rinishi</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 font-mono">A4 Landscape Vizualizatsiya</p>
                  </div>

                  <div className="flex items-center gap-1.5 self-stretch sm:self-auto">
                    <button 
                      onClick={() => {
                        const list: CertificateTemplate[] = ['blue', 'gold', 'green', 'crimson', 'purple', 'classic_dark', 'emerald'];
                        const nextIndex = (list.indexOf(template) + 1) % list.length;
                        setTemplate(list[nextIndex]);
                      }}
                      className="flex items-center gap-1 py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>⇅</span>
                      <span>Shablon</span>
                    </button>

                    <button 
                      onClick={() => setIsTemplatesModalOpen(true)}
                      className="flex items-center gap-1 py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>🎨</span>
                      <span>Rang</span>
                    </button>
                  </div>
                </div>

                <CertificatePreview 
                  orgName={orgName}
                  certId={certId}
                  recipientName={recipientName}
                  courseDescription={courseDescription}
                  certTitle={certTitle}
                  courseDescriptionShort={courseDescriptionShort}
                  date={date}
                  signee={signee}
                  location={location}
                  template={template}
                  recipientFont={recipientFont}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-left">
                  <button 
                    onClick={() => handleDownload()}
                    disabled={exportingId !== null}
                    className="py-3.5 bg-[#0f172a] hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    {exportingId ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>⬇ Yuklab Olish (PNG)</span>
                    )}
                  </button>

                  <div className="bg-white border border-slate-200/80 p-3 rounded-xl flex items-start gap-2.5 text-xs text-slate-500 leading-normal font-medium">
                    <span className="text-blue-500 text-base">ℹ</span>
                    <div>
                      <p className="font-bold text-[#0f172a] mb-0.5">Eslatma:</p>
                      <p className="text-[10.5px]">Sertifikatni saqlaganingizdan so'ng, uning onlayn QR kodi faollashadi va siz uni "Mening Kabinetim" yoki "Tekshirish" bo'limida ko'rishingiz mumkin.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {view === 'cabinet' && (
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            <CabinetView 
              user={user}
              certificates={certificates}
              loadingCerts={loadingCerts}
              copiedId={copiedId}
              onNavigate={(v) => setView(v)}
              openLoginModal={() => setIsLoginModalOpen(true)}
              openRegisterModal={() => setIsRegisterModalOpen(true)}
              onDelete={handleDeleteCertificate}
              onCopyLink={handleCopyLink}
              onEdit={(cert) => {
                setOrgName(cert.orgName);
                setCertTitle(cert.certTitle || 'SERTIFIKAT');
                setCertId(cert.certId);
                setRecipientName(cert.recipientName);
                setCourseDescription(cert.courseDescription);
                setCourseDescriptionShort(cert.courseDescriptionShort || '');
                setDate(cert.date);
                setSignee(cert.signee);
                setLocation(cert.location);
                setTemplate(cert.template);
                setRecipientFont(cert.recipientFont || 'serif');
                setView('editor');
              }}
              onDownload={(cert) => {
                setOrgName(cert.orgName);
                setCertTitle(cert.certTitle || 'SERTIFIKAT');
                setCertId(cert.certId);
                setRecipientName(cert.recipientName);
                setCourseDescription(cert.courseDescription);
                setCourseDescriptionShort(cert.courseDescriptionShort || '');
                setDate(cert.date);
                setSignee(cert.signee);
                setLocation(cert.location);
                setTemplate(cert.template);
                setRecipientFont(cert.recipientFont || 'serif');
                setTimeout(() => {
                  handleDownload(cert.recipientName);
                }, 150);
              }}
            />
          </div>
        )}

        {view === 'verify' && (
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            <VerifyView 
              verifyInputCode={verifyInputCode}
              setVerifyInputCode={setVerifyInputCode}
              verifyLoading={verifyLoading}
              verifiedCert={verifiedCert}
              verifyError={verifyError}
              onVerify={handleVerify}
              onDownload={(cert) => {
                setOrgName(cert.orgName);
                setCertTitle(cert.certTitle || 'SERTIFIKAT');
                setCertId(cert.certId);
                setRecipientName(cert.recipientName);
                setCourseDescription(cert.courseDescription);
                setCourseDescriptionShort(cert.courseDescriptionShort || '');
                setDate(cert.date);
                setSignee(cert.signee);
                setLocation(cert.location);
                setTemplate(cert.template);
                setRecipientFont(cert.recipientFont || 'serif');
                setTimeout(() => {
                  handleDownload(cert.recipientName);
                }, 150);
              }}
            />
          </div>
        )}
      </div>

      {/* 4. Statistics Footer bar */}
      <section className="bg-white border-t border-b border-slate-200/70 py-8 px-6 mt-6 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center select-none">
          <div className="flex flex-col items-center">
            <Award className="w-7 h-7 text-blue-600 mb-2 stroke-[1.5]" />
            <span className="text-xl font-black text-slate-800 tracking-tight">1000+</span>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">Yaratilgan sertifikatlar</span>
          </div>
          <div className="flex flex-col items-center">
            <User className="w-7 h-7 text-blue-600 mb-2 stroke-[1.5]" />
            <span className="text-xl font-black text-slate-800 tracking-tight">500+</span>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">Faol foydalanuvchilar</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-7 h-7 text-emerald-600 mb-2 stroke-[1.5]" />
            <span className="text-xl font-black text-slate-800 tracking-tight">100%</span>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">Xavfsiz va ishonchli</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-7 h-7 text-blue-600 mb-2 stroke-[1.5]" />
            <span className="text-xl font-black text-slate-800 tracking-tight">24/7</span>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">Tezkor Yordam xizmati</span>
          </div>
        </div>
      </section>

      {/* 5. Shared Footer */}
      <footer className="bg-slate-900 text-slate-400 px-6 py-8 text-center text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <p className="text-sm font-black uppercase text-white tracking-wide">Sertifikat Online</p>
            <p className="text-[11px] text-slate-500 mt-1">Professional sertifikatlarni tayyorlash, saqlash va onlayn QR-kod orqali tasdiqlash tizimi.</p>
          </div>
          <div className="flex gap-4 font-bold text-slate-400 uppercase tracking-wider text-[11px]">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Bosh sahifa</button>
            <button onClick={() => setIsTemplatesModalOpen(true)} className="hover:text-white transition-colors">Shablonlar</button>
            <button onClick={() => setIsPricingModalOpen(true)} className="hover:text-white transition-colors">Narxlar</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-6 pt-4 text-[10px] text-slate-600 text-center flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 Sertifikat.uz — Barcha huquqlar himoyalangan.</p>
          <p className="font-bold">Powered by Google AI Studio</p>
        </div>
      </footer>

      {/* ================= MODAL: LOGIN MODAL OVERLAY ================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative border border-slate-100 flex flex-col gap-5 animate-scaleIn">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl inline-block mb-3 border border-blue-100/60">
                <LogIn className="w-5.5 h-5.5" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Tizimga Kirish</h2>
              <p className="text-slate-400 text-xs mt-1 font-medium">Sertifikatlaringizni bazada saqlash va boshqarish uchun kiring</p>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-600 border border-red-100 rounded-lg p-2.5 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              setAuthError(null);
              if (!loginUsername || !loginPassword) {
                setAuthError("Foydalanuvchi nomi va parolni kiriting");
                return;
              }
              try {
                const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: loginUsername, password: loginPassword })
                });
                const data = await res.json();
                if (!res.ok) {
                  setAuthError(data.error || 'Login yoki parol noto\'g\'ri');
                } else {
                  setUser(data.user);
                  localStorage.setItem('sertifikat_user', JSON.stringify(data.user));
                  setIsLoginModalOpen(false);
                }
              } catch (err) {
                setAuthError('Aloqa xatoligi yuz berdi');
              }
            }} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Foydalanuvchi nomi</label>
                <input 
                  type="text" 
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Parol</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer mt-1"
              >
                Kirish
              </button>
            </form>

            <div className="text-center text-[11px] text-slate-400">
              Sizda hisob yo'qmi?{' '}
              <button onClick={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }} className="text-blue-600 font-bold hover:underline">Ro'yxatdan o'tish</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REGISTER MODAL OVERLAY ================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative border border-slate-100 flex flex-col gap-5 animate-scaleIn">
            <button onClick={() => setIsRegisterModalOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl inline-block mb-3 border border-blue-100/60">
                <UserPlus className="w-5.5 h-5.5" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Registratsiya</h2>
              <p className="text-slate-400 text-xs mt-1 font-medium">Yangi admin hisobini bepul va tezkor yarating</p>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-600 border border-red-100 rounded-lg p-2.5 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="bg-green-50 text-green-600 border border-green-100 rounded-lg p-2.5 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              setAuthError(null);
              setAuthSuccess(null);
              if (!regFullName || !regUsername || !regPassword) {
                setAuthError("Iltimos barcha maydonlarni to'ldiring");
                return;
              }
              try {
                const res = await fetch('/api/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: regUsername, password: regPassword, fullName: regFullName })
                });
                const data = await res.json();
                if (!res.ok) {
                  setAuthError(data.error || 'Xatolik yuz berdi');
                } else {
                  setAuthSuccess('Muvaffaqiyatli ro\'yxatdan o\'tdingiz! Kirishingiz mumkin.');
                  setRegUsername('');
                  setRegPassword('');
                  setRegFullName('');
                  setTimeout(() => {
                    setIsRegisterModalOpen(false);
                    setIsLoginModalOpen(true);
                  }, 1200);
                }
              } catch (err) {
                setAuthError('Ulanish xatoligi');
              }
            }} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">To'liq Ismingiz (F.I.Sh)</label>
                <input 
                  type="text" 
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  placeholder="Dilshod Allaberdiyev"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Foydalanuvchi nomi</label>
                <input 
                  type="text" 
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  placeholder="dilshod"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-tight mb-1">Parol</label>
                <input 
                  type="password" 
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer mt-1"
              >
                Ro'yxatdan o'tish
              </button>
            </form>

            <div className="text-center text-[11px] text-slate-400">
              Hisobingiz bormi?{' '}
              <button onClick={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }} className="text-blue-600 font-bold hover:underline">Kirish</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= IMPORTED MODALS ================= */}
      <PricingModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
      />

      <TemplatesModal 
        isOpen={isTemplatesModalOpen} 
        onClose={() => setIsTemplatesModalOpen(false)} 
        activeTemplate={template}
        onSelect={(temp) => setTemplate(temp)}
      />

    </div>
  );
}
