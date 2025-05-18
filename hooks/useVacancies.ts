import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getSimilarVacancies, getVacancyById, searchVacancies } from '../services/api/vacancy.service';
import { VacancySearchParams } from '../services/types/api.types';

// Search Vacancies Hook
export function useVacancySearch(params: VacancySearchParams) {
  return useQuery({
    queryKey: ['vacancies', params],
    queryFn: () => searchVacancies(params),
    enabled: !!params,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get Vacancy Details Hook
export function useVacancyDetails(id: string, lang?: string) {
  return useQuery({
    queryKey: ['vacancy', id, lang],
    queryFn: () => getVacancyById(id, lang),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get Similar Vacancies Hook
export function useSimilarVacancies(id: string, limit?: number) {
  return useQuery({
    queryKey: ['similarVacancies', id, limit],
    queryFn: () => getSimilarVacancies(id, limit),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Infinite Scroll Vacancies Hook
export function useInfiniteVacancies(initialParams: VacancySearchParams) {
  return useInfiniteQuery({
    queryKey: ['infiniteVacancies', initialParams],
    queryFn: ({ pageParam = 1 }) => {
      const params = {
        ...initialParams,
        page: pageParam,
      };
      return searchVacancies(params);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      if (lastPageParam < totalPages) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    enabled: !!initialParams,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
} 