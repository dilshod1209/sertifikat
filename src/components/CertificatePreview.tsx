import { useEffect, useState, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import { Award, ShieldCheck, GraduationCap } from 'lucide-react';
import { CertificateTemplate } from '../types';

interface CertificatePreviewProps {
  orgName: string;
  certId: string;
  recipientName: string;
  courseDescription: string;
  certTitle?: string;
  courseDescriptionShort?: string;
  date: string;
  signee: string;
  location: string;
  template: CertificateTemplate;
  recipientFont?: string;
}

export default function CertificatePreview({
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
  recipientFont,
}: CertificatePreviewProps) {
  const [qrSrc, setQrSrc] = useState<string>('');
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const certRef = useRef<HTMLDivElement>(null);

  // Template-specific style classes configured statically or dynamically
  const styles = useMemo(() => {
    switch (template) {
      case 'gold':
        return {
          bg: 'bg-[#fffdfa]',
          borderOuter: 'border-[12px] border-[#d97706]',
          borderInner: 'border-[2px] border-[#b45309]',
          primaryText: 'text-[#854d0e]',
          accentText: 'text-[#b45309]',
          badgeBg: 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]',
          icon: <Award className="w-14 h-14 text-[#d97706]" />,
          sealBorder: 'border-[#d97706]',
          signLine: 'border-[#b45309]',
          themeColor: '#d97706',
          recipientText: 'text-[#1a1105]',
          descriptionText: 'text-[#451a03]',
          shortDescText: 'text-[#7c2d12]',
          labelText: 'text-[#854d0e]',
          subText: 'text-[#b45309]',
          idBg: 'bg-[#fef3c7] border-[#f59e0b] text-[#78350f]'
        };
      case 'green':
        return {
          bg: 'bg-[#fcfdfc]',
          borderOuter: 'border-[12px] border-[#059669]',
          borderInner: 'border-[2px] border-[#047857]',
          primaryText: 'text-[#065f46]',
          accentText: 'text-[#047857]',
          badgeBg: 'bg-[#d1fae5] text-[#065f46] border-[#34d399]',
          icon: <GraduationCap className="w-14 h-14 text-[#059669]" />,
          sealBorder: 'border-[#059669]',
          signLine: 'border-[#047857]',
          themeColor: '#059669',
          recipientText: 'text-[#022c22]',
          descriptionText: 'text-[#064e3b]',
          shortDescText: 'text-[#065f46]',
          labelText: 'text-[#047857]',
          subText: 'text-[#065f46]',
          idBg: 'bg-[#d1fae5] border-[#34d399] text-[#064e3b]'
        };
      case 'crimson':
        return {
          bg: 'bg-[#fffbfb]',
          borderOuter: 'border-[12px] border-[#991b1b]',
          borderInner: 'border-[2px] border-[#7f1d1d]',
          primaryText: 'text-[#991b1b]',
          accentText: 'text-[#b91c1c]',
          badgeBg: 'bg-[#fee2e2] text-[#991b1b] border-[#f87171]',
          icon: <Award className="w-14 h-14 text-[#991b1b]" />,
          sealBorder: 'border-[#991b1b]',
          signLine: 'border-[#7f1d1d]',
          themeColor: '#991b1b',
          recipientText: 'text-[#450a0a]',
          descriptionText: 'text-[#7f1d1d]',
          shortDescText: 'text-[#991b1b]',
          labelText: 'text-[#b91c1c]',
          subText: 'text-[#7f1d1d]',
          idBg: 'bg-[#fee2e2] border-[#f87171] text-[#7f1d1d]'
        };
      case 'purple':
        return {
          bg: 'bg-[#fafafc]',
          borderOuter: 'border-[12px] border-[#581c87]',
          borderInner: 'border-[2px] border-[#4a044e]',
          primaryText: 'text-[#581c87]',
          accentText: 'text-[#6b21a8]',
          badgeBg: 'bg-[#f3e8ff] text-[#581c87] border-[#c084fc]',
          icon: <ShieldCheck className="w-14 h-14 text-[#6b21a8]" />,
          sealBorder: 'border-[#581c87]',
          signLine: 'border-[#4a044e]',
          themeColor: '#581c87',
          recipientText: 'text-[#2e1065]',
          descriptionText: 'text-[#4c1d95]',
          shortDescText: 'text-[#5b21b6]',
          labelText: 'text-[#6b21a8]',
          subText: 'text-[#4c1d95]',
          idBg: 'bg-[#f3e8ff] border-[#c084fc] text-[#4c1d95]'
        };
      case 'classic_dark':
        return {
          bg: 'bg-[#0f172a]',
          borderOuter: 'border-[12px] border-[#1e293b]',
          borderInner: 'border-[2px] border-[#f1f5f9]',
          primaryText: 'text-[#fbbf24]',
          accentText: 'text-[#f59e0b]',
          badgeBg: 'bg-[#1e293b] text-[#f8fafc] border-[#f59e0b]',
          icon: <Award className="w-14 h-14 text-[#fbbf24]" />,
          sealBorder: 'border-[#fbbf24]',
          signLine: 'border-[#e2e8f0]',
          themeColor: '#fbbf24',
          recipientText: 'text-[#f8fafc]',
          descriptionText: 'text-[#cbd5e1]',
          shortDescText: 'text-[#94a3b8]',
          labelText: 'text-[#cbd5e1]',
          subText: 'text-[#64748b]',
          idBg: 'bg-[#1e293b] border-[#475569] text-[#f8fafc]'
        };
      case 'emerald':
        return {
          bg: 'bg-[#f6fcf9]',
          borderOuter: 'border-[12px] border-[#047857]',
          borderInner: 'border-[2px] border-[#064e3b]',
          primaryText: 'text-[#064e3b]',
          accentText: 'text-[#047857]',
          badgeBg: 'bg-[#ecfdf5] text-[#064e3b] border-[#34d399]',
          icon: <GraduationCap className="w-14 h-14 text-[#047857]" />,
          sealBorder: 'border-[#047857]',
          signLine: 'border-[#064e3b]',
          themeColor: '#047857',
          recipientText: 'text-[#022c22]',
          descriptionText: 'text-[#064e3b]',
          shortDescText: 'text-[#047857]',
          labelText: 'text-[#059669]',
          subText: 'text-[#064e3b]',
          idBg: 'bg-[#ecfdf5] border-[#34d399] text-[#065f46]'
        };
      case 'blue':
      default:
        return {
          bg: 'bg-[#f7faff]',
          borderOuter: 'border-[12px] border-[#1e40af]',
          borderInner: 'border-[2px] border-[#1d4ed8]',
          primaryText: 'text-[#1e40af]',
          accentText: 'text-[#1d4ed8]',
          badgeBg: 'bg-[#dbeafe] text-[#1e40af] border-[#60a5fa]',
          icon: <ShieldCheck className="w-14 h-14 text-[#1d4ed8]" />,
          sealBorder: 'border-[#1d4ed8]',
          signLine: 'border-[#1e40af]',
          themeColor: '#1d4ed8',
          recipientText: 'text-[#0f172a]',
          descriptionText: 'text-[#1e3a8a]',
          shortDescText: 'text-[#1e40af]',
          labelText: 'text-[#1d4ed8]',
          subText: 'text-[#1e3a8a]',
          idBg: 'bg-[#dbeafe] border-[#60a5fa] text-[#1e40af]'
        };
    }
  }, [template]);

  // Generate dynamic QR code encoding the verification link
  useEffect(() => {
    const origin = window.location.origin;
    const verifyUrl = `${origin}/verify?code=${certId || 'demo'}`;
    
    // Choose dynamic dark color for contrast
    const darkColor = template === 'classic_dark' ? '#0f172a' : (styles.themeColor || '#1d4ed8');

    QRCode.toDataURL(verifyUrl, {
      width: 150,
      margin: 1,
      color: {
        dark: darkColor,
        light: '#ffffff',
      }
    }, (err, dataUrl) => {
      if (!err) {
        setQrSrc(dataUrl);
      }
    });
  }, [certId, template, styles.themeColor]);

  // Dynamically scale the fixed-width certificate container to fit its viewport parent perfectly
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.clientWidth;
      // Fixed width is 1000px
      const newScale = parentWidth / 1000;
      setScale(Math.max(0.3, Math.min(newScale, 1.2)));
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    window.addEventListener('resize', handleResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Helper to format date into DD.MM.YYYY if possible
  const formatDateString = (rawDate: string) => {
    if (!rawDate) return '';
    if (rawDate.includes('.')) return rawDate; // already formatted
    try {
      const parts = rawDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
    } catch (e) {}
    return rawDate;
  };

  const formattedDate = formatDateString(date);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex items-center justify-center overflow-hidden py-4 bg-slate-100 rounded-xl border border-slate-200/60 shadow-inner min-h-[360px]"
    >
      {/* 
        Fixed sized certificate container so that html-to-image captures 
        it with pixel-perfect accuracy, while CSS scale makes it responsive.
      */}
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'center center',
          width: '1000px',
          height: '707px',
          margin: `-${(1 - scale) * 707 / 2}px -${(1 - scale) * 1000 / 2}px`,
        }}
        className="transition-transform duration-100 ease-out shrink-0"
      >
        <div 
          ref={certRef}
          id="certificate-print-area"
          className={`w-full h-full p-8 ${styles.bg} ${styles.borderOuter} relative flex flex-col justify-between shadow-2xl select-none`}
        >
          {/* Inner Decorative Border */}
          <div className={`absolute inset-3 border-2 ${styles.borderInner} pointer-events-none rounded-sm`} />

          {/* Elegant Corner Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-current opacity-85" style={{ color: styles.themeColor }} />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-current opacity-85" style={{ color: styles.themeColor }} />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-current opacity-85" style={{ color: styles.themeColor }} />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-current opacity-85" style={{ color: styles.themeColor }} />

          {/* Certificate Content Column-wise Layout */}
          <div className="w-full h-full flex flex-col justify-between p-4 relative z-10">
            
            {/* 1. Organization Name (Centered at Top) */}
            <div className="text-center mt-4">
              <h4 className={`text-[16px] font-extrabold font-sans tracking-widest uppercase ${styles.primaryText}`}>
                {orgName || "Tashkilot Nomi"}
              </h4>
            </div>

            {/* 2. Main Title (Giant centered Serif uppercase) */}
            <div className="text-center my-1">
              <h1 className="text-[54px] font-serif uppercase font-extrabold tracking-widest text-center italic leading-none" style={{ color: styles.themeColor }}>
                {certTitle || "SERTIFIKAT"}
              </h1>
              
              {/* 3. Certificate Number */}
              <div className="text-center mt-1.5">
                <span className={`font-mono font-bold text-[12px] tracking-widest px-3 py-1 border rounded-md ${styles.idBg}`}>
                  № {certId || "093-060250"}
                </span>
              </div>
            </div>

            {/* 4. Course Description (Uppercase) */}
            <div className="text-center max-w-4xl mx-auto px-6">
              <p className={`text-[14px] leading-relaxed font-sans font-extrabold uppercase tracking-wide ${styles.descriptionText}`}>
                {courseDescription || "KASB VA XORIJIY TILLARGA O'QITISH DASTURI BO'YICHA O'QUV KURSLARINI MUVAFFAQIYATLI YAKUNLAGANLIK TO'G'RISIDA"}
              </p>
            </div>

            {/* 5. Solid Divider, Recipient Name, Solid Divider */}
            <div className="my-1 text-center w-full">
              <div className="w-4/5 h-[1px] bg-slate-400 mx-auto opacity-70" />
              <h2 className={`${
                (() => {
                  switch (recipientFont) {
                    case 'sans': return 'font-sans font-black';
                    case 'mono': return 'font-mono font-bold';
                    case 'signature': return 'font-signature font-normal tracking-wide leading-none';
                    case 'caveat': return 'font-caveat font-bold tracking-wide leading-none';
                    case 'serif':
                    default: return 'font-serif font-black uppercase tracking-wider';
                  }
                })()
              } my-2.5 py-1 text-center whitespace-normal break-words max-w-[90%] mx-auto leading-snug ${styles.recipientText} ${
                (() => {
                  const len = (recipientName || "").trim().length;
                  if (recipientFont === 'signature') {
                    if (len <= 20) return 'text-[52px]';
                    if (len <= 28) return 'text-[44px]';
                    if (len <= 38) return 'text-[36px]';
                    return 'text-[28px]';
                  }
                  if (recipientFont === 'caveat') {
                    if (len <= 20) return 'text-[54px]';
                    if (len <= 28) return 'text-[46px]';
                    if (len <= 38) return 'text-[38px]';
                    return 'text-[30px]';
                  }
                  if (len <= 20) return 'text-[36px]';
                  if (len <= 28) return 'text-[30px]';
                  if (len <= 38) return 'text-[24px]';
                  return 'text-[20px]';
                })()
              }`}>
                {recipientName || "TOHIROV JAXONGIR BEKALIYEVICH"}
              </h2>
              <div className="w-4/5 h-[1.5px] bg-slate-500 mx-auto opacity-80" />
            </div>

            {/* 6. Short Description (Slower details) */}
            <div className="text-center max-w-3xl mx-auto px-8 my-1">
              <p className={`text-[13.5px] leading-relaxed font-sans font-medium ${styles.shortDescText}`}>
                {courseDescriptionShort || `O'quvchi ingliz tili (CEFR B2 Intermediate Level) intensiv dasturi bo'yicha 6 oylik (144 soatlik) o'quv kursini a'lo baholar bilan muvaffaqiyatli yakunladi.`}
              </p>
            </div>

            {/* 7. Footer: Signee (Left), QR Code (Center), Date/Location (Right) */}
            <div className="grid grid-cols-3 items-end pt-2 pb-2 px-4">
              
              {/* Signee & Signature (Left Column) */}
              <div className="flex flex-col items-center justify-end h-full">
                <div className="w-full max-w-[220px] text-center pb-2">
                  <div className="h-10 flex items-center justify-center relative select-none" />
                  <div className="w-full border-t border-slate-300 my-1" />
                  <p className={`text-[11px] font-extrabold font-sans uppercase tracking-wide ${styles.labelText}`}>
                    {signee || "ALIMOV AKMAL FAXRIDDINOVICH"}
                  </p>
                </div>
              </div>

              {/* QR Code / Security Seal (Center Column) */}
              <div className="flex flex-col items-center justify-center relative">
                <div className="p-1 bg-white rounded-xl shadow-sm border-dashed border-2 relative transition-all duration-200 hover:scale-105" style={{ borderColor: styles.themeColor }}>
                  {qrSrc ? (
                    <img 
                      src={qrSrc} 
                      alt="Verification QR" 
                      className="w-20 h-20 pointer-events-none" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 animate-pulse rounded-lg" />
                  )}
                  {/* Small visual shield center tag */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-0.5 rounded-full shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Date & Location (Right Column) */}
              <div className="flex flex-col items-center justify-end h-full pb-2">
                <div className="w-full max-w-[220px] text-center">
                  <p className={`text-xs font-extrabold font-sans tracking-wide ${styles.labelText}`}>
                    {formattedDate || "25.06.2026"}
                  </p>
                  <div className="w-full border-t border-slate-300 my-1" />
                  <p className={`text-[9.5px] font-bold font-sans leading-tight ${styles.subText}`}>
                    {location || "Toshkent shahri, Chilonzor tumani"}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Micro Security Printing Text on bottom border */}
          <div className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[7px] font-mono tracking-widest uppercase ${template === 'classic_dark' ? 'text-slate-500/50' : 'text-slate-400/50'}`}>
            * SERTIFIKAT HAQIQIYLIGINI QR-KOD SKANERLASH ORQALI ONLAYN TEKSHIRISHINGIZ MUMKIN *
          </div>
        </div>
      </div>
    </div>
  );
}
