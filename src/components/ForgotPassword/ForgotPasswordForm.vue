<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import { 
  EnvelopeIcon
} from '@heroicons/vue/24/outline'
import OTPInput from '@/components/common/OTPInput.vue'

const router = useRouter()
const { t } = useI18n()

const email = ref('')
const step = ref(1)
const otpValue = ref('')
const isLoading = ref(false)

const errors = ref({
  email: '',
  otp: ''
})

const validateEmail = () => {
  if (!email.value) {
    errors.value.email = t('validation.emailRequired')
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = t('validation.emailInvalid')
    return false
  }
  errors.value.email = ''
  return true
}

const handleSubmitEmail = async () => {
  if (!validateEmail()) return
  
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    step.value = 2
  } finally {
    isLoading.value = false
  }
}

const handleOTPComplete = (code: string) => {
  console.log('OTP completed:', code)
  // Handle OTP verification
}
</script>

<template>
  <div class="w-full space-y-8">
    <!-- Step 1: Email -->
    <template v-if="step === 1">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Forgot Password?
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email address to receive a verification code
        </p>
      </div>

      <!-- Email Form -->
      <form class="space-y-6" @submit.prevent="handleSubmitEmail">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="w-full h-12 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
              :class="{ 'border-red-500 dark:border-red-400': errors.email }"
              @blur="validateEmail"
            />
          </div>
          <p v-if="errors.email" class="text-sm text-red-500 dark:text-red-400">
            {{ errors.email }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative"
        >
          <span :class="{ 'opacity-0': isLoading }">
            Send Code
          </span>
          <div v-if="isLoading" 
               class="absolute inset-0 flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </button>
      </form>
    </template>

    <!-- Step 2: OTP -->
    <template v-else>
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Enter Code
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We've sent a verification code to {{ email }}
        </p>
      </div>

      <!-- OTP Input -->
      <div class="space-y-6">
        <OTPInput
          v-model="otpValue"
          :length="5"
          @complete="handleOTPComplete"
        />

        <div class="text-center">
          <button 
            type="button"
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    </template>

    <!-- Back to Login -->
    <div class="text-center">
      <button 
        type="button"
        @click="router.push('/login')"
        class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      >
        Back to login
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Autocomplete Styles */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px rgb(249 250 251) inset;
  -webkit-text-fill-color: rgb(17 24 39);
  transition: background-color 5000s ease-in-out 0s;
}

:deep(.dark) input:-webkit-autofill,
:deep(.dark) input:-webkit-autofill:hover,
:deep(.dark) input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px rgb(31 41 55) inset;
  -webkit-text-fill-color: rgb(243 244 246);
}

input:-webkit-autofill::first-line {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  font-size: 1rem;
}
</style>