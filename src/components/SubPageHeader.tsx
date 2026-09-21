import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CloseIcon } from './icons';

export default function SubPageHeader({ title, variant = 'back' }: { title: string; variant?: 'back' | 'close' }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-4 px-4 pb-3 pt-4">
      <button aria-label={variant === 'back' ? 'Back' : 'Close'} onClick={() => navigate(-1)} className="text-brand-mint">
        {variant === 'back' ? <ChevronLeft width={26} height={26} /> : <CloseIcon width={24} height={24} />}
      </button>
      <p className="text-[19px] font-bold text-white">{title}</p>
    </div>
  );
}
