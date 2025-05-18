import { JobDomain } from '../types/api.types';
import { apiRequest } from './api.service';

/**
 * Get all job domains
 */
export async function getJobDomains(lang: string = 'nl'): Promise<JobDomain[]> {
  const response = await apiRequest<JobDomain[]>({
    method: 'GET',
    url: '/jobdomeinen',
    params: { lang }
  });
  
  return response.data;
}

/**
 * Get job domain by ID
 */
export async function getJobDomainById(id: string, lang: string = 'nl'): Promise<JobDomain> {
  const response = await apiRequest<JobDomain>({
    method: 'GET',
    url: `/jobdomeinen/${id}`,
    params: { lang }
  });
  
  return response.data;
}

/**
 * Get child job domains for a parent ID
 */
export async function getChildJobDomains(parentId: string, lang: string = 'nl'): Promise<JobDomain[]> {
  const response = await apiRequest<JobDomain[]>({
    method: 'GET',
    url: `/jobdomeinen/${parentId}/children`,
    params: { lang }
  });
  
  return response.data;
} 