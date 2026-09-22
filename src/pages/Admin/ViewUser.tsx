import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';

import {
    apiFetch,
    type Employee,
} from '../../api/api';

interface UserResponse {
    user: Employee;
}

export default function ViewUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] =
        useState<Employee | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        if (!id) {
            setError('User ID is missing');
            setLoading(false);
            return;
        }

        const loadUser = async () => {
            try {
                setLoading(true);
                setError('');

                const response =
                    await apiFetch<UserResponse>(
                        `/api/admin/users/${id}`
                    );

                setUser(response.user);
            } catch (error) {
                console.error(
                    'Admin: Failed to load user:',
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load user'
                );
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id]);

    // =========================================================================
    // LOADING
    // =========================================================================

    if (loading) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[#F4F8F6]">
                <div className="text-center">

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-brand-green" />

                    <p className="mt-4 text-sm font-semibold text-black/50">
                        Loading user...
                    </p>

                </div>
            </div>
        );
    }

    // =========================================================================
    // USER NOT FOUND
    // =========================================================================

    if (!user) {
        return (
            <div className="min-h-[100dvh] bg-[#F4F8F6] p-5">

                <button
                    type="button"
                    onClick={() =>
                        navigate('/admin')
                    }
                    className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm"
                >
                    ← Back
                </button>

                <div className="mx-auto mt-10 max-w-xl rounded-3xl bg-white p-6 text-center">

                    <h1 className="text-xl font-black">
                        User not found
                    </h1>

                    <p className="mt-2 text-sm text-black/40">
                        {error ||
                            'Unable to load this user.'}
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-[#F4F8F6] text-black">

            {/* ============================================================= */}
            {/* HEADER */}
            {/* ============================================================= */}

            <header className="border-b border-black/5 bg-white">

                <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">

                    <div className="flex min-w-0 items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/admin')
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F8F6] text-lg font-bold"
                        >
                            ←
                        </button>

                        <div className="min-w-0">

                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-green">
                                Admin
                            </p>

                            <h1 className="truncate text-lg font-black">
                                View Employee
                            </h1>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/users/${id}/edit`
                            )
                        }
                        className="rounded-2xl bg-brand-green px-4 py-3 text-sm font-bold text-white shadow-sm"
                    >
                        Edit User
                    </button>

                </div>

            </header>

            <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8">

                {/* ========================================================= */}
                {/* PROFILE HEADER */}
                {/* ========================================================= */}

                <section className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-6">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={
                                    user.name ||
                                    'Employee'
                                }
                                className="h-28 w-28 rounded-3xl object-cover"
                            />
                        ) : (
                            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#EAF5F0] text-4xl font-black text-brand-green">
                                {String(
                                    user.name || 'U'
                                )
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                        )}

                        <div>

                            <h2 className="text-2xl font-black">
                                {user.name ||
                                    'Unnamed User'}
                            </h2>

                            <p className="mt-2 font-mono text-sm text-black/40">
                                {
                                    user.residentIdNumber
                                }
                            </p>

                            <div className="mt-3">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                                        user.active ===
                                        false
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-green-50 text-green-700'
                                    }`}
                                >
                                    {user.active ===
                                    false
                                        ? 'Inactive'
                                        : 'Active'}
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ========================================================= */}
                {/* IMAGES */}
                {/* ========================================================= */}

                <InfoSection
                    eyebrow="Documents"
                    title="Employee Images"
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <ImageCard
                            title="Avatar"
                            src={
                                user.avatarUrl
                            }
                            alt="Employee avatar"
                            objectClass="object-cover"
                        />

                        <ImageCard
                            title="Iqama / Resident ID"
                            src={
                                user.iqamaImage
                            }
                            alt="Iqama"
                            objectClass="object-contain"
                        />

                    </div>
                </InfoSection>

                {/* ========================================================= */}
                {/* BASIC INFORMATION */}
                {/* ========================================================= */}

                <InfoSection
                    eyebrow="Personal"
                    title="Basic Information"
                >
                    <InfoGrid
                        items={[
                            [
                                'Full Name',
                                user.name,
                            ],
                            [
                                'Resident ID / Iqama',
                                user.residentIdNumber,
                            ],
                            [
                                'ID Version',
                                user.idVersion,
                            ],
                            [
                                'Nationality',
                                user.nationality,
                            ],
                            [
                                'Birth City',
                                user.birthCity,
                            ],
                            [
                                'Birth Country',
                                user.birthCountry,
                            ],
                            [
                                'Date of Birth',
                                user.dateOfBirth,
                            ],
                            [
                                'Marital Status',
                                user.maritalStatus,
                            ],
                            [
                                'Religion',
                                user.religion,
                            ],
                            [
                                'Sponsorship Transfers',
                                user.sponsorshipTransfers,
                            ],
                        ]}
                    />
                </InfoSection>

                {/* ========================================================= */}
                {/* WORK */}
                {/* ========================================================= */}

                <InfoSection
                    eyebrow="Employment"
                    title="Work Information"
                >
                    <InfoGrid
                        items={[
                            [
                                'Occupation',
                                user.occupation,
                            ],
                            [
                                'Employer',
                                user.employer,
                            ],
                            [
                                'Employer ID Number',
                                user.employerIdNumber,
                            ],
                            [
                                'Work Permit',
                                user.workPermit,
                            ],
                            [
                                'Issue Place',
                                user.issuePlace,
                            ],
                            [
                                'Resident ID Issue Date',
                                user.residentIdIssueDate,
                            ],
                            [
                                'Resident ID Expiry',
                                user.residentIdExpiry,
                            ],
                            [
                                'Sponsor Name',
                                user.sponsorName,
                            ],
                            [
                                'Sponsor ID Number',
                                user.sponsorIdNumber,
                            ],
                        ]}
                    />
                </InfoSection>

                {/* ========================================================= */}
                {/* PASSPORT */}
                {/* ========================================================= */}

                <InfoSection
                    eyebrow="Passport"
                    title="Passport Information"
                >
                    <InfoGrid
                        items={[
                            [
                                'Passport Number',
                                user.passport
                                    ?.passportNumber,
                            ],
                            [
                                'Type',
                                user.passport?.type,
                            ],
                            [
                                'Issuing Date',
                                user.passport
                                    ?.issuingDate,
                            ],
                            [
                                'Expiry Date',
                                user.passport
                                    ?.expiryDate,
                            ],
                            [
                                'Issuing City',
                                user.passport
                                    ?.issuingCity,
                            ],
                            [
                                'Status',
                                user.passport
                                    ?.status,
                            ],
                            [
                                'Amount Deposit',
                                user.passport
                                    ?.amountDeposit,
                            ],
                        ]}
                    />
                </InfoSection>

                {/* ========================================================= */}
                {/* HAJJ */}
                {/* ========================================================= */}

                <InfoSection
                    eyebrow="Hajj"
                    title="Hajj Information"
                >
                    <InfoGrid
                        items={[
                            [
                                'Hajj Status',
                                user.hajjDetails
                                    ?.status,
                            ],
                            [
                                'Last Hajj Year',
                                user.hajjDetails
                                    ?.lastHajjYear,
                            ],
                        ]}
                    />
                </InfoSection>

                {/* ========================================================= */}
                {/* HEALTH INSURANCE */}
                {/* ========================================================= */}

                {user.healthInsurance && (
                    <InfoSection
                        eyebrow="Insurance"
                        title="Health Insurance"
                    >
                        <ObjectInfo
                            value={
                                user.healthInsurance
                            }
                        />
                    </InfoSection>
                )}

                {/* ========================================================= */}
                {/* QR */}
                {/* ========================================================= */}

                {user.qrData && (
                    <InfoSection
                        eyebrow="QR"
                        title="QR Information"
                    >
                        <InfoGrid
                            items={[
                                [
                                    'Name',
                                    user.qrData
                                        ?.name,
                                ],
                                [
                                    'Resident ID',
                                    user.qrData
                                        ?.residentIdNumber,
                                ],
                                [
                                    'Nationality',
                                    user.qrData
                                        ?.nationality,
                                ],
                                [
                                    'Date of Birth',
                                    user.qrData
                                        ?.dateOfBirth,
                                ],
                                [
                                    'Sponsor Name',
                                    user.qrData
                                        ?.sponsorName,
                                ],
                                [
                                    'Sponsor ID',
                                    user.qrData
                                        ?.sponsorIdNumber,
                                ],
                            ]}
                        />
                    </InfoSection>
                )}

            </main>
        </div>
    );
}

// ============================================================================
// INFO SECTION
// ============================================================================

function InfoSection({
    eyebrow,
    title,
    children,
}: {
    eyebrow: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="mt-5 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-6">

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-green">
                {eyebrow}
            </p>

            <h2 className="mt-1 text-xl font-black">
                {title}
            </h2>

            <div className="mt-5">
                {children}
            </div>

        </section>
    );
}

// ============================================================================
// INFO GRID
// ============================================================================

function InfoGrid({
    items,
}: {
    items: Array<[string, unknown]>;
}) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {items.map(([label, value]) => (
                <div
                    key={label}
                    className="rounded-2xl bg-[#F4F8F6] p-4"
                >

                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-black/35">
                        {label}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-black/80">
                        {formatValue(value)}
                    </p>

                </div>
            ))}

        </div>
    );
}

// ============================================================================
// IMAGE CARD
// ============================================================================

function ImageCard({
    title,
    src,
    alt,
    objectClass,
}: {
    title: string;
    src?: string;
    alt: string;
    objectClass: string;
}) {
    return (
        <div>

            <p className="mb-3 text-xs font-bold text-black/55">
                {title}
            </p>

            <div className="overflow-hidden rounded-3xl bg-[#F4F8F6]">

                {src ? (
                    <img
                        src={src}
                        alt={alt}
                        className={`h-80 w-full ${objectClass}`}
                    />
                ) : (
                    <div className="flex h-80 items-center justify-center text-sm font-bold text-black/30">
                        No image uploaded
                    </div>
                )}

            </div>

        </div>
    );
}

// ============================================================================
// OBJECT INFO
// ============================================================================

function ObjectInfo({
    value,
}: {
    value: unknown;
}) {
    if (
        !value ||
        typeof value !== 'object'
    ) {
        return null;
    }

    const entries = Object.entries(
        value as Record<string, unknown>
    );

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {entries.map(([key, value]) => (
                <div
                    key={key}
                    className="rounded-2xl bg-[#F4F8F6] p-4"
                >

                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-black/35">
                        {formatLabel(key)}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-black/80">
                        {formatValue(value)}
                    </p>

                </div>
            ))}

        </div>
    );
}

// ============================================================================
// VALUE FORMATTER
// ============================================================================

function formatValue(
    value: unknown
): string {
    if (
        value === undefined ||
        value === null ||
        value === ''
    ) {
        return '—';
    }

    if (
        typeof value === 'object'
    ) {
        return JSON.stringify(value);
    }

    return String(value);
}

// ============================================================================
// LABEL FORMATTER
// ============================================================================

function formatLabel(
    value: string
): string {
    return value
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (character) =>
            character.toUpperCase()
        );
}