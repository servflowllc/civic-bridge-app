import { Representative, ActivityLog, ArchivedDocument } from '../types';

// Helper to simulate a date in the past
const hoursAgo = (hours: number) => Date.now() - hours * 60 * 60 * 1000;
const daysAgo = (days: number) => Date.now() - days * 24 * 60 * 60 * 1000;

export const MOCK_REPRESENTATIVES: Representative[] = [
  {
    id: 'rep_1',
    name: 'Sen. John Sterling',
    role: 'U.S. Senate • Senior Member',
    level: 'Federal',
    party: 'Democrat',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    lastContacted: hoursAgo(2), 
    lifetimeContactCount: 12,
    contactUrl: 'https://www.senate.gov/senators/senators-contact.htm',
    mailingAddress: '311 Hart Senate Office Building, Washington, DC 20510'
  },
  {
    id: 'rep_2',
    name: 'Gov. Michael Ross',
    role: 'Governor',
    level: 'State',
    party: 'Republican',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    lastContacted: hoursAgo(48),
    lifetimeContactCount: 5,
    contactUrl: 'https://www.usa.gov/state-governor',
    mailingAddress: 'State Capitol, Room 202, Jefferson City, MO 65101'
  },
  {
    id: 'rep_3',
    name: 'Mayor Emily Chen',
    role: 'City Mayor',
    level: 'Local',
    party: 'Independent',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
    lastContacted: null,
    lifetimeContactCount: 0,
    contactUrl: 'https://www.usmayors.org/',
    mailingAddress: 'City Hall, 123 Main St, Anytown, ST 12345'
  },
  {
    id: 'rep_4',
    name: 'Rep. Sarah Connor',
    role: 'State Representative',
    level: 'State',
    party: 'Democrat',
    imageUrl: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=002e6d&color=fff',
    lastContacted: null,
    lifetimeContactCount: 8,
    contactUrl: 'https://www.house.gov/representatives',
    mailingAddress: 'Legislative Office Building, Room 404, Hartford, CT 06106'
  },
  {
    id: 'rep_5',
    name: 'David Kim',
    role: 'County Commissioner',
    level: 'County',
    party: 'Republican',
    imageUrl: 'https://ui-avatars.com/api/?name=David+Kim&background=cc0000&color=fff',
    lastContacted: null,
    lifetimeContactCount: 1,
    contactUrl: 'https://www.naco.org/',
    mailingAddress: 'County Administration Building, 555 Court St, Clearwater, FL 33756'
  },
  {
    id: 'rep_6',
    name: 'Jessica Pearson',
    role: 'City Council',
    level: 'Local',
    party: 'Independent',
    imageUrl: 'https://ui-avatars.com/api/?name=Jessica+Pearson&background=5b21b6&color=fff',
    lastContacted: null,
    lifetimeContactCount: 3,
    contactUrl: 'https://www.nlc.org/',
    mailingAddress: 'City Hall, Suite 300, 200 E. Santa Clara St, San Jose, CA 95113'
  },
];

export const MOCK_LOGS: ActivityLog[] = [
  {
    id: 'log_1',
    repName: 'Rep. Ocasio-Cortez',
    repAvatar: 'https://ui-avatars.com/api/?name=AOC&background=002e6d&color=fff',
    topic: 'Housing Legislation: Urgent need for affordable housing reforms in district.',
    date: daysAgo(3),
    excerpt: 'I am writing to urge you to support the new affordable housing bill...',
    method: 'webform'
  },
  {
    id: 'log_2',
    repName: 'Sen. Ted Cruz',
    repAvatar: 'https://ui-avatars.com/api/?name=TC&background=cc0000&color=fff',
    topic: 'Energy Sector Regulations and grid stability concerns.',
    date: daysAgo(12),
    excerpt: 'The recent outages have highlighted significant vulnerabilities...',
    method: 'pdf'
  },
  {
    id: 'log_3',
    repName: 'Mayor Eric Adams',
    repAvatar: 'https://ui-avatars.com/api/?name=EA&background=002e6d&color=fff',
    topic: 'Local Infrastructure: Pothole repair schedule for Main St.',
    date: daysAgo(25),
    excerpt: 'Driving conditions on Main St have become hazardous...',
    method: 'webform'
  },
  {
    id: 'log_4',
    repName: 'Rep. Nancy Pelosi',
    repAvatar: 'https://ui-avatars.com/api/?name=NP&background=002e6d&color=fff',
    topic: 'Federal Budget allocation for improved public transit.',
    date: daysAgo(45),
    excerpt: 'Public transit funding is essential for our economic growth...',
    method: 'webform'
  }
];

export const MOCK_DOCUMENTS: ArchivedDocument[] = [
  {
    id: 'doc_1',
    title: 'Housing_Reform_Draft_v2.pdf',
    size: '2.4 MB',
    date: 'Nov 12, 2023',
    type: 'pdf'
  },
  {
    id: 'doc_2',
    title: 'Senator_Smith_Correspondence.pdf',
    size: '1.1 MB',
    date: 'Oct 28, 2023',
    type: 'pdf'
  }
];