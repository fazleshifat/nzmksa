import {
    useEffect,
    useMemo,
    useState,
    type FormEvent,
} from "react";
import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    User,
    Mail,
    ShieldCheck,
    CheckCircle2,
    LockKeyhole,
    Eye,
    EyeOff,
    Save,
    RefreshCw,
    CalendarDays,
    KeyRound,
    AlertCircle,
    Pencil,
    X,
    Check,
    CircleUserRound,
    Activity,
    Copy,
} from "lucide-react";

import { apiFetch } from "../../../api/api";

interface AdminProfileData {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: "admin";
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface AdminProfileResponse {
    admin: AdminProfileData;
}

interface UpdateProfileResponse {
    message: string;
    admin: AdminProfileData;
}

interface AdminByIdResponse {
    admin: AdminProfileData;
}

interface ApiError {
    message?: string;
}

interface AdminProfileProps {
    /**
     * Optional admin supplied directly by another component.
     *
     * Example:
     *
     * <AdminProfile
     *     adminData={admin}
     *     isViewOnly
     * />
     */
    adminData?: AdminProfileData;

    /**
     * If true, this profile is another administrator's profile.
     * Editing will be disabled.
     */
    isViewOnly?: boolean;
}

interface AdminProfileLocationState {
    admin?: AdminProfileData;
    from?: string;
}

type ConfirmationType =
    | "profile"
    | "password"
    | null;

export default function AdminProfile({
    adminData,
    isViewOnly = false,
}: AdminProfileProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    /*
     * ---------------------------------------------------------
     * ROUTE / DATA MODE
     * ---------------------------------------------------------
     *
     * Supported:
     *
     * 1. /admin/profile
     *    -> logged-in admin
     *AdminProfileLocationState
     * 2. /admin/admins/:id
     *    -> another admin
     *
     * 3. adminData prop
     *    -> admin supplied directly by another component
     *
     * 4. location.state.admin
     *    -> admin passed through navigate()
     */

    const routeState =
        location.state as AdminProfileLocationState | null;

    const passedAdmin =
        adminData ?? routeState?.admin ?? null;

    const handleBack = () => {
        if (routeState?.from) {
            navigate(routeState.from);
            return;
        }

        navigate(-1);
    };

    /*
     * If we have an ID, this is an administrator
     * being viewed from another route.
     *
     * If there is no ID and no passed admin,
     * this is the logged-in administrator.
     */
    const viewingAnotherAdmin =
        Boolean(isViewOnly || id || passedAdmin);

    /*
     * Only the /admin/profile situation is editable.
     */
    const isOwnProfile =
        !viewingAnotherAdmin;

    const [admin, setAdmin] =
        useState<AdminProfileData | null>(
            passedAdmin || null
        );

    const [loading, setLoading] =
        useState(!passedAdmin);

    const [refreshing, setRefreshing] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [editingName, setEditingName] =
        useState(false);

    const [editingEmail, setEditingEmail] =
        useState(false);

    const [editingPassword, setEditingPassword] =
        useState(false);

    const [name, setName] =
        useState(passedAdmin?.name || "");

    const [email, setEmail] =
        useState(passedAdmin?.email || "");

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [passwordSaving, setPasswordSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [copied, setCopied] =
        useState(false);

    const [confirmationType, setConfirmationType] =
        useState<ConfirmationType>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    /*
     * ---------------------------------------------------------
     * DERIVED DATA
     * ---------------------------------------------------------
     */

    const initials = useMemo(() => {
        if (!admin?.name) {
            return "A";
        }

        const parts = admin.name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (parts.length === 1) {
            return parts[0]
                .charAt(0)
                .toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    }, [admin?.name]);

    const formattedCreatedAt = useMemo(() => {
        if (!admin?.createdAt) {
            return "—";
        }

        return new Date(
            admin.createdAt
        ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }, [admin?.createdAt]);

    const formattedUpdatedAt = useMemo(() => {
        if (!admin?.updatedAt) {
            return "—";
        }

        return new Date(
            admin.updatedAt
        ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }, [admin?.updatedAt]);

    /*
     * ---------------------------------------------------------
     * SUCCESS MODAL
     * ---------------------------------------------------------
     */

    const showSuccessModal = (
        successText: string
    ) => {
        setSuccessMessage(successText);

        window.setTimeout(() => {
            setSuccessMessage(null);
        }, 2200);
    };

    /*
     * ---------------------------------------------------------
     * FETCH PROFILE
     * ---------------------------------------------------------
     *
     * Priority:
     *
     * 1. adminData prop
     * 2. location.state.admin
     * 3. /admin/admins/:id API
     * 4. logged-in /admin/profile API
     */

    const fetchProfile = async (
        showRefreshing = false
    ) => {
        /*
         * If this is another admin and data was supplied
         * directly, use that data.
         */
        if (
            viewingAnotherAdmin &&
            passedAdmin &&
            !showRefreshing
        ) {
            setAdmin(passedAdmin);

            setName(passedAdmin.name);
            setEmail(passedAdmin.email);

            setLoading(false);
            setRefreshing(false);

            return;
        }

        try {
            if (showRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            let response:
                | AdminProfileResponse
                | AdminByIdResponse;

            /*
             * Another admin with URL ID
             */
            if (id) {
                response =
                    await apiFetch<AdminByIdResponse>(
                        `/api/admin/all-admins/${id}`
                    );
            }

            /*
             * Logged-in admin
             */
            else {
                response =
                    await apiFetch<AdminProfileResponse>(
                        "/api/admin/profile"
                    );
            }

            setAdmin(response.admin);

            setName(response.admin.name);
            setEmail(response.admin.email);

            /*
             * Reset edit states whenever a profile
             * is loaded/refreshed.
             */
            setEditingName(false);
            setEditingEmail(false);
            setEditingPassword(false);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);

            setConfirmationType(null);
        } catch (err) {
            const apiError =
                err as ApiError;

            setAdmin(null);

            setError(
                apiError?.message ||
                "Failed to load admin profile."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /*
     * Load profile.
     *
     * If another admin was passed through props/router state,
     * we don't need an API request initially.
     *
     * If refreshed, URL ID still allows us to fetch the admin.
     */
    useEffect(() => {
        if (passedAdmin) {
            setAdmin(passedAdmin);
            setName(passedAdmin.name);
            setEmail(passedAdmin.email);

            setLoading(false);

            return;
        }

        fetchProfile();
    }, [id]);

    /*
     * ---------------------------------------------------------
     * PROFILE
     * ---------------------------------------------------------
     */

    const handleSaveBasicInfo = (
        event: FormEvent
    ) => {
        event.preventDefault();

        if (!isOwnProfile) {
            return;
        }

        setError("");
        setMessage("");

        if (!name.trim()) {
            setError(
                "Admin name cannot be empty."
            );

            return;
        }

        if (!email.trim()) {
            setError(
                "Admin email cannot be empty."
            );

            return;
        }

        /*
         * Don't update immediately.
         * Show confirmation first.
         */
        setConfirmationType("profile");
    };

    const confirmBasicInfoUpdate = async () => {
        if (!isOwnProfile) {
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const response =
                await apiFetch<UpdateProfileResponse>(
                    "/api/admin/profile",
                    {
                        method: "PATCH",
                        body: JSON.stringify({
                            name: name.trim(),
                            email: email
                                .trim()
                                .toLowerCase(),
                        }),
                    }
                );

            setAdmin(response.admin);

            setName(response.admin.name);
            setEmail(response.admin.email);

            setEditingName(false);
            setEditingEmail(false);

            setConfirmationType(null);

            setMessage(
                "Profile information updated successfully."
            );

            showSuccessModal(
                "Profile information updated successfully."
            );
        } catch (err) {
            const apiError =
                err as ApiError;

            setError(
                apiError?.message ||
                "Failed to update profile."
            );

            setConfirmationType(null);
        } finally {
            setSaving(false);
        }
    };

    /*
     * ---------------------------------------------------------
     * PASSWORD
     * ---------------------------------------------------------
     */

    const handlePasswordChange = (
        event: FormEvent
    ) => {
        event.preventDefault();

        if (!isOwnProfile) {
            return;
        }

        if (!editingPassword) {
            return;
        }

        setError("");
        setMessage("");

        if (!currentPassword) {
            setError(
                "Enter your current password."
            );

            return;
        }

        if (!newPassword) {
            setError(
                "Enter your new password."
            );

            return;
        }

        if (newPassword.length < 6) {
            setError(
                "New password must be at least 6 characters."
            );

            return;
        }

        if (!confirmPassword) {
            setError(
                "Confirm your new password."
            );

            return;
        }

        if (
            newPassword !==
            confirmPassword
        ) {
            setError(
                "New password and confirmation do not match."
            );

            return;
        }

        /*
         * Show confirmation modal before API call.
         */
        setConfirmationType("password");
    };

    const confirmPasswordUpdate =
        async () => {
            if (!isOwnProfile) {
                return;
            }

            try {
                setPasswordSaving(true);
                setError("");
                setMessage("");

                const response =
                    await apiFetch<UpdateProfileResponse>(
                        "/api/admin/profile",
                        {
                            method: "PATCH",
                            body: JSON.stringify({
                                currentPassword,
                                newPassword,
                            }),
                        }
                    );

                setAdmin(response.admin);

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);

                setEditingPassword(false);

                setConfirmationType(null);

                setMessage(
                    "Password changed successfully."
                );

                showSuccessModal(
                    "Password changed successfully."
                );
            } catch (err) {
                const apiError =
                    err as ApiError;

                setError(
                    apiError?.message ||
                    "Failed to change password."
                );

                setConfirmationType(null);
            } finally {
                setPasswordSaving(false);
            }
        };

    /*
     * ---------------------------------------------------------
     * CANCEL CONFIRMATION
     * ---------------------------------------------------------
     */

    const cancelConfirmation = () => {
        if (
            saving ||
            passwordSaving
        ) {
            return;
        }

        setConfirmationType(null);
    };

    /*
     * ---------------------------------------------------------
     * CANCEL PROFILE EDIT
     * ---------------------------------------------------------
     */

    const cancelProfileEdit = () => {
        if (!admin) {
            return;
        }

        setName(admin.name);
        setEmail(admin.email);

        setEditingName(false);
        setEditingEmail(false);

        setError("");
        setMessage("");
    };

    /*
     * ---------------------------------------------------------
     * CANCEL PASSWORD EDIT
     * ---------------------------------------------------------
     */

    const cancelPasswordEdit = () => {
        if (passwordSaving) {
            return;
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

        setEditingPassword(false);

        setError("");
        setMessage("");
    };

    /*
     * ---------------------------------------------------------
     * COPY ADMIN ID
     * ---------------------------------------------------------
     */

    const copyAdminId = async () => {
        const adminId =
            admin?._id ||
            admin?.id;

        if (!adminId) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                adminId
            );

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1800);
        } catch {
            // Ignore clipboard failure.
        }
    };

    /*
     * ---------------------------------------------------------
     * LOADING
     * ---------------------------------------------------------
     */

    if (loading) {
        return (
            <main className="min-h-[calc(100dvh-78px)] bg-[#F3F7F5] p-5 md:p-8">
                <div className="mx-auto max-w-[1400px]">
                    <div className="animate-pulse">
                        <div className="h-[260px] rounded-[32px] bg-white" />

                        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="h-[430px] rounded-[32px] bg-white" />

                            <div className="h-[430px] rounded-[32px] bg-white" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * ---------------------------------------------------------
     * PROFILE UNAVAILABLE
     * ---------------------------------------------------------
     */

    if (!admin) {
        return (
            <main className="min-h-[calc(100dvh-78px)] bg-[#F3F7F5] p-5 md:p-8">
                <div className="mx-auto flex min-h-[500px] w-full items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <AlertCircle
                                size={28}
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-black">
                            Admin profile unavailable
                        </h2>

                        <p className="mt-2 text-sm text-black/45">
                            {error ||
                                "Unable to load this admin profile."}
                        </p>

                        <button
                            type="button"
                            onClick={handleBack}
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#173D31] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                        >
                            <ArrowLeft
                                size={17}
                            />

                            Go Back
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * ---------------------------------------------------------
     * MAIN
     * ---------------------------------------------------------
     */

    return (
        <main className="min-h-[calc(100dvh-78px)] bg-[#F3F7F5]">
            <div className="mx-auto max-w-full p-3 md:p-5">

                {/* =====================================================
                    PAGE HEADER
                ===================================================== */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-black/55 shadow-sm transition hover:-translate-y-0.5 hover:text-black"
                            title="Go back"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green">
                                {viewingAnotherAdmin
                                    ? "Administrator"
                                    : "Account"}
                            </p>

                            <h1 className="mt-1 text-2xl font-black tracking-tight text-black md:text-3xl">
                                {viewingAnotherAdmin
                                    ? "Admin Profile"
                                    : "My Profile"}
                            </h1>

                            <p className="mt-1 text-sm text-black/40">
                                {viewingAnotherAdmin
                                    ? "View administrator account information."
                                    : "Manage your administrator account and security."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            fetchProfile(true)
                        }
                        disabled={refreshing}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-4 text-sm font-black text-black/60 shadow-sm transition hover:-translate-y-0.5 hover:text-black disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>
                </div>

                {/* =====================================================
                    ALERTS
                ===================================================== */}

                {message && (
                    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                        <CheckCircle2
                            size={18}
                            className="shrink-0"
                        />

                        <span>
                            {message}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setMessage("")
                            }
                            className="ml-auto"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                        <AlertCircle
                            size={18}
                            className="shrink-0"
                        />

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="ml-auto"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* =====================================================
                    PROFILE HERO
                ===================================================== */}

                <section className="relative overflow-hidden rounded-[32px] bg-[#173D31] shadow-[0_20px_60px_rgba(23,61,49,0.12)]">

                    <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/[0.04]" />

                    <div className="absolute -bottom-40 right-32 h-96 w-96 rounded-full bg-[#4FAF83]/[0.06]" />

                    <div className="relative flex flex-col gap-7 p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                            {/* Avatar */}

                            <div className="relative">
                                <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-white text-3xl font-black text-[#173D31] shadow-[0_15px_40px_rgba(0,0,0,0.18)]">
                                    {initials}
                                </div>

                                <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-[#173D31] bg-emerald-400 text-white">
                                    <Check
                                        size={16}
                                        strokeWidth={3}
                                    />
                                </div>
                            </div>

                            <div className="text-white">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                                        {admin.name}
                                    </h2>

                                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/80">
                                        Administrator
                                    </span>
                                </div>

                                <p className="mt-2 flex items-center gap-2 text-sm text-white/55">
                                    <Mail
                                        size={15}
                                    />

                                    {admin.email}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-400/10 px-3 py-2 text-[11px] font-black text-emerald-300">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400" />

                                        {admin.active
                                            ? "Active Account"
                                            : "Inactive Account"}
                                    </span>

                                    <span className="inline-flex items-center gap-2 rounded-xl bg-white/[0.07] px-3 py-2 text-[11px] font-bold text-white/60">
                                        <CalendarDays
                                            size={13}
                                        />

                                        Joined{" "}
                                        {
                                            formattedCreatedAt
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hero right information */}

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[390px]">

                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.05] p-4">
                                <ShieldCheck
                                    size={19}
                                    className="text-emerald-300"
                                />

                                <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-white/35">
                                    Role
                                </p>

                                <p className="mt-1 text-sm font-black text-white">
                                    Admin
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.05] p-4">
                                <Activity
                                    size={19}
                                    className="text-emerald-300"
                                />

                                <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-white/35">
                                    Status
                                </p>

                                <p className="mt-1 text-sm font-black text-white">
                                    {admin.active
                                        ? "Active"
                                        : "Inactive"}
                                </p>
                            </div>

                            <div className="col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.05] p-4 sm:col-span-1">
                                <CircleUserRound
                                    size={19}
                                    className="text-emerald-300"
                                />

                                <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-white/35">
                                    Account
                                </p>

                                <p className="mt-1 truncate text-sm font-black text-white">
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

                    {/* =================================================
                        BASIC INFORMATION
                    ================================================= */}

                    <section className="rounded-[30px] border border-black/[0.05] bg-white p-6 shadow-[0_15px_50px_rgba(20,50,40,0.05)] md:p-8">

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5F0] text-brand-green">
                                        <User
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-black">
                                            Personal Information
                                        </h3>

                                        <p className="text-xs text-black/35">
                                            Account identity and contact information
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!isViewOnly &&
                                isOwnProfile && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingName(
                                                true
                                            );

                                            setEditingEmail(
                                                true
                                            );
                                        }}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#F3F7F5] px-3.5 py-2 text-xs font-black text-black/55 transition hover:bg-[#EAF5F0] hover:text-brand-green"
                                    >
                                        <Pencil
                                            size={14}
                                        />

                                        Edit
                                    </button>
                                )}
                        </div>

                        <form
                            onSubmit={
                                handleSaveBasicInfo
                            }
                            className="mt-8 space-y-5"
                        >

                            {/* Name */}

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                                        Full Name
                                    </label>

                                    {!isViewOnly &&
                                        isOwnProfile &&
                                        !editingName && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditingName(
                                                        true
                                                    )
                                                }
                                                className="text-[10px] font-black text-brand-green"
                                            >
                                                Edit
                                            </button>
                                        )}
                                </div>

                                <div className="relative">
                                    <User
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25"
                                    />

                                    <input
                                        value={name}
                                        onChange={(
                                            event
                                        ) =>
                                            setName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            isViewOnly ||
                                            !editingName
                                        }
                                        className="h-14 w-full rounded-2xl border border-black/[0.07] bg-[#F8FAF9] pl-12 pr-4 text-sm font-normal text-black outline-none transition placeholder:text-black/20 focus:border-brand-green/30 focus:bg-white focus:ring-4 focus:ring-brand-green/5 disabled:text-black"
                                    />
                                </div>
                            </div>

                            {/* Email */}

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                                        Email Address
                                    </label>

                                    {!isViewOnly &&
                                        isOwnProfile &&
                                        !editingEmail && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditingEmail(
                                                        true
                                                    )
                                                }
                                                className="text-[10px] font-black text-brand-green"
                                            >
                                                Edit
                                            </button>
                                        )}
                                </div>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25"
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(
                                            event
                                        ) =>
                                            setEmail(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            isViewOnly ||
                                            !editingEmail
                                        }
                                        className="h-14 w-full rounded-2xl border border-black/[0.07] bg-[#F8FAF9] pl-12 pr-4 text-sm font-normal text-black outline-none transition placeholder:text-black/20 focus:border-brand-green/30 focus:bg-white focus:ring-4 focus:ring-brand-green/5 disabled:text-black"
                                    />
                                </div>
                            </div>

                            {/* Role */}

                            <div>
                                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                                    Account Role
                                </label>

                                <div className="flex h-14 items-center gap-3 rounded-2xl border border-black/[0.07] bg-[#F8FAF9] px-4">
                                    <ShieldCheck
                                        size={17}
                                        className="text-brand-green"
                                    />

                                    <span className="text-sm font-black text-black/60">
                                        Administrator
                                    </span>

                                    <span className="ml-auto rounded-lg bg-[#EAF5F0] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-brand-green">
                                        Protected
                                    </span>
                                </div>
                            </div>

                            {/* Account status */}

                            <div>
                                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                                    Account Status
                                </label>

                                <div className="flex h-14 items-center gap-3 rounded-2xl border border-black/[0.07] bg-[#F8FAF9] px-4">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${admin.active
                                            ? "bg-emerald-500"
                                            : "bg-red-500"
                                            }`}
                                    />

                                    <span className="text-sm font-black text-black/60">
                                        {admin.active
                                            ? "Active"
                                            : "Inactive"}
                                    </span>

                                    <span className="ml-auto text-[10px] font-bold text-black/25">
                                        Managed by system
                                    </span>
                                </div>
                            </div>

                            {/* Save */}

                            {!isViewOnly &&
                                isOwnProfile &&
                                (editingName ||
                                    editingEmail) && (
                                    <div className="flex flex-col gap-3 border-t border-black/[0.06] pt-5 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={
                                                cancelProfileEdit
                                            }
                                            className="h-12 rounded-2xl border border-black/[0.07] px-5 text-sm font-black text-black/55 transition hover:bg-black/[0.03]"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={
                                                saving
                                            }
                                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#173D31] px-6 text-sm font-black text-white shadow-[0_10px_25px_rgba(23,61,49,0.16)] transition hover:-translate-y-0.5 disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <RefreshCw
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Save
                                                    size={16}
                                                />
                                            )}

                                            {saving
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>
                                    </div>
                                )}
                        </form>

                        {/* Account metadata */}

                        <div className="mt-8 grid gap-3 border-t border-black/[0.06] pt-6 sm:grid-cols-2">

                            <div className="rounded-2xl bg-[#F8FAF9] p-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/30">
                                    Joined
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                    <CalendarDays
                                        size={15}
                                        className="text-brand-green"
                                    />

                                    <p className="text-xs font-black text-black/65">
                                        {
                                            formattedCreatedAt
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-[#F8FAF9] p-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/30">
                                    Last Updated
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                    <RefreshCw
                                        size={15}
                                        className="text-brand-green"
                                    />

                                    <p className="text-xs font-black text-black/65">
                                        {
                                            formattedUpdatedAt
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Admin ID */}

                        <div className="mt-3 rounded-2xl bg-[#F8FAF9] p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/30">
                                        Admin ID
                                    </p>

                                    <p className="mt-2 truncate font-mono text-xs font-bold text-black/45">
                                        {admin._id ||
                                            admin.id ||
                                            "—"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        copyAdminId
                                    }
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-black/35 shadow-sm transition hover:text-brand-green"
                                    title="Copy admin ID"
                                >
                                    {copied ? (
                                        <Check
                                            size={15}
                                            className="text-emerald-500"
                                        />
                                    ) : (
                                        <Copy
                                            size={15}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        SECURITY
                    ================================================= */}

                    <section className="h-fit rounded-[30px] border border-black/[0.05] bg-white p-6 shadow-[0_15px_50px_rgba(20,50,40,0.05)] md:p-8">

                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7E7] text-[#B7791F]">
                                    <LockKeyhole
                                        size={18}
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-black">
                                        Security
                                    </h3>

                                    <p className="text-xs text-black/35">
                                        Protect your administrator account.
                                    </p>
                                </div>
                            </div>

                            {!isViewOnly &&
                                isOwnProfile && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingPassword(
                                                true
                                            );

                                            setError("");
                                            setMessage("");
                                        }}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#F3F7F5] px-3.5 py-2 text-xs font-black text-black/55 transition hover:bg-[#EAF5F0] hover:text-brand-green"
                                    >
                                        <Pencil
                                            size={14}
                                        />

                                        Edit
                                    </button>
                                )}
                        </div>

                        {isViewOnly ? (
                            <div className="mt-8 rounded-3xl border border-black/[0.06] bg-[#F8FAF9] p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black/35 shadow-sm">
                                    <ShieldCheck
                                        size={21}
                                    />
                                </div>

                                <h4 className="mt-5 text-sm font-black">
                                    Password protected
                                </h4>

                                <p className="mt-2 text-xs leading-5 text-black/40">
                                    Password information is private and cannot be viewed from another administrator's profile.
                                </p>
                            </div>
                        ) : (
                            <form
                                onSubmit={
                                    handlePasswordChange
                                }
                                className="mt-8 space-y-5"
                            >

                                {/* Current password */}

                                <div>
                                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                                        Current Password
                                    </label>

                                    <div className="relative">
                                        <KeyRound
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25"
                                        />

                                        <input
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                currentPassword
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setCurrentPassword(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            disabled={
                                                !editingPassword
                                            }
                                            placeholder="Enter current password"
                                            className="h-14 w-full rounded-2xl border border-black/[0.07] bg-[#F8FAF9] pl-12 pr-12 text-sm font-normal text-black outline-none transition placeholder:text-black/20 focus:border-brand-green/30 focus:bg-white focus:ring-4 focus:ring-brand-green/5 disabled:text-black"
                                        />

                                        <button
                                            type="button"
                                            disabled={
                                                !editingPassword
                                            }
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    (
                                                        value
                                                    ) =>
                                                        !value
                                                )
                                            }
                                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-black/30 hover:bg-black/5 hover:text-black/60 disabled:opacity-50"
                                        >
                                            {showCurrentPassword ? (
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
                                </div>

                                {/* New password */}

                                <div>
                                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                                        New Password
                                    </label>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25"
                                        />

                                        <input
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                newPassword
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setNewPassword(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            disabled={
                                                !editingPassword
                                            }
                                            placeholder="Minimum 6 characters"
                                            className="h-14 w-full rounded-2xl border border-black/[0.07] bg-[#F8FAF9] pl-12 pr-12 text-sm font-normal text-black outline-none transition placeholder:text-black/20 focus:border-brand-green/30 focus:bg-white focus:ring-4 focus:ring-brand-green/5 disabled:text-black"
                                        />

                                        <button
                                            type="button"
                                            disabled={
                                                !editingPassword
                                            }
                                            onClick={() =>
                                                setShowNewPassword(
                                                    (
                                                        value
                                                    ) =>
                                                        !value
                                                )
                                            }
                                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-black/30 hover:bg-black/5 hover:text-black/60 disabled:opacity-50"
                                        >
                                            {showNewPassword ? (
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

                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-[10px] font-medium text-black/30">
                                            Use at least 6 characters.
                                        </span>

                                        {newPassword && (
                                            <span
                                                className={`text-[10px] font-black ${newPassword.length >=
                                                    6
                                                    ? "text-emerald-500"
                                                    : "text-amber-500"
                                                    }`}
                                            >
                                                {newPassword.length >=
                                                    6
                                                    ? "Strong enough"
                                                    : `${newPassword.length}/6 characters`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Confirm password */}

                                <div>
                                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                                        Confirm New Password
                                    </label>

                                    <div className="relative">
                                        <CheckCircle2
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25"
                                        />

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                confirmPassword
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setConfirmPassword(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            disabled={
                                                !editingPassword
                                            }
                                            placeholder="Repeat new password"
                                            className={`h-14 w-full rounded-2xl border bg-[#F8FAF9] pl-12 pr-12 text-sm font-normal text-black outline-none transition placeholder:text-black/20 focus:bg-white focus:ring-4 disabled:text-black ${confirmPassword &&
                                                newPassword !==
                                                confirmPassword
                                                ? "border-red-200 focus:border-red-300 focus:ring-red-500/5"
                                                : confirmPassword &&
                                                    newPassword ===
                                                    confirmPassword
                                                    ? "border-emerald-200 focus:border-emerald-300 focus:ring-emerald-500/5"
                                                    : "border-black/[0.07] focus:border-brand-green/30 focus:ring-brand-green/5"
                                                }`}
                                        />

                                        <button
                                            type="button"
                                            disabled={
                                                !editingPassword
                                            }
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (
                                                        value
                                                    ) =>
                                                        !value
                                                )
                                            }
                                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-black/30 hover:bg-black/5 hover:text-black/60 disabled:opacity-50"
                                        >
                                            {showConfirmPassword ? (
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
                                        newPassword ===
                                        confirmPassword && (
                                            <p className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-emerald-500">
                                                <Check
                                                    size={12}
                                                />

                                                Passwords match
                                            </p>
                                        )}
                                </div>

                                {/* Password buttons */}

                                {editingPassword && (
                                    <div className="flex flex-col gap-3 border-t border-black/[0.06] pt-5 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={
                                                cancelPasswordEdit
                                            }
                                            disabled={
                                                passwordSaving
                                            }
                                            className="h-12 rounded-2xl border border-black/[0.07] px-5 text-sm font-black text-black/55 transition hover:bg-black/[0.03] disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={
                                                passwordSaving
                                            }
                                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#173D31] px-6 text-sm font-black text-white shadow-[0_10px_25px_rgba(23,61,49,0.14)] transition hover:-translate-y-0.5 disabled:opacity-50"
                                        >
                                            {passwordSaving ? (
                                                <RefreshCw
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Save
                                                    size={16}
                                                />
                                            )}

                                            {passwordSaving
                                                ? "Updating Password..."
                                                : "Update Password"}
                                        </button>
                                    </div>
                                )}

                                {/* Security warning */}

                                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                                    <div className="flex gap-3">
                                        <ShieldCheck
                                            size={17}
                                            className="mt-0.5 shrink-0 text-amber-600"
                                        />

                                        <p className="text-[11px] leading-5 text-amber-800/65">
                                            Your current password is required before a new password can be saved.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        )}
                    </section>
                </div>
            </div>

            {/* =========================================================
                CONFIRMATION MODAL
            ========================================================= */}

            {confirmationType && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            cancelConfirmation();
                        }
                    }}
                >
                    <div className="w-full max-w-[460px] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.2)]">

                        {/* Header */}

                        <div className="p-6 pb-4 md:p-7 md:pb-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF5F0] text-brand-green">
                                    {confirmationType ===
                                        "profile" ? (
                                        <User
                                            size={21}
                                        />
                                    ) : (
                                        <LockKeyhole
                                            size={21}
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-black text-black">
                                        {confirmationType ===
                                            "profile"
                                            ? "Confirm Profile Changes"
                                            : "Confirm Password Change"}
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-black/40">
                                        {confirmationType ===
                                            "profile"
                                            ? "Please confirm that you want to save these profile changes."
                                            : "Please confirm that you want to change your administrator password."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        cancelConfirmation
                                    }
                                    disabled={
                                        saving ||
                                        passwordSaving
                                    }
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-black/35 transition hover:bg-black/5 hover:text-black disabled:opacity-40"
                                >
                                    <X
                                        size={18}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Content */}

                        {confirmationType ===
                            "profile" ? (
                            <div className="px-6 md:px-7">
                                <div className="rounded-2xl border border-black/[0.06] bg-[#F8FAF9] p-4">

                                    <div className="flex items-center gap-3">
                                        <User
                                            size={16}
                                            className="text-brand-green"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/30">
                                                Full Name
                                            </p>

                                            <p className="mt-1 truncate text-sm font-normal text-black">
                                                {name.trim() ||
                                                    "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="my-4 h-px bg-black/[0.05]" />

                                    <div className="flex items-center gap-3">
                                        <Mail
                                            size={16}
                                            className="text-brand-green"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/30">
                                                Email Address
                                            </p>

                                            <p className="mt-1 truncate text-sm font-normal text-black">
                                                {email.trim() ||
                                                    "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="px-6 md:px-7">
                                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                                    <div className="flex gap-3">
                                        <ShieldCheck
                                            size={18}
                                            className="mt-0.5 shrink-0 text-amber-600"
                                        />

                                        <p className="text-xs leading-5 text-amber-800/70">
                                            Your current password will be replaced with the new password after confirmation. Your password itself will never be displayed here.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}

                        <div className="flex flex-col-reverse gap-3 p-6 md:flex-row md:justify-end md:p-7">
                            <button
                                type="button"
                                onClick={
                                    cancelConfirmation
                                }
                                disabled={
                                    saving ||
                                    passwordSaving
                                }
                                className="h-12 rounded-2xl border border-black/[0.07] px-5 text-sm font-black text-black/55 transition hover:bg-black/[0.03] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmationType ===
                                        "profile"
                                        ? confirmBasicInfoUpdate
                                        : confirmPasswordUpdate
                                }
                                disabled={
                                    saving ||
                                    passwordSaving
                                }
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#173D31] px-6 text-sm font-black text-white shadow-[0_10px_25px_rgba(23,61,49,0.16)] transition hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                {saving ||
                                    passwordSaving ? (
                                    <RefreshCw
                                        size={16}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Check
                                        size={16}
                                    />
                                )}

                                {saving
                                    ? "Saving..."
                                    : passwordSaving
                                        ? "Updating..."
                                        : confirmationType ===
                                            "profile"
                                            ? "Confirm & Save"
                                            : "Confirm Password"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                SUCCESS MODAL
            ========================================================= */}

            {successMessage && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-[390px] rounded-[28px] bg-white p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.2)]">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                            <CheckCircle2
                                size={30}
                                strokeWidth={2.5}
                            />
                        </div>

                        <h3 className="mt-5 text-xl font-black text-black">
                            Successfully Updated
                        </h3>

                        <p className="mx-auto mt-2 max-w-[300px] text-sm leading-6 text-black/45">
                            {successMessage}
                        </p>
                    </div>
                </div>
            )}
        </main>
    );
}