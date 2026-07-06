import React from 'react';
import { X, Award, ShieldCheck, GraduationCap, Check } from 'lucide-react';
import { CertificateTemplate } from '../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTemplate: CertificateTemplate;
  onSelect: (temp: CertificateTemplate) => void;
}

export default function TemplatesModal({ isOpen, onClose, activeTemplate, onSelect }: TemplatesModalProps) {
  if (!isOpen) return null;

  const list: { id: CertificateTemplate; name: string; tag: string; desc: string; color: string; icon: React.ReactNode }[] = [
    {
      id: 'blue',
      name: "Okean Ko'k Rangi",
      tag: "OCEAN CORPORATE",
      desc: "Korporativ, rasmiy va texnik o'quv kurslari bitiruvchilari uchun mukammal klassik ko'k dizayn.",
      color: "border-blue-500 bg-blue-50/50 text-blue-700",
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />
    },
    {
      id: 'gold',
      name: "Qirollik Tilla Rangi",
      tag: "ROYAL EDITION",
      desc: "Klassik, tantanali va yuqori darajali yutuqlarni e'tirof etuvchi tillarang hoshiyali hashamatli shablon.",
      color: "border-amber-500 bg-amber-50/50 text-amber-700",
      icon: <Award className="w-8 h-8 text-amber-600" />
    },
    {
      id: 'green',
      name: "Zümrüd Yashil Rangi",
      tag: "ACADEMIC STYLE",
      desc: "Akademik, ekologik va ijodiy yo'nalishlardagi faollarni, talabalarni taqdirlash uchun chiroyli yashil shablon.",
      color: "border-emerald-500 bg-emerald-50/50 text-emerald-700",
      icon: <GraduationCap className="w-8 h-8 text-emerald-600" />
    },
    {
      id: 'crimson',
      name: "To'q Qizil (Crimson) Shabloni",
      tag: "PRESTIGE BURGUNDY",
      desc: "Maxsus diplomlar, oliy mukofotlar va tibbiyot, ijtimoiy soha yo'nalishlari uchun o'ta jiddiy va nufuzli dizayn.",
      color: "border-red-600 bg-red-50/50 text-red-700",
      icon: <Award className="w-8 h-8 text-red-600" />
    },
    {
      id: 'purple',
      name: "Qirollik Binafsha Rangi",
      tag: "CREATIVE & TECH",
      desc: "Zamonaviy IT akademiyalar, dizayn studiyalari va san'at maktablari uchun kreativ binafsha rangli shablon.",
      color: "border-purple-600 bg-purple-50/50 text-purple-700",
      icon: <ShieldCheck className="w-8 h-8 text-purple-600" />
    },
    {
      id: 'classic_dark',
      name: "Lux To'q Rangli (Charcoal Gold)",
      tag: "DARK EXECUTIVE LUXURY",
      desc: "Eksklyuziv master-klasslar, VIP bitiruvchilar va zamonaviy o'quv markazlari uchun qora fonli, oltin rang yozuvli hashamatli shablon.",
      color: "border-slate-800 bg-slate-950 text-amber-400",
      icon: <Award className="w-8 h-8 text-yellow-500" />
    },
    {
      id: 'emerald',
      name: "Yorqin Zumrad Shabloni",
      tag: "MINT CERTIFICATE",
      desc: "Moliyaviy kurslar, biznes maktablari va til o'rgatish akademiyalari uchun toza, professional va zamonaviy zumrad-yashil shablon.",
      color: "border-emerald-700 bg-emerald-50/50 text-emerald-800",
      icon: <GraduationCap className="w-8 h-8 text-emerald-700" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden border border-slate-100 flex flex-col gap-4 animate-scaleIn max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Sertifikat Shablonlari
            </span>
            <h3 className="text-xl font-black text-[#0f172a] uppercase mt-2">
              Premium Dizaynlar Ro'yxati
            </h3>
            <p className="text-slate-400 text-xs font-medium mt-1">
              Sertifikatingiz uchun quyidagi chiroyli shablonlardan birini tanlang (shablonlar ko'paytirildi)
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates List */}
        <div className="flex flex-col gap-3 my-2 pr-1 overflow-y-auto">
          {list.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                onSelect(item.id);
                onClose();
              }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md ${
                activeTemplate === item.id 
                  ? 'border-blue-600 bg-blue-50/30 font-semibold' 
                  : 'border-slate-200/80 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-950 uppercase tracking-tight">{item.name}</h4>
                    <span className="text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase border border-slate-200/50">{item.tag}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed max-w-xl">{item.desc}</p>
                </div>
              </div>

              {activeTemplate === item.id ? (
                <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-sm shrink-0 self-end sm:self-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-blue-600 self-end sm:self-center">Tanlash</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
