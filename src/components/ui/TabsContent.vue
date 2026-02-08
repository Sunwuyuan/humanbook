<template>
  <TabsContent v-bind="$attrs" :class="classes">
    <slot />
  </TabsContent>
</template>

<script setup>
import { computed } from 'vue';
import { TabsContent } from 'radix-vue';
import { cn } from '@/lib/utils';

const classes = computed(() => cn('mt-6'));
</script>
