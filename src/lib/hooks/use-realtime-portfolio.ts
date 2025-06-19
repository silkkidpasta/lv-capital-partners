'use client'

import { createClient } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'

// TypeScript interfaces for realtime updates
interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Record<string, unknown>;
  old: Record<string, unknown>;
  table: string;
}

interface PortfolioData {
  totalValue: number
  totalInvested: number
  totalReturns: number
  overallPerformance: number
  totalDistributions: number
  activeInvestments: number
  monthlyChange: number
  yearToDateReturn: number
}

interface Investment {
  id: string
  name: string
  type: string
  invested: number
  currentValue: number
  performance: number
  status: string
  assetClass: string
  location: string
  investmentDate: string
}

interface Distribution {
  id: string
  amount: number
  distributionDate: string
  type: string
  status: string
  investmentName: string
}

interface Activity {
  id: string
  type: string
  title: string
  description: string
  amount?: number
  date: string
  status: string
}

interface RealtimePortfolioData {
  portfolio: PortfolioData
  investments: Investment[]
  distributions: Distribution[]
  recentActivity: Activity[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void
}

export function useRealtimePortfolio(): RealtimePortfolioData {
  const { user } = useUser()
  const [data, setData] = useState<Omit<RealtimePortfolioData, 'refresh'>>({
    portfolio: {
      totalValue: 0,
      totalInvested: 0,
      totalReturns: 0,
      overallPerformance: 0,
      totalDistributions: 0,
      activeInvestments: 0,
      monthlyChange: 0,
      yearToDateReturn: 0
    },
    investments: [],
    distributions: [],
    recentActivity: [],
    isLoading: true,
    error: null,
    lastUpdated: null
  })

  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  // Fetch initial portfolio data
  const fetchPortfolioData = useCallback(async () => {
    if (!user) return

    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch('/api/dashboard/portfolio')

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data')
      }

      const result = await response.json()

      setData(prev => ({
        ...prev,
        portfolio: result.data.portfolio,
        investments: result.data.investments,
        distributions: result.data.distributions || [],
        recentActivity: result.data.recentActivity,
        isLoading: false,
        lastUpdated: new Date()
      }))
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
      setData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      }))
    }
  }, [user])

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((payload: RealtimePayload) => {
    console.log('Real-time update received:', payload)

    const { eventType, new: newRecord, old: oldRecord, table } = payload

    setData(prev => {
      const newData = { ...prev }

      switch (table) {
        case 'user_investments':
          if (eventType === 'INSERT') {
            // Add new investment
            const newInvestment: Investment = {
              id: newRecord.id,
              name: newRecord.investment_deals?.title || 'New Investment',
              type: newRecord.investment_deals?.property_type || 'Unknown',
              invested: newRecord.amount_invested,
              currentValue: newRecord.current_value,
              performance: ((newRecord.current_value - newRecord.amount_invested) / newRecord.amount_invested) * 100,
              status: newRecord.status,
              assetClass: newRecord.investment_deals?.asset_class || 'Unknown',
              location: newRecord.investment_deals?.location || 'Unknown',
              investmentDate: newRecord.investment_date
            }
            newData.investments = [...prev.investments, newInvestment]
          } else if (eventType === 'UPDATE') {
            // Update existing investment
            newData.investments = prev.investments.map(inv =>
              inv.id === newRecord.id
                ? {
                    ...inv,
                    invested: newRecord.amount_invested,
                    currentValue: newRecord.current_value,
                    performance: ((newRecord.current_value - newRecord.amount_invested) / newRecord.amount_invested) * 100,
                    status: newRecord.status
                  }
                : inv
            )
          } else if (eventType === 'DELETE') {
            // Remove investment
            newData.investments = prev.investments.filter(inv => inv.id !== oldRecord.id)
          }
          break

        case 'distributions':
          if (eventType === 'INSERT') {
            // Add new distribution
            const newDistribution: Distribution = {
              id: newRecord.id,
              amount: newRecord.amount,
              distributionDate: newRecord.distribution_date,
              type: newRecord.type,
              status: newRecord.status || 'processed',
              investmentName: newRecord.user_investments?.investment_deals?.title || 'Unknown Investment'
            }
            newData.distributions = [newDistribution, ...prev.distributions]

            // Add to recent activity
            const newActivity: Activity = {
              id: `dist_${newRecord.id}`,
              type: 'distribution',
              title: 'Distribution Received',
              description: `${newDistribution.type} distribution from ${newDistribution.investmentName}`,
              amount: newRecord.amount,
              date: new Date().toLocaleDateString(),
              status: 'new'
            }
            newData.recentActivity = [newActivity, ...prev.recentActivity.slice(0, 9)]
          }
          break

        case 'investment_deals':
          if (eventType === 'UPDATE') {
            // Update deal information in investments
            newData.investments = prev.investments.map(inv => {
              // This needs to match the investment deal ID with user investment deal ID
              return inv
            })
          }
          break
      }

      // Recalculate portfolio totals
      const totalInvested = newData.investments.reduce((sum, inv) => sum + inv.invested, 0)
      const totalValue = newData.investments.reduce((sum, inv) => sum + inv.currentValue, 0)
      const totalReturns = totalValue - totalInvested
      const overallPerformance = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0
      const totalDistributions = newData.distributions.reduce((sum, dist) => sum + dist.amount, 0)

      newData.portfolio = {
        ...prev.portfolio,
        totalValue,
        totalInvested,
        totalReturns,
        overallPerformance,
        totalDistributions,
        activeInvestments: newData.investments.filter(inv => inv.status === 'active').length
      }

      newData.lastUpdated = new Date()
      return newData
    })
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return

    const supabase = createClient()

    // Create real-time channel
    const realtimeChannel = supabase
      .channel(`portfolio_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_investments'
        },
        handleRealtimeUpdate
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'distributions'
        },
        handleRealtimeUpdate
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'investment_deals'
        },
        handleRealtimeUpdate
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription error')
          setData(prev => ({
            ...prev,
            error: 'Real-time connection failed'
          }))
        }
      })

    setChannel(realtimeChannel)

    // Fetch initial data
    fetchPortfolioData()

    // Cleanup function
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
      }
    }
  }, [user, fetchPortfolioData, handleRealtimeUpdate])

  // Refresh function for manual updates
  const refresh = useCallback(() => {
    fetchPortfolioData()
  }, [fetchPortfolioData])

  return {
    ...data,
    refresh
  }
}
