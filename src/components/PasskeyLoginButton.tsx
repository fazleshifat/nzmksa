import { useState } from 'react';
import { Fingerprint } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

import {
    initializePasskey,
} from '../services/passkey';

interface PasskeyLoginButtonProps {
    identifier: string;
    disabled?: boolean;
    onSuccess?: () => void;
    onError?: (message: string) => void;
}

export default function PasskeyLoginButton({
    identifier,
    disabled = false,
    onSuccess,
    onError,
}: PasskeyLoginButtonProps) {
    const {
        loginWithPasskey,
    } = useAuth();

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    // ==========================================================================
    // PASSKEY LOGIN
    // ==========================================================================

    const handleClick = async () => {
        if (
            disabled ||
            isLoading
        ) {
            return;
        }

        const cleanIdentifier =
            identifier.trim();

        if (!cleanIdentifier) {
            onError?.(
                'Enter your username or ID number first.'
            );

            return;
        }

        setIsLoading(true);

        try {
            // ----------------------------------------------------------------------
            // Make sure Capacitor native WebAuthn/passkey bridge is initialized.
            // ----------------------------------------------------------------------

            try {
                await initializePasskey();
            } catch (error) {
                console.error(
                    'PASSKEY INITIALIZATION ERROR:',
                    error
                );
            }

            // ----------------------------------------------------------------------
            // Start passkey authentication.
            // ----------------------------------------------------------------------

            const success =
                await loginWithPasskey(
                    cleanIdentifier
                );

            if (!success) {
                onError?.(
                    'Passkey authentication failed. Please try again.'
                );

                return;
            }

            /*
             * Login.tsx handles navigation after
             * authentication succeeds.
             */
            onSuccess?.();
        } catch (error) {
            console.error(
                'PASSKEY LOGIN BUTTON ERROR:',
                error
            );

            if (
                error instanceof Error &&
                error.message
            ) {
                onError?.(
                    error.message
                );
            } else {
                onError?.(
                    'Passkey authentication failed. Please try again.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================================================
    // UI
    // ==========================================================================

    return (
        <button
            type="button"
            aria-label="Use passkey"
            title="Use passkey"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                handleClick();
            }}
            disabled={
                disabled ||
                isLoading
            }
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-brand-green transition active:scale-90 active:bg-brand-green/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <div className="relative flex h-7 w-7 items-center justify-center">

                {/* Top-left scanner corner */}
                <span className="absolute left-0 top-0 h-[7px] w-[7px] rounded-tl-[3px] border-l-[2px] border-t-[2px] border-brand-green" />

                {/* Top-right scanner corner */}
                <span className="absolute right-0 top-0 h-[7px] w-[7px] rounded-tr-[3px] border-r-[2px] border-t-[2px] border-brand-green" />

                {/* Bottom-left scanner corner */}
                <span className="absolute bottom-0 left-0 h-[7px] w-[7px] rounded-bl-[3px] border-b-[2px] border-l-[2px] border-brand-green" />

                {/* Bottom-right scanner corner */}
                <span className="absolute bottom-0 right-0 h-[7px] w-[7px] rounded-br-[3px] border-b-[2px] border-r-[2px] border-brand-green" />

                {/* Fingerprint */}
                <Fingerprint
                    size={17}
                    strokeWidth={2.1}
                    className="text-brand-green"
                />

            </div>
        </button>
    );
}