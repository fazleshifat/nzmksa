export type SessionTab =
  | 'all'
  | 'active'
  | 'logged_out'
  | 'expired'
  | 'revoked'
  | 'employees'
  | 'admins'
  | 'superadmins';

export interface SessionLocation {
  country?: string;
  city?: string;
  region?: string;
}

export interface AdminSession {
  _id: string;

  userId: string;
  name: string;

  userType:
  | 'employee'
  | 'admin'
  | 'superadmin';

  device: string;
  browser: string;
  os: string;

  ipAddress: string;

  location?: SessionLocation;

  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;

  loggedOutAt?: string;

  revoked: boolean;

  status:
  | 'active'
  | 'logged_out'
  | 'expired'
  | 'revoked';

  isActive: boolean;
  isLoggedOut: boolean;
  isExpired: boolean;
  isRevoked: boolean;

  duration: number;
}

export interface SessionsStats {
  total: number;
  active: number;
  loggedOut: number;
  expired: number;
  revoked: number;
}

export interface SessionsResponse {
  sessions: AdminSession[];
  stats: SessionsStats;
}