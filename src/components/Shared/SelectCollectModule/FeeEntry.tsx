import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Erc20 } from '@generated/types'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { defaultModuleData } from '@lib/getModule'
import { Mixpanel } from '@lib/mixpanel'
import { Dispatch, FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_COLLECT_TOKEN } from 'src/constants'
import { useAppStore } from 'src/store/app'
import { useCollectModuleStore } from 'src/store/collectmodule'
import { PUBLICATION } from 'src/tracking'
import { object, string } from 'zod'

const feeDataSchema = object({
  collectLimit: string().min(1, { message: 'Invalid value' }).max(20, { message: 'Invalid value' }),
  value: string().min(1, { message: 'Invalid value' }).max(20, { message: 'Invalid value' }),
  referralFee: string()
    .min(1, { message: 'Invalid Referral fee' })
    .max(20, { message: 'Invalid Referral fee' })
})

interface Props {
  enabledModuleCurrencies: Erc20[]
  setShowFeeEntry: Dispatch<boolean>
  setShowModal: Dispatch<boolean>
}

const FeeEntry: FC<Props> = ({ enabledModuleCurrencies, setShowFeeEntry, setShowModal }) => {
  const { t } = useTranslation('common')
  const currentProfile = useAppStore((state) => state.currentProfile)
  const selectedCollectModule = useCollectModuleStore((state) => state.selectedCollectModule)
  const setSelectedCollectModule = useCollectModuleStore((state) => state.setSelectedCollectModule)
  const feeData = useCollectModuleStore((state) => state.feeData)
  const setFeeData = useCollectModuleStore((state) => state.setFeeData)
  const [followerOnly, setFollowerOnly] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_COLLECT_TOKEN)
  const form = useZodForm({
    schema: feeDataSchema,
    defaultValues: {
      value: feeData.amount.value,
      referralFee: feeData.referralFee.toString()
    }
  })

  const showCollect =
    selectedCollectModule.moduleName === 'LimitedFeeCollectModule' ||
    selectedCollectModule.moduleName === 'LimitedTimedFeeCollectModule'

  return (
    <div className="space-y-5">
      <button
        type="button"
        className="flex items-center space-x-1.5 font-bold text-gray-500"
        onClick={() => {
          setSelectedCollectModule(defaultModuleData)
          setShowFeeEntry(false)
          Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.BACK_FEE_ENTRY)
        }}
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <div>Back</div>
      </button>
      <Form form={form} className="space-y-4" onSubmit={({}) => {}}>
        <div>
          <div className="label">{t('Select currency')}</div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {enabledModuleCurrencies.map((currency: Erc20) => (
              <option key={currency.address} value={currency.address}>
                {currency.name}
              </option>
            ))}
          </select>
        </div>
        {showCollect && (
          <Input
            label="Collect Limit"
            type="number"
            placeholder="5"
            min="0"
            max="100000"
            {...form.register('collectLimit')}
          />
        )}
        <Input
          label="Amount"
          type="number"
          placeholder="0.5"
          min="0"
          max="100000"
          {...form.register('value')}
        />
        <Input
          label="Referral Fee"
          helper={<span>{t('Mirror description')}</span>}
          type="number"
          placeholder="5"
          min="0"
          max="100"
          iconRight={<span>%</span>}
          {...form.register('referralFee')}
        />
        <div>
          <div className="label">{t('Permission')}</div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setFollowerOnly(e.target.value === 'true')}
          >
            <option value="false">{t('Everyone')}</option>
            <option value="true">{t('Followers only')}</option>
          </select>
        </div>
        <Button
          type="button"
          disabled={
            !form.watch('value') ||
            parseFloat(form.watch('value')) <= 0 ||
            (showCollect ? !form.watch('collectLimit') || form.watch('collectLimit') == '0' : false)
          }
          onClick={() => {
            setFeeData({
              amount: {
                currency: selectedCurrency,
                value: form.getValues('value')
              },
              collectLimit: form.getValues('collectLimit'),
              recipient: currentProfile?.ownedBy,
              referralFee: parseFloat(form.getValues('referralFee')),
              followerOnly: followerOnly
            })
            setShowModal(false)
          }}
        >
          {t('Save')}
        </Button>
      </Form>
    </div>
  )
}

export default FeeEntry
