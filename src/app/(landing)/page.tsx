import React from 'react'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import Heading from '@/components/heading'
import { Check } from 'lucide-react'
import CtaButton from '@/components/cta-button'
import { MockDiscordUI } from '@/components/mock-discord'
import { AnimatedList, AnimatedListItem } from '@/components/ui/animated-list'
import DiscordMessage from '@/components/discord-message'
import { subscribe } from 'diagnostics_channel'

const page = () => {
  return (
    <>
      <section className='relative py-24 sm:py-32 bg-brand-25'>
        <MaxWidthWrapper>
          <div className='relative mx-auto text-center flex flex-col items-center gap-10 '>
            <div>
              <Heading>
                <span>Real-Time SaaS Insights,</span>
                <br />
                <span className='relative bg-gradient-to-r from-brand-700 to-brand-800 text-transparent bg-clip-text'>Delivered to Your Discord</span>
              </Heading>
            </div>

            <p className='text-base/7 text-gray-600 max-w-prose text-center text-pretty'>
              Pegion is the easiest way to moniter your SaaS. Get instant notifications for
              <span className='font-semibold text-gray-700'> sales, new users, or any other event </span>
              sent directly to your discord
            </p>

            <ul className='space-y-2 text-base/7 text-gray-600 text-left flex flex-col sm:items-start'>
              {["Real-Time Discord alerts for critical events", "Buy once, use forever", "Track sales, new users, or any other event"]
                .map((item, index) => (
                  <li key={index} className='flex gap-1.5 items-center text-left'>
                    <Check className='size-5 shrink-0 text-brand-700' />
                    {item}
                  </li>
                ))}
            </ul>

            {/* Cta button */}
            <div className='w-full max-w-80'>
              <CtaButton href="/sign-up" className='relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                Start For Free Today
              </CtaButton>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Discord section */}
      <section className=' relative bg-brand-25 pb-4'>
        <div className='absolute inset-x-0 bottom-24 top-24 bg-brand-700' />
        <div className='relative mx-auto'>
          <MaxWidthWrapper className='relative'>
            <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
              <MockDiscordUI>
                <AnimatedList>
                  <DiscordMessage avatarSrc='/brand-asset-profile-picture.png' avatarAlt='Peekegion avatar' username='PeekPegion'
                    timestamp='Today at 4:34Am' badgeText='Time to peek' badgeColor='#43b581' title='🤖 New user peeked'
                    content={{
                      name: 'Tushar bihari',
                      email: "ogbihari@bihar.in"
                    }} />
                  <DiscordMessage avatarSrc='/brand-asset-profile-picture.png' avatarAlt='Peekegion avatar' username='PeekPegion'
                    timestamp='Today at 9:34Am' badgeText='New Peek' badgeColor='#faa61a' title='🌟 New milestone'
                    content={{
                      users: '500',
                      subscribed: '200',
                      membership: "Yearly",
                    }} />
                  <DiscordMessage avatarSrc='/brand-asset-profile-picture.png' avatarAlt='Peekegion avatar' username='PeekPegion'
                    timestamp='Today at 11:34Am' badgeText='Need fix' badgeColor='#5865f2' title='⚙️ Critical issue'
                    content={{
                      issue: 'DDoS attack',
                      Time: 'Today at 11:32AM',
                      Rating: '9'
                    }} />
                </AnimatedList>
              </MockDiscordUI>
            </div>
          </MaxWidthWrapper>
        </div>

      </section>

      {/* Bento grid 20 Dec*/}

      <section></section>
      <section></section>

    </>
  )
}

export default page