
import React, { useMemo } from 'react';
import { SlideData } from '../types';
import { ICONS } from '../constants';
import { Phone, Globe } from 'lucide-react';

interface Props {
  data: SlideData;
}

const SlidePreview: React.FC<Props> = ({ data }) => {
  const slideId = useMemo(() => `slide-${data.id.replace(/\s+/g, '-')}`, [data.id]);

  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [data.logo]);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`poster-root ${slideId}`} 
         style={{ 
           fontFamily: 'IBM Plex Sans Arabic',
           backgroundColor: data.colors.background 
         }}>
      <style>
        {`
          .${slideId} {
            ${data.customCss || ''}
          }
          .${slideId} .poster-title {
            font-size: 22px !important;
            line-height: 1.2 !important;
            font-weight: 900 !important;
            color: ${data.colors.primary} !important;
          }
          .${slideId} .poster-subtitle {
            font-size: 13px !important;
            line-height: 1.4 !important;
            font-weight: 500 !important;
            color: ${data.colors.secondary} !important;
          }
          .${slideId} .poster-objective-text {
            font-size: 13px !important;
            line-height: 1.5 !important;
            font-weight: 500 !important;
            color: ${data.colors.text} !important;
          }
          .${slideId} .poster-objective-icon {
            border-color: ${data.colors.secondary}33 !important;
            color: ${data.colors.secondary} !important;
            background-color: ${data.colors.secondary}05 !important;
            width: 2rem !important;
            height: 2rem !important;
          }
          .${slideId} .poster-badge {
            font-weight: 700 !important;
            font-size: 11px !important;
            background-color: ${data.colors.secondary} !important;
          }
          .${slideId} .poster-footer {
            border-top: 1px solid ${data.colors.primary}22 !important;
            color: ${data.colors.primary} !important;
          }
          .${slideId} .poster-footer-right {
             background-color: ${data.colors.primary} !important;
          }
        `}
      </style>
      
      {/* Header Logo */}
      <div className="poster-logo-container">
        {data.logo && !imageError ? (
          <img 
            src={data.logo} 
            alt="Logo" 
            className="poster-logo"
            crossOrigin="anonymous"
            onError={handleImageError}
          />
        ) : data.logo && imageError ? (
           <div className="fallback-icon flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
             <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
               <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
               <circle cx="8.5" cy="8.5" r="1.5"></circle>
               <polyline points="21 15 16 10 5 21"></polyline>
             </svg>
           </div>
        ) : null}
      </div>

      {/* Title & Subtitle */}
      <div className="poster-titles-container">
        <h2 className="poster-title">
          {data.title}
        </h2>
        <p className="poster-subtitle">
          {data.subtitle}
        </p>
      </div>

      {/* Main Image Container */}
      <div className="poster-image-wrapper">
        <div className="poster-image-container">
          <img 
            src={data.mainImage} 
            alt="Main Content" 
            className="poster-image"
            crossOrigin="anonymous"
            onError={handleImageError}
          />
        </div>
        
        {/* Floating Badge */}
        <div className="poster-badge-container">
          <div className="poster-badge">
            {data.badgeText}
          </div>
        </div>
      </div>

      {/* Objectives Section - This now has more space due to the 2/3 ratio */}
      <div className="poster-objectives">
        <div className="poster-objectives-grid">
          {data.objectives.map((obj) => (
            <div key={obj.id} className="poster-objective-item">
              <div className="poster-objective-icon">
                <div className="poster-objective-icon-inner">
                  {ICONS[obj.icon] || ICONS['Agriculture']}
                </div>
              </div>
              <p className="poster-objective-text">
                {obj.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - Pushed to absolute bottom with mt-auto */}
      <div className="poster-footer">
        <div className="poster-footer-wrapper">
          <div className="poster-footer-left">
            <span>{data.footer.handle}</span>
            <span className="poster-footer-dot" style={{ backgroundColor: data.colors.text }}></span>
            <div className="poster-footer-phone-icon">
              <Phone style={{ color: data.colors.secondary }} />
            </div>
            <span>{data.footer.phone}</span>
          </div>
        </div>
        <div className="poster-footer-right">
            <Globe />
            <span>{data.footer.website}</span>
        </div>
      </div>

      {/* Design Footer - 5px high line with text above it */}
      <div className="design-footer-container">
        <div className="design-footer-text-row">
          <span>al_investor.com</span>
          <span>منصة المستثمر</span>
        </div>
        <div className="design-footer-line" style={{ backgroundColor: data.colors.primary }}></div>
      </div>
    </div>
  );
};

export default SlidePreview;
