<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/stores/auth'
import { 
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const errors = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
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

const validateUsername = () => {
  if (!username.value) {
    errors.value.username = t('validation.usernameRequired')
    return false
  }
  if (username.value.length < 3) {
    errors.value.username = t('validation.usernameLength')
    return false
  }
  errors.value.username = ''
  return true
}

const validatePassword = () => {
  if (!password.value) {
    errors.value.password = t('validation.passwordRequired')
    return false
  }
  if (password.value.length < 8) {
    errors.value.password = t('validation.passwordLength')
    return false
  }
  if (!/[A-Z]/.test(password.value)) {
    errors.value.password = t('validation.passwordUppercase')
    return false
  }
  if (!/[a-z]/.test(password.value)) {
    errors.value.password = t('validation.passwordLowercase')
    return false
  }
  if (!/[0-9]/.test(password.value)) {
    errors.value.password = t('validation.passwordNumber')
    return false
  }
  errors.value.password = ''
  return true
}

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    errors.value.confirmPassword = t('validation.confirmPasswordRequired')
    return false
  }
  if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = t('validation.passwordsDoNotMatch')
    return false
  }
  errors.value.confirmPassword = ''
  return true
}

const isFormValid = computed(() => {
  return validateEmail() && 
         validateUsername() && 
         validatePassword() && 
         validateConfirmPassword()
})

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  try {
    await authStore.register({
      email: email.value,
      username: username.value,
      password: password.value
    })
    
    // Redirect to dashboard on success
    router.push('/')
  } catch (err) {
    // Error handling is done in the store
    console.error('Registration failed:', err)
  }
}
</script>

<template>
  <div class="w-full space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {{ t('register.title') }}
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {{ t('register.subtitle') }}
      </p>
    </div>

    <!-- Form -->
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Email -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('register.emailPlaceholder') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EnvelopeIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="email"
            type="email"
            :placeholder="t('register.emailPlaceholder')"
            class="w-full h-12 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            :class="{ 'border-red-500 dark:border-red-400': errors.email }"
            @blur="validateEmail"
          />
        </div>
        <p v-if="errors.email" class="text-sm text-red-500 dark:text-red-400">
          {{ errors.email }}
        </p>
      </div>

      <!-- Username -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('register.usernamePlaceholder') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="username"
            type="text"
            :placeholder="t('register.usernamePlaceholder')"
            class="w-full h-12 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            :class="{ 'border-red-500 dark:border-red-400': errors.username }"
            @blur="validateUsername"
          />
        </div>
        <p v-if="errors.username" class="text-sm text-red-500 dark:text-red-400">
          {{ errors.username }}
        </p>
      </div>

      <!-- Password -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('register.passwordPlaceholder') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="t('register.passwordPlaceholder')"
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

      <!-- Confirm Password -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('register.confirmPasswordPlaceholder') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="t('register.confirmPasswordPlaceholder')"
            class="w-full h-12 pl-10 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            :class="{ 'border-red-500 dark:border-red-400': errors.confirmPassword }"
            @blur="validateConfirmPassword"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5 text-gray-400" />
            <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="text-sm text-red-500 dark:text-red-400">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="!isFormValid || authStore.isLoading"
        class="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative"
      >
        <span :class="{ 'opacity-0': authStore.isLoading }">
          {{ t('register.submitButton') }}
        </span>
        <div v-if="authStore.isLoading" 
             class="absolute inset-0 flex items-center justify-center">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </button>

      <!-- Sign In Link -->
      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ t('register.alreadyHaveAccount') }}
          <button 
            type="button"
            @click="router.push('/login')"
            class="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            {{ t('register.signInLink') }}
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