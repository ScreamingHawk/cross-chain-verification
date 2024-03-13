import { getSourceFromEtherscan, verifySourceOnEtherscan, waitForVerification } from './source'

export type CopyVerificationOptions = {
  sourceUrl: string
  sourceApiKey: string
  sourceAddress: string
  destUrl: string
  destApiKey: string
  destAddress: string
}

export const copyVerification = async (opts: CopyVerificationOptions): Promise<void> => {
  const src = await getSourceFromEtherscan(opts.sourceUrl, opts.sourceApiKey, opts.sourceAddress)
  console.log(`Source obtained. Verifying...`)
  const guid = await verifySourceOnEtherscan(opts.destUrl, opts.destApiKey, opts.destAddress, src)
  console.log(`Verification GUID: ${guid}`)
  await waitForVerification(opts.destUrl, opts.destApiKey, guid)
}
