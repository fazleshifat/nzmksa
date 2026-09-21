import SubPageHeader from '../../components/SubPageHeader';
import EmptyState from '../../components/EmptyState';
import { DocumentIcon } from '../../components/icons';

export default function DrivingLicense() {
    return (
        <div className="flex min-h-screen flex-col bg-black">
            <SubPageHeader title="" />

            <div className="flex flex-1 items-center justify-center px-4">
                <EmptyState
                    icon={<DocumentIcon width={64} height={64} />}
                    title="No Driving License"
                    description="Once you have a Driving License, the details will display here."
                />
            </div>
        </div>
    );
}