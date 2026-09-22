import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    IoFingerPrint,
    IoPersonOutline,
    IoSettingsOutline,
} from 'react-icons/io5';
import { VscBell } from 'react-icons/vsc';
import { BsGrid } from 'react-icons/bs';
import { SiGoogledocs } from 'react-icons/si';

export default function Welcome() {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }
    return (
        <div className="flex min-h-[100dvh] w-full flex-col bg-[#F5F7F6] text-black">

            {/* HERO */}
            <section className="relative overflow-hidden bg-[#FFF8E9] px-5 pb-8 pt-3">

                {/* Top Icons */}
                <div className="flex justify-end gap-2">

                    <button
                        type="button"
                        aria-label="Settings"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-[#197653] active:bg-black/5"
                    >
                        <IoSettingsOutline size={22} />
                    </button>

                    <button
                        type="button"
                        aria-label="Notifications"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-[#197653] active:bg-black/5"
                    >
                        <VscBell size={22} />
                    </button>

                </div>

                {/* Logo */}
                <div className="mt-6 flex items-center justify-center">
                    <div className="flex items-end gap-[3px]">
                        <img
                            src="/logo1.png"
                            alt="Absher"
                            className="h-[72px] w-[72px] object-contain"
                        />

                        <img
                            src="/logo2.png"
                            alt=""
                            className="h-[72px] w-[72px] object-contain"
                        />
                    </div>
                </div>

                {/* Title */}
                <h1 className="mt-8 text-center text-xl font-bold tracking-tight">
                    Absher E-Services 24/7
                </h1>

                {/* Login */}
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="mt-5 h-14 w-full rounded-full bg-green-800 px-5 text-[16px] font-bold text-white shadow-sm active:scale-[0.99] active:opacity-90"
                >
                    Log In
                </button>

            </section>

            {/* PUBLIC SERVICES */}
            <section className="px-4 pb-5 pt-6">

                {/* Section Header */}
                <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-xl font-bold tracking-tight">
                        Public Services
                    </h2>

                    <button
                        type="button"
                        className="flex min-h-11 items-center px-2 text-sm font-bold text-[#247858] active:opacity-60"
                    >
                        See All
                    </button>

                </div>

                {/* Services */}
                <div className="grid grid-cols-2 gap-4">

                    {/* Manage Digital Identity */}
                    <button
                        type="button"
                        className="flex min-h-[145px] flex-col items-start justify-between rounded-[22px] bg-white p-4 text-left shadow-sm active:scale-[0.98] active:bg-black/[0.02]"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#287E64]/10 text-[#287E64]">
                            <IoPersonOutline size={27} />
                        </span>

                        <span className="text-[13px] font-bold leading-[1.25] text-green-900">
                            Manage Digital
                            <br />
                            Identity
                        </span>
                    </button>

                    {/* Digital Documents */}
                    <button
                        type="button"
                        className="flex min-h-[145px] flex-col items-start justify-between rounded-[22px] bg-white p-4 text-left shadow-sm active:scale-[0.98] active:bg-black/[0.02]"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#287E64]/10 text-[#287E64]">
                            <BsGrid size={26} />
                        </span>

                        <span className="text-[13px] font-bold leading-[1.25] text-green-900">
                            View Digital
                            <br />
                            Documents
                        </span>
                    </button>

                    {/* Authentication */}
                    <button
                        type="button"
                        className="flex min-h-[145px] flex-col items-start justify-between rounded-[22px] bg-white p-4 text-left shadow-sm active:scale-[0.98] active:bg-black/[0.02]"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#287E64]/10 text-[#287E64]">
                            <IoFingerPrint size={27} />
                        </span>

                        <span className="text-[13px] font-bold leading-[1.25] text-green-900">
                            Authentication
                            <br />
                            Services
                        </span>
                    </button>

                    {/* My Documents */}
                    <button
                        type="button"
                        className="flex min-h-[145px] flex-col items-start justify-between rounded-[22px] bg-white p-4 text-left shadow-sm active:scale-[0.98] active:bg-black/[0.02]"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#287E64]/10 text-[#287E64]">
                            <SiGoogledocs size={25} />
                        </span>

                        <span className="text-[13px] font-bold leading-[1.25] text-green-900">
                            My Documents
                        </span>
                    </button>

                </div>
            </section>

            {/* FOOTER */}
            <footer className="mt-auto px-4 pb-6 pt-4 text-center">

                <p className="text-[12px] leading-5 text-black/45">
                    Powered by{' '}
                    <span className="text-black/55">
                        National Information Center
                    </span>
                </p>

                <p className="text-[12px] leading-5 text-black/45">
                    All rights are reserved by the Ministry of Interior
                </p>

            </footer>

        </div>
    );
}