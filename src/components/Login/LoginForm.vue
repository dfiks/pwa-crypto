<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import { 
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'
import GradientCheckbox from '@/components/common/GradientCheckbox.vue'

const router = useRouter()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const errors = ref({
  email: '',
  password: ''
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

const validatePassword = () => {
  if (!password.value) {
    errors.value.password = t('validation.passwordRequired')
    return false
  }
  errors.value.password = ''
  return true
}

const isFormValid = computed(() => {
  return validateEmail() && validatePassword()
})

const handleSubmit = () => {
  if (isFormValid.value) {
    // Handle login logic
    console.log('Form submitted:', {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    })
  }
}
</script>

<template>
  <div class="w-full space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Welcome Back
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Sign in to continue to your account
      </p>
    </div>

    <!-- Form -->
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Email -->
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

      <!-- Password -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            class="w-full h-12 pl-10 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            :class="{ 'border-red-500 dark:border-red-400': errors.password }"
            @blur="validatePassword"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
            <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <p v-if="errors.password" class="text-sm text-red-500 dark:text-red-400">
          {{ errors.password }}
        </p>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <GradientCheckbox
          v-model="rememberMe"
          label="Remember me"
        />
        <button
          type="button"
          @click="router.push('/forgot-password')"
          class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Forgot password?
        </button>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="!isFormValid"
        class="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Sign In
      </button>

      <!-- Register Link -->
      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <button 
            type="button"
            @click="router.push('/register')"
            class="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Create account
          </button>
        </p>
      </div>
    </form>
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