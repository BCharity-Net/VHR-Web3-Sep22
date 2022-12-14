import { BCharityPublication } from '@generated/bcharitytypes'
import clsx from 'clsx'
import React, { FC } from 'react'
import { useAppStore } from 'src/store/app'

import Collect from './Collect'
import Comment from './Comment'
import Like from './Like'
import PublicationMenu from './Menu'
import Mirror from './Mirror'

interface Props {
  publication: BCharityPublication
  isFullPublication?: boolean
}

const PublicationActions: FC<Props> = ({ publication, isFullPublication = false }) => {
  const currentProfile = useAppStore((state) => state.currentProfile)
  const publicationType = publication?.metadata?.attributes[0]?.value
  const collectModuleType = publication?.collectModule.__typename
  const canMirror = currentProfile ? publication?.canMirror?.result : true

  return (
    <span
      onClick={(event) => {
        event.stopPropagation()
      }}
      className={clsx(
        { 'justify-between': isFullPublication },
        'flex gap-6 items-center pt-3 -ml-2 text-gray-500 sm:gap-8'
      )}
    >
      <Comment publication={publication} isFullPublication={isFullPublication} />
      {canMirror && <Mirror publication={publication} isFullPublication={isFullPublication} />}
      <Like publication={publication} isFullPublication={isFullPublication} />
      {collectModuleType !== 'RevertCollectModuleSettings' &&
        collectModuleType !== 'UnknownCollectModuleSettings' && // TODO: remove this check when we have a better way to handle unknown collect modules
        publicationType !== 'fundraise' &&
        publicationType !== 'fundraise-comment' &&
        publicationType !== 'hours' && (
          <Collect publication={publication} isFullPublication={isFullPublication} />
        )}
      <PublicationMenu publication={publication} isFullPublication={isFullPublication} />
    </span>
  )
}

export default PublicationActions
