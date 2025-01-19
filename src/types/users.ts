export interface Role {
  created_at: string;
  description: string;
  id: number;
  name: string;
  updated_at: string;
}

export interface User {
  created_at: string;
  email: string;
  id: number;
  name: string;
  password: string;
  role: Role;
  role_id: number;
  updated_at: string;
}

export interface CreateUser {
  fullname: string;
  email: string;
  nominatedPassword: string;
  confirmPassword: string;
  role: string;
}