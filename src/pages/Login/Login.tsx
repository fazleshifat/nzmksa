import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft } from '../../components/icons';

export default function Login() {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (login(idNumber, password)) {
      navigate('/home');
    } else {
      setError('Incorrect ID number or password.');
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-[#F4F8F6] px-4 pt-6 pb-4">

      {/* Back */}
      <button
        type="button"
        aria-label="Back"
        onClick={() => navigate('/', { replace: true })}
        className="flex h-11 w-11 items-center justify-center rounded-full text-brand-green active:bg-black/5"
      >
        <ChevronLeft width={26} height={26} />
      </button>

      {/* Logo + Title */}
      <div className="flex flex-col items-center pt-5">
        <div className="flex items-end gap-[3px]">
          <img
            src="/logo1.png"
            alt="Absher"
            className="h-18 w-18"
          />

          <img
            src="/logo2.png"
            alt=""
            className="h-18 w-18"
          />
        </div>

        <p className="mt-10 text-2xl font-bold tracking-tight text-black">
          Log In to Absher
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-9 flex flex-1 flex-col gap-4"
      >

        {/* Username / ID */}
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-black/60">
            Username or ID Number
          </label>

          <input
            value={idNumber}
            onChange={(e) => {
              setIdNumber(e.target.value);
              setError('');
            }}
            inputMode="numeric"
            autoComplete="username"
            placeholder="Enter Username or ID Number"
            className="h-14 w-full rounded-2xl bg-white px-4 text-[15px] text-black outline-none ring-brand-green/40 placeholder:text-black/35 focus:ring-2"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-black/60">
            Password
          </label>

          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            type="password"
            autoComplete="current-password"
            placeholder="Enter Password"
            className="h-14 w-full rounded-2xl bg-white px-4 text-[15px] text-black outline-none ring-brand-green/40 placeholder:text-black/35 focus:ring-2"
          />
        </div>

        {/* Keep Logged In */}
        <button
          type="button"
          onClick={() => setKeepLoggedIn((v) => !v)}
          className="flex min-h-11 items-center gap-2.5 text-left active:opacity-70"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${keepLoggedIn
              ? 'border-brand-green bg-brand-green'
              : 'border-black/25 bg-transparent'
              }`}
          >
            {keepLoggedIn && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
            )}
          </span>

          <span className="text-[14px] font-medium text-black/70">
            Keep me logged in
          </span>
        </button>
        
        {/* Error */}
        {error && (
          <p className="text-center text-sm text-red-500">
            {error}
          </p>
        )}

        {/* Bottom Actions */}
        <div className="mt-auto pb-1 pt-8">
          <button
            type="submit"
            className="h-14 w-full rounded-full bg-green-800/70 text-[16px] font-bold text-white shadow-sm active:scale-[0.99] active:opacity-80"
          >
            Log In
          </button>

          <button
            type="button"
            className="mt-4 flex min-h-11 w-full items-center justify-center text-[14px] font-semibold text-brand-green active:opacity-60"
          >
            Forgot Password
          </button>
        </div>

      </form>
    </div>
  );
}