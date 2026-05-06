export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  address: string;
  contactInfo: string;
  dob: string;         // Added
  panNumber: string;   // Added
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
}