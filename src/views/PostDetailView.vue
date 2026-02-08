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
      <div class="max-w-3xl mx-auto space-y-6">
        <!-- Post Detail -->
        <div v-if="loading" class="text-center py-8">
          <p class="text-muted-foreground">Loading post...</p>
        </div>

        <Card v-else-if="post" class="shadow-lg">
          <CardHeader>
            <CardTitle class="text-2xl">{{ post.title }}</CardTitle>
            <div class="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span>By {{ post.author?.displayName || post.author?.username }}</span>
              <span>•</span>
              <span>{{ formatDate(post.createdAt) }}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-foreground whitespace-pre-wrap mb-4">{{ post.content }}</p>
            <div v-if="post.tags && post.tags.length" class="flex gap-2 mb-4">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
              >
                #{{ tag }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <button
                @click="likePost"
                class="flex items-center gap-1 hover:text-primary"
              >
                <span>❤️</span>
                <span>{{ post.likes || 0 }}</span>
              </button>
              <span class="flex items-center gap-1">
                <span>💬</span>
                <span>{{ comments.length }}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <!-- Add Comment -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Add a Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="submitComment" class="space-y-4">
              <Textarea
                v-model="newComment"
                placeholder="Share your thoughts..."
                class="min-h-[100px]"
                required
              />
              <div v-if="commentError" class="text-sm text-destructive">
                {{ commentError }}
              </div>
              <Button type="submit" :disabled="submittingComment">
                {{ submittingComment ? 'Posting...' : 'Post Comment' }}
              </Button>
            </form>
          </CardContent>
        </Card>

        <!-- Comments List -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Comments ({{ comments.length }})</h2>

          <div v-if="loadingComments" class="text-center py-4">
            <p class="text-muted-foreground">Loading comments...</p>
          </div>

          <Card v-for="comment in comments" :key="comment.id" class="bg-muted/30">
            <CardContent class="pt-6">
              <div class="flex items-start gap-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-semibold text-sm">
                      {{ comment.author?.displayName || comment.author?.username }}
                    </span>
                    <span class="text-xs text-muted-foreground">
                      {{ formatDate(comment.createdAt) }}
                    </span>
                  </div>
                  <p class="text-foreground whitespace-pre-wrap">{{ comment.content }}</p>
                  <div class="flex items-center gap-4 mt-2">
                    <button
                      @click="likeComment(comment.id)"
                      class="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <span>❤️</span>
                      <span>{{ comment.likes || 0 }}</span>
                    </button>
                    <button
                      @click="replyToComment(comment)"
                      class="text-xs text-muted-foreground hover:text-primary"
                    >
                      Reply
                    </button>
                  </div>

                  <!-- Reply Form -->
                  <div v-if="replyingTo === comment.id" class="mt-3 pl-4 border-l-2 border-muted">
                    <form @submit.prevent="submitReply(comment.id)" class="space-y-2">
                      <Textarea
                        v-model="replyContent"
                        placeholder="Write a reply..."
                        class="min-h-[80px]"
                        required
                      />
                      <div class="flex gap-2">
                        <Button type="submit" size="sm" :disabled="submittingReply">
                          {{ submittingReply ? 'Posting...' : 'Reply' }}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          @click="cancelReply"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>

                  <!-- Nested Replies -->
                  <div v-if="comment.replies && comment.replies.length" class="mt-3 pl-4 border-l-2 border-muted space-y-3">
                    <div v-for="reply in comment.replies" :key="reply.id" class="bg-background/50 p-3 rounded">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="font-semibold text-sm">
                          {{ reply.author?.displayName || reply.author?.username }}
                        </span>
                        <span class="text-xs text-muted-foreground">
                          {{ formatDate(reply.createdAt) }}
                        </span>
                      </div>
                      <p class="text-foreground whitespace-pre-wrap text-sm">{{ reply.content }}</p>
                      <button
                        @click="likeComment(reply.id)"
                        class="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-2"
                      >
                        <span>❤️</span>
                        <span>{{ reply.likes || 0 }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div v-if="comments.length === 0 && !loadingComments" class="text-center py-8">
            <p class="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/client'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Textarea from '@/components/ui/Textarea.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const post = ref<any>(null)
const comments = ref<any[]>([])
const loading = ref(true)
const loadingComments = ref(false)

const newComment = ref('')
const submittingComment = ref(false)
const commentError = ref('')

const replyingTo = ref<string | null>(null)
const replyContent = ref('')
const submittingReply = ref(false)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const loadPost = async () => {
  loading.value = true
  try {
    const postId = route.params.id as string
    const response = await api.getPost(postId)
    if (response.success) {
      post.value = response.post
    }
  } catch (error) {
    console.error('Failed to load post:', error)
  } finally {
    loading.value = false
  }
}

const loadComments = async () => {
  loadingComments.value = true
  try {
    const postId = route.params.id as string
    const response = await api.getComments(postId, { limit: 100 })
    if (response.success) {
      comments.value = response.comments
    }
  } catch (error) {
    console.error('Failed to load comments:', error)
  } finally {
    loadingComments.value = false
  }
}

const submitComment = async () => {
  submittingComment.value = true
  commentError.value = ''

  try {
    const postId = route.params.id as string
    const response = await api.createComment(postId, {
      content: newComment.value,
    })

    if (response.success) {
      newComment.value = ''
      loadComments()
    }
  } catch (error: any) {
    commentError.value = error.response?.data?.error?.message || 'Failed to post comment'
  } finally {
    submittingComment.value = false
  }
}

const replyToComment = (comment: any) => {
  replyingTo.value = comment.id
  replyContent.value = ''
}

const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
}

const submitReply = async (parentCommentId: string) => {
  submittingReply.value = true

  try {
    const postId = route.params.id as string
    const response = await api.createComment(postId, {
      content: replyContent.value,
      parentCommentId,
    })

    if (response.success) {
      replyingTo.value = null
      replyContent.value = ''
      loadComments()
    }
  } catch (error) {
    console.error('Failed to post reply:', error)
  } finally {
    submittingReply.value = false
  }
}

const likePost = async () => {
  try {
    if (post.value) {
      await api.likePost(post.value.id)
      loadPost()
    }
  } catch (error) {
    console.error('Failed to like post:', error)
  }
}

const likeComment = async (commentId: string) => {
  try {
    await api.likeComment(commentId)
    loadComments()
  } catch (error) {
    console.error('Failed to like comment:', error)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadPost()
  loadComments()
})
</script>
