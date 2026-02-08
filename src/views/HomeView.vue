<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation -->
    <nav class="border-b bg-card">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-primary">HumanBook</h1>
        <div class="flex items-center gap-4">
          <Button @click="showCreatePost = true" size="sm">
            Create Post
          </Button>
          <Button @click="handleLogout" variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto space-y-6">
        <!-- Create Post Modal Overlay -->
        <div
          v-if="showCreatePost"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="showCreatePost = false"
        >
          <Card class="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>Share your thoughts with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <form @submit.prevent="submitPost" class="space-y-4">
                <div class="space-y-2">
                  <Label for="title">Title</Label>
                  <Input
                    id="title"
                    v-model="newPost.title"
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <Label for="content">Content</Label>
                  <Textarea
                    id="content"
                    v-model="newPost.content"
                    placeholder="What's on your mind?"
                    class="min-h-[200px]"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <Label for="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    v-model="newPost.tagsInput"
                    placeholder="technology, programming, etc."
                  />
                </div>
                <div v-if="postError" class="text-sm text-destructive">
                  {{ postError }}
                </div>
                <div class="flex gap-2">
                  <Button type="submit" :disabled="submitting">
                    {{ submitting ? 'Posting...' : 'Post' }}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    @click="showCreatePost = false"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <!-- Posts Feed -->
        <div v-if="loading" class="text-center py-8">
          <p class="text-muted-foreground">Loading posts...</p>
        </div>

        <div v-else class="space-y-4">
          <Card v-for="post in posts" :key="post.id" class="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <CardTitle class="text-xl cursor-pointer hover:text-primary" @click="viewPost(post.id)">
                    {{ post.title }}
                  </CardTitle>
                  <div class="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <span>By {{ post.author?.displayName || post.author?.username }}</span>
                    <span>•</span>
                    <span>{{ formatDate(post.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p class="text-foreground whitespace-pre-wrap line-clamp-3">{{ post.content }}</p>
              <div v-if="post.tags && post.tags.length" class="flex gap-2 mt-4">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                >
                  #{{ tag }}
                </span>
              </div>
              <div class="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <button
                  @click="likePost(post.id)"
                  class="flex items-center gap-1 hover:text-primary"
                >
                  <span>❤️</span>
                  <span>{{ post.likes || 0 }}</span>
                </button>
                <button
                  @click="viewPost(post.id)"
                  class="flex items-center gap-1 hover:text-primary"
                >
                  <span>💬</span>
                  <span>{{ post.comments || 0 }}</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <div v-if="posts.length === 0" class="text-center py-12">
            <p class="text-muted-foreground text-lg">No posts yet. Be the first to post!</p>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2">
            <Button
              @click="loadPage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span class="flex items-center px-4 text-sm text-muted-foreground">
              Page {{ pagination.page }} of {{ pagination.totalPages }}
            </span>
            <Button
              @click="loadPage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages"
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
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

const posts = ref<any[]>([])
const loading = ref(true)
const showCreatePost = ref(false)
const submitting = ref(false)
const postError = ref('')

const newPost = ref({
  title: '',
  content: '',
  tagsInput: '',
})

const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const loadPosts = async (page = 1) => {
  loading.value = true
  try {
    const response = await api.getPosts({ page, limit: pagination.value.limit, sort: 'latest' })
    if (response.success) {
      posts.value = response.posts
      if (response.pagination) {
        pagination.value = response.pagination
      }
    }
  } catch (error) {
    console.error('Failed to load posts:', error)
  } finally {
    loading.value = false
  }
}

const loadPage = (page: number) => {
  loadPosts(page)
}

const submitPost = async () => {
  submitting.value = true
  postError.value = ''

  try {
    const tags = newPost.value.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const response = await api.createPost({
      title: newPost.value.title,
      content: newPost.value.content,
      tags,
      visibility: 'public',
    })

    if (response.success) {
      showCreatePost.value = false
      newPost.value = { title: '', content: '', tagsInput: '' }
      loadPosts()
    }
  } catch (error: any) {
    postError.value = error.response?.data?.error?.message || 'Failed to create post'
  } finally {
    submitting.value = false
  }
}

const viewPost = (postId: string) => {
  router.push(`/post/${postId}`)
}

const likePost = async (postId: string) => {
  try {
    await api.likePost(postId)
    loadPosts(pagination.value.page)
  } catch (error) {
    console.error('Failed to like post:', error)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadPosts()
})
</script>
