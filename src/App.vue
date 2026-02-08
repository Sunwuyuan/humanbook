<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 px-6 py-8 text-slate-100">
    <div class="mx-auto flex max-w-6xl flex-col gap-8">
      <header class="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <div class="flex flex-col gap-2">
          <p class="text-sm uppercase tracking-[0.2em] text-slate-400">Moltbook Electron Client</p>
          <h1 class="text-3xl font-semibold text-white">全功能 Moltbook 桌面客户端</h1>
          <p class="text-sm text-slate-300">
            使用 shadcn-vue 风格组件与 Moltbook API 构建的纯客户端应用。所有请求仅发送至
            <span class="font-semibold text-slate-100">www.moltbook.com</span>。
          </p>
        </div>
        <div class="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div class="space-y-2">
            <Label>API Base URL</Label>
            <Input v-model="baseUrl" placeholder="https://www.moltbook.com/api/v1" />
            <p class="text-xs text-amber-300">
              ⚠️ 请保持 www 域名，避免重定向丢失 Authorization。
            </p>
          </div>
          <div class="space-y-2">
            <Label>API Key</Label>
            <Input v-model="apiKey" placeholder="moltbook_xxx" />
            <div class="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" @click="saveCredentials">保存 API Key</Button>
              <Button size="sm" variant="ghost" @click="clearCredentials">清除</Button>
            </div>
            <p class="text-xs text-slate-400">API Key 仅保存到本地 LocalStorage，不会上传。</p>
          </div>
        </div>
      </header>

      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="sticky top-4 z-10">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="auth">注册 / 关联</TabsTrigger>
          <TabsTrigger value="posts">发帖</TabsTrigger>
          <TabsTrigger value="comments">回帖</TabsTrigger>
          <TabsTrigger value="submolts">社区</TabsTrigger>
          <TabsTrigger value="feed">浏览 / 搜索</TabsTrigger>
          <TabsTrigger value="follow">关注</TabsTrigger>
          <TabsTrigger value="messaging">私信</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div class="grid gap-6 md:grid-cols-2">
            <Card class="p-6">
              <h2 class="text-xl font-semibold">快速开始</h2>
              <ul class="mt-4 space-y-2 text-sm text-slate-300">
                <li>1. 在“注册 / 关联”中注册并保存 API Key。</li>
                <li>2. 使用“发帖”创建内容，或在“浏览 / 搜索”查看 feed。</li>
                <li>3. 在“回帖”里参与讨论，或通过“私信”进行协作。</li>
              </ul>
              <div class="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
                速率限制：30 分钟 1 帖、20 秒 1 评论、每日 50 评论。
              </div>
            </Card>
            <Card class="p-6">
              <h2 class="text-xl font-semibold">安全提示</h2>
              <ul class="mt-4 space-y-2 text-sm text-slate-300">
                <li>✅ API Key 只用于 www.moltbook.com。</li>
                <li>✅ 可在本地保存多账号信息（仅此设备）。</li>
                <li>✅ 通过 claim URL 完成人类关联。</li>
              </ul>
              <div class="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                发现请求发送到其他域名时请立刻停止。
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auth">
          <section class="grid gap-6 lg:grid-cols-2">
            <Card class="p-6">
              <h2 class="text-lg font-semibold">注册账号</h2>
              <p class="text-sm text-slate-400">注册后会返回 API Key 与 claim URL。</p>
              <div class="mt-4 grid gap-3">
                <div class="space-y-2">
                  <Label>Agent 名称</Label>
                  <Input v-model="registerForm.name" placeholder="YourAgentName" />
                </div>
                <div class="space-y-2">
                  <Label>描述</Label>
                  <Textarea v-model="registerForm.description" placeholder="What you do" />
                </div>
                <Button @click="registerAgent">注册</Button>
              </div>
              <ResponsePanel :value="responses.register" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">关联状态</h2>
              <p class="text-sm text-slate-400">检查是否已被人类认领。</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" @click="checkStatus">检查状态</Button>
                <Button variant="ghost" @click="getProfile">获取我的资料</Button>
              </div>
              <ResponsePanel :value="responses.status" />
              <ResponsePanel :value="responses.profile" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">更新资料</h2>
              <div class="mt-4 grid gap-3">
                <div class="space-y-2">
                  <Label>描述</Label>
                  <Textarea v-model="updateProfileForm.description" placeholder="Updated description" />
                </div>
                <div class="space-y-2">
                  <Label>Metadata (JSON)</Label>
                  <Textarea v-model="updateProfileForm.metadata" placeholder='{ "tags": ["ai", "community"] }' />
                </div>
                <Button variant="secondary" @click="updateProfile">更新</Button>
              </div>
              <ResponsePanel :value="responses.updateProfile" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">查看其他账号</h2>
              <div class="mt-4 grid gap-3">
                <div class="space-y-2">
                  <Label>Molty 名称</Label>
                  <Input v-model="otherProfileForm.name" placeholder="SomeMolty" />
                </div>
                <Button variant="secondary" @click="getOtherProfile">查看资料</Button>
              </div>
              <ResponsePanel :value="responses.otherProfile" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">头像管理</h2>
              <div class="mt-4 grid gap-3">
                <div class="space-y-2">
                  <Label>上传头像</Label>
                  <input class="text-sm text-slate-300" type="file" @change="handleAvatarFile" />
                </div>
                <Button variant="secondary" @click="uploadAvatar">上传</Button>
                <Button variant="ghost" @click="removeAvatar">移除头像</Button>
              </div>
              <ResponsePanel :value="responses.avatar" />
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="posts">
          <section class="grid gap-6 lg:grid-cols-2">
            <Card class="p-6">
              <h2 class="text-lg font-semibold">发布文本帖</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="postForm.submolt" placeholder="submolt (general)" />
                <Input v-model="postForm.title" placeholder="标题" />
                <Textarea v-model="postForm.content" placeholder="内容" />
                <Button @click="createPost">发布</Button>
              </div>
              <ResponsePanel :value="responses.createPost" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">发布链接帖</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="linkPostForm.submolt" placeholder="submolt (general)" />
                <Input v-model="linkPostForm.title" placeholder="标题" />
                <Input v-model="linkPostForm.url" placeholder="https://example.com" />
                <Button variant="secondary" @click="createLinkPost">发布链接</Button>
              </div>
              <ResponsePanel :value="responses.createLink" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">获取帖子</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="singlePostForm.id" placeholder="POST_ID" />
                <Button variant="secondary" @click="getPost">获取详情</Button>
              </div>
              <ResponsePanel :value="responses.getPost" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">删除帖子</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="deletePostForm.id" placeholder="POST_ID" />
                <Button variant="danger" @click="deletePost">删除</Button>
              </div>
              <ResponsePanel :value="responses.deletePost" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">帖子投票</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="postVoteForm.id" placeholder="POST_ID" />
                <div class="flex flex-wrap gap-2">
                  <Button variant="secondary" @click="upvotePost">赞同</Button>
                  <Button variant="ghost" @click="downvotePost">反对</Button>
                </div>
              </div>
              <ResponsePanel :value="responses.votePost" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">Pin / Unpin</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="pinPostForm.id" placeholder="POST_ID" />
                <div class="flex flex-wrap gap-2">
                  <Button variant="secondary" @click="pinPost">置顶</Button>
                  <Button variant="ghost" @click="unpinPost">取消置顶</Button>
                </div>
              </div>
              <ResponsePanel :value="responses.pinPost" />
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="comments">
          <section class="grid gap-6 lg:grid-cols-2">
            <Card class="p-6">
              <h2 class="text-lg font-semibold">评论帖子</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="commentForm.postId" placeholder="POST_ID" />
                <Textarea v-model="commentForm.content" placeholder="评论内容" />
                <Button @click="addComment">发送评论</Button>
              </div>
              <ResponsePanel :value="responses.addComment" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">回复评论</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="replyForm.postId" placeholder="POST_ID" />
                <Input v-model="replyForm.parentId" placeholder="COMMENT_ID" />
                <Textarea v-model="replyForm.content" placeholder="回复内容" />
                <Button variant="secondary" @click="replyComment">回复</Button>
              </div>
              <ResponsePanel :value="responses.replyComment" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">查看评论</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="listCommentsForm.postId" placeholder="POST_ID" />
                <select v-model="listCommentsForm.sort" class="h-10 rounded-md border border-slate-800 bg-slate-950 px-3 text-sm">
                  <option value="top">top</option>
                  <option value="new">new</option>
                  <option value="controversial">controversial</option>
                </select>
                <Button variant="secondary" @click="listComments">获取评论</Button>
              </div>
              <ResponsePanel :value="responses.listComments" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">评论投票</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="commentVoteForm.id" placeholder="COMMENT_ID" />
                <Button variant="secondary" @click="upvoteComment">赞同评论</Button>
              </div>
              <ResponsePanel :value="responses.voteComment" />
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="submolts">
          <section class="grid gap-6 lg:grid-cols-2">
            <Card class="p-6">
              <h2 class="text-lg font-semibold">创建社区</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="submoltForm.name" placeholder="name (aithoughts)" />
                <Input v-model="submoltForm.displayName" placeholder="display_name" />
                <Textarea v-model="submoltForm.description" placeholder="description" />
                <Button @click="createSubmolt">创建</Button>
              </div>
              <ResponsePanel :value="responses.createSubmolt" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">查询社区</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="submoltInfoForm.name" placeholder="submolt name" />
                <div class="flex flex-wrap gap-2">
                  <Button variant="secondary" @click="listSubmolts">获取列表</Button>
                  <Button variant="ghost" @click="getSubmolt">获取详情</Button>
                </div>
              </div>
              <ResponsePanel :value="responses.listSubmolts" />
              <ResponsePanel :value="responses.getSubmolt" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">订阅社区</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="submoltSubscribeForm.name" placeholder="submolt name" />
                <div class="flex flex-wrap gap-2">
                  <Button variant="secondary" @click="subscribeSubmolt">订阅</Button>
                  <Button variant="ghost" @click="unsubscribeSubmolt">取消订阅</Button>
                </div>
              </div>
              <ResponsePanel :value="responses.subscribeSubmolt" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">社区设置</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="submoltSettingsForm.name" placeholder="submolt name" />
                <Textarea v-model="submoltSettingsForm.description" placeholder="description" />
                <Input v-model="submoltSettingsForm.bannerColor" placeholder="#1a1a2e" />
                <Input v-model="submoltSettingsForm.themeColor" placeholder="#ff4500" />
                <Button variant="secondary" @click="updateSubmoltSettings">更新设置</Button>
              </div>
              <ResponsePanel :value="responses.updateSubmolt" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">社区图像</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="submoltAssetForm.name" placeholder="submolt name" />
                <select v-model="submoltAssetForm.type" class="h-10 rounded-md border border-slate-800 bg-slate-950 px-3 text-sm">
                  <option value="avatar">avatar</option>
                  <option value="banner">banner</option>
                </select>
                <input class="text-sm text-slate-300" type="file" @change="handleSubmoltAssetFile" />
                <Button variant="secondary" @click="uploadSubmoltAsset">上传</Button>
              </div>
              <ResponsePanel :value="responses.submoltAsset" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">社区管理员</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="moderatorForm.name" placeholder="submolt name" />
                <Input v-model="moderatorForm.agentName" placeholder="agent name" />
                <Input v-model="moderatorForm.role" placeholder="moderator" />
                <div class="flex flex-wrap gap-2">
                  <Button variant="secondary" @click="addModerator">添加</Button>
                  <Button variant="ghost" @click="removeModerator">移除</Button>
                  <Button variant="ghost" @click="listModerators">查看列表</Button>
                </div>
              </div>
              <ResponsePanel :value="responses.moderators" />
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="feed">
          <section class="grid gap-6 lg:grid-cols-2">
            <Card class="p-6">
              <h2 class="text-lg font-semibold">全站 Feed</h2>
              <div class="mt-4 grid gap-3">
                <select v-model="feedForm.sort" class="h-10 rounded-md border border-slate-800 bg-slate-950 px-3 text-sm">
                  <option value="hot">hot</option>
                  <option value="new">new</option>
                  <option value="top">top</option>
                  <option value="rising">rising</option>
                </select>
                <Input v-model="feedForm.limit" type="number" placeholder="limit" />
                <Button variant="secondary" @click="getFeed">获取</Button>
              </div>
              <ResponsePanel :value="responses.feed" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">社区 Feed</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="submoltFeedForm.name" placeholder="submolt name" />
                <select v-model="submoltFeedForm.sort" class="h-10 rounded-md border border-slate-800 bg-slate-950 px-3 text-sm">
                  <option value="hot">hot</option>
                  <option value="new">new</option>
                  <option value="top">top</option>
                  <option value="rising">rising</option>
                </select>
                <Button variant="secondary" @click="getSubmoltFeed">获取</Button>
              </div>
              <ResponsePanel :value="responses.submoltFeed" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">个性化 Feed</h2>
              <div class="mt-4 grid gap-3">
                <select v-model="personalFeedForm.sort" class="h-10 rounded-md border border-slate-800 bg-slate-950 px-3 text-sm">
                  <option value="hot">hot</option>
                  <option value="new">new</option>
                  <option value="top">top</option>
                </select>
                <Input v-model="personalFeedForm.limit" type="number" placeholder="limit" />
                <Button variant="secondary" @click="getPersonalFeed">获取</Button>
              </div>
              <ResponsePanel :value="responses.personalFeed" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">语义搜索</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="searchForm.q" placeholder="搜索内容" />
                <select v-model="searchForm.type" class="h-10 rounded-md border border-slate-800 bg-slate-950 px-3 text-sm">
                  <option value="all">all</option>
                  <option value="posts">posts</option>
                  <option value="comments">comments</option>
                </select>
                <Input v-model="searchForm.limit" type="number" placeholder="limit" />
                <Button variant="secondary" @click="searchContent">搜索</Button>
              </div>
              <ResponsePanel :value="responses.search" />
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="follow">
          <section class="grid gap-6 lg:grid-cols-2">
            <Card class="p-6">
              <h2 class="text-lg font-semibold">关注 / 取消关注</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="followForm.name" placeholder="Molty name" />
                <div class="flex flex-wrap gap-2">
                  <Button variant="secondary" @click="followAgent">关注</Button>
                  <Button variant="ghost" @click="unfollowAgent">取消关注</Button>
                </div>
              </div>
              <ResponsePanel :value="responses.follow" />
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="messaging">
          <section class="grid gap-6 lg:grid-cols-2">
            <Card class="p-6">
              <h2 class="text-lg font-semibold">私信概览</h2>
              <div class="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" @click="checkDm">检查活动</Button>
                <Button variant="ghost" @click="listRequests">查看请求</Button>
                <Button variant="ghost" @click="listConversations">查看会话</Button>
              </div>
              <ResponsePanel :value="responses.dmCheck" />
              <ResponsePanel :value="responses.dmRequests" />
              <ResponsePanel :value="responses.dmConversations" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">发送聊天请求</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="dmRequestForm.to" placeholder="to (agent name)" />
                <Input v-model="dmRequestForm.toOwner" placeholder="to_owner (@handle)" />
                <Textarea v-model="dmRequestForm.message" placeholder="message" />
                <Button @click="sendDmRequest">发送请求</Button>
              </div>
              <ResponsePanel :value="responses.dmRequest" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">处理请求</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="dmManageForm.id" placeholder="CONVERSATION_ID" />
                <label class="flex items-center gap-2 text-sm text-slate-300">
                  <input v-model="dmManageForm.block" type="checkbox" />
                  拒绝并阻止
                </label>
                <div class="flex flex-wrap gap-2">
                  <Button variant="secondary" @click="approveRequest">批准</Button>
                  <Button variant="ghost" @click="rejectRequest">拒绝</Button>
                </div>
              </div>
              <ResponsePanel :value="responses.dmManage" />
            </Card>

            <Card class="p-6">
              <h2 class="text-lg font-semibold">读取 / 发送消息</h2>
              <div class="mt-4 grid gap-3">
                <Input v-model="dmConversationForm.id" placeholder="CONVERSATION_ID" />
                <Textarea v-model="dmConversationForm.message" placeholder="message" />
                <label class="flex items-center gap-2 text-sm text-slate-300">
                  <input v-model="dmConversationForm.needsHuman" type="checkbox" />
                  需要人类介入
                </label>
                <div class="flex flex-wrap gap-2">
                  <Button variant="secondary" @click="readConversation">读取</Button>
                  <Button variant="ghost" @click="sendMessage">发送</Button>
                </div>
              </div>
              <ResponsePanel :value="responses.dmConversation" />
            </Card>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import Input from '@/components/ui/Input.vue';
import Label from '@/components/ui/Label.vue';
import Tabs from '@/components/ui/Tabs.vue';
import TabsContent from '@/components/ui/TabsContent.vue';
import TabsList from '@/components/ui/TabsList.vue';
import TabsTrigger from '@/components/ui/TabsTrigger.vue';
import Textarea from '@/components/ui/Textarea.vue';

const ResponsePanel = {
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  template: `
    <div v-if="value" class="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200">
      <div class="mb-2 flex items-center gap-2">
        <span class="h-2 w-2 rounded-full" :class="value.ok ? 'bg-emerald-400' : 'bg-rose-400'"></span>
        <span>{{ value.ok ? 'Success' : 'Error' }}</span>
      </div>
      <pre class="max-h-64 overflow-auto whitespace-pre-wrap break-words scrollbar-thin">{{ value.text }}</pre>
    </div>
  `
};

const baseUrl = ref('https://www.moltbook.com/api/v1');
const apiKey = ref(localStorage.getItem('moltbook_api_key') || '');
const activeTab = ref('overview');

const responses = reactive({});

const registerForm = reactive({ name: '', description: '' });
const updateProfileForm = reactive({ description: '', metadata: '' });
const otherProfileForm = reactive({ name: '' });
const postForm = reactive({ submolt: 'general', title: '', content: '' });
const linkPostForm = reactive({ submolt: 'general', title: '', url: '' });
const singlePostForm = reactive({ id: '' });
const deletePostForm = reactive({ id: '' });
const postVoteForm = reactive({ id: '' });
const pinPostForm = reactive({ id: '' });
const commentForm = reactive({ postId: '', content: '' });
const replyForm = reactive({ postId: '', parentId: '', content: '' });
const listCommentsForm = reactive({ postId: '', sort: 'top' });
const commentVoteForm = reactive({ id: '' });
const submoltForm = reactive({ name: '', displayName: '', description: '' });
const submoltInfoForm = reactive({ name: '' });
const submoltSubscribeForm = reactive({ name: '' });
const submoltSettingsForm = reactive({ name: '', description: '', bannerColor: '', themeColor: '' });
const submoltAssetForm = reactive({ name: '', type: 'avatar', file: null });
const moderatorForm = reactive({ name: '', agentName: '', role: 'moderator' });
const feedForm = reactive({ sort: 'hot', limit: 25 });
const submoltFeedForm = reactive({ name: '', sort: 'new' });
const personalFeedForm = reactive({ sort: 'new', limit: 25 });
const searchForm = reactive({ q: '', type: 'all', limit: 20 });
const followForm = reactive({ name: '' });
const dmRequestForm = reactive({ to: '', toOwner: '', message: '' });
const dmManageForm = reactive({ id: '', block: false });
const dmConversationForm = reactive({ id: '', message: '', needsHuman: false });

const avatarFile = ref(null);

const saveCredentials = () => {
  localStorage.setItem('moltbook_api_key', apiKey.value.trim());
};

const clearCredentials = () => {
  apiKey.value = '';
  localStorage.removeItem('moltbook_api_key');
};

const setResponse = (key, ok, payload) => {
  responses[key] = {
    ok,
    text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2)
  };
};

const apiRequest = async (key, path, { method = 'GET', body = null, auth = true } = {}) => {
  if (auth && !apiKey.value) {
    setResponse(key, false, '请先输入 API Key');
    return;
  }

  const headers = {};
  if (auth && apiKey.value) {
    headers.Authorization = `Bearer ${apiKey.value}`;
  }

  let payload;
  if (body instanceof FormData) {
    payload = body;
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${baseUrl.value}${path}`, {
      method,
      headers,
      body: payload
    });
    const text = await response.text();
    let data = text;
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = text;
    }
    setResponse(key, response.ok, data);
  } catch (error) {
    setResponse(key, false, error.message || '请求失败');
  }
};

const registerAgent = () =>
  apiRequest('register', '/agents/register', {
    method: 'POST',
    auth: false,
    body: {
      name: registerForm.name,
      description: registerForm.description
    }
  });

const checkStatus = () => apiRequest('status', '/agents/status');
const getProfile = () => apiRequest('profile', '/agents/me');

const updateProfile = () => {
  let metadata;
  if (updateProfileForm.metadata) {
    try {
      metadata = JSON.parse(updateProfileForm.metadata);
    } catch (error) {
      setResponse('updateProfile', false, 'Metadata 需要是合法 JSON');
      return;
    }
  }
  apiRequest('updateProfile', '/agents/me', {
    method: 'PATCH',
    body: {
      description: updateProfileForm.description || undefined,
      metadata
    }
  });
};

const getOtherProfile = () =>
  apiRequest('otherProfile', `/agents/profile?name=${encodeURIComponent(otherProfileForm.name)}`);

const handleAvatarFile = (event) => {
  avatarFile.value = event.target.files?.[0] || null;
};

const uploadAvatar = () => {
  if (!avatarFile.value) {
    setResponse('avatar', false, '请先选择文件');
    return;
  }
  const form = new FormData();
  form.append('file', avatarFile.value);
  apiRequest('avatar', '/agents/me/avatar', { method: 'POST', body: form });
};

const removeAvatar = () => apiRequest('avatar', '/agents/me/avatar', { method: 'DELETE' });

const createPost = () =>
  apiRequest('createPost', '/posts', {
    method: 'POST',
    body: {
      submolt: postForm.submolt,
      title: postForm.title,
      content: postForm.content
    }
  });

const createLinkPost = () =>
  apiRequest('createLink', '/posts', {
    method: 'POST',
    body: {
      submolt: linkPostForm.submolt,
      title: linkPostForm.title,
      url: linkPostForm.url
    }
  });

const getPost = () => apiRequest('getPost', `/posts/${encodeURIComponent(singlePostForm.id)}`);

const deletePost = () =>
  apiRequest('deletePost', `/posts/${encodeURIComponent(deletePostForm.id)}`, { method: 'DELETE' });

const upvotePost = () =>
  apiRequest('votePost', `/posts/${encodeURIComponent(postVoteForm.id)}/upvote`, { method: 'POST' });

const downvotePost = () =>
  apiRequest('votePost', `/posts/${encodeURIComponent(postVoteForm.id)}/downvote`, { method: 'POST' });

const pinPost = () =>
  apiRequest('pinPost', `/posts/${encodeURIComponent(pinPostForm.id)}/pin`, { method: 'POST' });

const unpinPost = () =>
  apiRequest('pinPost', `/posts/${encodeURIComponent(pinPostForm.id)}/pin`, { method: 'DELETE' });

const addComment = () =>
  apiRequest('addComment', `/posts/${encodeURIComponent(commentForm.postId)}/comments`, {
    method: 'POST',
    body: { content: commentForm.content }
  });

const replyComment = () =>
  apiRequest('replyComment', `/posts/${encodeURIComponent(replyForm.postId)}/comments`, {
    method: 'POST',
    body: { content: replyForm.content, parent_id: replyForm.parentId }
  });

const listComments = () =>
  apiRequest(
    'listComments',
    `/posts/${encodeURIComponent(listCommentsForm.postId)}/comments?sort=${listCommentsForm.sort}`
  );

const upvoteComment = () =>
  apiRequest('voteComment', `/comments/${encodeURIComponent(commentVoteForm.id)}/upvote`, {
    method: 'POST'
  });

const createSubmolt = () =>
  apiRequest('createSubmolt', '/submolts', {
    method: 'POST',
    body: {
      name: submoltForm.name,
      display_name: submoltForm.displayName,
      description: submoltForm.description
    }
  });

const listSubmolts = () => apiRequest('listSubmolts', '/submolts');

const getSubmolt = () => apiRequest('getSubmolt', `/submolts/${encodeURIComponent(submoltInfoForm.name)}`);

const subscribeSubmolt = () =>
  apiRequest('subscribeSubmolt', `/submolts/${encodeURIComponent(submoltSubscribeForm.name)}/subscribe`, {
    method: 'POST'
  });

const unsubscribeSubmolt = () =>
  apiRequest('subscribeSubmolt', `/submolts/${encodeURIComponent(submoltSubscribeForm.name)}/subscribe`, {
    method: 'DELETE'
  });

const updateSubmoltSettings = () =>
  apiRequest('updateSubmolt', `/submolts/${encodeURIComponent(submoltSettingsForm.name)}/settings`, {
    method: 'PATCH',
    body: {
      description: submoltSettingsForm.description || undefined,
      banner_color: submoltSettingsForm.bannerColor || undefined,
      theme_color: submoltSettingsForm.themeColor || undefined
    }
  });

const handleSubmoltAssetFile = (event) => {
  submoltAssetForm.file = event.target.files?.[0] || null;
};

const uploadSubmoltAsset = () => {
  if (!submoltAssetForm.file) {
    setResponse('submoltAsset', false, '请先选择文件');
    return;
  }
  const form = new FormData();
  form.append('file', submoltAssetForm.file);
  form.append('type', submoltAssetForm.type);
  apiRequest('submoltAsset', `/submolts/${encodeURIComponent(submoltAssetForm.name)}/settings`, {
    method: 'POST',
    body: form
  });
};

const addModerator = () =>
  apiRequest('moderators', `/submolts/${encodeURIComponent(moderatorForm.name)}/moderators`, {
    method: 'POST',
    body: {
      agent_name: moderatorForm.agentName,
      role: moderatorForm.role || 'moderator'
    }
  });

const removeModerator = () =>
  apiRequest('moderators', `/submolts/${encodeURIComponent(moderatorForm.name)}/moderators`, {
    method: 'DELETE',
    body: { agent_name: moderatorForm.agentName }
  });

const listModerators = () =>
  apiRequest('moderators', `/submolts/${encodeURIComponent(moderatorForm.name)}/moderators`);

const getFeed = () =>
  apiRequest('feed', `/posts?sort=${feedForm.sort}&limit=${feedForm.limit}`);

const getSubmoltFeed = () =>
  apiRequest('submoltFeed', `/submolts/${encodeURIComponent(submoltFeedForm.name)}/feed?sort=${submoltFeedForm.sort}`);

const getPersonalFeed = () =>
  apiRequest('personalFeed', `/feed?sort=${personalFeedForm.sort}&limit=${personalFeedForm.limit}`);

const searchContent = () =>
  apiRequest(
    'search',
    `/search?q=${encodeURIComponent(searchForm.q)}&type=${searchForm.type}&limit=${searchForm.limit}`
  );

const followAgent = () =>
  apiRequest('follow', `/agents/${encodeURIComponent(followForm.name)}/follow`, { method: 'POST' });

const unfollowAgent = () =>
  apiRequest('follow', `/agents/${encodeURIComponent(followForm.name)}/follow`, { method: 'DELETE' });

const checkDm = () => apiRequest('dmCheck', '/agents/dm/check');

const sendDmRequest = () =>
  apiRequest('dmRequest', '/agents/dm/request', {
    method: 'POST',
    body: {
      to: dmRequestForm.to || undefined,
      to_owner: dmRequestForm.toOwner || undefined,
      message: dmRequestForm.message
    }
  });

const listRequests = () => apiRequest('dmRequests', '/agents/dm/requests');

const approveRequest = () =>
  apiRequest('dmManage', `/agents/dm/requests/${encodeURIComponent(dmManageForm.id)}/approve`, {
    method: 'POST'
  });

const rejectRequest = () =>
  apiRequest('dmManage', `/agents/dm/requests/${encodeURIComponent(dmManageForm.id)}/reject`, {
    method: 'POST',
    body: dmManageForm.block ? { block: true } : undefined
  });

const listConversations = () => apiRequest('dmConversations', '/agents/dm/conversations');

const readConversation = () =>
  apiRequest('dmConversation', `/agents/dm/conversations/${encodeURIComponent(dmConversationForm.id)}`);

const sendMessage = () =>
  apiRequest('dmConversation', `/agents/dm/conversations/${encodeURIComponent(dmConversationForm.id)}/send`, {
    method: 'POST',
    body: {
      message: dmConversationForm.message,
      needs_human_input: dmConversationForm.needsHuman || undefined
    }
  });

watch(apiKey, (value) => {
  if (!value) return;
  localStorage.setItem('moltbook_api_key', value);
});
</script>
