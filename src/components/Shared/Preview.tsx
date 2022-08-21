import { Tooltip } from '@components/UI/Tooltip'
import { EyeIcon } from '@heroicons/react/outline'
import { Mixpanel } from '@lib/mixpanel'
import { motion } from 'framer-motion'
import { Dispatch, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { PUBLICATION } from 'src/tracking'

interface Props {
  preview: boolean
  setPreview: Dispatch<boolean>
}

const Preview: FC<Props> = ({ preview, setPreview }) => {
  const { t } = useTranslation('common')
  return (
    <div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => {
          setPreview(!preview)
          Mixpanel.track(PUBLICATION.NEW.MARKDOWN_PREVIEW)
        }}
        aria-label={t('Choose attachment')}
      >
        <Tooltip placement="top" content="Preview">
          <EyeIcon className="w-5 h-5 text-brand" />
        </Tooltip>
      </motion.button>
    </div>
  )
}

export default Preview
