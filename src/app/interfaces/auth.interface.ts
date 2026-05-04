export interface User {
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  contactInfo?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
}