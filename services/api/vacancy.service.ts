import {
    VacancyDetails,
    VacancySearchParams,
    VacancySearchResponse
} from '../types/api.types';
import { apiRequest, validateRequest } from './api.service';

/**
 * Search for vacancies based on the provided parameters
 */
export async function searchVacancies(params: VacancySearchParams): Promise<VacancySearchResponse> {
  // Default values for pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  
  // Calculate offset
  const offset = (page - 1) * limit;
  
  // Build query parameters
  const queryParams = {
    q: params.q,
    jobDomainId: params.jobDomainId,
    postalCode: params.postalCode,
    distance: params.distance,
    offset,
    limit,
    sort: params.sort || 'relevance',
    lang: params.lang || 'nl'
  };
  
  // Build API request
  const response = await apiRequest<VacancySearchResponse>({
    method: 'GET',
    url: '/vacatures',
    params: queryParams
  });
  
  return response.data;
}

/**
 * Get vacancy details by ID
 */
export async function getVacancyById(id: string, lang: string = 'nl'): Promise<VacancyDetails> {
  // Validate required parameters
  if (!validateRequest({ id }, ['id'])) {
    throw new Error('Vacancy ID is required');
  }
  
  // Build API request
  const response = await apiRequest<VacancyDetails>({
    method: 'GET',
    url: `/vacatures/${id}`,
    params: { lang }
  });
  
  return response.data;
}

/**
 * Get similar vacancies for a given vacancy ID
 */
export async function getSimilarVacancies(id: string, limit: number = 5): Promise<VacancySearchResponse> {
  // Validate required parameters
  if (!validateRequest({ id }, ['id'])) {
    throw new Error('Vacancy ID is required');
  }
  
  // Build API request
  const response = await apiRequest<VacancySearchResponse>({
    method: 'GET',
    url: `/vacatures/${id}/similar`,
    params: { limit }
  });
  
  return response.data;
} 