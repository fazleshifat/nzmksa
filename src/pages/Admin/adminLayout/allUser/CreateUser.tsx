import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";

import {
    ArrowLeft,
    Eye,
    EyeOff,
    UserPlus,
    User,
    BriefcaseBusiness,
    CreditCard,
    ShieldCheck,
    HeartPulse,
    LockKeyhole,
    RotateCcw,
    CheckCircle2,
    Camera,
    IdCard,
    Upload,
    X,
    AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    apiFetch,
    apiUpload,
    type Employee,
} from "../../../../api/api";

import AdminPageLayout from "../../AdminPageLayout";

// ============================================================================
// FORM DATA
// ============================================================================

interface FormData {
    name: string;
    residentIdNumber: string;
    idVersion: string;
    nationality: string;
    birthCity: string;
    birthCountry: string;
    dateOfBirth: string;
    maritalStatus: string;
    sponsorshipTransfers: string;
    religion: string;

    occupation: string;
    employer: string;
    employerIdNumber: string;
    issuePlace: string;
    workPermit: string;
    residentIdIssueDate: string;
    residentIdExpiry: string;
    sponsorName: string;
    sponsorIdNumber: string;

    passportNumber: string;
    passportType: string;
    passportIssuingDate: string;
    passportExpiryDate: string;
    passportIssuingCity: string;
    passportStatus: string;
    amountDeposit: string;

    hajjStatus: string;
    lastHajjYear: string;

    insuranceIssuingDate: string;
    insuranceExpiryDate: string;

    password: string;
}

const initialForm: FormData = {
    name: "",
    residentIdNumber: "",
    idVersion: "",
    nationality: "",
    birthCity: "",
    birthCountry: "",
    dateOfBirth: "",
    maritalStatus: "",
    sponsorshipTransfers: "0",
    religion: "",

    occupation: "",
    employer: "",
    employerIdNumber: "",
    issuePlace: "",
    workPermit: "",
    residentIdIssueDate: "",
    residentIdExpiry: "",
    sponsorName: "",
    sponsorIdNumber: "",

    passportNumber: "",
    passportType: "Normal",
    passportIssuingDate: "",
    passportExpiryDate: "",
    passportIssuingCity: "",
    passportStatus: "",
    amountDeposit: "SAR 0.00",

    hajjStatus: "eligible",
    lastHajjYear: "",

    insuranceIssuingDate: "",
    insuranceExpiryDate: "",

    password: "",
};

// ============================================================================
// DATE HELPERS
// ============================================================================
//
// DATABASE / API STANDARD:
//
//     DD MMM YYYY
//
// Example:
//
//     10 Oct 2026
//
// IMPORTANT:
//
// HTML <input type="date"> requires:
//
//     YYYY-MM-DD
//
// Therefore the form internally uses YYYY-MM-DD,
// but before sending data to the backend we convert it to:
//
//     DD MMM YYYY
//
// ============================================================================

function parseDateParts(value: unknown): {
    year: number;
    month: number;
    day: number;
} | null {
    if (!value) {
        return null;
    }

    const stringValue = String(value).trim();

    if (!stringValue) {
        return null;
    }

    // ------------------------------------------------------------------------
    // YYYY-MM-DD
    // Example: 2026-10-10
    // ------------------------------------------------------------------------

    let match = stringValue.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (match) {
        return {
            year: Number(match[1]),
            month: Number(match[2]),
            day: Number(match[3]),
        };
    }

    // ------------------------------------------------------------------------
    // ISO DATE / DATETIME
    // Example: 2026-10-10T00:00:00.000Z
    // ------------------------------------------------------------------------

    match = stringValue.match(
        /^(\d{4})-(\d{2})-(\d{2})T/
    );

    if (match) {
        return {
            year: Number(match[1]),
            month: Number(match[2]),
            day: Number(match[3]),
        };
    }

    // ------------------------------------------------------------------------
    // DD-MM-YYYY
    // Example: 10-10-2026
    // ------------------------------------------------------------------------

    match = stringValue.match(
        /^(\d{2})-(\d{2})-(\d{4})$/
    );

    if (match) {
        return {
            year: Number(match[3]),
            month: Number(match[2]),
            day: Number(match[1]),
        };
    }

    // ------------------------------------------------------------------------
    // DD/MM/YYYY
    // Example: 10/10/2026
    // ------------------------------------------------------------------------

    match = stringValue.match(
        /^(\d{2})\/(\d{2})\/(\d{4})$/
    );

    if (match) {
        return {
            year: Number(match[3]),
            month: Number(match[2]),
            day: Number(match[1]),
        };
    }

    // ------------------------------------------------------------------------
    // YYYY/MM/DD
    // Example: 2026/10/10
    // ------------------------------------------------------------------------

    match = stringValue.match(
        /^(\d{4})\/(\d{2})\/(\d{2})$/
    );

    if (match) {
        return {
            year: Number(match[1]),
            month: Number(match[2]),
            day: Number(match[3]),
        };
    }

    // ------------------------------------------------------------------------
    // DD MMM YYYY
    // Example: 10 Oct 2026
    // ------------------------------------------------------------------------

    match = stringValue.match(
        /^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/
    );

    if (match) {
        const monthMap: Record<string, number> = {
            jan: 1,
            january: 1,

            feb: 2,
            february: 2,

            mar: 3,
            march: 3,

            apr: 4,
            april: 4,

            may: 5,

            jun: 6,
            june: 6,

            jul: 7,
            july: 7,

            aug: 8,
            august: 8,

            sep: 9,
            sept: 9,
            september: 9,

            oct: 10,
            october: 10,

            nov: 11,
            november: 11,

            dec: 12,
            december: 12,
        };

        const month =
            monthMap[match[2].toLowerCase()];

        if (month) {
            return {
                year: Number(match[3]),
                month,
                day: Number(match[1]),
            };
        }
    }

    // ------------------------------------------------------------------------
    // Final fallback
    // ------------------------------------------------------------------------

    const date = new Date(stringValue);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
    };
}

// ============================================================================
// FORMAT DATE FOR STORAGE
// ============================================================================
//
// Input:
//     2026-10-10
//
// Output:
//     10 Oct 2026
//
// ============================================================================

function formatDateForStorage(
    value: unknown
): string {
    const parts = parseDateParts(value);

    if (!parts) {
        return "";
    }

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    return `${String(parts.day).padStart(
        2,
        "0"
    )} ${monthNames[parts.month - 1]} ${
        parts.year
    }`;
}

// ============================================================================
// SECTION
// ============================================================================

interface SectionProps {
    icon: ReactNode;
    title: string;
    description: string;
    children: ReactNode;
}

function Section({
    icon,
    title,
    description,
    children,
}: SectionProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    {icon}
                </div>

                <div>
                    <h2 className="text-[17px] font-semibold text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                        {description}
                    </p>
                </div>
            </div>

            <div className="p-6">
                {children}
            </div>
        </section>
    );
}

// ============================================================================
// FIELD
// ============================================================================

interface FieldProps {
    label: string;
    required?: boolean;
    value: string;
    onChange: (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => void;
    name: string;
    placeholder?: string;
    type?: string;
    className?: string;
}

function Field({
    label,
    required,
    value,
    onChange,
    name,
    placeholder,
    type = "text",
    className = "",
}: FieldProps) {
    return (
        <div className={className}>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
        </div>
    );
}

// ============================================================================
// SELECT FIELD
// ============================================================================

interface SelectFieldProps {
    label: string;
    required?: boolean;
    value: string;
    onChange: (
        e: ChangeEvent<HTMLSelectElement>
    ) => void;
    name: string;
    children: ReactNode;
}

function SelectField({
    label,
    required,
    value,
    onChange,
    name,
    children,
}: SelectFieldProps) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            >
                {children}
            </select>
        </div>
    );
}

// ============================================================================
// IMAGE UPLOAD
// ============================================================================

interface ImageUploadProps {
    title: string;
    description: string;
    icon: ReactNode;
    file: File | null;
    preview: string;
    onChange: (
        e: ChangeEvent<HTMLInputElement>
    ) => void;
    onRemove: () => void;
    accept?: string;
    compact?: boolean;
}

function ImageUpload({
    title,
    description,
    icon,
    file,
    preview,
    onChange,
    onRemove,
    accept = "image/*",
    compact = false,
}: ImageUploadProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200">
                        {icon}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                            {title}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                            {description}
                        </p>
                    </div>
                </div>

                {file && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img
                        src={preview}
                        alt={title}
                        className={
                            compact
                                ? "h-40 w-full object-contain"
                                : "h-52 w-full object-contain"
                        }
                    />

                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/55 px-3 py-2 text-white backdrop-blur-sm">
                        <span className="max-w-[80%] truncate text-xs">
                            {file?.name}
                        </span>

                        <label className="cursor-pointer text-xs font-medium hover:underline">
                            Change

                            <input
                                type="file"
                                accept={accept}
                                onChange={onChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            ) : (
                <label
                    className={
                        compact
                            ? "group flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white px-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
                            : "group flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white px-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
                    }
                >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition group-hover:scale-105">
                        <Upload size={20} />
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                        Upload {title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        PNG, JPG or JPEG
                    </p>

                    <input
                        type="file"
                        accept={accept}
                        onChange={onChange}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
}

// ============================================================================
// CREATE USER
// ============================================================================

export default function CreateUser() {
    const navigate = useNavigate();

    const [form, setForm] =
        useState<FormData>(initialForm);

    const [avatarFile, setAvatarFile] =
        useState<File | null>(null);

    const [iqamaFile, setIqamaFile] =
        useState<File | null>(null);

    const [avatarPreview, setAvatarPreview] =
        useState("");

    const [iqamaPreview, setIqamaPreview] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showSuccessModal, setShowSuccessModal] =
        useState(false);

    const [showErrorModal, setShowErrorModal] =
        useState(false);

    const [createdUserId, setCreatedUserId] =
        useState("");

    // =========================================================================
    // SUCCESS REDIRECT
    // =========================================================================

    useEffect(() => {
        if (
            !showSuccessModal ||
            !createdUserId
        ) {
            return;
        }

        const timer = setTimeout(() => {
            setShowSuccessModal(false);

            navigate(
                `/admin/users/${createdUserId}`
            );
        }, 1800);

        return () => clearTimeout(timer);
    }, [
        showSuccessModal,
        createdUserId,
        navigate,
    ]);

    // =========================================================================
    // FORM CHANGE
    // =========================================================================

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // =========================================================================
    // AVATAR CHANGE
    // =========================================================================

    const handleAvatarChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image file."
            );
            setShowErrorModal(true);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Employee Profile image must be smaller than 5MB."
            );
            setShowErrorModal(true);
            return;
        }

        setAvatarFile(file);

        setAvatarPreview(
            URL.createObjectURL(file)
        );

        setError("");
        setSuccess("");
    };

    // =========================================================================
    // IQAMA CHANGE
    // =========================================================================

    const handleIqamaChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image file."
            );
            setShowErrorModal(true);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Iqama image must be smaller than 5MB."
            );
            setShowErrorModal(true);
            return;
        }

        setIqamaFile(file);

        setIqamaPreview(
            URL.createObjectURL(file)
        );

        setError("");
        setSuccess("");
    };

    // =========================================================================
    // REMOVE IMAGES
    // =========================================================================

    const removeAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview("");
    };

    const removeIqama = () => {
        setIqamaFile(null);
        setIqamaPreview("");
    };

    // =========================================================================
    // RESET
    // =========================================================================

    const resetForm = () => {
        setForm({ ...initialForm });

        setAvatarFile(null);
        setIqamaFile(null);

        setAvatarPreview("");
        setIqamaPreview("");

        setConfirmPassword("");

        setError("");
        setSuccess("");
        setShowErrorModal(false);
    };

    // =========================================================================
    // IMAGE UPLOAD
    // =========================================================================

    const uploadImage = async (
        userId: string,
        file: File,
        type: "avatar" | "iqama"
    ) => {
        const formData = new FormData();

        formData.append("image", file);
        formData.append("type", type);

        return await apiUpload(
            `/api/admin/users/${userId}/image`,
            formData
        );
    };

    // =========================================================================
    // SUBMIT
    // =========================================================================

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        // ---------------------------------------------------------------------
        // PASSWORD CHECK
        // ---------------------------------------------------------------------

        if (
            form.password !==
            confirmPassword
        ) {
            setError(
                "Password and confirm password do not match."
            );

            setShowErrorModal(true);

            return;
        }

        setSubmitting(true);
        setError("");
        setSuccess("");
        setShowErrorModal(false);

        try {
            // =================================================================
            // PAYLOAD
            // =================================================================
            //
            // IMPORTANT:
            //
            // The form date values are YYYY-MM-DD because
            // HTML date inputs require that format.
            //
            // Before sending to API, every business date is converted to:
            //
            //     DD MMM YYYY
            //
            // Example:
            //
            //     2026-10-10
            //
            // becomes:
            //
            //     10 Oct 2026
            //
            // =================================================================

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

                // -------------------------------------------------------------
                // PERSONAL DATE
                // -------------------------------------------------------------

                dateOfBirth:
                    formatDateForStorage(
                        form.dateOfBirth
                    ),

                maritalStatus:
                    form.maritalStatus,

                sponsorshipTransfers:
                    Number(
                        form.sponsorshipTransfers ||
                            0
                    ),

                religion:
                    form.religion.trim(),

                // -------------------------------------------------------------
                // EMPLOYMENT
                // -------------------------------------------------------------

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

                // -------------------------------------------------------------
                // RESIDENT ID DATES
                // -------------------------------------------------------------

                residentIdIssueDate:
                    formatDateForStorage(
                        form.residentIdIssueDate
                    ),

                residentIdExpiry:
                    formatDateForStorage(
                        form.residentIdExpiry
                    ),

                sponsorName:
                    form.sponsorName.trim(),

                sponsorIdNumber:
                    form.sponsorIdNumber.trim(),

                // -------------------------------------------------------------
                // PASSPORT
                // -------------------------------------------------------------

                passport: {
                    passportNumber:
                        form.passportNumber.trim(),

                    type:
                        form.passportType,

                    issuingDate:
                        formatDateForStorage(
                            form.passportIssuingDate
                        ),

                    expiryDate:
                        formatDateForStorage(
                            form.passportExpiryDate
                        ),

                    issuingCity:
                        form.passportIssuingCity.trim(),

                    status:
                        form.passportStatus.trim(),

                    amountDeposit:
                        form.amountDeposit.trim(),
                },

                // -------------------------------------------------------------
                // HAJJ
                // -------------------------------------------------------------

                hajjDetails: {
                    status:
                        form.hajjStatus,

                    // This is a YEAR only.
                    // Keep it exactly as entered.
                    lastHajjYear:
                        form.lastHajjYear.trim(),
                },

                // -------------------------------------------------------------
                // HEALTH INSURANCE
                // -------------------------------------------------------------

                healthInsurance: {
                    issuingDate:
                        formatDateForStorage(
                            form.insuranceIssuingDate
                        ),

                    expiryDate:
                        formatDateForStorage(
                            form.insuranceExpiryDate
                        ),
                },

                // -------------------------------------------------------------
                // PASSWORD
                // -------------------------------------------------------------

                password:
                    form.password,
            };

            // =================================================================
            // CREATE EMPLOYEE
            // =================================================================

            const data = await apiFetch<{
                message: string;
                user: Employee;
            }>("/api/admin/users", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            const userId =
                data?.user?._id ||
                data?.user?.id;

            if (!userId) {
                throw new Error(
                    "Employee was created, but the employee ID was not returned."
                );
            }

            // =================================================================
            // UPLOAD AVATAR
            // =================================================================

            if (avatarFile) {
                await uploadImage(
                    userId,
                    avatarFile,
                    "avatar"
                );
            }

            // =================================================================
            // UPLOAD IQAMA
            // =================================================================

            if (iqamaFile) {
                await uploadImage(
                    userId,
                    iqamaFile,
                    "iqama"
                );
            }

            // =================================================================
            // SUCCESS
            // =================================================================

            setCreatedUserId(userId);

            setSuccess(
                "Employee and selected images were created successfully."
            );

            setShowSuccessModal(true);
        } catch (err) {
            console.error(
                "Create employee error:",
                err
            );

            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong while creating the employee.";

            setError(message);
            setShowErrorModal(true);
        } finally {
            setSubmitting(false);
        }
    };

    // =========================================================================
    // UI
    // =========================================================================

    return (
        <AdminPageLayout>
            {/* =================================================================
                HEADER
            ================================================================= */}

            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex min-h-[76px] items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/admin/users"
                                    )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                            >
                                <ArrowLeft
                                    size={19}
                                />
                            </button>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                        Create Employee
                                    </h1>

                                    <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:inline-flex">
                                        New Account
                                    </span>
                                </div>

                                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                                    Add complete employee
                                    information and
                                    documents
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
                        >
                            <RotateCcw
                                size={15}
                            />
                            Reset
                        </button>
                    </div>
                </div>
            </header>

            {/* =================================================================
                MAIN
            ================================================================= */}

            <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto w-full max-w-[1800px]"
                >
                    {/* =========================================================
                        IMAGES
                    ========================================================= */}

                    <div className="mb-6">
                        <Section
                            icon={
                                <Camera size={20} />
                            }
                            title="Employee Images"
                            description="Upload the employee profile photo and Iqama / Resident ID"
                        >
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.72fr_1.28fr]">
                                <ImageUpload
                                    title="Employee Image"
                                    description="Profile / employee image"
                                    icon={
                                        <Camera
                                            size={19}
                                        />
                                    }
                                    file={
                                        avatarFile
                                    }
                                    preview={
                                        avatarPreview
                                    }
                                    onChange={
                                        handleAvatarChange
                                    }
                                    onRemove={
                                        removeAvatar
                                    }
                                    compact
                                />

                                <ImageUpload
                                    title="Iqama / Resident ID"
                                    description="Employee Iqama document"
                                    icon={
                                        <IdCard
                                            size={19}
                                        />
                                    }
                                    file={
                                        iqamaFile
                                    }
                                    preview={
                                        iqamaPreview
                                    }
                                    onChange={
                                        handleIqamaChange
                                    }
                                    onRemove={
                                        removeIqama
                                    }
                                />
                            </div>

                            <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                                Images will be uploaded
                                securely to Cloudinary
                                after the employee
                                account is created.
                            </div>
                        </Section>
                    </div>

                    {/* =========================================================
                        TWO COLUMN SECTIONS
                    ========================================================= */}

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {/* =====================================================
                            PERSONAL
                        ===================================================== */}

                        <Section
                            icon={
                                <User size={20} />
                            }
                            title="Personal Information"
                            description="Basic identity and personal details"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <Field
                                    label="Full Name"
                                    name="name"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter employee name"
                                    required
                                />

                                <Field
                                    label="Resident ID / Iqama"
                                    name="residentIdNumber"
                                    value={
                                        form.residentIdNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter iqama number"
                                    required
                                />

                                <Field
                                    label="ID Version"
                                    name="idVersion"
                                    value={
                                        form.idVersion
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="N/A"
                                />

                                <Field
                                    label="Nationality"
                                    name="nationality"
                                    value={
                                        form.nationality
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Bangladeshi"
                                />

                                <Field
                                    label="Birth City"
                                    name="birthCity"
                                    value={
                                        form.birthCity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Chittagong"
                                />

                                <Field
                                    label="Birth Country"
                                    name="birthCountry"
                                    value={
                                        form.birthCountry
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Bangladesh"
                                />

                                <Field
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    value={
                                        form.dateOfBirth
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    type="date"
                                />

                                <SelectField
                                    label="Marital Status"
                                    name="maritalStatus"
                                    value={
                                        form.maritalStatus
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select status
                                    </option>

                                    <option value="SINGLE">
                                        SINGLE
                                    </option>

                                    <option value="MARRIED">
                                        MARRIED
                                    </option>

                                    <option value="DIVORCED">
                                        DIVORCED
                                    </option>

                                    <option value="WIDOWED">
                                        WIDOWED
                                    </option>
                                </SelectField>

                                <Field
                                    label="Sponsorship Transfers"
                                    name="sponsorshipTransfers"
                                    value={
                                        form.sponsorshipTransfers
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    type="number"
                                    placeholder="0"
                                />

                                <Field
                                    label="Religion"
                                    name="religion"
                                    value={
                                        form.religion
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Islam"
                                />
                            </div>
                        </Section>

                        {/* =====================================================
                            EMPLOYMENT
                        ===================================================== */}

                        <Section
                            icon={
                                <BriefcaseBusiness
                                    size={20}
                                />
                            }
                            title="Employment Information"
                            description="Work permit, employer and sponsorship details"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <Field
                                    label="Occupation"
                                    name="occupation"
                                    value={
                                        form.occupation
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter occupation"
                                />

                                <Field
                                    label="Employer"
                                    name="employer"
                                    value={
                                        form.employer
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter employer name"
                                />

                                <Field
                                    label="Employer ID Number"
                                    name="employerIdNumber"
                                    value={
                                        form.employerIdNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter employer ID"
                                />

                                <Field
                                    label="Work Permit"
                                    name="workPermit"
                                    value={
                                        form.workPermit
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Work permit"
                                />

                                <Field
                                    label="Issue Place"
                                    name="issuePlace"
                                    value={
                                        form.issuePlace
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Issue place"
                                />

                                <Field
                                    label="Resident ID Issue Date"
                                    name="residentIdIssueDate"
                                    value={
                                        form.residentIdIssueDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    type="date"
                                />

                                <Field
                                    label="Resident ID Expiry"
                                    name="residentIdExpiry"
                                    value={
                                        form.residentIdExpiry
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    type="date"
                                />

                                <Field
                                    label="Sponsor ID Number"
                                    name="sponsorIdNumber"
                                    value={
                                        form.sponsorIdNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter resident ID / Iqama number"
                                />

                                <Field
                                    label="Sponsor Name"
                                    name="sponsorName"
                                    value={
                                        form.sponsorName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter sponsor name"
                                    className="md:col-span-2"
                                />
                            </div>
                        </Section>

                        {/* =====================================================
                            PASSPORT
                        ===================================================== */}

                        <Section
                            icon={
                                <CreditCard
                                    size={20}
                                />
                            }
                            title="Passport Information"
                            description="Passport and travel document details"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <Field
                                    label="Passport Number"
                                    name="passportNumber"
                                    value={
                                        form.passportNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="A03870440"
                                />

                                <SelectField
                                    label="Type"
                                    name="passportType"
                                    value={
                                        form.passportType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="Normal">
                                        Normal
                                    </option>

                                    <option value="Diplomatic">
                                        Diplomatic
                                    </option>

                                    <option value="Official">
                                        Official
                                    </option>
                                </SelectField>

                                <Field
                                    label="Issuing Date"
                                    name="passportIssuingDate"
                                    value={
                                        form.passportIssuingDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    type="date"
                                />

                                <Field
                                    label="Expiry Date"
                                    name="passportExpiryDate"
                                    value={
                                        form.passportExpiryDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    type="date"
                                />

                                <Field
                                    label="Issuing City"
                                    name="passportIssuingCity"
                                    value={
                                        form.passportIssuingCity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Bangladesh"
                                />

                                <Field
                                    label="Status"
                                    name="passportStatus"
                                    value={
                                        form.passportStatus
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Active"
                                />

                                <Field
                                    label="Amount Deposit"
                                    name="amountDeposit"
                                    value={
                                        form.amountDeposit
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="SAR 0.00"
                                    className="md:col-span-2"
                                />
                            </div>
                        </Section>

                        {/* =====================================================
                            HAJJ
                        ===================================================== */}

                        <Section
                            icon={
                                <ShieldCheck
                                    size={20}
                                />
                            }
                            title="Hajj Information"
                            description="Hajj eligibility and history"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <SelectField
                                    label="Hajj Status"
                                    name="hajjStatus"
                                    value={
                                        form.hajjStatus
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="eligible">
                                        Eligible
                                    </option>

                                    <option value="not_eligible">
                                        Not Eligible
                                    </option>

                                    <option value="completed">
                                        Completed
                                    </option>
                                </SelectField>

                                <Field
                                    label="Last Hajj Year"
                                    name="lastHajjYear"
                                    value={
                                        form.lastHajjYear
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="2024"
                                />
                            </div>
                        </Section>

                        {/* =====================================================
                            HEALTH INSURANCE
                        ===================================================== */}

                        <Section
                            icon={
                                <HeartPulse
                                    size={20}
                                />
                            }
                            title="Health Insurance"
                            description="Employee medical insurance information"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <Field
                                    label="Insurance Issuing Date"
                                    name="insuranceIssuingDate"
                                    value={
                                        form.insuranceIssuingDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    type="date"
                                />

                                <Field
                                    label="Insurance Expiry Date"
                                    name="insuranceExpiryDate"
                                    value={
                                        form.insuranceExpiryDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    type="date"
                                />
                            </div>
                        </Section>

                        {/* =====================================================
                            SECURITY
                        ===================================================== */}

                        <Section
                            icon={
                                <LockKeyhole
                                    size={20}
                                />
                            }
                            title="Account Security"
                            description="Login credentials for the employee"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Employee Password

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                form.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Create login password"
                                            required
                                            minLength={
                                                6
                                            }
                                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (
                                                        prev
                                                    ) =>
                                                        !prev
                                                )
                                            }
                                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    size={
                                                        17
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        17
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>

                                    <p className="mt-2 text-xs text-slate-400">
                                        Minimum 6
                                        characters.
                                        The password
                                        will be
                                        securely
                                        hashed before
                                        storage.
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Confirm Password

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                confirmPassword
                                            }
                                            onChange={(
                                                e
                                            ) => {
                                                setConfirmPassword(
                                                    e
                                                        .target
                                                        .value
                                                );

                                                setError(
                                                    ""
                                                );

                                                setSuccess(
                                                    ""
                                                );
                                            }}
                                            placeholder="Re-enter password"
                                            required
                                            minLength={
                                                6
                                            }
                                            className={`h-11 w-full rounded-xl border bg-slate-50/50 px-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                                confirmPassword &&
                                                confirmPassword !==
                                                    form.password
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                                                    : confirmPassword &&
                                                      confirmPassword ===
                                                          form.password
                                                    ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                                                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10"
                                            }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (
                                                        prev
                                                    ) =>
                                                        !prev
                                                )
                                            }
                                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    size={
                                                        17
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        17
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>

                                    {confirmPassword &&
                                        confirmPassword !==
                                            form.password && (
                                            <p className="mt-2 text-xs font-medium text-red-500">
                                                Passwords
                                                do not
                                                match.
                                            </p>
                                        )}

                                    {confirmPassword &&
                                        confirmPassword ===
                                            form.password && (
                                            <p className="mt-2 text-xs font-medium text-emerald-600">
                                                Passwords
                                                match.
                                            </p>
                                        )}
                                </div>
                            </div>
                        </Section>
                    </div>

                    {/* =========================================================
                        SAVE BAR
                    ========================================================= */}

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-800">
                                    Ready to create this
                                    employee?
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    QR information is
                                    generated
                                    automatically from
                                    the employee's main
                                    profile data.
                                </p>
                            </div>

                            <div className="flex w-full gap-3 sm:w-auto">
                                <button
                                    type="button"
                                    onClick={
                                        resetForm
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="flex-1 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:flex-none"
                                >
                                    Reset
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        submitting ||
                                        (confirmPassword.length >
                                            0 &&
                                            confirmPassword !==
                                                form.password)
                                    }
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus
                                                size={
                                                    17
                                                }
                                            />

                                            Create Employee
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            {/* =================================================================
                SUCCESS MODAL
            ================================================================= */}

            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm">
                    <div className="w-full max-w-md animate-[scaleIn_0.2s_ease-out] rounded-[2rem] bg-white p-7 text-center shadow-[0_25px_80px_rgba(0,0,0,0.20)] sm:p-9">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_10px_25px_rgba(5,150,105,0.25)]">
                                <CheckCircle2
                                    size={30}
                                    strokeWidth={2.5}
                                />
                            </div>
                        </div>

                        <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                            Employee Created
                            Successfully
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
                            {success ||
                                "The employee account and selected documents have been created successfully."}
                        </p>

                        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-emerald-50">
                            <div className="h-full w-full origin-left animate-[progress_1.8s_linear] rounded-full bg-emerald-600" />
                        </div>

                        <p className="mt-3 text-[11px] font-bold text-slate-400">
                            Opening employee
                            profile...
                        </p>
                    </div>
                </div>
            )}

            {/* =================================================================
                ERROR MODAL
            ================================================================= */}

            {showErrorModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm">
                    <div className="w-full max-w-md animate-[scaleIn_0.2s_ease-out] rounded-[2rem] bg-white p-7 text-center shadow-[0_25px_80px_rgba(0,0,0,0.20)] sm:p-9">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_10px_25px_rgba(239,68,68,0.25)]">
                                <AlertCircle
                                    size={30}
                                    strokeWidth={2.5}
                                />
                            </div>
                        </div>

                        <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                            Creation Failed
                        </h2>

                        <p className="mx-auto mt-3 max-w-sm text-sm font-medium leading-6 text-slate-500">
                            {error ||
                                "Something went wrong while creating the employee."}
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setShowErrorModal(
                                    false
                                );

                                setError("");
                            }}
                            className="mt-7 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Close & Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* =================================================================
                ANIMATIONS
            ================================================================= */}

            <style>
                {`
                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scale(0.94);
                        }

                        to {
                            opacity: 1;
                            transform: scale(1);
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
                `}
            </style>
        </AdminPageLayout>
    );
}