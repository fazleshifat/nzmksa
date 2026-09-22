import { Preferences } from '@capacitor/preferences';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Employee {
    id?: string;
    _id?: string;

    name: string;
    residentIdNumber: string;

    idVersion?: string;
    nationality?: string;
    birthCity?: string;
    birthCountry?: string;
    dateOfBirth?: string;
    maritalStatus?: string;
    sponsorshipTransfers?: number;
    religion?: string;
    occupation?: string;
    employer?: string;
    employerIdNumber?: string;
    issuePlace?: string;
    workPermit?: string;
    residentIdIssueDate?: string;
    residentIdExpiry?: string;
    sponsorName?: string;
    sponsorIdNumber?: string;

    active?: boolean;

    avatarUrl?: string;
    iqamaImage?: string;

    passport?: {
        amountDeposit?: string;
        passportNumber?: string;
        type?: string;
        issuingDate?: string;
        expiryDate?: string;
        issuingCity?: string;
        status?: string;
    };

    healthInsurance?: {
        [key: string]: unknown;
    };

    hajjDetails?: {
        status?: string;
        lastHajjYear?: string;
    };

    qrData?: {
        name?: string;
        residentIdNumber?: string;
        nationality?: string;
        dateOfBirth?: string;
        sponsorName?: string;
        sponsorIdNumber?: string;
    };

    [key: string]: unknown;
}

export interface Admin {
    id?: string;
    _id?: string;

    name: string;
    email: string;
    role: 'admin';
    active?: boolean;

    [key: string]: unknown;
}

export type AccountRole = 'user' | 'admin';

export interface LoginResponse {
    message?: string;
    token: string;
    role: AccountRole;

    user?: Employee;
    admin?: Admin;
}

export interface MeResponse {
    role: AccountRole;

    user?: Employee;
    admin?: Admin;
}

export interface ImageUploadResponse {
    message: string;
    url: string;
    publicId: string;
}

/**
 * Normal JSON API request
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const tokenResult = await Preferences.get({
        key: 'absher_token',
    });

    const token = tokenResult.value;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,

        headers: {
            'Content-Type': 'application/json',

            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),

            ...options.headers,
        },
    });

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        let message = `Request failed: ${response.status}`;

        if (
            typeof data === 'object' &&
            data !== null &&
            'message' in data &&
            typeof data.message === 'string'
        ) {
            message = data.message;
        }

        throw new Error(message);
    }

    return data as T;
}

/**
 * Multipart/form-data upload request
 *
 * IMPORTANT:
 * Do not set Content-Type manually here.
 * The browser must generate the multipart boundary automatically.
 */
export async function apiUpload<T>(
    endpoint: string,
    formData: FormData
): Promise<T> {
    const tokenResult = await Preferences.get({
        key: 'absher_token',
    });

    const token = tokenResult.value;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',

        headers: {
            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),
        },

        body: formData,
    });

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        let message = `Request failed: ${response.status}`;

        if (
            typeof data === 'object' &&
            data !== null &&
            'message' in data &&
            typeof data.message === 'string'
        ) {
            message = data.message;
        }

        throw new Error(message);
    }

    return data as T;
}