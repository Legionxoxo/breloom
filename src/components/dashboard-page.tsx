"use client"
import React, { ReactNode } from 'react'
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import Heading from './heading';
import { useRouter } from 'next/navigation';
interface DashboardPageProps {
    title: string;
    children?: ReactNode;
    hideBackButton?: boolean;
    cta?: ReactNode
}
const DashboardPage = ({
    title,
    children,
    cta,
    hideBackButton
}: DashboardPageProps) => {
    const router = useRouter();
    return (
        <section className='flex-1 h-full w-full flex-col'>
            <div className=' p-6 sm:p-8 flex justify-between border-b border-gray-200'>
                <div className=' flex max-md:flex-col flex-row items-start gap-y-6'>
                    <div className='flex items-center gap-8'>
                        {hideBackButton ? null : <Button onClick={() => router.push("/dashboard")} className='w-fit bg-white' variant='outline'>
                            <ArrowLeft className='size-4' />
                        </Button>
                        }
                        <Heading>{title}</Heading>
                    </div>

                    {cta ? <div className='max-md:ml-20 md:ml-5 md:pt-1'>{cta}</div> : null}
                </div>
            </div>
            <div className='flex-1 p-6 sm:p-8 flex flex-col overflow-auto'>
                {children}
            </div>
        </section>
    )
}

export default DashboardPage