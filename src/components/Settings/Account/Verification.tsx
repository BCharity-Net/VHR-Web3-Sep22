import { Card, CardBody } from '@components/UI/Card'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import isVerified from '@lib/isVerified'
import { Mixpanel } from '@lib/mixpanel'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from 'src/store/app'
import { SETTINGS } from 'src/tracking'

const Verification: FC = () => {
  const { t } = useTranslation('common')
  const currentProfile = useAppStore((state) => state.currentProfile)

  return (
    <Card>
      <CardBody className="space-y-2 linkify">
        <div className="text-lg font-bold">{t('Verified title')}</div>
        {isVerified(currentProfile?.id) ? (
          <div className="flex items-center space-x-1.5">
            <span>{t('Is verified2')}</span>
            <BadgeCheckIcon className="w-5 h-5 text-brand" />
          </div>
        ) : (
          <div>
            {t('Is verified1')}{' '}
            <a
              href="https://tally.so/r/wgDajK"
              onClick={() => {
                Mixpanel.track(SETTINGS.ACCOUNT.OPEN_VERIFICATION)
              }}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t('Request verification')}
            </a>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default Verification
