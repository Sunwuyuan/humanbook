<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation -->
    <nav class="border-b bg-card">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-primary cursor-pointer" @click="router.push('/home')">
          HumanBook
        </h1>
        <div class="flex items-center gap-4">
          <Button @click="router.push('/home')" variant="outline" size="sm">
            Back to Feed
          </Button>
          <Button @click="handleLogout" variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your profile and linked accounts</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Profile Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Profile Information</h3>
              <div class="space-y-2">
                <Label for="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  v-model="profile.displayName"
                  placeholder="John Doe"
                />
              </div>
              <div class="space-y-2">
                <Label for="bio">Bio</Label>
                <Textarea
                  id="bio"
                  v-model="profile.bio"
                  placeholder="Tell us about yourself..."
                  class="min-h-[100px]"
                />
              </div>
              <div class="space-y-2">
                <Label for="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  v-model="profile.avatar"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div v-if="profileError" class="text-sm text-destructive">
                {{ profileError }}
              </div>
              <div v-if="profileSuccess" class="text-sm text-green-600">
                Profile updated successfully!
              </div>
              <Button @click="updateProfile" :disabled="updatingProfile">
                {{ updatingProfile ? 'Updating...' : 'Update Profile' }}
              </Button>
            </div>

            <!-- Divider -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold mb-4">Linked Accounts</h3>
              
              <!-- Existing Linked Accounts -->
              <div v-if="linkedAccounts.length > 0" class="space-y-2 mb-4">
                <Card v-for="account in linkedAccounts" :key="account.platform" class="bg-muted/30">
                  <CardContent class="pt-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-semibold">{{ account.platform }}</p>
                        <p class="text-sm text-muted-foreground">
                          User ID: {{ account.platformUserId }}
                        </p>
                        <p class="text-xs text-muted-foreground">
                          Linked: {{ formatDate(account.linkedAt) }}
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Unlink
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Link New Account -->
              <Card class="bg-primary/5">
                <CardHeader>
                  <CardTitle class="text-base">Link New Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form @submit.prevent="linkAccount" class="space-y-4">
                    <div class="space-y-2">
                      <Label for="platform">Platform</Label>
                      <Input
                        id="platform"
                        v-model="linkForm.platform"
                        placeholder="e.g., GitHub, Twitter, Discord"
                        required
                      />
                    </div>
                    <div class="space-y-2">
                      <Label for="platformUserId">Platform User ID</Label>
                      <Input
                        id="platformUserId"
                        v-model="linkForm.platformUserId"
                        placeholder="Your user ID on the platform"
                        required
                      />
                    </div>
                    <div class="space-y-2">
                      <Label for="credentials">Credentials (JSON)</Label>
                      <Textarea
                        id="credentials"
                        v-model="linkForm.credentialsJson"
                        placeholder='{"token": "your-token"}'
                        class="min-h-[80px] font-mono text-sm"
                      />
                    </div>
                    <div v-if="linkError" class="text-sm text-destructive">
                      {{ linkError }}
                    </div>
                    <div v-if="linkSuccess" class="text-sm text-green-600">
                      Account linked successfully!
                    </div>
                    <Button type="submit" :disabled="linkingAccount">
                      {{ linkingAccount ? 'Linking...' : 'Link Account' }}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/client'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Textarea from '@/components/ui/Textarea.vue'

const router = useRouter()
const authStore = useAuthStore()

const profile = ref({
  displayName: '',
  bio: '',
  avatar: '',
})

const linkedAccounts = ref<any[]>([])

const updatingProfile = ref(false)
const profileError = ref('')
const profileSuccess = ref(false)

const linkForm = ref({
  platform: '',
  platformUserId: '',
  credentialsJson: '',
})

const linkingAccount = ref(false)
const linkError = ref('')
const linkSuccess = ref(false)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const updateProfile = async () => {
  updatingProfile.value = true
  profileError.value = ''
  profileSuccess.value = false

  try {
    await api.updateProfile({
      displayName: profile.value.displayName,
      bio: profile.value.bio,
      avatar: profile.value.avatar,
    })
    profileSuccess.value = true
    setTimeout(() => {
      profileSuccess.value = false
    }, 3000)
  } catch (error: any) {
    profileError.value = error.response?.data?.error?.message || 'Failed to update profile'
  } finally {
    updatingProfile.value = false
  }
}

const linkAccount = async () => {
  linkingAccount.value = true
  linkError.value = ''
  linkSuccess.value = false

  try {
    let credentials = {}
    if (linkForm.value.credentialsJson) {
      try {
        credentials = JSON.parse(linkForm.value.credentialsJson)
      } catch {
        linkError.value = 'Invalid JSON in credentials field'
        linkingAccount.value = false
        return
      }
    }

    const response = await api.linkAccount({
      platform: linkForm.value.platform,
      platformUserId: linkForm.value.platformUserId,
      credentials,
    })

    if (response.success) {
      linkedAccounts.value.push(response.linkedAccount)
      linkForm.value = { platform: '', platformUserId: '', credentialsJson: '' }
      linkSuccess.value = true
      setTimeout(() => {
        linkSuccess.value = false
      }, 3000)
    }
  } catch (error: any) {
    linkError.value = error.response?.data?.error?.message || 'Failed to link account'
  } finally {
    linkingAccount.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  if (authStore.user) {
    profile.value.displayName = authStore.user.displayName || ''
    profile.value.bio = authStore.user.bio || ''
    profile.value.avatar = authStore.user.avatar || ''
  }
})
</script>
