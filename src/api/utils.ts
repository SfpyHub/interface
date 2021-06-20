import { AxiosError } from 'axios'
import { ApiError, REQUEST_ERROR } from './error'

export const filter = (data) => {
  return Object.keys(data).reduce((prev, key) => {
    if (typeof data[key] === 'object') {
      const sub = filter(data[key])
      prev[key] = sub
    } else if (data[key] !== undefined) {
      prev[key] = data[key]
    }
    return prev
  }, {})
}

export function handleError(error?: AxiosError) {
  if (!error) {
    return undefined
  }

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { response: { data }} = error
    if (typeof data === 'string') {
      return new ApiError({ category: REQUEST_ERROR, message: data })
    }

    const {
      response: {
        data: {
          error: { category, message },
        },
      },
    } = error
    return new ApiError({ category, message })
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return new ApiError({ category: REQUEST_ERROR, message: error.request.statusText || error.message })
  } else {
    // Something happened in setting up the request that triggered an Error
    return new ApiError({ category: REQUEST_ERROR, message: error.message })
  }
}
