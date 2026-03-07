
import React from 'react';
import { 
  Leaf, 
  Cpu, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  Globe, 
  Phone,
  Layout,
  Download,
  Plus,
  Trash2,
  Image as ImageIcon,
  Type,
  Sparkles,
  Palette,
  Code,
  FileText
} from 'lucide-react';

export const ICONS: Record<string, React.ReactNode> = {
  Agriculture: <Leaf className="w-7 h-7" />,
  ModernTech: <Cpu className="w-7 h-7" />,
  Development: <Users className="w-7 h-7" />,
  Protection: <ShieldCheck className="w-7 h-7" />,
  Commerce: <TrendingUp className="w-7 h-7" />,
};

export const COLOR_THEMES = [
  { name: 'كحلي المستثمر', primary: '#0ea5e9', secondary: '#0f172a', background: '#f8fafc', text: '#1e293b' },
  { name: 'الأحمر الصيفي', primary: '#dc2626', secondary: '#facc15', background: '#fefce8', text: '#7f1d1d' },
  { name: 'فوشيا التحليل', primary: '#c026d3', secondary: '#3b82f6', background: '#eff6ff', text: '#1e293b' },
  { name: 'سيان الابتكار', primary: '#0891b2', secondary: '#0f172a', background: '#ffffff', text: '#0f172a' },
  { name: 'لايم النمو', primary: '#65a30d', secondary: '#3b82f6', background: '#eff6ff', text: '#1a2e05' },
  { name: 'برتقالي الحركة', primary: '#f97316', secondary: '#fb923c', background: '#fff7ed', text: '#7c2d12' },
  { name: 'الوضع الداكن', primary: '#2dd4bf', secondary: '#1e293b', background: '#0f172a', text: '#e2e8f0' },
  { name: 'بنفسجي العمق', primary: '#7c3aed', secondary: '#3b82f6', background: '#f5f3ff', text: '#1e1b4b' },
];

export const CSS_SNIPPETS = [
  { name: 'مؤسسي كلاسيك', css: '.poster-root { background: #ffffff; }\n.poster-title { color: #00554e; }\n.poster-subtitle { color: #00a651; }' },
  { name: 'ذهبي ملكي', css: '.poster-root { background: radial-gradient(circle at top right, #fff, #fdf8e8); }\n.poster-title { color: #8b7355; }\n.poster-badge { background: #8b7355; }\n.poster-objective-icon { border-color: #d4af37; color: #8b7355; }' },
  { name: 'نمط داكن', css: '.poster-root { background: #00554e; }\n.poster-title { color: #ffffff; }\n.poster-subtitle { color: #00ff80; }\n.poster-objective-text { color: #e2e8f0; }\n.poster-objective-icon { background: rgba(255,255,255,0.1); border-color: transparent; color: #fff; }' },
  { name: 'تدرج حديث', css: '.poster-root { background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); }\n.poster-image-container { border: 8px solid white; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); }' },
  { name: 'عنوان عريض جداً', css: '.poster-title { text-transform: uppercase; letter-spacing: -0.02em; font-weight: 900 !important; font-size: 42px !important; }' },
  { name: 'بطاقة شفافة', css: '.poster-badge { background: rgba(0, 166, 81, 0.9); backdrop-filter: blur(8px); }' }
];

export const DEFAULT_SLIDE: any = {
  // Using a cleaner SVG placeholder for the logo that supports CORS and doesn't fail.
  logo: 'https://raw.githubusercontent.com/saudivision2030/logos/main/vision2030-logo.png',
  title: 'تحقيق مستهدفات رؤية المملكة 2030 في الأمن الغذائي والاستدامة',
  subtitle: 'مبادرات استراتيجية لتعزيز الابتكار في القطاع الزراعي والمائي',
  mainImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
  badgeText: 'ركائز التحول الرقمي',
  objectives: [
    { id: '1', icon: 'ModernTech', text: 'تمكين التقنيات الزراعية الحديثة لرفع كفاءة الإنتاج' },
    { id: '2', icon: 'Protection', text: 'حماية الموارد الطبيعية وضمان استدامتها للأجيال' },
    { id: '3', icon: 'Development', text: 'تطوير الكوادر الوطنية وتعزيز الخبرات الميدانية' },
    { id: '4', icon: 'Commerce', text: 'دعم الاستثمار وتحفيز القطاع الخاص في المشاريع' },
  ],
  colors: {
    primary: '#00554e',
    secondary: '#00a651',
    background: '#ffffff',
    text: '#1e293b'
  },
  footer: {
    handle: '@mewa_ksa',
    phone: '939',
    website: 'mewa.gov.sa'
  },
  customCss: ''
};
