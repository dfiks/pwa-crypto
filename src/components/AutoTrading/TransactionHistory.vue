<script setup lang="ts">
import { ref } from 'vue'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ClockIcon,
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

interface Transaction {
  id: number
  type: 'buy' | 'sell'
  pair: string
  amount: number
  price: number
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
  investment?: number
  exitValue?: number
  multiplier?: number
}

const transactions = ref<Transaction[]>([
  {
    id: 1,
    type: 'sell',
    pair: 'SOL/PEPE',
    amount: 1000000,
    price: 0.0003403,
    timestamp: '2024-03-23T10:30:00Z',
    status: 'completed',
    investment: 500,
    exitValue: 1750,
    multiplier: 3.5
  },
  {
    id: 2,
    type: 'sell',
    pair: 'SOL/BONK',
    amount: 2500000,
    price: 0.000012,
    timestamp: '2024-03-23T09:15:00Z',
    status: 'completed',
    investment: 1000,
    exitValue: 2300,
    multiplier: 2.3
  },
  {
    id: 3,
    type: 'buy',
    pair: 'SOL/DOGE',
    amount: 1500000,
    price: 0.000789,
    timestamp: '2024-03-23T08:45:00Z',
    status: 'pending',
    investment: 750
  }
])

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
  })
}

const formatAmount = (amount: number) => {
  return amount.toLocaleString('en-US')
}

const formatUSD = (value: number) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

const calculateProfit = (investment: number, exitValue: number) => {
  return exitValue - investment
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="transaction in transactions" 
         :key="transaction.id"
         class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <!-- Header -->
      <div class="flex items-center gap-4 mb-3">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center',
            transaction.type === 'buy' 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-red-100 dark:bg-red-900/30'
          ]">
            <component 
              :is="transaction.type === 'buy' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon"
              :class="[
                'w-5 h-5',
                transaction.type === 'buy' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              ]"
            />
          </div>
        </div>

        <!-- Title and Time -->
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
              {{ transaction.pair }}
            </h3>
            <div class="flex items-center gap-2">
              <ClockIcon class="w-4 h-4 text-gray-400" />
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(transaction.timestamp) }}
              </span>
            </div>
          </div>
          <span :class="[
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1',
            {
              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': transaction.status === 'completed',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': transaction.status === 'pending',
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': transaction.status === 'failed'
            }
          ]">
            {{ transaction.status }}
          </span>
        </div>
      </div>

      <!-- Trade Details -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Amount</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">
            {{ formatAmount(transaction.amount) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Price</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">
            ${{ formatPrice(transaction.price) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Investment</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">
            {{ formatUSD(transaction.investment || 0) }}
          </p>
        </div>
        <div v-if="transaction.exitValue">
          <p class="text-sm text-gray-500 dark:text-gray-400">Exit Value</p>
          <p class="font-medium text-gray-900 dark:text-gray-100">
            {{ formatUSD(transaction.exitValue) }}
          </p>
        </div>
      </div>

      <!-- Profit Info (Only for completed sells) -->
      <div v-if="transaction.type === 'sell' && transaction.status === 'completed' && transaction.exitValue" 
           class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <BanknotesIcon class="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Profit</p>
              <p class="font-medium text-green-600 dark:text-green-400">
                +{{ formatUSD(calculateProfit(transaction.investment, transaction.exitValue)) }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <ChartBarIcon class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Multiplier</p>
              <p class="font-medium text-blue-600 dark:text-blue-400">
                {{ transaction.multiplier }}x
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>