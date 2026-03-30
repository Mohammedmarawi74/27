
import React, { useState, useRef } from 'react';
import { SlideData, Objective } from './types';
import { DEFAULT_SLIDE, ICONS } from './constants';
import SlidePreview from './components/SlidePreview';
import EditorPanel from './components/EditorPanel';
import { Plus, Trash2, Download, Copy, Layout } from 'lucide-react';
import { toPng } from 'html-to-image';

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>([{ ...DEFAULT_SLIDE, id: Date.now().toString() }]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  const activeSlide = slides[activeSlideIndex];

  const updateActiveSlide = (newData: Partial<SlideData>) => {
    const updatedSlides = [...slides];
    updatedSlides[activeSlideIndex] = { ...activeSlide, ...newData };
    setSlides(updatedSlides);
  };

  const addSlide = () => {
    const newSlide = { ...activeSlide, id: Date.now().toString() };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  const duplicateSlide = (index: number) => {
    const newSlide = { ...slides[index], id: Date.now().toString() };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
    setActiveSlideIndex(index + 1);
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;
    
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: activeSlide.colors.background || '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `carousel-slide-${activeSlideIndex + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    }
  };

  return (
    <div className="app-container" dir="rtl">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="header-icon-wrapper">
            <Layout className="header-icon" />
          </div>
          <h1 className="header-title">مصمم الكاروسيل الاحترافي</h1>
        </div>
        <div className="header-actions">
          <button 
            onClick={downloadImage}
            className="btn-export"
          >
            <Download />
            تصدير الصورة
          </button>
        </div>
      </header>

      <div className="main-layout">
        {/* Sidebar Navigation */}
        <aside className="sidebar-nav">
          <div className="sidebar-header">
            <span className="sidebar-title">شرائح التصميم ({slides.length})</span>
            <button 
              onClick={addSlide}
              className="btn-add-slide"
            >
              <Plus />
            </button>
          </div>
          <div className="slides-list">
            {slides.map((slide, idx) => (
              <div 
                key={slide.id}
                onClick={() => setActiveSlideIndex(idx)}
                className={`slide-item ${activeSlideIndex === idx ? 'slide-item-active' : 'slide-item-inactive'}`}
              >
                <div className="slide-item-label">شريحة {idx + 1}</div>
                <div className="slide-item-title">{slide.title}</div>
                
                <div className="slide-actions">
                  <button 
                    onClick={(e) => { e.stopPropagation(); duplicateSlide(idx); }}
                    className="btn-slide-action btn-duplicate"
                  >
                    <Copy />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeSlide(idx); }}
                    className="btn-slide-action btn-delete"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="editor-main">
          <div className="editor-sticky-container">
            <div ref={previewRef} className="preview-wrapper slide-preview">
              <SlidePreview data={activeSlide} />
            </div>
            <p className="preview-label">معاينة مباشرة (شريحة {activeSlideIndex + 1})</p>
          </div>
        </main>

        {/* Customization Panel */}
        <aside className="panel-sidebar">
          <EditorPanel 
            data={activeSlide} 
            onChange={updateActiveSlide} 
          />
        </aside>
      </div>
    </div>
  );
};

export default App;
