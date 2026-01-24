export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';