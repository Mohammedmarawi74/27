
import React, { useMemo } from 'react';
import { SlideData } from '../types';
import { ICONS } from '../constants';
import { Phone, Globe, Image as ImageIcon } from 'lucide-react';

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
            font-size: 20px !important;
            font-weight: 800 !important;
            color: ${data.colors.primary} !important;
          }
          .${slideId} .poster-subtitle {
            font-size: 11px !important;
            font-weight: 600 !important;
            color: ${data.colors.secondary} !important;
          }
          .${slideId} .poster-objective-text {
            color: ${data.colors.text} !important;
            font-weight: 600 !important;
          }
          .${slideId} .poster-objective-icon {
            border-color: ${data.colors.secondary}40 !important;
            color: ${data.colors.secondary} !important;
            background-color: ${data.colors.secondary}20 !important;
          }
          .${slideId} .poster-badge {
            font-weight: 700 !important;
            background-color: ${data.colors.secondary} !important;
          }
          .${slideId} .poster-footer-phone-icon {
            border-color: ${data.colors.secondary}30 !important;
            background-color: ${data.colors.secondary}15 !important;
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
        {data.badgeText && (
          <div className="poster-badge-container">
            <div className="poster-badge">
              {data.badgeText}
            </div>
          </div>
        )}
      </div>

      {/* Objectives Section Grid */}
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



      {/* Design Footer - 5px high line with text above it */}
      <div className="design-footer-container">
        <div className="design-footer-text-row" style={{ color: data.colors.text }}>
          {/* RTL -> Right side first */}
          <span style={{ fontWeight: 800 }}>منصة المستثمر الاقتصادية</span>
          {/* RTL -> Left side second */}
          <span style={{ direction: 'ltr', display: 'inline-block' }}>al-investor.com</span>
        </div>
        <div className="design-footer-line" style={{ backgroundColor: data.colors.primary }}></div>
      </div>
    </div>
  );
};

export default SlidePreview;
