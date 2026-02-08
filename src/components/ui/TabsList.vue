<template>
  <TabsList v-bind="$attrs" :class="classes">
    <slot />
  </TabsList>
</template>

<script setup>
import { computed } from 'vue';
import { TabsList } from 'radix-vue';
import { cn } from '@/lib/utils';

const classes = computed(() =>
  cn(
    'inline-flex flex-wrap items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 p-2'
  )
);
</script>
