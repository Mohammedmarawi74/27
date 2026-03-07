
export interface Objective {
  id: string;
  icon: string;
  text: string;
}

export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ColorTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface SlideData {
  id: string;
  logo: string;
  secondaryLogo?: string;
  secondaryLogoPosition?: LogoPosition;
  title: string;
  subtitle: string;
  mainImage: string;
  badgeText: string;
  objectives: Objective[];
  colors: ColorTheme;
  footer: {
    handle: string;
    phone: string;
    website: string;
  };
  customCss?: string;
}

export type IconType = 'Agriculture' | 'ModernTech' | 'Development' | 'Protection' | 'Commerce' | 'Livestock';
