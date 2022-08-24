import { useQuery } from '@apollo/client'
import { CURRENT_PROFILE_QUERY } from '@components/Layout'
import { FC } from 'react'

interface Props {
  address: string
  callback?: Function
}

const QueryHandle: FC<Props> = ({ address, callback }) => {
  useQuery(CURRENT_PROFILE_QUERY, {
    variables: {
      ownedBy: address
    },
    onCompleted: (data) => {
      if (!callback) {
        return
      }
      callback(data)
    }
  })

  return <div />
}

export default QueryHandle
