<script setup lang="ts">
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import ForgotPasswordForm from '@/components/ForgotPassword/ForgotPasswordForm.vue'

const router = useRouter()

const handleBack = () => {
  router.push('/login')
}
</script>

<template>
  <AuthLayout :show-back-button="true" @back="handleBack">
    <ForgotPasswordForm />
  </AuthLayout>
</template>