import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import RecommendedProfiles from '@components/Home/RecommendedProfiles'
import Footer from '@components/Shared/Footer'
import Seo from '@components/utils/Seo'
import { PublicationSortCriteria } from '@generated/types'
import { Mixpanel } from '@lib/mixpanel'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PAGEVIEW } from 'src/tracking'

import Feed from './Feed'
import FeedType from './FeedType'

const Explore: NextPage = () => {
  const {
    query: { type }
  } = useRouter()
  const { t } = useTranslation('common')
  const [feedType, setFeedType] = useState(
    type && ['top_commented', 'top_collected', 'latest'].includes(type as string)
      ? type.toString().toUpperCase()
      : PublicationSortCriteria.TopCommented
  )

  useEffect(() => {
    Mixpanel.track(PAGEVIEW.EXPLORE)
  }, [])

  return (
    <GridLayout>
      <Seo title={t('Explore web')} description={t('Web description')} />
      <GridItemEight className="space-y-5" data-test="explore-feed">
        <FeedType setFeedType={setFeedType} feedType={feedType} />
        <Feed feedType={feedType} />
      </GridItemEight>
      <GridItemFour>
        <RecommendedProfiles />
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default Explore
