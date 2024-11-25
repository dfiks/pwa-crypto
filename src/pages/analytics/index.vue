<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  ChartBarIcon,
  WalletIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/solid'
import PageHeader from '@/components/PageHeader.vue'
import AnalyticsCard from '@/components/Analytics/AnalyticsCard.vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const isLoading = ref(true)
const selectedPeriod = ref('24h')

const generateChartData = (period) => {
  const now = new Date()
  const data = []
  const labels = []
  
  const intervals = {
    '1h': { count: 12, unit: 'minutes', format: 'HH:mm' },
    '3h': { count: 18, unit: 'minutes', format: 'HH:mm' },
    '6h': { count: 24, unit: 'minutes', format: 'HH:mm' },
    '12h': { count: 24, unit: 'minutes', format: 'HH:mm' },
    '24h': { count: 24, unit: 'hours', format: 'HH:mm' },
    '7d': { count: 7, unit: 'days', format: 'MM/DD' },
    '30d': { count: 30, unit: 'days', format: 'MM/DD' }
  }

  const interval = intervals[period]
  const baseValue = 100000
  let currentValue = baseValue

  for (let i = 0; i < interval.count; i++) {
    const change = (Math.random() - 0.45) * 5000
    currentValue = Math.max(currentValue + change, baseValue * 0.7)
    data.push(currentValue)
    
    const date = new Date(now)
    if (interval.unit === 'minutes') {
      date.setMinutes(date.getMinutes() - (interval.count - i) * (60 / interval.count))
    } else if (interval.unit === 'hours') {
      date.setHours(date.getHours() - (interval.count - i))
    } else {
      date.setDate(date.getDate() - (interval.count - i))
    }
    
    labels.push(date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      ...(interval.unit === 'days' && { month: 'short', day: 'numeric' })
    }))
  }

  return {
    labels,
    datasets: [{
      label: 'Portfolio Value',
      data,
      borderColor: '#646cff',
      backgroundColor: 'rgba(100, 108, 255, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 2,
      pointHoverRadius: 4
    }]
  }
}

const chartData = ref(generateChartData(selectedPeriod.value))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      padding: 12,
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      callbacks: {
        label: (context) => {
          return `$${context.parsed.y.toLocaleString('en-US', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 6
      }
    },
    y: {
      beginAtZero: false,
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      },
      ticks: {
        callback: (value) => `$${value.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })}`
      }
    }
  }
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})
</script>

<template>
  <div class="min-h-screen pb-24">
    <PageHeader title="Analytics" showTimeframe />

    <!-- Content -->
    <div class="p-4 space-y-6">
      <!-- Portfolio Value - Full Width -->
      <div class="col-span-12">
        <AnalyticsCard
          title="Portfolio Value"
          value="$124,500"
          subtitle="Total assets under management"
          :icon="CurrencyDollarIcon"
          gradient="bg-gradient-to-br from-purple-500 to-pink-500"
          icon-class="text-white"
          icon-bg-class="bg-white/20"
          :loading="isLoading"
          class="h-full"
        />
      </div>

      <!-- Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Portfolio Performance</h3>
        <div class="h-64">
          <Line 
            v-if="!isLoading"
            :data="chartData" 
            :options="chartOptions"
          />
          <div v-else class="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <!-- Performance Metrics - Dynamic Grid -->
      <div class="grid grid-cols-12 gap-4">
        <!-- Large Cards (span-6) -->
        <div class="col-span-12 md:col-span-6">
          <AnalyticsCard
            title="Successful Profit"
            value="$32,450"
            subtitle="From profitable trades"
            :icon="ArrowTrendingUpIcon"
            :loading="isLoading"
            gradient="bg-gradient-to-br from-blue-500 to-purple-500"
            icon-class="text-white"
            icon-bg-class="bg-white/20"
            class="h-full"
          />
        </div>
        
        <div class="col-span-12 md:col-span-6">
          <AnalyticsCard
            title="Total Profit"
            value="$45,230"
            subtitle="All-time earnings"
            :icon="BanknotesIcon"
            :loading="isLoading"
            gradient="bg-gradient-to-br from-green-500 to-blue-500"
            icon-class="text-white"
            icon-bg-class="bg-white/20"
            class="h-full"
          />
        </div>

        <!-- Medium Cards (span-4) -->
        <div class="col-span-12 md:col-span-4">
          <AnalyticsCard
            title="ROI"
            value="+156%"
            subtitle="Return on investment"
            :icon="ChartBarIcon"
            :loading="isLoading"
            gradient="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
            icon-class="text-white"
            icon-bg-class="bg-white/20"
            class="h-full"
          />
        </div>
        
        <div class="col-span-12 md:col-span-4">
          <AnalyticsCard
            title="Profitable Tokens"
            value="42 of 50"
            subtitle="Success rate: 84%"
            :icon="CheckBadgeIcon"
            :loading="isLoading"
            gradient="bg-gradient-to-br from-green-400 to-blue-500"
            icon-class="text-white"
            icon-bg-class="bg-white/20"
            class="h-full"
          />
        </div>
        
        <div class="col-span-12 md:col-span-4">
          <AnalyticsCard
            title="Loss Making"
            value="8 of 50"
            subtitle="Loss rate: 16%"
            :icon="ExclamationTriangleIcon"
            :loading="isLoading"
            gradient="bg-gradient-to-br from-red-500 to-pink-500"
            icon-class="text-white"
            icon-bg-class="bg-white/20"
            class="h-full"
          />
        </div>

        <!-- Small Cards (span-3) -->
        <div class="col-span-6 md:col-span-3">
          <AnalyticsCard
            title="Best Token"
            value="SOL/PEPE"
            subtitle="+312% profit"
            :icon="TrophyIcon"
            :loading="isLoading"
            gradient="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500"
            icon-class="text-white"
            icon-bg-class="bg-white/20"
            class="h-full"
          />
        </div>
        
        <div class="col-span-6 md:col-span-3">
          <AnalyticsCard
            title="Worst Token"
            value="ETH/SHIB"
            subtitle="-45% loss"
            :icon="ArrowTrendingDownIcon"
            :loading="isLoading"
            gradient="bg-gradient-to-br from-red-400 via-red-500 to-orange-500"
            icon-class="text-white"
            icon-bg-class="bg-white/20"
            class="h-full"
          />
        </div>
        
        <div class="col-span-6 md:col-span-3">
          <AnalyticsCard
            title="Total Invested"
            value="$85,000"
            subtitle="Capital deployed"
            :icon="WalletIcon"
            :loading="isLoading"
            gradient="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500"
            icon-class="text-white"
            icon-bg-class="bg-white/20"
            class="h-full"
          />
        </div>
        
        <div class="col-span-6 md:col-span-3">
          <AnalyticsCard
            title="Total Returns"
            value="$130,230"
            subtitle="Including initial capital"
            :icon="ArrowPathIcon"
            :loading="isLoading"
            gradient="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500"
            icon-class="text-white"
            icon-bg-class="bg-white/20"
            class="h-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>