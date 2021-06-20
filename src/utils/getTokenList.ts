import { TokenList } from '@uniswap/token-lists'
import schema from '@uniswap/token-lists/src/tokenlist.schema.json'
import Ajv from 'ajv'
import { getTokenListByName } from '../constants/list'

const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)

export default async function getTokenList(listName: string): Promise<TokenList> {
  // passing listName to getTokenList
  // is moot right now. maybe in the future
  // it will have a purpose
  const json = getTokenListByName(listName)
  if (!tokenListValidator(json)) {
    const validationErrors: string =
      tokenListValidator.errors?.reduce<string>((memo, error) => {
        const add = `${error.dataPath} ${error.message ?? ''}`
        return memo.length > 0 ? `${memo}; ${add}` : `${add}`
      }, '') ?? 'unknown error'
    throw new Error(`Token list failed validation: ${validationErrors}`)
  }
  return json
}
