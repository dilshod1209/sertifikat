import { 
  ShieldCheck, AlertCircle, QrCode, Search, Download, CheckCircle, Info 
} from 'lucide-react';
import { Certificate } from '../types';
import CertificatePreview from './CertificatePreview';

interface VerifyViewProps {
  verifyInputCode: string;
  setVerifyInputCode: (code: string) => void;
  verifyLoading: boolean;
  verifiedCert: Certificate | null;
  verifyError: string | null;
  onVerify: (code?: string) => void;
  onDownload: (cert: Certificate) => void;
}

export default function VerifyView({
  verifyInputCode,
  setVerifyInputCode,
  verifyLoading,
  verifiedCert,
  verifyError,
  onVerify,
  onDownload
}: VerifyViewProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-scaleIn text-left">
      {/* Search Input Bar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 w-full">
        <div className="flex-1 text-left">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Onlayn Tasdiq & Rasmiy Reyestr</span>
          </h3>
          <p className="text-[10.5px] text-slate-400 font-semibold uppercase mt-0.5 leading-relaxed">
            Sertifikat raqamini (ID) kiritib, uning onlayn reyestrdagi haqiqiyligini tekshiring
          </p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onVerify(); }} className="flex w-full md:w-auto items-center gap-2 md:min-w-[360px]">
          <input 
            type="text" 
            value={verifyInputCode}
            onChange={e => setVerifyInputCode(e.target.value)}
            placeholder="ID kiriting (Masalan: 093-060250)"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-slate-50/50 uppercase font-mono tracking-wider"
          />
          <button 
            type="submit"
            disabled={verifyLoading}
            className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            {verifyLoading ? "..." : <Search className="w-4 h-4" />}
            <span>Qidirish</span>
          </button>
        </form>
      </div>

      <div className="w-full">
        {/* 1. Loading State */}
        {verifyLoading && (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Onlayn reyestr so'ralmoqda...</p>
          </div>
        )}

        {/* 2. Verified Certificate Found */}
        {!verifyLoading && verifiedCert && (
          <div className="flex flex-col gap-6">
            {/* Success Shield Card Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5 text-left animate-scaleIn">
              <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 p-4 rounded-2xl flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">HAQIQIY HUJJAT</span>
                  <span className="text-[9px] font-mono font-bold text-emerald-600">Tasdiq raqami: {verifiedCert.certId}</span>
                </div>
                <h2 className="text-base md:text-lg font-black text-slate-800 mt-1 uppercase">Sertifikat Haqiqiy deb Tasdiqlandi!</h2>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-0.5">
                  Ushbu sertifikat rasmiy onlayn bazadan o'tgan bo'lib, uning haqiqiyligi muvaffaqiyatli tasdiqlandi.
                </p>
              </div>
            </div>

            {/* Visual Preview Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left/Main Column: Certificate Visual Rendering */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm">
                  <CertificatePreview 
                    orgName={verifiedCert.orgName}
                    certId={verifiedCert.certId}
                    recipientName={verifiedCert.recipientName}
                    courseDescription={verifiedCert.courseDescription}
                    certTitle={verifiedCert.certTitle || 'SERTIFIKAT'}
                    courseDescriptionShort={verifiedCert.courseDescriptionShort || ''}
                    date={verifiedCert.date}
                    signee={verifiedCert.signee}
                    location={verifiedCert.location}
                    template={verifiedCert.template}
                    recipientFont={verifiedCert.recipientFont}
                  />
                </div>

                {/* Direct Action */}
                <button 
                  onClick={() => onDownload(verifiedCert)}
                  className="py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Sertifikatni rasmiy rasm ko'rinishida yuklab olish</span>
                </button>
              </div>

              {/* Right Column: Detailed Security Verification checklist */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col gap-4 text-left">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Haqiqiylik Ko'rsatkichlari</span>
                  </h4>
                </div>

                <div className="flex flex-col gap-3.5 text-xs">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider block">Bitiruvchi (Talaba)</span>
                    <span className="font-extrabold text-slate-800 uppercase block mt-0.5 text-[13px] leading-tight">
                      {verifiedCert.recipientName}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5 leading-none uppercase">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping inline-block" /> Tasdiqlandi
                    </span>
                  </div>

                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider block">O'quv kursi</span>
                    <span className="font-semibold text-slate-700 uppercase block mt-0.5 text-[11px] leading-snug">
                      {verifiedCert.courseDescription}
                    </span>
                  </div>

                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider block">O'quv markazi</span>
                    <span className="font-extrabold text-slate-800 uppercase block mt-0.5 text-[11.5px] leading-tight">
                      {verifiedCert.orgName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider block">Berilgan Sana</span>
                      <span className="font-bold text-slate-800 font-mono block mt-0.5">
                        {verifiedCert.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider block">Sertifikat ID</span>
                      <span className="font-bold text-slate-800 font-mono block mt-0.5 text-blue-600">
                        {verifiedCert.certId}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider block">Tekshiruv Sanasi</span>
                    <span className="font-bold text-slate-500 font-mono block mt-0.5">
                      {new Date().toLocaleDateString('uz-UZ')} {new Date().toLocaleTimeString('uz-UZ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Error State */}
        {!verifyLoading && verifyError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-6 text-left max-w-xl mx-auto flex flex-col items-center text-center gap-4 animate-scaleIn">
            <div className="bg-red-100 border border-red-200 p-4 rounded-full text-red-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider text-slate-950">Sertifikat Topilmadi</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2">
                Kiritilgan ID raqamga mos keladigan sertifikat onlayn reyestrdan topilmadi. ID raqami to'g'riligini va bo'shliqlar yo'qligini tekshirib ko'ring.
              </p>
            </div>
          </div>
        )}

        {/* 4. Default Portal Page Welcome */}
        {!verifyLoading && !verifiedCert && !verifyError && (
          <div className="py-14 text-center max-w-md mx-auto flex flex-col items-center gap-3">
            <QrCode className="w-12 h-12 text-slate-300 animate-pulse" />
            <p className="text-xs font-bold text-slate-400 uppercase">Reyestrdan Onlayn Skaner</p>
            <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
              Sertifikat haqiqiyligini tasdiqlash uchun uning ID raqamini yuqoridagi maydonga kiriting yoki sertifikat burchagidagi QR-kodni to'g'ridan-to'g'ri smartfoningiz orqali skanerlang.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
