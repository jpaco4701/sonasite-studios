export enum AppState {
  GATHERING_INFO,
  GENERATING,
  VIEWING_SITE,
}

export interface BusinessInfo {
  name: string;
  type: string;
  location: string;
  language: string;
}

export interface WebsiteSection {
  id: string; // Now required for stable linking and selection
  type: 'header' | 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact' | 'footer';
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    imageUrl?: string;
    logoUrl?: string;
    items?: { title: string; description: string; icon?: string; price?: string, imageUrl?: string }[];
    images?: string[];
    links?: { name: string; url: string; }[];
    navLinks?: { name: string; url: string; }[];
    ctaButton?: { text: string; url: string; };
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
  }
}

export interface WebsiteData {
  businessName: string;
  language: string;
  pages: {
    home: WebsiteSection[];
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export interface CrmContact {
  id: number;
  name: string;
  email: string;
  status: 'Lead' | 'Contacted' | 'Customer' | 'Lost';
  lastContacted: string;
}

export interface Invoice {
    id: string;
    customerName: string;
    customerEmail: string;
    items: {
        description: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    issueDate: string;
    dueDate: string;
}