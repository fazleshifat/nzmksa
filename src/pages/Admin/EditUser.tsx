import { useEffect, useState } from 'react';
import type {
    ChangeEvent,
    FormEvent,
    ReactNode,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

import { apiFetch, type Employee } from '../../api/api';

interface UserResponse {
    user: Employee;
}

interface UploadResponse {
    message: string;
    url: string;
    publicId: string;
    type: 'avatar' | 'iqama';
    userId: string;
}

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState<Employee | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [avatarFile, setAvatarFile] =
        useState<File | null>(null);

    const [iqamaFile, setIqamaFile] =
        useState<File | null>(null);

    const [avatarPreview, setAvatarPreview] =
        useState('');

    const [iqamaPreview, setIqamaPreview] =
        useState('');

    const [form, setForm] = useState({
        name: '',
        residentIdNumber: '',
        idVersion: '',
        nationality: '',
        birthCity: '',
        birthCountry: '',
        dateOfBirth: '',
        maritalStatus: '',
        sponsorshipTransfers: '',
        religion: '',
        occupation: '',
        employer: '',
        employerIdNumber: '',
        issuePlace: '',
        workPermit: '',
        residentIdIssueDate: '',
        residentIdExpiry: '',
        sponsorName: '',
        sponsorIdNumber: '',
        active: true,

        passportNumber: '',
        passportType: '',
        passportIssuingDate: '',
        passportExpiryDate: '',
        passportIssuingCity: '',
        passportStatus: '',
        passportAmountDeposit: '',

        hajjStatus: '',
        lastHajjYear: '',
    });

    // =========================================================================
    // LOAD USER
    // =========================================================================

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

                const loadedUser = response.user;

                setUser(loadedUser);

                setAvatarPreview(
                    loadedUser.avatarUrl || ''
                );

                setIqamaPreview(
                    loadedUser.iqamaImage || ''
                );

                setForm({
                    name: String(
                        loadedUser.name || ''
                    ),

                    residentIdNumber: String(
                        loadedUser.residentIdNumber || ''
                    ),

                    idVersion: String(
                        loadedUser.idVersion || ''
                    ),

                    nationality: String(
                        loadedUser.nationality || ''
                    ),

                    birthCity: String(
                        loadedUser.birthCity || ''
                    ),

                    birthCountry: String(
                        loadedUser.birthCountry || ''
                    ),

                    dateOfBirth: String(
                        loadedUser.dateOfBirth || ''
                    ),

                    maritalStatus: String(
                        loadedUser.maritalStatus || ''
                    ),

                    sponsorshipTransfers:
                        loadedUser.sponsorshipTransfers != null
                            ? String(
                                  loadedUser.sponsorshipTransfers
                              )
                            : '',

                    religion: String(
                        loadedUser.religion || ''
                    ),

                    occupation: String(
                        loadedUser.occupation || ''
                    ),

                    employer: String(
                        loadedUser.employer || ''
                    ),

                    employerIdNumber: String(
                        loadedUser.employerIdNumber || ''
                    ),

                    issuePlace: String(
                        loadedUser.issuePlace || ''
                    ),

                    workPermit: String(
                        loadedUser.workPermit || ''
                    ),

                    residentIdIssueDate: String(
                        loadedUser.residentIdIssueDate || ''
                    ),

                    residentIdExpiry: String(
                        loadedUser.residentIdExpiry || ''
                    ),

                    sponsorName: String(
                        loadedUser.sponsorName || ''
                    ),

                    sponsorIdNumber: String(
                        loadedUser.sponsorIdNumber || ''
                    ),

                    active:
                        loadedUser.active !== false,

                    passportNumber: String(
                        loadedUser.passport
                            ?.passportNumber || ''
                    ),

                    passportType: String(
                        loadedUser.passport?.type || ''
                    ),

                    passportIssuingDate: String(
                        loadedUser.passport
                            ?.issuingDate || ''
                    ),

                    passportExpiryDate: String(
                        loadedUser.passport
                            ?.expiryDate || ''
                    ),

                    passportIssuingCity: String(
                        loadedUser.passport
                            ?.issuingCity || ''
                    ),

                    passportStatus: String(
                        loadedUser.passport?.status || ''
                    ),

                    passportAmountDeposit: String(
                        loadedUser.passport
                            ?.amountDeposit || ''
                    ),

                    hajjStatus: String(
                        loadedUser.hajjDetails
                            ?.status || ''
                    ),

                    lastHajjYear: String(
                        loadedUser.hajjDetails
                            ?.lastHajjYear || ''
                    ),
                });
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
    // FIELD CHANGE
    // =========================================================================

    const updateField = (
        field: keyof typeof form,
        value: string | boolean
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    // =========================================================================
    // IMAGE SELECTION
    // =========================================================================

    const handleAvatarChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                'Image must be smaller than 5MB.'
            );
            return;
        }

        setError('');
        setAvatarFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setAvatarPreview(previewUrl);
    };

    const handleIqamaChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                'Image must be smaller than 5MB.'
            );
            return;
        }

        setError('');
        setIqamaFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setIqamaPreview(previewUrl);
    };

    // =========================================================================
    // UPLOAD IMAGE
    // =========================================================================

    const uploadImage = async (
        file: File,
        type: 'avatar' | 'iqama'
    ): Promise<UploadResponse> => {
        if (!id) {
            throw new Error('User ID is missing');
        }

        const tokenResult =
            await Preferences.get({
                key: 'absher_token',
            });

        const token = tokenResult.value;

        const formData = new FormData();

        formData.append('image', file);
        formData.append('type', type);

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/uploads/admin/user/${id}/image`,
            {
                method: 'POST',

                headers: token
                    ? {
                          Authorization:
                              `Bearer ${token}`,
                      }
                    : undefined,

                body: formData,
            }
        );

        const data =
            await response
                .json()
                .catch(() => null);

        if (!response.ok) {
            throw new Error(
                data?.message ||
                    'Image upload failed'
            );
        }

        return data as UploadResponse;
    };

    // =========================================================================
    // SAVE
    // =========================================================================

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!id) {
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // -------------------------------------------------------------
            // UPDATE USER INFORMATION
            // -------------------------------------------------------------

            const payload = {
                name: form.name.trim(),

                residentIdNumber:
                    form.residentIdNumber.trim(),

                idVersion:
                    form.idVersion.trim(),

                nationality:
                    form.nationality.trim(),

                birthCity:
                    form.birthCity.trim(),

                birthCountry:
                    form.birthCountry.trim(),

                dateOfBirth:
                    form.dateOfBirth.trim(),

                maritalStatus:
                    form.maritalStatus.trim(),

                sponsorshipTransfers:
                    form.sponsorshipTransfers === ''
                        ? undefined
                        : Number(
                              form.sponsorshipTransfers
                          ),

                religion:
                    form.religion.trim(),

                occupation:
                    form.occupation.trim(),

                employer:
                    form.employer.trim(),

                employerIdNumber:
                    form.employerIdNumber.trim(),

                issuePlace:
                    form.issuePlace.trim(),

                workPermit:
                    form.workPermit.trim(),

                residentIdIssueDate:
                    form.residentIdIssueDate.trim(),

                residentIdExpiry:
                    form.residentIdExpiry.trim(),

                sponsorName:
                    form.sponsorName.trim(),

                sponsorIdNumber:
                    form.sponsorIdNumber.trim(),

                active: form.active,

                passport: {
                    amountDeposit:
                        form.passportAmountDeposit.trim(),

                    passportNumber:
                        form.passportNumber.trim(),

                    type:
                        form.passportType.trim(),

                    issuingDate:
                        form.passportIssuingDate.trim(),

                    expiryDate:
                        form.passportExpiryDate.trim(),

                    issuingCity:
                        form.passportIssuingCity.trim(),

                    status:
                        form.passportStatus.trim(),
                },

                hajjDetails: {
                    status:
                        form.hajjStatus.trim(),

                    lastHajjYear:
                        form.lastHajjYear.trim(),
                },
            };

            const response =
                await apiFetch<UserResponse>(
                    `/api/admin/users/${id}`,
                    {
                        method: 'PATCH',
                        body: JSON.stringify(payload),
                    }
                );

            setUser(response.user);

            // -------------------------------------------------------------
            // UPLOAD IMAGES
            // -------------------------------------------------------------

            setUploadingImage(true);

            let latestAvatarUrl =
                response.user.avatarUrl || '';

            let latestIqamaUrl =
                response.user.iqamaImage || '';

            if (avatarFile) {
                const avatarResult =
                    await uploadImage(
                        avatarFile,
                        'avatar'
                    );

                latestAvatarUrl =
                    avatarResult.url;

                setAvatarPreview(
                    avatarResult.url
                );

                setAvatarFile(null);
            }

            if (iqamaFile) {
                const iqamaResult =
                    await uploadImage(
                        iqamaFile,
                        'iqama'
                    );

                latestIqamaUrl =
                    iqamaResult.url;

                setIqamaPreview(
                    iqamaResult.url
                );

                setIqamaFile(null);
            }

            setUser((current) =>
                current
                    ? {
                          ...current,
                          avatarUrl:
                              latestAvatarUrl,
                          iqamaImage:
                              latestIqamaUrl,
                      }
                    : current
            );

            setSuccess(
                'User information updated successfully.'
            );

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } catch (error) {
            console.error(
                'Admin: Failed to update user:',
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to update user'
            );
        } finally {
            setSaving(false);
            setUploadingImage(false);
        }
    };

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

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="min-h-[100dvh] bg-[#F4F8F6] text-black">

            {/* HEADER */}

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
                                Edit Employee
                            </h1>
                        </div>
                    </div>

                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8">

                {/* USER HEADER */}

                <section className="mb-5 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

                    <div className="flex items-center gap-4">

                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt={user.name}
                                className="h-16 w-16 rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF5F0] text-xl font-black text-brand-green">
                                {String(
                                    user.name || 'U'
                                )
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                        )}

                        <div className="min-w-0">

                            <h2 className="truncate text-xl font-black">
                                {user.name ||
                                    'Unnamed User'}
                            </h2>

                            <p className="mt-1 font-mono text-xs text-black/40">
                                {
                                    user.residentIdNumber
                                }
                            </p>

                        </div>
                    </div>
                </section>

                {/* SUCCESS */}

                {success && (
                    <div className="mb-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
                        <p className="text-sm font-semibold text-green-700">
                            {success}
                        </p>
                    </div>
                )}

                {/* ERROR */}

                {error && (
                    <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
                        <p className="text-sm font-semibold text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* ===================================================== */}
                    {/* IMAGES */}
                    {/* ===================================================== */}

                    <FormSection
                        eyebrow="Documents"
                        title="Profile & Iqama Images"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            {/* AVATAR */}

                            <div>

                                <p className="mb-3 text-xs font-bold text-black/55">
                                    Employee Avatar
                                </p>

                                <div className="overflow-hidden rounded-3xl bg-[#F4F8F6]">

                                    {avatarPreview ? (
                                        <img
                                            src={
                                                avatarPreview
                                            }
                                            alt="Employee avatar"
                                            className="h-64 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-64 items-center justify-center text-sm font-bold text-black/30">
                                            No avatar image
                                        </div>
                                    )}

                                </div>

                                <label className="mt-3 flex h-12 cursor-pointer items-center justify-center rounded-2xl bg-brand-green text-sm font-bold text-white transition active:scale-[0.98]">

                                    Choose Avatar

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={
                                            handleAvatarChange
                                        }
                                    />

                                </label>

                                {avatarFile && (
                                    <p className="mt-2 truncate text-xs font-medium text-black/40">
                                        Selected:{' '}
                                        {
                                            avatarFile.name
                                        }
                                    </p>
                                )}

                            </div>

                            {/* IQAMA */}

                            <div>

                                <p className="mb-3 text-xs font-bold text-black/55">
                                    Iqama / Resident ID
                                </p>

                                <div className="overflow-hidden rounded-3xl bg-[#F4F8F6]">

                                    {iqamaPreview ? (
                                        <img
                                            src={
                                                iqamaPreview
                                            }
                                            alt="Iqama"
                                            className="h-64 w-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex h-64 items-center justify-center text-sm font-bold text-black/30">
                                            No Iqama image
                                        </div>
                                    )}

                                </div>

                                <label className="mt-3 flex h-12 cursor-pointer items-center justify-center rounded-2xl bg-brand-green text-sm font-bold text-white transition active:scale-[0.98]">

                                    Choose Iqama

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={
                                            handleIqamaChange
                                        }
                                    />

                                </label>

                                {iqamaFile && (
                                    <p className="mt-2 truncate text-xs font-medium text-black/40">
                                        Selected:{' '}
                                        {
                                            iqamaFile.name
                                        }
                                    </p>
                                )}

                            </div>

                        </div>
                    </FormSection>

                    {/* ===================================================== */}
                    {/* BASIC INFORMATION */}
                    {/* ===================================================== */}

                    <FormSection
                        eyebrow="Personal"
                        title="Basic Information"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <Field
                                label="Full Name"
                                value={form.name}
                                onChange={(value) =>
                                    updateField(
                                        'name',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Resident ID / Iqama"
                                value={
                                    form.residentIdNumber
                                }
                                onChange={(value) =>
                                    updateField(
                                        'residentIdNumber',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="ID Version"
                                value={
                                    form.idVersion
                                }
                                onChange={(value) =>
                                    updateField(
                                        'idVersion',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Nationality"
                                value={
                                    form.nationality
                                }
                                onChange={(value) =>
                                    updateField(
                                        'nationality',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Birth City"
                                value={
                                    form.birthCity
                                }
                                onChange={(value) =>
                                    updateField(
                                        'birthCity',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Birth Country"
                                value={
                                    form.birthCountry
                                }
                                onChange={(value) =>
                                    updateField(
                                        'birthCountry',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Date of Birth"
                                value={
                                    form.dateOfBirth
                                }
                                onChange={(value) =>
                                    updateField(
                                        'dateOfBirth',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Marital Status"
                                value={
                                    form.maritalStatus
                                }
                                onChange={(value) =>
                                    updateField(
                                        'maritalStatus',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Religion"
                                value={
                                    form.religion
                                }
                                onChange={(value) =>
                                    updateField(
                                        'religion',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Sponsorship Transfers"
                                value={
                                    form.sponsorshipTransfers
                                }
                                onChange={(value) =>
                                    updateField(
                                        'sponsorshipTransfers',
                                        value
                                    )
                                }
                                type="number"
                            />

                        </div>

                        <Toggle
                            label="Account Active"
                            checked={form.active}
                            onChange={(value) =>
                                updateField(
                                    'active',
                                    value
                                )
                            }
                        />
                    </FormSection>

                    {/* ===================================================== */}
                    {/* WORK */}
                    {/* ===================================================== */}

                    <FormSection
                        eyebrow="Employment"
                        title="Work Information"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <Field
                                label="Occupation"
                                value={
                                    form.occupation
                                }
                                onChange={(value) =>
                                    updateField(
                                        'occupation',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Employer"
                                value={
                                    form.employer
                                }
                                onChange={(value) =>
                                    updateField(
                                        'employer',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Employer ID Number"
                                value={
                                    form.employerIdNumber
                                }
                                onChange={(value) =>
                                    updateField(
                                        'employerIdNumber',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Work Permit"
                                value={
                                    form.workPermit
                                }
                                onChange={(value) =>
                                    updateField(
                                        'workPermit',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Issue Place"
                                value={
                                    form.issuePlace
                                }
                                onChange={(value) =>
                                    updateField(
                                        'issuePlace',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Resident ID Issue Date"
                                value={
                                    form.residentIdIssueDate
                                }
                                onChange={(value) =>
                                    updateField(
                                        'residentIdIssueDate',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Resident ID Expiry"
                                value={
                                    form.residentIdExpiry
                                }
                                onChange={(value) =>
                                    updateField(
                                        'residentIdExpiry',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Sponsor Name"
                                value={
                                    form.sponsorName
                                }
                                onChange={(value) =>
                                    updateField(
                                        'sponsorName',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Sponsor ID Number"
                                value={
                                    form.sponsorIdNumber
                                }
                                onChange={(value) =>
                                    updateField(
                                        'sponsorIdNumber',
                                        value
                                    )
                                }
                            />

                        </div>
                    </FormSection>

                    {/* ===================================================== */}
                    {/* PASSPORT */}
                    {/* ===================================================== */}

                    <FormSection
                        eyebrow="Passport"
                        title="Passport Information"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <Field
                                label="Passport Number"
                                value={
                                    form.passportNumber
                                }
                                onChange={(value) =>
                                    updateField(
                                        'passportNumber',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Type"
                                value={
                                    form.passportType
                                }
                                onChange={(value) =>
                                    updateField(
                                        'passportType',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Issuing Date"
                                value={
                                    form.passportIssuingDate
                                }
                                onChange={(value) =>
                                    updateField(
                                        'passportIssuingDate',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Expiry Date"
                                value={
                                    form.passportExpiryDate
                                }
                                onChange={(value) =>
                                    updateField(
                                        'passportExpiryDate',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Issuing City"
                                value={
                                    form.passportIssuingCity
                                }
                                onChange={(value) =>
                                    updateField(
                                        'passportIssuingCity',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Status"
                                value={
                                    form.passportStatus
                                }
                                onChange={(value) =>
                                    updateField(
                                        'passportStatus',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Amount Deposit"
                                value={
                                    form.passportAmountDeposit
                                }
                                onChange={(value) =>
                                    updateField(
                                        'passportAmountDeposit',
                                        value
                                    )
                                }
                            />

                        </div>
                    </FormSection>

                    {/* ===================================================== */}
                    {/* HAJJ */}
                    {/* ===================================================== */}

                    <FormSection
                        eyebrow="Hajj"
                        title="Hajj Information"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <Field
                                label="Hajj Status"
                                value={
                                    form.hajjStatus
                                }
                                onChange={(value) =>
                                    updateField(
                                        'hajjStatus',
                                        value
                                    )
                                }
                            />

                            <Field
                                label="Last Hajj Year"
                                value={
                                    form.lastHajjYear
                                }
                                onChange={(value) =>
                                    updateField(
                                        'lastHajjYear',
                                        value
                                    )
                                }
                            />

                        </div>
                    </FormSection>

                    {/* ===================================================== */}
                    {/* SAVE */}
                    {/* ===================================================== */}

                    <div className="sticky bottom-3 z-10">

                        <div className="rounded-3xl border border-black/5 bg-white/95 p-3 shadow-[0_10px_40px_rgba(0,0,0,0.10)] backdrop-blur">

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate('/admin')
                                    }
                                    className="h-12 flex-1 rounded-2xl bg-[#F4F8F6] text-sm font-bold text-black/60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        uploadingImage
                                    }
                                    className="h-12 flex-[1.5] rounded-2xl bg-brand-green text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-50"
                                >
                                    {saving ||
                                    uploadingImage
                                        ? 'Saving...'
                                        : 'Save Changes'}
                                </button>

                            </div>
                        </div>
                    </div>

                </form>
            </main>
        </div>
    );
}

// ============================================================================
// FORM SECTION
// ============================================================================

function FormSection({
    eyebrow,
    title,
    children,
}: {
    eyebrow: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-6">

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
// FIELD
// ============================================================================

function Field({
    label,
    value,
    onChange,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}) {
    return (
        <label className="block">

            <span className="mb-2 block text-xs font-bold text-black/55">
                {label}
            </span>

            <input
                type={type}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="h-12 w-full rounded-2xl bg-[#F4F8F6] px-4 text-sm font-medium outline-none ring-brand-green/30 transition placeholder:text-black/25 focus:ring-2"
            />

        </label>
    );
}

// ============================================================================
// TOGGLE
// ============================================================================

function Toggle({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <label className="mt-5 flex cursor-pointer items-center justify-between rounded-2xl bg-[#F4F8F6] p-4">

            <span className="text-sm font-bold">
                {label}
            </span>

            <button
                type="button"
                onClick={() =>
                    onChange(!checked)
                }
                className={`relative h-7 w-12 rounded-full transition ${
                    checked
                        ? 'bg-brand-green'
                        : 'bg-black/15'
                }`}
            >

                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                        checked
                            ? 'left-6'
                            : 'left-1'
                    }`}
                />

            </button>

        </label>
    );
}