<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  }
});

const classes = computed(() =>
  cn(
    'rounded-xl border border-slate-800 bg-slate-900/60 text-slate-100 shadow-sm backdrop-blur',
    props.variant === 'soft' && 'bg-slate-900/40'
  )
);
</script>
