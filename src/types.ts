export type SearchMode = 'all' | 'deep' | 'academic' | 'code' | 'news';
export type SearchTone = 'balanced' | 'concise' | 'comprehensive';
export type TimeFilter = 'all' | 'day' | 'week' | 'month' | 'year';

export interface Source {
  title: string;
  url: string;
  domain: string;
}

export interface SearchMessage {
  role: 'user' | 'model';
  text: string;
  sources?: Source[];
  webSearchQueries?: string[];
  followUps?: string[];
  createdAt: number;
}

export interface SearchSession {
  id: string;
  initialQuery: string;
  mode: SearchMode;
  tone: SearchTone;
  timeFilter: TimeFilter;
  messages: SearchMessage[];
  createdAt: number;
  bookmarked?: boolean;
}

export interface TrendingTopic {
  category: string;
  query: string;
  icon: string;
}
