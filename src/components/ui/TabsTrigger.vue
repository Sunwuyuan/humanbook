<template>
  <TabsTrigger v-bind="$attrs" :class="classes">
    <slot />
  </TabsTrigger>
</template>

<script setup>
import { computed } from 'vue';
import { TabsTrigger } from 'radix-vue';
import { cn } from '@/lib/utils';

const classes = computed(() =>
  cn(
    'rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition data-[state=active]:bg-slate-100 data-[state=active]:text-slate-950 hover:bg-slate-800 hover:text-slate-100'
  )
);
</script>
