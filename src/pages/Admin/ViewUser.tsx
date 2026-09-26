import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

    const [user, setUser] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

                const response = await apiFetch<UserResponse>(
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
            <div className="flex min-h-[100dvh] items-center justify-center bg-[#F5F8F6]">
                <div className="flex flex-col items-center">
                    <div className="relative h-11 w-11">
                        <div className="absolute inset-0 rounded-full border-[3px] border-black/5" />
                        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-brand-green" />
                    </div>

                    <p className="mt-4 text-sm font-bold text-black/45">
                        Loading employee...
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
            <div className="min-h-[100dvh] bg-[#F5F8F6] px-4 py-6 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black shadow-sm ring-1 ring-black/5 transition hover:bg-black/[0.02]"
                >
                    <ArrowLeftIcon />
                    Back to Users
                </button>

                <div className="mx-auto mt-16 max-w-lg rounded-3xl bg-white p-8 text-center shadow-[0_12px_40px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.03]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <AlertIcon />
                    </div>

                    <h1 className="mt-5 text-2xl font-black tracking-tight">
                        User not found
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-black/40">
                        {error || 'Unable to load this employee.'}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="mt-6 rounded-xl bg-brand-green px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] w-full bg-[#F5F8F6] text-black">

            {/* ================================================================= */}
            {/* HEADER */}
            {/* ================================================================= */}

            <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/95 backdrop-blur-xl">
                <div className="flex w-full items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8 xl:px-10">

                    <div className="flex min-w-0 items-center gap-3">

                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F6F4] text-black/70 transition hover:bg-[#E7F1EC] hover:text-black"
                            aria-label="Back to dashboard"
                        >
                            <ArrowLeftIcon />
                        </button>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="hidden text-[10px] font-black uppercase tracking-[0.18em] text-brand-green sm:block">
                                    Administration
                                </span>

                                <span className="hidden h-1 w-1 rounded-full bg-black/15 sm:block" />

                                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/30">
                                    Employee Profile
                                </span>
                            </div>

                            <h1 className="mt-0.5 truncate text-base font-black tracking-tight sm:text-lg">
                                {user.name || 'Unnamed Employee'}
                            </h1>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/admin/users/${id}/edit`)
                        }
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-green px-3.5 py-2.5 text-xs font-black text-white shadow-[0_5px_18px_rgba(25,118,83,0.18)] transition hover:brightness-95 active:scale-[0.98] sm:px-5 sm:py-3 sm:text-sm"
                    >
                        <EditIcon />
                        <span>Edit User</span>
                    </button>

                </div>
            </header>

            {/* ================================================================= */}
            {/* MAIN */}
            {/* ================================================================= */}

            <main className="w-full px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10">

                {/* ================================================================= */}
                {/* TOP EMPLOYEE + DOCUMENT HERO */}
                {/* ================================================================= */}

                <section className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_12px_45px_rgba(0,0,0,0.055)] ring-1 ring-black/[0.035]">

                    {/* Decorative top area */}

                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-[#DFF1E8] via-[#EEF7F3] to-white" />

                    <div className="relative">

                        {/* ========================================================= */}
                        {/* EMPLOYEE IDENTITY */}
                        {/* ========================================================= */}

                        <div className="border-b border-black/[0.055] px-5 pb-6 pt-7 sm:px-7 lg:px-9">

                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                                {/* Small Profile Image */}

                                <div className="relative shrink-0">

                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt={
                                                user.name ||
                                                'Employee'
                                            }
                                            className="h-20 w-20 rounded-2xl object-cover shadow-[0_8px_25px_rgba(0,0,0,0.12)] ring-4 ring-white sm:h-[88px] sm:w-[88px]"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#DDEFE7] text-3xl font-black text-brand-green ring-4 ring-white sm:h-[88px] sm:w-[88px]">
                                            {String(
                                                user.name || 'U'
                                            )
                                                .trim()
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <span
                                        className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-white ${
                                            user.active === false
                                                ? 'bg-red-500'
                                                : 'bg-emerald-500'
                                        }`}
                                    />

                                </div>

                                {/* Employee information */}

                                <div className="min-w-0 flex-1">

                                    <div className="flex flex-wrap items-center gap-2.5">

                                        <h2 className="text-2xl font-black tracking-tight sm:text-[28px]">
                                            {user.name ||
                                                'Unnamed User'}
                                        </h2>

                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                                                user.active === false
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'bg-emerald-50 text-emerald-700'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    user.active === false
                                                        ? 'bg-red-500'
                                                        : 'bg-emerald-500'
                                                }`}
                                            />

                                            {user.active === false
                                                ? 'Inactive'
                                                : 'Active'}
                                        </span>

                                    </div>

                                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">

                                        <div className="flex items-center gap-2 text-xs text-black/50">
                                            <IdIcon />

                                            <span className="font-mono font-bold">
                                                {String(
                                                    user.residentIdNumber ||
                                                        '—'
                                                )}
                                            </span>
                                        </div>

                                        {user.nationality && (
                                            <div className="flex items-center gap-2">
                                                <span className="hidden h-3 w-px bg-black/10 sm:block" />

                                                <span className="text-xs font-bold text-black/40">
                                                    {String(
                                                        user.nationality
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {user.occupation && (
                                            <div className="flex items-center gap-2">
                                                <span className="hidden h-3 w-px bg-black/10 sm:block" />

                                                <span className="text-xs font-bold text-black/40">
                                                    {String(
                                                        user.occupation
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ========================================================= */}
                        {/* DOCUMENTS — TOP OF PAGE */}
                        {/* ========================================================= */}

                        <div className="px-5 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-8">

                            <div className="mb-5 flex items-end justify-between gap-4">

                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-green">
                                        Identity Documents
                                    </p>

                                    <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
                                        Employee Documents
                                    </h2>
                                </div>

                                <div className="hidden rounded-full bg-[#F1F6F3] px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-black/35 sm:block">
                                    Digital Records
                                </div>

                            </div>

                            {/* ===================================================== */}
                            {/* DOCUMENT GRID */}
                            {/* ===================================================== */}

                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">

                                {/* ------------------------------------------------- */}
                                {/* PROFILE PHOTO */}
                                {/* ------------------------------------------------- */}

                                <div className="rounded-2xl border border-black/[0.055] bg-[#FAFBFA] p-4">

                                    <div className="mb-4 flex items-center justify-between gap-2">

                                        <div>
                                            <p className="text-xs font-black">
                                                Profile Photo
                                            </p>
                                        </div>

                                        {user.avatarUrl && (
                                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black uppercase tracking-wide text-emerald-700">
                                                Uploaded
                                            </span>
                                        )}

                                    </div>

                                    <div className="flex justify-center">

                                        {user.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                alt="Employee profile"
                                                className="h-30 w-30 rounded-2xl object-cover shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
                                            />
                                        ) : (
                                            <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-[#E2F0E9] text-5xl font-black text-brand-green">
                                                {String(
                                                    user.name || 'U'
                                                )
                                                    .trim()
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                    </div>

                                </div>

                                {/* ------------------------------------------------- */}
                                {/* IQAMA */}
                                {/* ------------------------------------------------- */}

                                <div className="rounded-2xl border border-black/[0.055] bg-white p-4 sm:p-5">

                                    <div className="mb-4 flex items-center justify-between gap-3">

                                        <div>
                                            <p className="text-xs font-black">
                                                Iqama / Resident ID
                                            </p>

                                            <p className="mt-0.5 text-[10px] font-medium text-black/30">
                                                Resident identity document
                                            </p>
                                        </div>

                                        {user.iqamaImage && (
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-black uppercase tracking-wide text-emerald-700">
                                                Uploaded
                                            </span>
                                        )}

                                    </div>

                                    {/* 
                                        IMPORTANT:
                                        No artificial background.
                                        No fixed width/height.
                                        The image keeps its own aspect ratio.
                                    */}

                                    {user.iqamaImage ? (
                                        <div className="flex w-full items-center justify-center overflow-hidden">

                                            <img
                                                src={user.iqamaImage}
                                                alt="Iqama / Resident ID"
                                                className="block h-auto w-auto max-h-[420px] max-w-full object-contain sm:max-h-[500px] lg:max-h-[300px] rounded-2xl"
                                            />

                                        </div>
                                    ) : (
                                        <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-black/10">
                                            <div className="text-center">

                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4F7F5] text-black/25">
                                                    <ImageIcon />
                                                </div>

                                                <p className="mt-3 text-xs font-bold text-black/35">
                                                    No Iqama image uploaded
                                                </p>

                                            </div>
                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================================================================= */}
                {/* CONTENT */}
                {/* ================================================================= */}

                <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">

                    {/* ============================================================= */}
                    {/* LEFT */}
                    {/* ============================================================= */}

                    <div className="min-w-0 space-y-5">

                        {/* BASIC INFORMATION */}

                        <InfoSection
                            eyebrow="Personal"
                            title="Basic Information"
                            icon={<UserIcon />}
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
                                        true,
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

                        {/* EMPLOYMENT */}

                        <InfoSection
                            eyebrow="Employment"
                            title="Work Information"
                            icon={<BriefcaseIcon />}
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
                                        true,
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
                                        true,
                                    ],
                                ]}
                            />
                        </InfoSection>

                        {/* PASSPORT */}

                        <InfoSection
                            eyebrow="Identity Document"
                            title="Passport Information"
                            icon={<PassportIcon />}
                        >
                            <InfoGrid
                                items={[
                                    [
                                        'Passport Number',
                                        user.passport?.passportNumber,
                                        true,
                                    ],
                                    [
                                        'Type',
                                        user.passport?.type,
                                    ],
                                    [
                                        'Issuing Date',
                                        user.passport?.issuingDate,
                                    ],
                                    [
                                        'Expiry Date',
                                        user.passport?.expiryDate,
                                    ],
                                    [
                                        'Issuing City',
                                        user.passport?.issuingCity,
                                    ],
                                    [
                                        'Status',
                                        user.passport?.status,
                                    ],
                                    [
                                        'Amount Deposit',
                                        user.passport?.amountDeposit,
                                    ],
                                ]}
                            />
                        </InfoSection>

                        {/* HAJJ */}

                        <InfoSection
                            eyebrow="Religious Information"
                            title="Hajj Information"
                            icon={<HajjIcon />}
                        >
                            <InfoGrid
                                items={[
                                    [
                                        'Hajj Status',
                                        user.hajjDetails?.status,
                                    ],
                                    [
                                        'Last Hajj Year',
                                        user.hajjDetails?.lastHajjYear,
                                    ],
                                ]}
                            />
                        </InfoSection>

                        {/* HEALTH INSURANCE */}

                        {user.healthInsurance && (
                            <InfoSection
                                eyebrow="Insurance"
                                title="Health Insurance"
                                icon={<ShieldIcon />}
                            >
                                <ObjectInfo
                                    value={user.healthInsurance}
                                />
                            </InfoSection>
                        )}

                    </div>

                    {/* ============================================================= */}
                    {/* RIGHT */}
                    {/* ============================================================= */}

                    <aside className="min-w-0 space-y-5">

                        {/* ACCOUNT STATUS */}

                        <section className="rounded-3xl bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.045)] ring-1 ring-black/[0.03] sm:p-6">

                            <SectionHeading
                                eyebrow="Account"
                                title="Account Status"
                                icon={<ShieldIcon />}
                            />

                            <div className="mt-5 space-y-2.5">

                                <StatusRow
                                    label="Account Status"
                                    value={
                                        user.active === false
                                            ? 'Inactive'
                                            : 'Active'
                                    }
                                    active={
                                        user.active !== false
                                    }
                                />

                                <StatusRow
                                    label="Resident ID"
                                    value={
                                        user.residentIdNumber
                                            ? 'Available'
                                            : 'Missing'
                                    }
                                    active={
                                        !!user.residentIdNumber
                                    }
                                />

                                <StatusRow
                                    label="Profile Photo"
                                    value={
                                        user.avatarUrl
                                            ? 'Uploaded'
                                            : 'Not uploaded'
                                    }
                                    active={
                                        !!user.avatarUrl
                                    }
                                />

                                <StatusRow
                                    label="Iqama Image"
                                    value={
                                        user.iqamaImage
                                            ? 'Uploaded'
                                            : 'Not uploaded'
                                    }
                                    active={
                                        !!user.iqamaImage
                                    }
                                />

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/admin/users/${id}/edit`
                                    )
                                }
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-3 text-sm font-black text-white shadow-[0_6px_18px_rgba(25,118,83,0.16)] transition hover:brightness-95 active:scale-[0.99]"
                            >
                                <EditIcon />
                                Edit Employee
                            </button>

                        </section>

                    </aside>

                </div>

            </main>
        </div>
    );
}

// ============================================================================
// SECTION
// ============================================================================

function InfoSection({
    eyebrow,
    title,
    icon,
    children,
}: {
    eyebrow: string;
    title: string;
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="rounded-3xl bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.045)] ring-1 ring-black/[0.03] sm:p-6 lg:p-7">

            <SectionHeading
                eyebrow={eyebrow}
                title={title}
                icon={icon}
            />

            <div className="mt-5">
                {children}
            </div>

        </section>
    );
}

// ============================================================================
// SECTION HEADING
// ============================================================================

function SectionHeading({
    eyebrow,
    title,
    icon,
}: {
    eyebrow: string;
    title: string;
    icon: ReactNode;
}) {
    return (
        <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF5F0] text-brand-green">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-[9px] font-black uppercase tracking-[0.17em] text-brand-green">
                    {eyebrow}
                </p>

                <h2 className="mt-0.5 text-lg font-black tracking-tight sm:text-xl">
                    {title}
                </h2>

            </div>

        </div>
    );
}

// ============================================================================
// INFO GRID
// ============================================================================

function InfoGrid({
    items,
}: {
    items: Array<
        [string, unknown] | [string, unknown, boolean]
    >;
}) {
    return (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">

            {items.map((item) => {
                const [label, value, mono] = item;

                return (
                    <div
                        key={label}
                        className="group rounded-2xl border border-black/[0.045] bg-[#F7F9F8] px-4 py-3.5 transition hover:border-brand-green/10 hover:bg-[#F4F8F6]"
                    >

                        <p className="text-[9px] font-black uppercase tracking-[0.08em] text-black/30">
                            {label}
                        </p>

                        <p
                            className={`mt-1.5 break-words text-[13px] font-bold text-black/75 ${
                                mono
                                    ? 'font-mono tracking-tight'
                                    : ''
                            }`}
                        >
                            {formatValue(value)}
                        </p>

                    </div>
                );
            })}

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

    if (!entries.length) {
        return (
            <div className="rounded-2xl bg-[#F7F9F8] p-5 text-sm font-semibold text-black/35">
                No insurance information available.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">

            {entries.map(([key, value]) => (
                <div
                    key={key}
                    className="rounded-2xl border border-black/[0.045] bg-[#F7F9F8] px-4 py-3.5"
                >

                    <p className="text-[9px] font-black uppercase tracking-[0.08em] text-black/30">
                        {formatLabel(key)}
                    </p>

                    <p className="mt-1.5 break-words text-[13px] font-bold text-black/75">
                        {formatValue(value)}
                    </p>

                </div>
            ))}

        </div>
    );
}

// ============================================================================
// STATUS ROW
// ============================================================================

function StatusRow({
    label,
    value,
    active,
}: {
    label: string;
    value: string;
    active: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F7F9F8] px-4 py-3.5">

            <span className="text-xs font-bold text-black/50">
                {label}
            </span>

            <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide ${
                    active
                        ? 'text-emerald-600'
                        : 'text-red-500'
                }`}
            >

                <span
                    className={`h-1.5 w-1.5 rounded-full ${
                        active
                            ? 'bg-emerald-500'
                            : 'bg-red-500'
                    }`}
                />

                {value}

            </span>

        </div>
    );
}

// ============================================================================
// VALUE FORMATTER
// ============================================================================

function formatValue(value: unknown): string {
    if (
        value === undefined ||
        value === null ||
        value === ''
    ) {
        return '—';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

// ============================================================================
// LABEL FORMATTER
// ============================================================================

function formatLabel(value: string): string {
    return value
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (character) =>
            character.toUpperCase()
        );
}

// ============================================================================
// ICONS
// ============================================================================

function ArrowLeftIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
    );
}

function BriefcaseIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                width="20"
                height="14"
                x="2"
                y="7"
                rx="2"
            />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <path d="M2 12h20" />
        </svg>
    );
}

function PassportIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                width="16"
                height="20"
                x="4"
                y="2"
                rx="2"
            />
            <circle cx="12" cy="11" r="3" />
            <path d="M8 17h8" />
            <path d="M9 7h6" />
        </svg>
    );
}

function HajjIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 20h16" />
            <path d="M6 20V9l6-5 6 5v11" />
            <path d="M9 20v-6h6v6" />
            <path d="M9 9h6" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function ImageIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                width="18"
                height="18"
                x="3"
                y="3"
                rx="2"
            />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
        </svg>
    );
}

function IdIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                width="20"
                height="16"
                x="2"
                y="4"
                rx="2"
            />
            <circle cx="8" cy="12" r="2" />
            <path d="M14 9h4" />
            <path d="M14 13h4" />
        </svg>
    );
}

function AlertIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10.3 3.9 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    );
}