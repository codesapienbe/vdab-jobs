import { useQuery } from '@tanstack/react-query';
import { getChildJobDomains, getJobDomainById, getJobDomains } from '../services/api/jobDomain.service';

// Get All Job Domains Hook
export function useJobDomains(lang?: string) {
  return useQuery({
    queryKey: ['jobDomains', lang],
    queryFn: () => getJobDomains(lang),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - reference data changes infrequently
  });
}

// Get Job Domain By ID Hook
export function useJobDomainById(id: string, lang?: string) {
  return useQuery({
    queryKey: ['jobDomain', id, lang],
    queryFn: () => getJobDomainById(id, lang),
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Get Child Job Domains Hook
export function useChildJobDomains(parentId: string, lang?: string) {
  return useQuery({
    queryKey: ['childJobDomains', parentId, lang],
    queryFn: () => getChildJobDomains(parentId, lang),
    enabled: !!parentId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
} 