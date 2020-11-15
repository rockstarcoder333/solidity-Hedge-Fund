import dotenv from 'dotenv'
dotenv.config()

import Web3 from 'web3'

import Kyber from './exchanges/kyber'
import UniswapV1 from './exchanges/uniswap-v1'
import UniswapV2 from './exchanges/uniswap-v2'
import Token from './classes/Token'
import { Context } from './utils/types'
import { loadContracts } from './on-chain/contracts'

const provider = new Web3.providers.HttpProvider(process.env.INFURA_URL as string)
const web3 = new Web3(provider)

const { log } = console

async function main() {
  const contracts = loadContracts()
  const ctx: Context = {
    web3,
    contracts
  }

  const { tokens } = contracts
  const ETH = new Token(ctx, 'ETH', tokens.ETH.address, 18)
  const WETH = new Token(ctx, 'WETH', tokens.WETH.address, 18)
  const DAI = new Token(ctx, 'DAI', tokens.DAI.address, 18)

  const kyber = new Kyber(ctx)
  const kyberRate = await kyber.getRate(WETH, DAI, 2)

  const uniswapV1 = new UniswapV1(ctx)
  const uniswapV1Rate = await uniswapV1.getRate(ETH, DAI, 2)

  const uniswapV2 = new UniswapV2(ctx)
  const uniswapV2Rate = await uniswapV2.getRate(WETH, DAI, 2)

  log('Kyber:', kyberRate)
  log('Uniswap (v1):', uniswapV1Rate)
  log('Uniswap (v2):', uniswapV2Rate)
}

main()
