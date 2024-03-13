import axios from 'axios'

export type SourceCode = {
  contractName: string
  compilerInput: string
  compilerVersion: string
  constructorArgs?: string
}

export const getSourceFromEtherscan = async (apiUrlBase: string, apiKey: string, contractAddr: string): Promise<SourceCode> => {
  const apiUrl = `${apiUrlBase}?module=contract&action=getsourcecode&apikey=${apiKey}&address=${contractAddr}`
  try {
    const response = await axios.get(apiUrl)
    if (response.status !== 200) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const result = response.data.result[0]
    const sourceData = result.SourceCode.slice(1, -1) // Fix formatting

    // Find contract file name in source keys
    const contractFileName = Object.keys(JSON.parse(sourceData).sources).find(key => key.includes(result.ContractName))
    return {
      contractName: `${contractFileName}:${result.ContractName}`,
      compilerInput: JSON.stringify(JSON.parse(sourceData)), // Fix formatting issues
      compilerVersion: result.CompilerVersion,
      constructorArgs: result.ConstructorArguments === '' ? undefined : result.ConstructorArguments
    }
  } catch (error) {
    console.error(`Error downloading JSON data`, error)
    throw error
  }
}

export const verifySourceOnEtherscan = async (
  apiUrlBase: string,
  apiKey: string,
  contractAddr: string,
  sourceCode: SourceCode
): Promise<string> => {
  // Create verification body
  const body: Record<string, string> = {
    apikey: apiKey,
    module: 'contract',
    action: 'verifysourcecode',
    contractaddress: contractAddr,
    sourceCode: sourceCode.compilerInput,
    codeformat: 'solidity-standard-json-input',
    contractname: sourceCode.contractName,
    compilerversion: sourceCode.compilerVersion
  }
  if (sourceCode.constructorArgs) {
    // Note typo in Etherscan API
    if (sourceCode.constructorArgs.startsWith('0x')) {
      body.constructorArguements = sourceCode.constructorArgs.substring(2)
    } else {
      body.constructorArguements = sourceCode.constructorArgs
    }
  }
  try {
    const response = await axios.post(apiUrlBase, new URLSearchParams(body))
    if (response.status !== 200) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return response.data.result as string // guid
  } catch (error) {
    console.error(`Error uploading source code`, error)
    throw error
  }
}

export const waitForVerification = async (apiUrlBase: string, apiKey: string, guid: string, attempts = 12): Promise<boolean> => {
  const params = new URLSearchParams({
    module: 'contract',
    action: 'checkverifystatus',
    apikey: apiKey,
    guid
  })

  await new Promise(resolve => setTimeout(resolve, 5000)) // Delay 5s
  console.log('Waiting for verification...')
  const res = await axios.get(apiUrlBase, { params })
  const status = res.data.result as string
  if (status.includes('Pending') && attempts > 0) {
    return waitForVerification(apiUrlBase, apiKey, guid, attempts - 1)
  }

  if (status.includes('Pass')) {
    console.log('Verification passed')
    return true
  }
  console.error(`Verification failed with ${status}`)
  return false
}
