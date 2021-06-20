import { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { ipfs } from '../../ipfs'
import { Merchant, MerchantProps } from '../../order'
import { ApiState, useUpdateMerchant, filter } from '../../api'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useDerivedAuthState } from '../auth/hooks'
import { useApiErrorPopup } from '../../hooks/useApiErrorPopup'
import { Field, URLField, uploadImage, changeName, changeURL, changeURLs } from './actions'

export function useMerchantState(): AppState['merchant'] {
  return useSelector<AppState, AppState['merchant']>((state) => state.merchant)
}

type LinkMapType = { [field in URLField]: string }

export function useMerchantActionHandlers(): {
  onUploadImage: (field: Field, url: string, isLoading: boolean) => void
  onChangeURL: (field: URLField, url: string) => void
  onChangeName: (name: string) => void
  onChangeURLs: (values: LinkMapType) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUploadImage = useCallback(
    (field: Field, url: string, isLoading: boolean) => {
      dispatch(uploadImage({ field, url, isLoading }))
    },
    [dispatch]
  )

  const onChangeURL = useCallback(
    (field: URLField, url: string) => {
      dispatch(changeURL({ field, url }))
    },
    [dispatch]
  )

  const onChangeName = useCallback(
    (name: string) => {
      dispatch(changeName({ name }))
    },
    [dispatch]
  )

  const onChangeURLs = useCallback(
    (values) => {
      dispatch(changeURLs(values))
    },
    [dispatch]
  )

  return {
    onUploadImage,
    onChangeURL,
    onChangeURLs,
    onChangeName,
  }
}

export function useDerivedMerchantInfo(): {
  merchant: Merchant
  bgImageLoading: boolean
  profileImageLoading: boolean
  inputError?: string
} {
  const { account } = useActiveWeb3React()
  const {
    registeredName,
    registeredNameDirty,
    websiteURL,
    websiteURLDirty,
    twitterURL,
    twitterURLDirty,
    instagramURL,
    instagramURLDirty,
    fileUpload: {
      [Field.BACKGROUND]: { imgURL: bgImageURL, isLoading: bgImageLoading, dirty: bgImageURLDirty },
      [Field.PROFILE]: { imgURL: profileImageURL, isLoading: profileImageLoading, dirty: profileImageURLDirty },
    },
  } = useMerchantState()

  const { merchant: savedMerchant } = useDerivedAuthState()

  const merchant = new Merchant({
    registered_name: registeredNameDirty ? registeredName : savedMerchant?.name,
    website_url: websiteURLDirty ? websiteURL : savedMerchant?.websiteURL,
    twitter_url: twitterURLDirty ? twitterURL : savedMerchant?.twitterURL,
    instagram_url: instagramURLDirty ? instagramURL : savedMerchant?.instagramURL,
    background_img_url: bgImageURLDirty ? bgImageURL : savedMerchant?.backgroundImg,
    profile_img_url: profileImageURLDirty ? profileImageURL : savedMerchant?.profileImg,
  })

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!merchant.name) {
    inputError = 'A name is required'
  }

  return {
    merchant,
    bgImageLoading,
    profileImageLoading,
    inputError,
  }
}

export function useUpdateMerchantCallback(): {
  state: ApiState
  data?: MerchantProps
  execute: () => void
} {
  const {
    data: { data: merchantProps },
    state,
    error,
    execute: updateMerchant,
  } = useUpdateMerchant()

  // show popup on error
  useApiErrorPopup(error)

  const { merchant } = useDerivedMerchantInfo()
  const { apikey } = useDerivedAuthState()
  const handleSubmit = useCallback(() => {
    if (!updateMerchant) {
      return
    }

    const body = filter(merchant.toJSON())
    updateMerchant({
      headers: {
        'X-SFPY-API-KEY': apikey.pvtKey,
      },
      data: {
        merchant_service: {
          merchant: body,
        },
      },
    }).catch(() => {})
  }, [merchant, updateMerchant, apikey])

  return {
    state: state,
    data: merchantProps,
    execute: handleSubmit,
  }
}

export function useMerchantResponse(): Merchant | null {
  const [result, setResult] = useState<Merchant | null>()
  const { merchant } = useDerivedAuthState()

  useEffect(() => {
    setResult(merchant)
  }, [merchant, setResult])

  return result
}

export function useFetchMerchantState(): [ApiState] {
  const state = useSelector<AppState, AppState['merchant']['fetchApiState']>((state) => state.merchant.fetchApiState)
  return useMemo(() => {
    if (!state) {
      return [ApiState.LOADING]
    }
    return [state]
  }, [state])
}

function fileToBuffer(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onloadend = () => {
      resolve(Buffer.from(reader.result))
    }
    reader.onerror = () => {
      reader.abort()
      reject(new Error('problem reading file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

export function useFileUploader(): (file: File) => Promise<any> {
  const upload = useCallback(async (file: File): Promise<any> => {
    if (!file) {
      return
    }

    return fileToBuffer(file)
      .then((buffer) => {
        return ipfs.add(buffer)
      })
      .catch((err) => {
        console.error(err.message)
      })
  }, [])

  return upload
}
