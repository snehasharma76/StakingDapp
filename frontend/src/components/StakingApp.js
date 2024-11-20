'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Slider } from "./ui/slider"
import { CoinsIcon as CoinIcon, Rocket, Sparkles, Wallet } from 'lucide-react'
import StakingPlatform from '../contracts/StakingPlatform.json'
import StakingToken from '../contracts/StakingToken.json'

export default function StakingApp() {
  const [stakeAmount, setStakeAmount] = useState(0)
  const [stakedAmount, setStakedAmount] = useState(0)
  const [rewards, setRewards] = useState(0)
  const [isStaking, setIsStaking] = useState(false)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [account, setAccount] = useState('')
  const [stakingContract, setStakingContract] = useState(null)
  const [tokenContract, setTokenContract] = useState(null)
  const [tokenBalance, setTokenBalance] = useState('0')
  const [isApproved, setIsApproved] = useState(false)
  const [loading, setLoading] = useState(false)

  const connectWallet = async () => {
    try {
      setLoading(true)
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {}
      })
      
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const account = await signer.getAddress()

      setProvider(provider)
      setSigner(signer)
      setAccount(account)

      // Initialize contracts
      const stakingContract = new ethers.Contract(
        process.env.REACT_APP_STAKING_CONTRACT_ADDRESS,
        StakingPlatform.abi,
        signer
      )
      const tokenContract = new ethers.Contract(
        process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS,
        StakingToken.abi,
        signer
      )

      setStakingContract(stakingContract)
      setTokenContract(tokenContract)

      // Load initial data
      await updateStakeInfo(stakingContract, account)
      await updateTokenBalance(tokenContract, account)
      await checkAllowance(tokenContract, account, process.env.REACT_APP_STAKING_CONTRACT_ADDRESS)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStakeInfo = async (contract, account) => {
    try {
      const info = await contract.getStakeInfo(account)
      setStakedAmount(Number(ethers.utils.formatEther(info.stakedAmount)))
      setRewards(Number(ethers.utils.formatEther(info.pendingRewards)))
    } catch (error) {
      console.error("Error updating stake info:", error)
    }
  }

  const updateTokenBalance = async (contract, account) => {
    try {
      const balance = await contract.balanceOf(account)
      setTokenBalance(ethers.utils.formatEther(balance))
    } catch (error) {
      console.error("Error updating token balance:", error)
    }
  }

  const checkAllowance = async (contract, owner, spender) => {
    try {
      const allowance = await contract.allowance(owner, spender)
      setIsApproved(allowance.gt(ethers.utils.parseEther("100")))
    } catch (error) {
      console.error("Error checking allowance:", error)
    }
  }

  const handleApprove = async () => {
    try {
      setLoading(true)
      const tx = await tokenContract.approve(
        process.env.REACT_APP_STAKING_CONTRACT_ADDRESS,
        ethers.constants.MaxUint256
      )
      await tx.wait()
      setIsApproved(true)
    } catch (error) {
      console.error("Error approving tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStake = async () => {
    try {
      setLoading(true)
      const tx = await stakingContract.stake(ethers.utils.parseEther(stakeAmount.toString()))
      await tx.wait()
      setStakeAmount(0)
      setIsStaking(true)
      await updateStakeInfo(stakingContract, account)
      await updateTokenBalance(tokenContract, account)
    } catch (error) {
      console.error("Error staking tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    try {
      setLoading(true)
      const tx = await stakingContract.withdraw(ethers.utils.parseEther(stakedAmount.toString()))
      await tx.wait()
      setIsStaking(false)
      await updateStakeInfo(stakingContract, account)
      await updateTokenBalance(tokenContract, account)
    } catch (error) {
      console.error("Error withdrawing tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (stakingContract && account) {
      const interval = setInterval(() => {
        updateStakeInfo(stakingContract, account)
        updateTokenBalance(tokenContract, account)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [stakingContract, tokenContract, account])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-white/20">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
              Staking Token Platform
            </CardTitle>
          </div>
          <CardDescription className="text-center text-purple-600 text-lg">
            Stake your tokens and reach for the stars!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!account ? (
            <Button 
              onClick={connectWallet} 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg text-lg py-6"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-purple-600 mb-1">Balance</div>
                  <div className="font-bold text-lg text-purple-800">
                    {Number(tokenBalance).toFixed(2)} STK
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-indigo-600 mb-1">Staked</div>
                  <div className="font-bold text-lg text-indigo-800">
                    {Number(stakedAmount).toFixed(2)} STK
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Stake Amount</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter amount to stake"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(Number(e.target.value))}
                      className="flex-grow"
                      disabled={loading}
                    />
                    <Button
                      onClick={() => setStakeAmount(Number(tokenBalance))}
                      variant="outline"
                      className="whitespace-nowrap"
                      disabled={loading}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                {!isApproved ? (
                  <Button 
                    onClick={handleApprove} 
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Approving...</span>
                      </div>
                    ) : (
                      <>
                        <CoinIcon className="mr-2 h-4 w-4" />
                        Approve STK Token
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={handleStake} 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                      disabled={loading || stakeAmount <= 0}
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-4 w-4" />
                          Stake
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleWithdraw}
                      variant="outline"
                      className="border-2"
                      disabled={loading || stakedAmount <= 0}
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      ) : (
                        <>
                          <CoinIcon className="mr-2 h-4 w-4" />
                          Withdraw
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {stakedAmount > 0 && (
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4">
                  <div className="text-sm text-purple-600 mb-2">Pending Rewards</div>
                  <div className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
                    {Number(rewards).toFixed(4)} STK
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
