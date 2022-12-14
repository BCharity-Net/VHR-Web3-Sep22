import getEnvConfig from '@lib/getEnvConfig'
import { chain } from 'wagmi'

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? 'mainnet'
export const MAINNET_API_URL = 'https://api.lens.dev'
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev'
export const SANDBOX_API_URL = 'https://api-sandbox-mumbai.lens.dev'

export const API_URL = getEnvConfig().apiEndpoint
export const LENSHUB_PROXY = getEnvConfig().lensHubProxyAddress
export const LENS_PERIPHERY = getEnvConfig().lensPeripheryAddress
export const FREE_COLLECT_MODULE = getEnvConfig().freeCollectModuleAddress
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken

export const IS_MAINNET = API_URL === MAINNET_API_URL

// Application

export const APP_NAME = 'BCharity'
export const DESCRIPTION =
  'Next generation group-driven composable, decentralized, and permissionless public good Web3 built on blockchain.'
export const DEFAULT_OG = 'https://github.com/bcharity/assets'

// Git
export const GIT_COMMIT_SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7)

// Misc
export const CONTACT_EMAIL = 'admin@bcharity.net'
export const RELAY_ON = process.env.NEXT_PUBLIC_RELAY_ON === 'true'
export const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? ''
export const MIXPANEL_API_HOST = 'https://utils.lenster.xyz/collect'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const CATEGORIES = [
  'Education',
  'Environment',
  'Animals',
  'Social',
  'Healthcare',
  'Sports and Leisure',
  'Disaster Relief',
  'Reduce Poverty',
  'Reduce Hunger',
  'Health',
  'Clean Water',
  'Gender Equality',
  'Affordable and Clean Energy',
  'Work Experience',
  'Technology',
  'Infrastructure',
  'Peace and Justice'
]

// Messages
export const ERROR_MESSAGE = 'Something went wrong!'
export const SIGN_WALLET = 'Please sign in your wallet.'
export const WRONG_NETWORK = IS_MAINNET
  ? 'Please change network to Polygon mainnet.'
  : 'Please change network to Polygon Mumbai testnet.'
export const SIGN_ERROR = 'Failed to sign data'

// URLs
export const STATIC_ASSETS = 'https://cdn.statically.io/gh/liraymond04/bcharity-assets/main/images'
export const POLYGONSCAN_URL = IS_MAINNET ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com'
export const VHR_TOP_HOLDERS_URL =
  'https://mumbai.polygonscan.com/token/tokenholderchart/0x28ee241ab245699968f2980d3d1b1d23120ab8be'
export const RARIBLE_URL = IS_MAINNET ? 'https://rarible.com' : 'https://rinkeby.rarible.com'
export const ARWEAVE_GATEWAY = 'https://arweave.net'
export const IMAGEKIT_URL = `https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_ID}`
export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/'

// Web3
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
export const ALCHEMY_RPC = IS_MAINNET
  ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
  : `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`

export const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
export const INFURA_PROJECT_SECRET = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET

export const ARWEAVE_KEY = process.env.NEXT_PUBLIC_ARWEAVE_KEY

export const POLYGON_MAINNET = {
  ...chain.polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon-rpc.com' }
}
export const POLYGON_MUMBAI = {
  ...chain.polygonMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: { default: 'https://rpc-mumbai.maticvigil.com' }
}
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id

// Errors
export const ERRORS = {
  notMined:
    'A previous transaction may not been mined yet or you have passed in a invalid nonce. You must wait for that to be mined before doing another action, please try again in a few moments. Nonce out of sync.'
}

//VHR and GOOD Conversion
export const VHR_TOKEN = '0x28EE241ab245699968F2980D3D1b1d23120ab8BE'
export const GOOD_TOKEN = '0xd21932b453f0dC0918384442D7AaD5B033C4217B'
export const GIVE_DAI_LP = '0x4373C35bB4E55Dea2dA2Ba695605a768f011b4B9'
export const DAI_TOKEN = '0xf0728Bfe68B96Eb241603994de44aBC2412548bE'
export const VHR_TO_DAI_PRICE = 0.009
export const GOOD_TO_DAI_DONATE_RATE = 0.003

export const WMATIC_GOOD_LP = '0xbe796a61F8d6E4CA823485D9D47BDBBD5eCbf909'
export const WMATIC_TOKEN = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
export const DAI_CHECK_FOR_CONVERSION = '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F'

// Regex
export const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[\da-z]+([.\-][\da-z]+)*\.[a-z]{2,63}(:\d{1,5})?(\/.*)?$/
export const ADDRESS_REGEX = /^(0x)?[\da-f]{40}$/i
export const HANDLE_REGEX = /^[\da-z]+$/
export const ALL_HANDLES_REGEX = /([\s+])@(\S+)/g
export const HANDLE_SANITIZE_REGEX = /[^\d .A-Za-z]/g

// Utils
export const ALLOWED_MEDIA_TYPES = ['video/mp4', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Bundlr
export const BUNDLR_CURRENCY = 'matic'
export const BUNDLR_NODE_URL = IS_MAINNET ? 'https://node2.bundlr.network' : 'https://devnet.bundlr.network'

// UI
export const PAGINATION_ROOT_MARGIN = '300% 0px'
