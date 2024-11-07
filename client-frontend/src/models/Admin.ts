export interface Admin {
  _id: string;
  adminEmail: string;
  adminPassword: string;
  adminImage?: string;
  fullName: string;
  role?: "admin" | "manager";
  status?: "active" | "suspended" | "deleted";
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
}

export default Admin;
