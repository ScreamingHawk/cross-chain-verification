import { Command } from '@commander-js/extra-typings'
import { copyVerification } from './verify'

const program = new Command()

program
  .name('cross-chain-verification')
  .description('Copy contract verifications across etherscan supported chain explorers.')
  .version('1.0.0')

program
  .command('verify')
  .description('Copy contract verifications across etherscan supported chain explorers')
  .requiredOption('-u, --source-url <string>', 'Etherscan API URL for the source chain')
  .requiredOption('-k, --source-api-key <string>', 'Etherscan API key for the source chain')
  .requiredOption('-a, --source-address <string>', 'Address of the source contract')
  .requiredOption('-d, --dest-url <string>', 'Etherscan API URL for the destination chain')
  .requiredOption('-e, --dest-api-key <string>', 'Etherscan API URL for the destination chain')
  .option('-x, --dest-address <string>', 'Address of the destination contract (optional)')
  .action(opts => {
    copyVerification({
      ...opts,
      destAddress: opts.destAddress || opts.sourceAddress
    })
  })

program.parse()
