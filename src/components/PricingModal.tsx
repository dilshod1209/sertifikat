import React from 'react';
import { Check, X, ShieldCheck, Zap } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden border border-slate-100 flex flex-col gap-6 animate-scaleIn">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Xizmat Narxlari
            </span>
            <h3 className="text-2xl font-black text-[#0f172a] uppercase mt-2">
              Mos va qulay tariflar
            </h3>
            <p className="text-slate-400 text-xs font-medium mt-1">
              O'zingizga mos tarif rejasini tanlang va professional sertifikatlar yarating
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
          
          {/* Free Card */}
          <div className="border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">BEPUL TARIF</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-4xl font-black text-slate-900 tracking-tight">0</span>
                <span className="text-lg font-bold text-slate-400 ml-1">UZS / abadiy</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Boshlang'ich darajada sertifikatlar tayyorlash uchun.</p>
              
              <div className="w-full h-[1px] bg-slate-100 my-4" />
              
              <ul className="flex flex-col gap-3 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Kuniga 5 tagacha sertifikat yaratish</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>3 xil rangli premium shablon</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>QR kod onlayn tekshiruv tizimi</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <X className="w-4 h-4 shrink-0" />
                  <span>O'z logotipini joylash (Pro)</span>
                </li>
              </ul>
            </div>
            
            <button 
              onClick={onClose}
              className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Hozirgi tarif
            </button>
          </div>

          {/* Pro Card */}
          <div className="border-2 border-blue-600 rounded-2xl p-6 flex flex-col justify-between relative shadow-lg shadow-blue-50">
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Zap className="w-3 h-3 fill-white" />
              <span>TAVSIYA ETILADI</span>
            </div>
            
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-600">PRO PROFESSIONAL</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-4xl font-black text-slate-900 tracking-tight">99 000</span>
                <span className="text-lg font-bold text-slate-400 ml-1">UZS / oy</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">O'quv markazlari va yirik tashkilotlar uchun.</p>
              
              <div className="w-full h-[1px] bg-slate-100 my-4" />
              
              <ul className="flex flex-col gap-3 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-bold">Cheksiz sertifikatlar yaratish</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Barcha dizayndagi premium shablonlar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tashkilot xususiy logotipini yuklash</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Excel orqali ommaviy yaratish</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>24/7 Shaxsiy menejer yordami</span>
                </li>
              </ul>
            </div>
            
            <button 
              onClick={() => alert("PRO to'lovi tez orada ishga tushadi! Hozircha barcha imkoniyatlardan mutlaqo bepul foydalanishingiz mumkin.")}
              className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-150 shadow-md shadow-blue-200 cursor-pointer"
            >
              PRO tarifga o'tish
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-2 border border-slate-100 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Sertifikat.uz barcha to'lovlar va ma'lumotlar xavfsizligini 100% kafolatlaydi. Hech qanday yashirin komissiyalar yo'q.</span>
        </div>

      </div>
    </div>
  );
}
