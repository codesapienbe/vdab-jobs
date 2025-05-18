// Job Domain Interfaces
export interface JobDomain {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  children?: JobDomain[];
}

// Company Interfaces
export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
}

// Location Interfaces
export interface Location {
  city: string;
  postalCode: string;
  street?: string;
  houseNumber?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
}

// Vacancy Interfaces
export interface VacancySearchResult {
  id: string;
  title: string;
  url: string;
  company: Company;
  publicationDate: string;
  location: Location;
  jobDomain?: string;
  jobDomainId?: string;
  expired: boolean;
}

export interface VacancySearchParams {
  q?: string;
  jobDomainId?: string;
  postalCode?: string;
  distance?: number;
  page?: number;
  limit?: number;
  sort?: 'date' | 'relevance' | 'distance';
  lang?: 'nl' | 'fr' | 'en';
}

export interface VacancySearchResponse {
  items: VacancySearchResult[];
  total: number;
  limit: number;
  offset: number;
  count: number;
}

export interface VacancyDetails extends VacancySearchResult {
  description: string;
  requirements?: string[];
  qualifications?: string[];
  experienceLevel?: string;
  contractType?: string;
  workRegime?: string;
  salary?: {
    value?: string;
    period?: string;
    benefits?: string[];
  };
  applicationUrl?: string;
  applicationEmail?: string;
  applicationPhone?: string;
  applicationDeadline?: string;
}

// Error Interfaces
export interface ApiError {
  code: string;
  message: string;
  details?: any;
} 