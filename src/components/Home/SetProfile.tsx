import { Card, CardBody } from '@components/UI/Card'
import { MinusCircleIcon, PencilAltIcon, PhotographIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { Mixpanel } from '@lib/mixpanel'
import clsx from 'clsx'
import Link from 'next/link'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from 'src/constants'
import { useAppStore } from 'src/store/app'
import { MISCELLANEOUS } from 'src/tracking'

interface StatusProps {
  finished: boolean
  title: string
}

const Status: FC<StatusProps> = ({ finished, title }) => (
  <div className="flex items-center space-x-1.5">
    {finished ? (
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
    ) : (
      <MinusCircleIcon className="w-5 h-5 text-yellow-500" />
    )}
    <div className={clsx(finished ? 'text-green-500' : 'text-yellow-500')}>{title}</div>
  </div>
)

const SetProfile: FC = () => {
  const { t } = useTranslation('common')
  const profiles = useAppStore((state) => state.profiles)
  const currentProfile = useAppStore((state) => state.currentProfile)
  const hasDefaultProfile = !!profiles.find((o) => o.isDefault)
  const doneSetup = !!currentProfile?.name && !!currentProfile?.bio && !!currentProfile?.picture

  if (!hasDefaultProfile || doneSetup) {
    return null
  }

  return (
    <Card as="aside" className="mb-4 bg-green-50 dark:bg-green-900 !border-green-600">
      <CardBody className="space-y-4 text-green-600">
        <div className="flex items-center space-x-2 font-bold">
          <PhotographIcon className="w-5 h-5" />
          <p>
            {t('Setup profile')} - {APP_NAME}
          </p>
        </div>
        <div className="space-y-1 text-sm leading-[22px]">
          <Status finished={!!currentProfile?.name} title={t('Set profile name')} />
          <Status finished={!!currentProfile?.bio} title={t('Set profile bio')} />
          <Status finished={!!currentProfile?.picture} title={t('Set your avatar')} />
        </div>
        <div className="flex items-center space-x-1.5 text-sm font-bold">
          <PencilAltIcon className="w-4 h-4" />
          <Link href="/settings" onClick={() => Mixpanel.track(MISCELLANEOUS.NAVIGATE_UPDATE_PROFILE)}>
            {t('Update profile')}
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

export default SetProfile
