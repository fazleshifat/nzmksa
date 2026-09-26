import { useEffect, useState } from 'react';
import type {
    ChangeEvent,
    FormEvent,
    ReactNode,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    apiFetch,
    apiUpload,
    type Employee,
} from '../../api/api';

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

    const [showSuccessModal, setShowSuccessModal] =
        useState(false);

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
    // CHECK WHETHER ANYTHING CHANGED
    // =========================================================================

    const hasFormChanges = () => {
        if (!user) {
            return false;
        }

        return (
            form.name.trim() !==
                String(user.name || '') ||
            form.residentIdNumber.trim() !==
                String(user.residentIdNumber || '') ||
            form.idVersion.trim() !==
                String(user.idVersion || '') ||
            form.nationality.trim() !==
                String(user.nationality || '') ||
            form.birthCity.trim() !==
                String(user.birthCity || '') ||
            form.birthCountry.trim() !==
                String(user.birthCountry || '') ||
            form.dateOfBirth.trim() !==
                String(user.dateOfBirth || '') ||
            form.maritalStatus.trim() !==
                String(user.maritalStatus || '') ||
            form.religion.trim() !==
                String(user.religion || '') ||
            form.sponsorshipTransfers !==
                (user.sponsorshipTransfers != null
                    ? String(
                          user.sponsorshipTransfers
                      )
                    : '') ||
            form.occupation.trim() !==
                String(user.occupation || '') ||
            form.employer.trim() !==
                String(user.employer || '') ||
            form.employerIdNumber.trim() !==
                String(user.employerIdNumber || '') ||
            form.issuePlace.trim() !==
                String(user.issuePlace || '') ||
            form.workPermit.trim() !==
                String(user.workPermit || '') ||
            form.residentIdIssueDate.trim() !==
                String(
                    user.residentIdIssueDate || ''
                ) ||
            form.residentIdExpiry.trim() !==
                String(
                    user.residentIdExpiry || ''
                ) ||
            form.sponsorName.trim() !==
                String(user.sponsorName || '') ||
            form.sponsorIdNumber.trim() !==
                String(user.sponsorIdNumber || '') ||
            form.active !==
                (user.active !== false) ||
            form.passportNumber.trim() !==
                String(
                    user.passport?.passportNumber ||
                        ''
                ) ||
            form.passportType.trim() !==
                String(
                    user.passport?.type || ''
                ) ||
            form.passportIssuingDate.trim() !==
                String(
                    user.passport?.issuingDate ||
                        ''
                ) ||
            form.passportExpiryDate.trim() !==
                String(
                    user.passport?.expiryDate ||
                        ''
                ) ||
            form.passportIssuingCity.trim() !==
                String(
                    user.passport?.issuingCity ||
                        ''
                ) ||
            form.passportStatus.trim() !==
                String(
                    user.passport?.status || ''
                ) ||
            form.passportAmountDeposit.trim() !==
                String(
                    user.passport
                        ?.amountDeposit || ''
                ) ||
            form.hajjStatus.trim() !==
                String(
                    user.hajjDetails?.status ||
                        ''
                ) ||
            form.lastHajjYear.trim() !==
                String(
                    user.hajjDetails?.lastHajjYear ||
                        ''
                ) ||
            avatarFile !== null ||
            iqamaFile !== null
        );
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
            setError(
                'Please select a valid image file.'
            );
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                'Image must be smaller than 5MB.'
            );
            return;
        }

        setError('');
        setSuccess('');
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
            setError(
                'Please select a valid image file.'
            );
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                'Image must be smaller than 5MB.'
            );
            return;
        }

        setError('');
        setSuccess('');
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

        const formData = new FormData();

        formData.append('image', file);
        formData.append('type', type);

        return await apiUpload<UploadResponse>(
            `/api/uploads/admin/user/${id}/image`,
            formData
        );
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

        // -------------------------------------------------------------
        // NOTHING CHANGED
        // -------------------------------------------------------------

        if (!hasFormChanges()) {
            setSuccess('');
            setError('');
            setShowSuccessModal(false);

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });

            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

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

            // -------------------------------------------------------------
            // UPDATE USER INFORMATION
            // -------------------------------------------------------------

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

            // -------------------------------------------------------------
            // SUCCESS MODAL
            // -------------------------------------------------------------

            setSuccess(
                'Employee information updated successfully.'
            );

            setShowSuccessModal(true);
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

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } finally {
            setSaving(false);
            setUploadingImage(false);
        }
    };

    // =========================================================================
    // SUCCESS MODAL → PREVIOUS PAGE
    // =========================================================================

    useEffect(() => {
        if (!showSuccessModal) {
            return;
        }

        const timer = window.setTimeout(() => {
            navigate(-1);
        }, 1500);

        return () => {
            window.clearTimeout(timer);
        };
    }, [showSuccessModal, navigate]);

    // =========================================================================
    // LOADING
    // =========================================================================

    if (loading) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[#F4F8F6]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-black/10 border-t-brand-green" />

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
            <div className="min-h-[100dvh] bg-[#F4F8F6] p-5">
                <button
                    type="button"
                    onClick={() =>
                        navigate('/admin')
                    }
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-bold shadow-sm transition hover:shadow-md"
                >
                    ← Back to Dashboard
                </button>

                <div className="mx-auto mt-10 max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-[0_15px_50px_rgba(0,0,0,0.06)]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
                        !
                    </div>

                    <h1 className="mt-5 text-2xl font-black">
                        User not found
                    </h1>

                    <p className="mt-2 text-sm font-medium text-black/40">
                        {error ||
                            'Unable to load this employee.'}
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
            {/* ============================================================= */}
            {/* SUCCESS MODAL */}
            {/* ============================================================= */}

            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm">
                    <div className="w-full max-w-md animate-[scaleIn_0.2s_ease-out] rounded-[2rem] bg-white p-7 text-center shadow-[0_25px_80px_rgba(0,0,0,0.20)] sm:p-9">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF5F0]">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-2xl font-black text-white shadow-[0_10px_25px_rgba(25,118,83,0.25)]">
                                ✓
                            </div>
                        </div>

                        <h2 className="mt-6 text-2xl font-black tracking-tight sm:text-3xl">
                            User Updated Successfully
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-black/40">
                            Employee information has been
                            updated successfully.
                        </p>

                        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#EAF5F0]">
                            <div className="h-full w-full origin-left animate-[progress_1.5s_linear] rounded-full bg-brand-green" />
                        </div>

                        <p className="mt-3 text-[11px] font-bold text-black/30">
                            Returning to previous page...
                        </p>
                    </div>
                </div>
            )}

            {/* ============================================================= */}
            {/* HEADER */}
            {/* ============================================================= */}

            <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/95 backdrop-blur-xl">
                <div className="flex w-full items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                navigate('/admin')
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F4F8F6] text-lg font-black transition hover:bg-[#EAF5F0] active:scale-95"
                        >
                            ←
                        </button>

                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green">
                                Admin Panel
                            </p>

                            <h1 className="truncate text-lg font-black sm:text-xl">
                                Edit Employee
                            </h1>
                        </div>
                    </div>

                    <div className="hidden items-center gap-2 rounded-full bg-[#EAF5F0] px-4 py-2 sm:flex">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                form.active
                                    ? 'bg-brand-green'
                                    : 'bg-black/20'
                            }`}
                        />

                        <span className="text-xs font-bold text-black/55">
                            {form.active
                                ? 'Active Account'
                                : 'Inactive Account'}
                        </span>
                    </div>
                </div>
            </header>

            <main className="w-full px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10">
                {/* ========================================================= */}
                {/* PAGE INTRO */}
                {/* ========================================================= */}

                <div className="mb-6">
                    <p className="text-xs font-bold text-black/35">
                        Employee Management
                    </p>

                    <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                        Update employee profile
                    </h2>

                    <p className="mt-1.5 max-w-2xl text-sm font-medium leading-6 text-black/40">
                        Update identity, employment, passport,
                        Hajj information and employee documents.
                    </p>
                </div>

                {/* ========================================================= */}
                {/* ALERTS */}
                {/* ========================================================= */}

                {success && !showSuccessModal && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-black text-white">
                            ✓
                        </div>

                        <div>
                            <p className="text-sm font-black text-green-800">
                                Changes saved
                            </p>

                            <p className="mt-0.5 text-xs font-medium text-green-700/70">
                                {success}
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-black text-white">
                            !
                        </div>

                        <div>
                            <p className="text-sm font-black text-red-700">
                                Update failed
                            </p>

                            <p className="mt-0.5 text-xs font-medium text-red-600/75">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* ===================================================== */}
                    {/* TOP IDENTITY / DOCUMENTS */}
                    {/* ===================================================== */}

                    <section className="overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white shadow-[0_12px_45px_rgba(0,0,0,0.045)]">
                        <div className="border-b border-black/[0.05] px-5 py-5 sm:px-7">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                                        Identity Documents
                                    </p>

                                    <h2 className="mt-1 text-xl font-black sm:text-2xl">
                                        Profile & Iqama
                                    </h2>
                                </div>

                                <div className="hidden rounded-full bg-[#F4F8F6] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black/40 sm:block">
                                    Max 5MB / image
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[250px_minmax(0,1fr)]">
                            {/* PROFILE */}

                            <div className="rounded-[1.5rem] border border-black/[0.05] bg-[#F8FBF9] p-5">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative">
                                        {avatarPreview ? (
                                            <img
                                                src={
                                                    avatarPreview
                                                }
                                                alt={
                                                    user.name
                                                }
                                                className="h-28 w-28 rounded-[1.75rem] object-cover shadow-[0_10px_30px_rgba(0,0,0,0.10)] ring-4 ring-white"
                                            />
                                        ) : (
                                            <div className="flex h-28 w-28 items-center justify-center rounded-[1.75rem] bg-[#EAF5F0] text-3xl font-black text-brand-green ring-4 ring-white">
                                                {String(
                                                    user.name ||
                                                        'U'
                                                )
                                                    .trim()
                                                    .charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-brand-green text-xs font-black text-white shadow-lg">
                                            ✎
                                        </div>
                                    </div>

                                    <h3 className="mt-5 max-w-full truncate text-base font-black">
                                        {user.name ||
                                            'Unnamed User'}
                                    </h3>

                                    <p className="mt-1 max-w-full truncate font-mono text-[11px] font-bold text-black/35">
                                        {
                                            user.residentIdNumber
                                        }
                                    </p>

                                    <label className="mt-5 flex h-11 w-full cursor-pointer items-center justify-center rounded-2xl bg-brand-green px-4 text-xs font-black text-white shadow-sm transition hover:brightness-95 active:scale-[0.98]">
                                        Change Profile Photo

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
                                        <div className="mt-3 w-full rounded-xl bg-white px-3 py-2 text-left">
                                            <p className="truncate text-[10px] font-bold text-black/40">
                                                New image
                                            </p>

                                            <p className="mt-0.5 truncate text-xs font-bold text-brand-green">
                                                {
                                                    avatarFile.name
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* IQAMA */}

                            <div className="min-w-0">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-black text-black/60">
                                            Iqama / Resident ID
                                        </p>

                                        <p className="mt-0.5 text-[11px] font-medium text-black/30">
                                            Original aspect ratio is preserved
                                        </p>
                                    </div>

                                    {iqamaFile && (
                                        <span className="shrink-0 rounded-full bg-[#EAF5F0] px-3 py-1.5 text-[10px] font-black text-brand-green">
                                            New image selected
                                        </span>
                                    )}
                                </div>

                                <div className="flex min-h-[220px] w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-black/10 bg-[#FAFCFB] p-3 sm:p-5">
                                    {iqamaPreview ? (
                                        <img
                                            src={
                                                iqamaPreview
                                            }
                                            alt="Iqama / Resident ID"
                                            className="block h-auto w-auto max-h-[320px] max-w-full rounded-2xl object-contain"
                                        />
                                    ) : (
                                        <div className="py-16 text-center">
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF5F0] text-xl text-brand-green">
                                                ▣
                                            </div>

                                            <p className="mt-4 text-sm font-black text-black/45">
                                                No Iqama image
                                            </p>

                                            <p className="mt-1 text-xs font-medium text-black/25">
                                                Upload the resident ID
                                                document below
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <label className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-brand-green/10 bg-brand-green text-sm font-black text-white shadow-sm transition hover:brightness-95 active:scale-[0.99]">
                                    {iqamaPreview
                                        ? 'Replace Iqama Image'
                                        : 'Upload Iqama Image'}

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
                                    <p className="mt-2 truncate text-xs font-bold text-black/35">
                                        Selected:{' '}
                                        {
                                            iqamaFile.name
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ===================================================== */}
                    {/* BASIC INFORMATION */}
                    {/* ===================================================== */}

                    <FormSection
                        eyebrow="Personal"
                        title="Basic Information"
                        description="Core identity and personal information."
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                            description="Allow this employee to access the application."
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
                    {/* EMPLOYMENT */}
                    {/* ===================================================== */}

                    <FormSection
                        eyebrow="Employment"
                        title="Work Information"
                        description="Employer, work permit and sponsorship details."
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                        description="Passport identification and validity information."
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                        description="Hajj status and previous pilgrimage information."
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                    {/* SAVE BAR */}
                    {/* ===================================================== */}

                    <div className="sticky bottom-3 z-20 pt-1">
                        <div className="rounded-[1.5rem] border border-black/[0.06] bg-white/95 p-2.5 shadow-[0_15px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-3">
                            <div className="flex items-center gap-2.5 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            '/admin'
                                        )
                                    }
                                    disabled={
                                        saving ||
                                        uploadingImage
                                    }
                                    className="h-12 flex-1 rounded-2xl bg-[#F4F8F6] px-4 text-sm font-black text-black/55 transition hover:bg-[#EAF5F0] active:scale-[0.98] disabled:opacity-50 sm:flex-none sm:px-8"
                                >
                                    Cancel
                                </button>

                                {!hasFormChanges() && (
                                    <div className="hidden items-center gap-2 rounded-2xl bg-[#F4F8F6] px-4 py-3 sm:flex">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.06] text-xs font-black text-black/35">
                                            i
                                        </span>

                                        <span className="text-xs font-bold text-black/35">
                                            No changes to save
                                        </span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        uploadingImage ||
                                        !hasFormChanges()
                                    }
                                    className="flex h-12 flex-[1.5] items-center justify-center gap-2 rounded-2xl bg-brand-green px-5 text-sm font-black text-white shadow-[0_8px_22px_rgba(25,118,83,0.22)] transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:min-w-[190px]"
                                >
                                    {saving ||
                                    uploadingImage ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                            <span>
                                                {uploadingImage
                                                    ? 'Uploading...'
                                                    : 'Saving...'}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span>
                                                Save Changes
                                            </span>

                                            <span className="text-base">
                                                ✓
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            {/* ============================================================= */}
            {/* MODAL ANIMATIONS */}
            {/* ============================================================= */}

            <style>{`
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.94) translateY(8px);
                    }

                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes progress {
                    from {
                        transform: scaleX(0);
                    }

                    to {
                        transform: scaleX(1);
                    }
                }
            `}</style>
        </div>
    );
}

// ============================================================================
// FORM SECTION
// ============================================================================

function FormSection({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow: string;
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-[2rem] border border-black/[0.05] bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.035)] sm:p-7">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                    {eyebrow}
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1.5 text-xs font-medium leading-5 text-black/35">
                        {description}
                    </p>
                )}
            </div>

            <div className="mt-6">
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
        <label className="group block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-wide text-black/45 transition group-focus-within:text-brand-green">
                {label}
            </span>

            <input
                type={type}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="h-[52px] w-full rounded-2xl border border-transparent bg-[#F4F8F6] px-4 text-sm font-semibold text-black outline-none transition placeholder:text-black/20 focus:border-brand-green/20 focus:bg-white focus:ring-4 focus:ring-brand-green/5"
            />
        </label>
    );
}

// ============================================================================
// TOGGLE
// ============================================================================

function Toggle({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-black/[0.04] bg-[#F7FAF8] p-4 sm:p-5">
            <div>
                <p className="text-sm font-black">
                    {label}
                </p>

                {description && (
                    <p className="mt-1 text-xs font-medium text-black/35">
                        {description}
                    </p>
                )}
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() =>
                    onChange(!checked)
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
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
        </div>
    );
}