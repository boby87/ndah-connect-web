export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
  message?: string;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
