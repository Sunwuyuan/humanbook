<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>{{ isLogin ? 'Login' : 'Register' }}</CardTitle>
        <CardDescription>
          {{ isLogin ? 'Welcome back to HumanBook' : 'Create your HumanBook account' }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="!isLogin" class="space-y-2">
            <Label for="displayName">Display Name</Label>
            <Input
              id="displayName"
              v-model="form.displayName"
              placeholder="John Doe"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="username">Username</Label>
            <Input
              id="username"
              v-model="form.username"
              placeholder="johndoe"
              required
            />
          </div>

          <div v-if="!isLogin" class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="form.email"
              placeholder="john@example.com"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              v-model="form.password"
              placeholder="••••••••"
              required
            />
          </div>

          <div v-if="error" class="text-sm text-destructive">
            {{ error }}
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register') }}
          </Button>

          <div class="text-center text-sm">
            <button
              type="button"
              @click="toggleMode"
              class="text-primary hover:underline"
            >
              {{ isLogin ? "Don't have an account? Register" : 'Already have an account? Login' }}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const loading = ref(false)
const error = ref('')

const form = ref({
  username: '',
  email: '',
  password: '',
  displayName: '',
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    let result
    if (isLogin.value) {
      result = await authStore.login(form.value.username, form.value.password)
    } else {
      result = await authStore.register({
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        displayName: form.value.displayName,
      })
    }

    if (result.success) {
      router.push('/home')
    } else {
      error.value = result.error || 'An error occurred'
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
