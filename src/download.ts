import { writeFileSync } from 'fs'
import { getSourceFromEtherscan } from './source'

export const downloadSource = async (
  apiUrlBase: string,
  apiKey: string,
  contractAddr: string,
  outputFile?: string
): Promise<void> => {
  try {
    const src = await getSourceFromEtherscan(apiUrlBase, apiKey, contractAddr)
    const formattedSrc = {
      ...src,
      compilerInput: JSON.parse(src.compilerInput)
    }
    if (outputFile) {
      await writeFileSync(outputFile, JSON.stringify(formattedSrc))
    } else {
      console.log(JSON.stringify(formattedSrc, null, 2))
    }
  } catch (error) {
    console.error(`Error downloading source code`, error)
    throw error
  }
}
