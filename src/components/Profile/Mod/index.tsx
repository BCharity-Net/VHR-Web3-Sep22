import { Card, CardBody } from '@components/UI/Card'
import { Profile } from '@generated/types'
import { AtSymbolIcon, CashIcon, HashtagIcon } from '@heroicons/react/outline'
import formatAddress from '@lib/formatAddress'
import getAttribute from '@lib/getAttribute'
import hasPrideLogo from '@lib/hasPrideLogo'
import React, { FC, ReactNode } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

interface Props {
  profile: Profile
}

const ProfileMod: FC<Props> = ({ profile }) => {
  const { t } = useTranslation('common')
  const MetaDetails = ({
    children,
    value,
    icon
  }: {
    children: ReactNode
    value: string
    icon: ReactNode
  }) => (
    <CopyToClipboard
      text={value}
      onCopy={() => {
        toast.success(t('Copied to clipboard!'))
      }}
    >
      <div className="flex gap-2 items-center font-bold cursor-pointer">
        {icon}
        <div>{children}</div>
      </div>
    </CopyToClipboard>
  )

  return (
    <Card className="mt-5 border-yellow-400 !bg-yellow-300 !bg-opacity-20">
      <CardBody>
        <div className="text-lg font-bold">{t('Details')}</div>
        <div className="mt-3 space-y-1.5">
          {getAttribute(profile?.attributes, 'app') === 'BCharity' && (
            <MetaDetails
              icon={
                <img
                  className="w-4 h-4"
                  height={16}
                  width={16}
                  src={hasPrideLogo(profile) ? '/pride.svg' : '/logo.jpg'}
                  alt="Logo"
                />
              }
              value={profile?.handle}
            >
              {t('BCharity account')}
            </MetaDetails>
          )}
          <MetaDetails icon={<HashtagIcon className="w-4 h-4 text-gray-500" />} value={profile?.id}>
            {profile?.id}
          </MetaDetails>
          <MetaDetails icon={<CashIcon className="w-4 h-4 text-gray-500" />} value={profile?.ownedBy}>
            {formatAddress(profile?.ownedBy)}
          </MetaDetails>
          <MetaDetails icon={<AtSymbolIcon className="w-4 h-4 text-gray-500" />} value={profile?.handle}>
            {profile?.handle}
          </MetaDetails>
        </div>
      </CardBody>
    </Card>
  )
}

export default ProfileMod
