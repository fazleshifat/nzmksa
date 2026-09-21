import SubPageHeader from '../../components/SubPageHeader';
import EmptyState from '../../components/EmptyState';
import { DocumentIcon } from '../../components/icons';

export default function Visa() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SubPageHeader title="" />

      <div className="flex flex-1 items-center justify-center px-4">
        <EmptyState
          icon={<DocumentIcon width={64} height={64} />}
          title="No Visa"
          description="Once you have a Visa, the details will display here."
        />
      </div>
    </div>
  );
}