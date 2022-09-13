import { gql, useQuery } from '@apollo/client'
import QueuedPublication from '@components/Publication/QueuedPublication'
import SinglePublication from '@components/Publication/SinglePublication'
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer'
import { Card } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { BCharityPublication } from '@generated/bcharitytypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { CollectionIcon } from '@heroicons/react/outline'
import { Mixpanel } from '@lib/mixpanel'
import React, { FC } from 'react'
import { useInView } from 'react-cool-inview'
import { useTranslation } from 'react-i18next'
import { useAppStore } from 'src/store/app'
import { usePublicationPersistStore } from 'src/store/publication'
import { PAGINATION } from 'src/tracking'

import ReferenceAlert from '../Shared/ReferenceAlert'
import NewComment from './New'

const COMMENT_FEED_QUERY = gql`
  query CommentFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${CommentFields}
`

interface Props {
  publication: BCharityPublication
  type?: 'comment' | 'group post'
  onlyFollowers?: boolean
  isFollowing?: boolean
}

const Feed: FC<Props> = ({ publication, type = 'comment', onlyFollowers = false, isFollowing = true }) => {
  const { t } = useTranslation('common')
  const pubId = publication?.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id
  const currentProfile = useAppStore((state) => state.currentProfile)
  const txnQueue = usePublicationPersistStore((state) => state.txnQueue)

  const { data, loading, error, fetchMore } = useQuery(COMMENT_FEED_QUERY, {
    variables: {
      request: { commentsOf: pubId, limit: 10 },
      reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
      profileId: currentProfile?.id ?? null
    },
    skip: !pubId
  })

  const pageInfo = data?.publications?.pageInfo
  const { observe } = useInView({
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            commentsOf: pubId,
            cursor: pageInfo?.next,
            limit: 10
          },
          reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
          profileId: currentProfile?.id ?? null
        }
      })
      Mixpanel.track(type === 'comment' ? PAGINATION.COMMENT_FEED : PAGINATION.GROUP_FEED)
    }
  })

  const queuedCount = txnQueue.filter((o) => o.type === 'NEW_COMMENT').length
  const totalComments = data?.publications?.items?.length + queuedCount

  return (
    <>
      {currentProfile ? (
        isFollowing || !onlyFollowers ? (
          <NewComment publication={publication} type={type} />
        ) : (
          <ReferenceAlert
            handle={publication?.profile?.handle}
            isSuperFollow={publication?.profile?.followModule?.__typename === 'FeeFollowModuleSettings'}
            action="comment"
          />
        )
      ) : null}
      {loading && <PublicationsShimmer />}
      {totalComments === 0 && (
        <EmptyState
          message={<span>{t('First comment')}</span>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load comment feed" error={error} />
      {!error && !loading && totalComments !== 0 && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {txnQueue.map(
              (txn) =>
                txn?.type === 'NEW_COMMENT' &&
                txn?.parent === publication?.id && (
                  <div key={txn.id}>
                    <QueuedPublication txn={txn} />
                  </div>
                )
            )}
            {data?.publications?.items?.map((post: BCharityPublication, index: number) => (
              <SinglePublication key={`${pubId}_${index}`} publication={post} showType={false} />
            ))}
          </Card>
          {pageInfo?.next && data?.publications?.items.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Feed
