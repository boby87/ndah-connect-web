export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, string | number | boolean | undefined>;
}

export const DEFAULT_PAGINATION: Required<Pick<PaginationParams, 'page' | 'pageSize'>> = {
  page: 1,
  pageSize: 20,
};
