
import React, { useState } from 'react';
import { SlideData, Objective, LogoPosition, ColorTheme } from '../types';
import { ICONS, CSS_SNIPPETS, COLOR_THEMES } from '../constants';
import { 
  ImageIcon, 
  Target, 
  Info, 
  Upload, 
  Sparkles, 
  Palette, 
  Code, 
  FileText,
  LayoutGrid,
  Trash2,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface Props {
  data: SlideData;
  onChange: (newData: Partial<SlideData>) => void;
}

type Tab = 'ai' | 'texts' | 'design' | 'customize';

const EditorPanel: React.FC<Props> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<Tab>('design');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a professional carousel slide content in Arabic about: ${aiPrompt}. 
        The content should be highly engaging and suitable for a government or corporate presentation.
        Return a title, a subtitle, a badge text, and exactly 4 objectives. 
        The tone should be formal and inspired by modern Saudi initiatives if applicable.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              badgeText: { type: Type.STRING },
              objectives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    icon: { 
                      type: Type.STRING,
                      description: 'Must be one of: Agriculture, ModernTech, Development, Protection, Commerce'
                    }
                  },
                  required: ['text', 'icon']
                }
              }
            },
            required: ['title', 'subtitle', 'badgeText', 'objectives']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      onChange({
        title: result.title || data.title,
        subtitle: result.subtitle || data.subtitle,
        badgeText: result.badgeText || data.badgeText,
        objectives: (result.objectives || []).map((obj: any, idx: number) => ({
          id: (idx + 1).toString() + Date.now(),
          text: obj.text,
          icon: obj.icon
        }))
      });
      
      setActiveTab('texts');
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("حدث خطأ أثناء توليد المحتوى. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'mainImage' | 'secondaryLogo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateObjective = (id: string, updates: Partial<Objective>) => {
    const updated = data.objectives.map(obj => 
      obj.id === id ? { ...obj, ...updates } : obj
    );
    onChange({ objectives: updated });
  };

  const applyTheme = (theme: ColorTheme) => {
    onChange({ colors: theme });
  };

  const updateColor = (key: keyof ColorTheme, value: string) => {
    onChange({ colors: { ...data.colors, [key]: value } });
  };

  const addSnippet = (css: string) => {
    const currentCss = data.customCss || '';
    onChange({ customCss: currentCss + (currentCss ? '\n' : '') + css });
  };

  const renderTabs = () => (
    <div className="flex bg-[#1e293b] p-1 border-b border-gray-700">
      <button 
        onClick={() => setActiveTab('ai')}
        className={`flex-1 flex flex-col items-center py-2 transition-colors ${activeTab === 'ai' ? 'text-emerald-400 bg-[#0f172a] rounded-lg shadow-sm' : 'text-gray-400 hover:text-white'}`}
      >
        <Sparkles className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">الذكاء</span>
      </button>
      <button 
        onClick={() => setActiveTab('texts')}
        className={`flex-1 flex flex-col items-center py-2 transition-colors ${activeTab === 'texts' ? 'text-emerald-400 bg-[#0f172a] rounded-lg shadow-sm' : 'text-gray-400 hover:text-white'}`}
      >
        <FileText className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">النصوص</span>
      </button>
      <button 
        onClick={() => setActiveTab('design')}
        className={`flex-1 flex flex-col items-center py-2 transition-colors ${activeTab === 'design' ? 'text-emerald-400 bg-[#0f172a] rounded-lg shadow-sm' : 'text-gray-400 hover:text-white'}`}
      >
        <Palette className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">التصميم</span>
      </button>
      <button 
        onClick={() => setActiveTab('customize')}
        className={`flex-1 flex flex-col items-center py-2 transition-colors ${activeTab === 'customize' ? 'text-emerald-400 bg-[#0f172a] rounded-lg shadow-sm' : 'text-gray-400 hover:text-white'}`}
      >
        <Code className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">تخصيص</span>
      </button>
    </div>
  );

  const isSelectedTheme = (theme: ColorTheme) => {
    return theme.primary === data.colors.primary && 
           theme.background === data.colors.background &&
           theme.secondary === data.colors.secondary;
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a]">
      {renderTabs()}
      
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {activeTab === 'design' && (
           <div className="space-y-8 text-gray-300">
              {/* Ready Themes Grid */}
              <section>
                <h3 className="text-gray-400 font-bold text-xs mb-4 text-center uppercase tracking-widest">الثيمات الجاهزة</h3>
                <div className="grid grid-cols-2 gap-3">
                  {COLOR_THEMES.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => applyTheme(theme)}
                      className={`relative flex flex-col bg-white rounded-xl p-3 border-2 transition-all group ${
                        isSelectedTheme(theme) ? 'border-blue-500 shadow-lg scale-105' : 'border-transparent hover:border-gray-400'
                      }`}
                    >
                      {isSelectedTheme(theme) && (
                        <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-0.5 z-10">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-1.5">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.secondary }}></div>
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 truncate ml-1">{theme.name}</span>
                      </div>
                      
                      <div className="h-2 w-full rounded-full overflow-hidden flex bg-gray-100">
                        <div className="h-full" style={{ width: '65%', backgroundColor: theme.background }}></div>
                        <div className="h-full" style={{ width: '35%', backgroundColor: theme.secondary }}></div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Color Customization */}
              <section>
                <h3 className="text-gray-400 font-bold text-xs mb-6 text-center uppercase tracking-widest">تخصيص الألوان</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 text-center uppercase">الأساسي</label>
                    <div className="relative group">
                      <input 
                        type="color" 
                        value={data.colors.primary}
                        onChange={(e) => updateColor('primary', e.target.value)}
                        className="w-full h-10 bg-[#1e293b] border border-gray-700 rounded-lg cursor-pointer opacity-0 absolute inset-0 z-10"
                      />
                      <div className="w-full h-10 rounded-lg border border-gray-600 overflow-hidden flex items-center justify-center bg-[#1e293b]">
                        <div className="w-full h-full" style={{ backgroundColor: data.colors.primary }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 text-center uppercase">الثانوي</label>
                    <div className="relative group">
                      <input 
                        type="color" 
                        value={data.colors.secondary}
                        onChange={(e) => updateColor('secondary', e.target.value)}
                        className="w-full h-10 bg-[#1e293b] border border-gray-700 rounded-lg cursor-pointer opacity-0 absolute inset-0 z-10"
                      />
                      <div className="w-full h-10 rounded-lg border border-gray-600 overflow-hidden flex items-center justify-center bg-[#1e293b]">
                        <div className="w-full h-full" style={{ backgroundColor: data.colors.secondary }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 text-center uppercase">الخلفية</label>
                    <div className="relative group">
                      <input 
                        type="color" 
                        value={data.colors.background}
                        onChange={(e) => updateColor('background', e.target.value)}
                        className="w-full h-10 bg-[#1e293b] border border-gray-700 rounded-lg cursor-pointer opacity-0 absolute inset-0 z-10"
                      />
                      <div className="w-full h-10 rounded-lg border border-gray-600 overflow-hidden flex items-center justify-center bg-[#1e293b]">
                        <div className="w-full h-full" style={{ backgroundColor: data.colors.background }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 text-center uppercase">النصوص</label>
                    <div className="relative group">
                      <input 
                        type="color" 
                        value={data.colors.text}
                        onChange={(e) => updateColor('text', e.target.value)}
                        className="w-full h-10 bg-[#1e293b] border border-gray-700 rounded-lg cursor-pointer opacity-0 absolute inset-0 z-10"
                      />
                      <div className="w-full h-10 rounded-lg border border-gray-600 overflow-hidden flex items-center justify-center bg-[#1e293b]">
                        <div className="w-full h-full" style={{ backgroundColor: data.colors.text }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-800 pt-8">
                <section>
                  <h3 className="text-emerald-400 font-bold text-sm mb-4">الشعارات والوسائط</h3>
                  
                  {/* Logo Selection Grid */}
                  <div className="mb-6">
                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">اختر شعار من القائمة</label>
                    <div className="logo-picker-grid">
                      {[1, 2, 3, 4].map(idx => {
                        const logoPath = `/logooo/logo-${idx}.png`;
                        return (
                          <div 
                            key={idx}
                            className={`logo-option ${data.logo === logoPath ? 'active' : ''}`}
                            onClick={() => onChange({ logo: logoPath })}
                          >
                            <img src={logoPath} alt={`Logo ${idx}`} />
                          </div>
                        );
                      })}
                    </div>
                    {data.logo && (
                      <button 
                        onClick={() => onChange({ logo: '' })}
                        className="btn-remove-logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        إزالة الشعار كلياً
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center p-6 bg-[#1e293b] border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
                      <Upload className="w-5 h-5 text-emerald-400 mb-2" />
                      <span className="text-[10px] font-medium text-gray-400">تحميل شعار مخصص</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                    </label>
                    <label className="flex flex-col items-center justify-center p-6 bg-[#1e293b] border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
                      <Upload className="w-5 h-5 text-emerald-400 mb-2" />
                      <span className="text-[10px] font-medium text-gray-400">تغيير الصورة المركزية</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'mainImage')} />
                    </label>
                  </div>
                </section>
              </div>
           </div>
        )}

        {activeTab === 'customize' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-emerald-400 font-bold text-sm mb-4">قوالب جاهزة (SNIPPETS)</h3>
              <div className="grid grid-cols-2 gap-3">
                {CSS_SNIPPETS.map((snippet) => (
                  <button
                    key={snippet.name}
                    onClick={() => addSnippet(snippet.css)}
                    className="bg-[#1e293b] hover:bg-[#334155] border border-gray-700 text-gray-300 py-3 px-2 rounded-lg text-xs font-medium transition-colors text-right flex items-center justify-between"
                  >
                    <span className="ml-2">+</span>
                    <span>{snippet.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-emerald-400 font-bold text-sm">محرر CSS المتقدم</h3>
              </div>
              <div className="mb-4">
                <p className="text-[10px] text-gray-400 mb-2 font-mono">
                  Classes: <span className="text-emerald-300">.poster-root, .poster-title, .poster-subtitle, .poster-image, .poster-badge, .poster-objective-text...</span>
                </p>
                <div className="relative group">
                  <textarea
                    value={data.customCss}
                    onChange={(e) => onChange({ customCss: e.target.value })}
                    placeholder="... هنا لتخصيص التصميم CSS اكتب كود"
                    className="w-full h-80 bg-[#020617] text-emerald-400 p-4 font-mono text-xs rounded-xl border border-gray-800 focus:border-emerald-500/50 outline-none resize-none transition-all leading-relaxed"
                    spellCheck={false}
                  />
                  <div className="absolute top-2 left-2 opacity-30 group-hover:opacity-100 transition-opacity">
                    <Code className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => onChange({ customCss: '' })}
                className="w-full py-3 bg-[#1e293b] hover:bg-[#334155] text-gray-300 rounded-lg text-sm font-medium transition-colors border border-gray-700"
              >
                إعادة تعيين CSS
              </button>
            </section>
          </div>
        )}

        {activeTab === 'texts' && (
          <div className="space-y-6 text-gray-300">
             <section>
              <h3 className="text-emerald-400 font-bold text-sm mb-4">العناوين والمحتوى</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">العنوان الرئيسي</label>
                  <textarea 
                    value={data.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    className="w-full p-3 border border-gray-700 rounded-lg text-sm bg-[#1e293b] text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none h-20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">العنوان الفرعي</label>
                  <input 
                    type="text"
                    value={data.subtitle}
                    onChange={(e) => onChange({ subtitle: e.target.value })}
                    className="w-full p-3 border border-gray-700 rounded-lg text-sm bg-[#1e293b] text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <section className="mt-6">
                <h3 className="text-emerald-400 font-bold text-sm mb-4">الأهداف النقاط</h3>
                <div className="space-y-3">
                  {data.objectives.map((obj, i) => (
                    <div key={obj.id} className="p-3 bg-[#1e293b] rounded-lg border border-gray-700">
                      <textarea 
                        value={obj.text}
                        onChange={(e) => updateObjective(obj.id, { text: e.target.value })}
                        className="w-full p-2 text-xs bg-[#0f172a] text-white border border-gray-800 rounded outline-none h-14"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </section>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-full space-y-6">
             <div className="flex flex-col items-center justify-center text-center p-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                   <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-white font-bold">توليد المحتوى بالذكاء الاصطناعي</h4>
                <p className="text-xs text-gray-400 leading-relaxed">اكتب موضوع الشريحة وسيقوم الذكاء الاصطناعي بكتابة النصوص واختيار الأيقونات المناسبة.</p>
             </div>

             <div className="space-y-4 px-2">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="مثال: أهمية الأمن المائي في رؤية 2030..."
                  className="w-full h-32 p-4 bg-[#1e293b] border border-gray-700 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500 resize-none transition-all leading-relaxed rtl"
                />
                <button
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      توليد المحتوى
                    </>
                  )}
                </button>
             </div>
          </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default EditorPanel;
