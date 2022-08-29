import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
import result from '@generated/types'
import { cursorBasedPagination } from '@lib/cursorBasedPagination'
import { publicationKeyFields } from '@lib/keyFields'
import parseJwt from '@lib/parseJwt'
import axios from 'axios'

import { API_URL, ERROR_MESSAGE } from './constants'

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

const httpLink = new HttpLink({
  uri: API_URL,
  fetchOptions: 'no-cors',
  fetch
})

// RetryLink is a link that retries requests based on the status code returned.
const retryLink = new RetryLink({
  attempts: { max: 3 }
})

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken === 'undefined' || !accessToken) {
    localStorage.getItem('accessToken')
    localStorage.getItem('refreshToken')

    return forward(operation)
  }

  operation.setContext({
    headers: {
      'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
    }
  })

  const { exp }: { exp: number } = parseJwt(accessToken)

  if (Date.now() >= exp * 1000) {
    axios(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        operationName: 'Refresh',
        query: REFRESH_AUTHENTICATION_MUTATION,
        variables: {
          request: { refreshToken: localStorage.getItem('refreshToken') }
        }
      })
    })
      .then(({ data }) => {
        const refresh = data?.data?.refresh
        operation.setContext({
          headers: {
            'x-access-token': accessToken ? `Bearer ${refresh?.accessToken}` : ''
          }
        })
        localStorage.setItem('accessToken', refresh?.accessToken)
        localStorage.setItem('refreshToken', refresh?.refreshToken)
      })
      .catch(() => console.log(ERROR_MESSAGE))
  }

  return forward(operation)
})

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    Post: { keyFields: publicationKeyFields },
    Comment: { keyFields: publicationKeyFields },
    Mirror: { keyFields: publicationKeyFields },
    Query: {
      fields: {
        timeline: cursorBasedPagination(['request', ['profileId']]),
        explorePublications: cursorBasedPagination(['request', ['sortCriteria']]),
        publications: cursorBasedPagination(['request', ['profileId', 'commentsOf', 'publicationTypes']]),
        nfts: cursorBasedPagination(['request', ['ownerAddress', 'chainIds']]),
        notifications: cursorBasedPagination(['request', ['profileId']]),
        followers: cursorBasedPagination(['request', ['profileId']]),
        following: cursorBasedPagination(['request', ['address']]),
        search: cursorBasedPagination(['request', ['query', 'type']]),
        profiles: cursorBasedPagination([
          'request',
          ['profileIds', 'ownedBy', 'handles', 'whoMirroredPublicationId']
        ]),
        whoCollectedPublication: cursorBasedPagination(['request', ['publicationId']]),
        whoReactedPublication: cursorBasedPagination(['request', ['publicationId']]),
        mutualFollowersProfiles: cursorBasedPagination(['request', ['viewingProfileId', 'yourProfileId']])
      }
    }
  }
})

const client = new ApolloClient({
  link: from([retryLink, authLink, httpLink]),
  cache
})

export default client
