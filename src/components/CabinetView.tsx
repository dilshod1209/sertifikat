import { useState } from 'react';
import { 
  User, Plus, Award, ShieldCheck, Download, Copy, Check, Trash2, Edit3, Search, Info
} from 'lucide-react';
import { Certificate, User as UserType } from '../types';

interface CabinetViewProps {
  user: UserType | null;
  certificates: Certificate[];
  loadingCerts: boolean;
  onEdit: (cert: Certificate) => void;
  onDownload: (cert: Certificate) => void;
  onCopyLink: (certId: string) => void;
  copiedId: string | null;
  onDelete: (id: string) => void;
  onNavigate: (view: 'home' | 'editor' | 'cabinet' | 'verify') => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
}

export default function CabinetView({
  user,
  certificates,
  loadingCerts,
  onEdit,
  onDownload,
  onCopyLink,
  copiedId,
  onDelete,
  onNavigate,
  openLoginModal,
  openRegisterModal,
}: CabinetViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCerts = certificates.filter(cert => {
    const q = searchQuery.toLowerCase();
    return (
      cert.certId.toLowerCase().includes(q) ||
      cert.recipientName.toLowerCase().includes(q) ||
      cert.orgName.toLowerCase().includes(q) ||
      cert.courseDescription.toLowerCase().includes(q)
    );
  });

  if (!user) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-14 text-center max-w-xl mx-auto flex flex-col items-center gap-5 my-12 shadow-sm animate-scaleIn">
        <div className="bg-blue-50 text-blue-600 p-4 rounded-full border border-blue-100">
          <User className="w-8 h-8" />
        </div>
        <div className="text-left text-center">
          <h3 className="text-base font-black uppercase tracking-wider text-slate-900">Shaxsiy Kabinetga Kirish</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
            Sertifikatlaringizni o'zingizning shaxsiy kabinetingizda xavfsiz saqlash, rasm sifatida yuklab olish va boshqarish uchun tizimga kiring yoki ro'yxatdan o'ting.
          </p>
        </div>
        <div className="flex gap-3 mt-2 w-full">
          <button 
            onClick={openLoginModal}
            className="flex-1 py-3 bg-[#0f172a] hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Kirish
          </button>
          <button 
            onClick={openRegisterModal}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            Ro'yxatdan o'tish
          </button>
        </div>
      </div>
    );
  }

  // Count template-based certificates
  const goldCount = certificates.filter(c => c.template === 'gold').length;
  const blueCount = certificates.filter(c => c.template === 'blue').length;
  const greenCount = certificates.filter(c => c.template === 'green').length;

  return (
    <div className="flex flex-col gap-6 w-full animate-scaleIn">
      {/* Cabinet Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-white">
            <User className="w-8 h-8" />
          </div>
          <div className="text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-300 bg-blue-500/20 border border-blue-400/20 px-2 py-0.5 rounded-full">FOYDALANUVCHINING SHAXSIY KABINETI</span>
            <h2 className="text-xl md:text-2xl font-black mt-1">{user.fullName}</h2>
            <p className="text-[10.5px] text-slate-300 font-semibold uppercase mt-0.5 font-mono">Ma'muriy Hisob</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 w-full sm:w-auto">
          <button 
            onClick={() => onNavigate('editor')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-4.5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/15"
          >
            <Plus className="w-4 h-4" />
            <span>Sertifikat Yaratish</span>
          </button>
        </div>
      </div>

      {/* Cabinet Stat Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Jami Sertifikatlar</p>
          <p className="text-2xl font-black text-slate-800 mt-1.5">{certificates.length} ta</p>
        </div>
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Oltin Shablonlar</p>
          <p className="text-2xl font-black text-amber-600 mt-1.5">{goldCount} ta</p>
        </div>
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Ko'k Shablonlar</p>
          <p className="text-2xl font-black text-blue-600 mt-1.5">{blueCount} ta</p>
        </div>
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Yashil Shablonlar</p>
          <p className="text-2xl font-black text-emerald-600 mt-1.5">{greenCount} ta</p>
        </div>
      </div>

      {/* Search and List Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left w-full md:w-auto">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Saqlangan Sertifikatlar Ro'yxati
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Siz tomondan yaratilgan rasmiy reyestrdagi hujjatlar</p>
        </div>

        <div className="relative w-full md:w-[320px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ID yoki Ism bo'yicha qidirish..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1.5 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Visual Card Grid Section */}
      <div className="flex flex-col gap-4">
        {loadingCerts ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Tarix yuklanmoqda...</p>
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl py-14 text-center max-w-md mx-auto flex flex-col items-center gap-3 w-full">
            <Info className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-bold text-slate-400 uppercase">Sertifikatlar topilmadi</p>
            <p className="text-slate-400 text-[11px] font-medium leading-relaxed px-6">
              {searchQuery ? "Kiritilgan qidiruv mezonlariga mos keladigan sertifikat topilmadi." : "Siz hali sertifikat yaratmadingiz. 'Sertifikat yaratish' bo'limida birinchi sertifikatingizni yaratib saqlang."}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => onNavigate('editor')}
                className="mt-2 py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-xl text-[11px] font-bold uppercase transition-colors"
              >
                Yaratishni boshlash
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <div 
                key={cert.id} 
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col text-left"
              >
                {/* Certificate Card Header */}
                <div className="p-4.5 border-b border-slate-100 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-slate-800 text-[10.5px] bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded">
                      № {cert.certId}
                    </span>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border tracking-wider uppercase inline-block ${
                      (() => {
                        switch (cert.template) {
                          case 'gold': return 'bg-amber-50 text-amber-700 border-amber-200';
                          case 'green': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                          case 'emerald': return 'bg-teal-50 text-teal-700 border-teal-200';
                          case 'crimson': return 'bg-red-50 text-red-700 border-red-200';
                          case 'purple': return 'bg-purple-50 text-purple-700 border-purple-200';
                          case 'classic_dark': return 'bg-slate-900 text-yellow-500 border-slate-700';
                          case 'blue':
                          default: return 'bg-blue-50 text-blue-700 border-blue-200';
                        }
                      })()
                    }`}>
                      {cert.template.toUpperCase()} shablon
                    </span>
                  </div>
                  
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide leading-tight line-clamp-1 mt-1">
                    {cert.recipientName}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold truncate leading-none uppercase">
                    Tashkilot: {cert.orgName}
                  </p>
                </div>

                {/* Card Description Block */}
                <div className="p-4.5 bg-slate-50/50 flex-grow flex flex-col gap-2 border-b border-slate-100">
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-semibold uppercase">
                    {cert.courseDescription}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold font-mono mt-auto pt-1">
                    <span>Sana: {cert.date}</span>
                    <span className="truncate max-w-[120px]">{cert.location}</span>
                  </div>
                </div>

                {/* Card Actions Bottom Block */}
                <div className="p-3 bg-white grid grid-cols-4 gap-2">
                  <button 
                    onClick={() => onEdit(cert)}
                    title="Tahrirlash va ko'rish"
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-2.5 text-slate-600 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => onDownload(cert)}
                    title="Rasm yuklash (PNG)"
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-2.5 text-slate-600 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => onCopyLink(cert.certId)}
                    title="QR skaner havolasini nusxalash"
                    className={`border rounded-lg py-2.5 transition-colors flex items-center justify-center cursor-pointer ${
                      copiedId === cert.certId 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {copiedId === cert.certId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button 
                    onClick={() => onDelete(cert.id)}
                    title="Sertifikatni o'chirish"
                    className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-lg py-2.5 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
