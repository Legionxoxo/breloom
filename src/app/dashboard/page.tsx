
import CreateEventCategoryModal from '@/components/create-event-category-modal';
import DashboardPage from '@/components/dashboard-page';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { createCheckoutSession } from '@/lib/stripe';
import { currentUser } from '@clerk/nextjs/server';
import { PlusIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { DashboardPageContent } from './dashboard-page-content';
import PaymentSuccessModal from '@/components/payment-success-modal';

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}
const Dashboard = async ({ searchParams }: PageProps) => {
    const auth = await currentUser();

    if (!auth) {
        redirect('/sign-in')
    }

    const user = await db.user.findUnique({
        where: { externalId: auth.id },
    })

    if (!user) {
        redirect('/welcome')
    }

    const intent = searchParams.intent

    if (intent == "upgrade") {
        const session = await createCheckoutSession({
            userEmail: user.email,
            userId: user.id
        })

        if (session.url) redirect(session.url)
    }

    const success = searchParams.success
    return (
        <>{success ? <PaymentSuccessModal /> : null}
            <DashboardPage cta={
                <CreateEventCategoryModal>
                    <Button>
                        <PlusIcon className='size-4 mr-2' />
                        Add Category
                    </Button>
                </CreateEventCategoryModal>

            } title='Dashboard'>
                <DashboardPageContent />
            </DashboardPage></>

    )
}

export default Dashboard