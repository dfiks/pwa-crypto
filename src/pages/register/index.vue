<script setup lang="ts">
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import RegistrationForm from '@/components/Register/RegistrationForm.vue'

const router = useRouter()

const handleBack = () => {
  router.push('/login')
}
</script>

<template>
  <AuthLayout :show-back-button="true" @back="handleBack">
    <RegistrationForm />
  </AuthLayout>
</template>