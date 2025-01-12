"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { client } from '@/lib/client'
import { Label } from '@radix-ui/react-label'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'

const AccountSettings = ({ discordId: initialDiscordId }: { discordId: string }) => {
    const [discordId, setDiscordId] = useState(initialDiscordId)
    const [showSteps, setShowSteps] = useState(false) // State to toggle steps visibility

    const { mutate, isPending } = useMutation({
        mutationFn: async (discordId: string) => {
            const res = await client.project.setDiscordId.$post({ discordId })
            return await res.json()
        }
    })

    return (
        <>
            <Card className="max-w-xl w-full space-y-4">
                <div>
                    <Label>Discord ID</Label>
                    <Input
                        className="mt-1"
                        value={discordId}
                        onChange={(e) => setDiscordId(e.target.value)}
                        placeholder="Enter your discord ID"
                    />
                </div>
                <p className="mt-2 text-sm/6 text-gray-600">
                    Don't know how to find your Discord ID?{" "}
                    <div
                        className="text-brand-700 hover:text-brand-500 cursor-pointer"
                        onClick={() => setShowSteps(!showSteps)}
                    >
                        Learn how to obtain it here.
                    </div>
                </p>
                <div className="pt-4">
                    <Button onClick={() => mutate(discordId)} disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </Card>

            {showSteps && (
                <Card className="max-w-xl w-full mt-6 p-2 bg-white space-y-0">
                    <div className="flex justify-between items-center mb-2 -mt-2">
                        <Label className="text-lg font-semibold text-gray-800">How to Find Your Discord User ID</Label>
                        <Button variant="destructive" size="sm" onClick={() => setShowSteps(false)} className='px-8'>
                            Close
                        </Button>
                    </div>
                    <div className="p-4 bg-gray-50  text-sm text-gray-700 space-y-2">
                        <p>1. Open Discord and go to User Settings (gear icon).</p>
                        <p>2. Navigate to the "Advanced" tab under App Settings.</p>
                        <p>3. Enable "Developer Mode."</p>
                        <p>4. Right-click on your profile in the member list and select "Copy ID."</p>
                        <p>5. Paste the copied ID into the input field above.</p>
                    </div>
                </Card>
            )}
        </>
    )
}

export default AccountSettings