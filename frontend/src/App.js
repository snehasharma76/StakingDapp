'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Wallet2 } from 'lucide-react'
import StakingPlatform from './contracts/StakingPlatform.json'
import StakingToken from './contracts/StakingToken.json'
import SnowAnimation from './components/ui/SnowAnimation'
import ChristmasScene from './components/ui/ChristmasScene'

import './styles/globals.css'
import './styles/snowflake.css'

function App() {
  // State variables for wallet connection and contract interaction
  const [stakeAmount, setStakeAmount] = useState(0)
  const [stakedAmount, setStakedAmount] = useState(0)
  const [rewards, setRewards] = useState(0)
  const [account, setAccount] = useState('')
  const [stakingContract, setStakingContract] = useState(null)
  const [tokenContract, setTokenContract] = useState(null)
  const [tokenBalance, setTokenBalance] = useState('0')
  const [isApproved, setIsApproved] = useState(false)
  const [loading, setLoading] = useState(false)

  // Connect wallet function
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

  // Update stake info
  const updateStakeInfo = async (contract, account) => {
    try {
      const info = await contract.getStakeInfo(account)
      setStakedAmount(Number(ethers.utils.formatEther(info.stakedAmount)))
      setRewards(Number(ethers.utils.formatEther(info.pendingRewards)))
    } catch (error) {
      console.error("Error updating stake info:", error)
    }
  }

  // Update token balance
  const updateTokenBalance = async (contract, account) => {
    try {
      const balance = await contract.balanceOf(account)
      setTokenBalance(ethers.utils.formatEther(balance))
    } catch (error) {
      console.error("Error updating token balance:", error)
    }
  }

  // Check allowance
  const checkAllowance = async (contract, owner, spender) => {
    try {
      const allowance = await contract.allowance(owner, spender)
      setIsApproved(allowance.gt(ethers.utils.parseEther("100")))
    } catch (error) {
      console.error("Error checking allowance:", error)
    }
  }

  // Handle token approval
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

  // Handle staking
  const handleStake = async () => {
    try {
      setLoading(true)
      const tx = await stakingContract.stake(ethers.utils.parseEther(stakeAmount.toString()))
      await tx.wait()
      setStakeAmount(0)
      await updateStakeInfo(stakingContract, account)
      await updateTokenBalance(tokenContract, account)
    } catch (error) {
      setLoading(false)
      console.error("Error staking tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle withdrawal
  const handleWithdraw = async () => {
    try {
      setLoading(true)
      const tx = await stakingContract.withdraw(ethers.utils.parseEther(stakedAmount.toString()))
      await tx.wait()
      await updateStakeInfo(stakingContract, account)
      await updateTokenBalance(tokenContract, account)
    } catch (error) {
      setLoading(false)
      console.error("Error withdrawing tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-update effect
  useEffect(() => {
    if (stakingContract && account) {
      const interval = setInterval(() => {
        updateStakeInfo(stakingContract, account)
        updateTokenBalance(tokenContract, account)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [stakingContract, tokenContract, account])

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance) => {
    return Number(balance).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f1f] via-[#3c1f3b] to-[#C41E3A] flex items-center justify-center p-4">
      <ChristmasScene />
      <div className="w-full max-w-xl">
        {/* Connect Wallet Card */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-christmas-red animate-pulse"></div>
              <h2 className="text-lg font-semibold text-white">Wallet Connection</h2>
            </div>
            <button
              onClick={connectWallet}
              disabled={loading}
              className="px-4 py-2 bg-black/20 hover:bg-black/30 text-white rounded-xl transition-all border border-white/20"
            >
              {account ? shortenAddress(account) : "Connect Wallet"}
            </button>
          </div>
        </div>

        {/* Staking Card */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🎅</span> Stake Your Tokens
          </h2>
          
          <div className="space-y-4">
            {/* Balance Display */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/20 rounded-xl p-3">
                <div className="text-sm text-white/60 mb-1">Token Balance</div>
                <div className="text-lg font-semibold text-white">{formatBalance(tokenBalance)} STK</div>
              </div>
              <div className="bg-black/20 rounded-xl p-3">
                <div className="text-sm text-white/60 mb-1">Staked Amount</div>
                <div className="text-lg font-semibold text-white">{formatBalance(stakedAmount)} STK</div>
              </div>
            </div>

            {/* Staking Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm text-white/80 font-medium">Amount to Stake</label>
                <button
                  onClick={() => setStakeAmount(tokenBalance)}
                  className="text-sm px-2 py-1 bg-black/20 hover:bg-black/30 text-white rounded-lg transition-all border border-white/20"
                >
                  MAX
                </button>
              </div>

              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter amount"
              />
              
              {/* Enhanced Slider */}
              <div className="relative py-2">
                <div className="relative h-6">
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-5 bg-black/20 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] overflow-hidden">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-christmas-red to-christmas-green rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${(stakeAmount / tokenBalance) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_20%,rgba(255,255,255,0)_40%)] animate-shine"></div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={tokenBalance}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="absolute top-1/2 -translate-y-1/2 w-full h-5 appearance-none bg-transparent cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:w-7 
                      [&::-webkit-slider-thumb]:h-7
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.2)] 
                      [&::-webkit-slider-thumb]:cursor-pointer 
                      [&::-webkit-slider-thumb]:border-2
                      [&::-webkit-slider-thumb]:border-christmas-red 
                      hover:[&::-webkit-slider-thumb]:border-christmas-green
                      [&::-webkit-slider-thumb]:transition-all
                      [&::-webkit-slider-thumb]:duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleStake}
                disabled={!account || loading}
                className="flex-1 px-4 py-3 bg-christmas-green hover:bg-christmas-green/90 text-white rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg"
              >
                Stake Tokens
              </button>
              <button
                onClick={handleWithdraw}
                disabled={!account || loading}
                className="flex-1 px-4 py-3 bg-christmas-red hover:bg-christmas-red/90 text-white rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg"
              >
                Unstake
              </button>
            </div>
          </div>
        </div>
      </div>
      <SnowAnimation />
    </div>
  )
}

export default App
