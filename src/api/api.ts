const API_BASE_URL = 'http://localhost:4000';

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
    sponsorshipTransfers?: string;
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
    avatarUrl?: string;

    passport?: {
        amountDeposit?: string;
        passportNumber?: string;
        type?: string;
        issuingDate?: string;
        expiryDate?: string;
        issuingCity?: string;
        status?: string;
    };

    hajj?: {
        status?: string;
        lastHajjYear?: string;
    };
}

export interface LoginResponse {
    message?: string;
    employee?: Employee;
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
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