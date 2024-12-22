
import { db } from '@/db';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const Dashboard = async () => {
    const auth = await currentUser();

    if (!auth) {
        redirect('/sign-in')
    }

    const user = await db.user.findUnique({
        where: { externalId: auth.id },
    })

    if (!user) {
        redirect('/sign-in')
    }

    return (
        <div>Dashboard</div>
    )
}

export default Dashboard