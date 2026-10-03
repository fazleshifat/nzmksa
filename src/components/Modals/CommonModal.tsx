import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

export type CommonModalVariant =
    | 'error'
    | 'success'
    | 'warning'
    | 'info'
    | 'confirm';

interface CommonModalProps {
    open: boolean;

    title: string;
    message?: string;

    variant?: CommonModalVariant;

    icon?: ReactNode;

    // Dynamic colors
    iconBgClassName?: string;
    iconClassName?: string;
    titleClassName?: string;
    messageClassName?: string;
    modalClassName?: string;
    backdropClassName?: string;

    // Normal button
    buttonText?: string;
    buttonClassName?: string;

    // Confirmation mode
    confirmation?: boolean;
    confirmText?: string;
    confirmClassName?: string;
    cancelText?: string;
    cancelClassName?: string;

    onClose: () => void;
    onConfirm?: () => void;

    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
}

export default function CommonModal({
    open,

    title,
    message,

    variant = 'info',

    icon,

    iconBgClassName,
    iconClassName,
    titleClassName,
    messageClassName,
    modalClassName,

    backdropClassName = 'bg-black/45 backdrop-blur-md',

    buttonText = 'Okay',
    buttonClassName,

    confirmation = false,
    confirmText = 'Yes',
    confirmClassName,
    cancelText = 'Cancel',
    cancelClassName,

    onClose,
    onConfirm,

    closeOnBackdrop = true,
    closeOnEscape = true,
}: CommonModalProps) {
    // ========================================================================
    // ESCAPE KEY
    // ========================================================================

    useEffect(() => {
        if (!open || !closeOnEscape) {
            return;
        }

        const handleKeyDown = (
            event: KeyboardEvent
        ) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener(
            'keydown',
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown
            );
        };
    }, [
        open,
        closeOnEscape,
        onClose,
    ]);

    // ========================================================================
    // BODY SCROLL LOCK
    // ========================================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [open]);

    if (!open) {
        return null;
    }

    // ========================================================================
    // DEFAULT VARIANT COLORS
    // ========================================================================

    const variantStyles: Record<
        CommonModalVariant,
        {
            iconBg: string;
            iconColor: string;
            button: string;
        }
    > = {
        error: {
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
            button: 'bg-red-500 hover:bg-red-600',
        },

        success: {
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            button: 'bg-emerald-600 hover:bg-emerald-700',
        },

        warning: {
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-500',
            button: 'bg-amber-500 hover:bg-amber-600',
        },

        info: {
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
            button: 'bg-blue-600 hover:bg-blue-700',
        },

        confirm: {
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
            button: 'bg-red-500 hover:bg-red-600',
        },
    };

    const currentStyle =
        variantStyles[variant];

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div
            className={`fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center px-5 py-6 ${backdropClassName}`}
            onMouseDown={(event) => {
                if (
                    closeOnBackdrop &&
                    event.target === event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                role={
                    confirmation
                        ? 'alertdialog'
                        : 'dialog'
                }
                aria-modal="true"
                className={`w-full max-w-md animate-[commonModalIn_0.2s_ease-out] rounded-[2rem] bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:p-8 ${modalClassName || ''}`}
                onMouseDown={(event) => {
                    event.stopPropagation();
                }}
            >
                {/* ========================================================== */}
                {/* TOP */}
                {/* ========================================================== */}

                <div className="flex items-start justify-between gap-4">

                    {/* ICON */}
                    <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                            iconBgClassName ||
                            currentStyle.iconBg
                        }`}
                    >
                        <div
                            className={
                                iconClassName ||
                                currentStyle.iconColor
                            }
                        >
                            {icon || (
                                <span className="text-2xl font-black">
                                    !
                                </span>
                            )}
                        </div>
                    </div>

                    {/* CLOSE */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/[0.04] text-black/35 transition hover:bg-black/[0.08] hover:text-black/70 active:scale-95"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ========================================================== */}
                {/* CONTENT */}
                {/* ========================================================== */}

                <div className="mt-5">

                    <h2
                        className={
                            titleClassName ||
                            'text-xl font-black tracking-tight text-black sm:text-2xl'
                        }
                    >
                        {title}
                    </h2>

                    {message && (
                        <p
                            className={
                                messageClassName ||
                                'mt-2 text-sm font-medium leading-6 text-black/50'
                            }
                        >
                            {message}
                        </p>
                    )}
                </div>

                {/* ========================================================== */}
                {/* BUTTONS */}
                {/* ========================================================== */}

                {confirmation ? (
                    <div className="mt-7 grid grid-cols-2 gap-3">

                        {/* CONFIRM / DELETE — LEFT */}
                        <button
                            type="button"
                            onClick={() => {
                                onConfirm?.();
                            }}
                            className={`h-12 rounded-2xl px-4 text-sm font-black text-white shadow-sm transition active:scale-[0.98] ${
                                confirmClassName ||
                                currentStyle.button
                            }`}
                        >
                            {confirmText}
                        </button>

                        {/* CANCEL — RIGHT */}
                        <button
                            type="button"
                            onClick={onClose}
                            className={`h-12 rounded-2xl bg-black/[0.05] px-4 text-sm font-black text-black/55 transition hover:bg-black/[0.08] active:scale-[0.98] ${
                                cancelClassName || ''
                            }`}
                        >
                            {cancelText}
                        </button>

                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={onClose}
                        className={`mt-7 h-12 w-full rounded-2xl px-5 text-sm font-black text-white shadow-sm transition active:scale-[0.98] ${
                            buttonClassName ||
                            currentStyle.button
                        }`}
                    >
                        {buttonText}
                    </button>
                )}
            </div>

            <style>{`
                @keyframes commonModalIn {
                    from {
                        opacity: 0;
                        transform: scale(0.94) translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}