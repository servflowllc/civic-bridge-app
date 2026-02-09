import * as React from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  address?: string;
  isVerified: boolean;
  isPro: boolean; // New field for subscription status
}

export type ViewState = 'LANDING' | 'LOGIN' | 'ONBOARDING' | 'DASHBOARD' | 'PORTAL' | 'SUCCESS' | 'ARCHIVE' | 'SETTINGS' | 'ABOUT' | 'EDUCATION' | 'UPGRADE' | 'PRIVACY' | 'TERMS' | 'ACCESSIBILITY';

export interface Representative {
  id: string;
  name: string;
  role: string;
  level: 'Federal' | 'State' | 'County' | 'Local';
  party: 'Democrat' | 'Republican' | 'Independent';
  imageUrl: string;
  lastContacted: number | null; // Timestamp
  lifetimeContactCount: number;
  contactUrl?: string; // Made optional for when API returns no URL
  mailingAddress: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  attachment?: {
    inlineData: {
      data: string;
      mimeType: string;
    }
  };
}

export interface ActivityLog {
  id: string;
  repName: string;
  repRole?: string; // e.g. "Sen. Ted Cruz"
  repAvatar: string;
  topic: string;
  date: number; // timestamp
  excerpt: string;
  method: 'webform' | 'pdf';
}

export interface ArchivedDocument {
  id: string;
  title: string;
  size: string;
  date: string;
  type: 'pdf' | 'doc';
}

// --- Google Maps Web Component Types ---
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-autocomplete': any;
    }
  }
}