<template>
  <label :class="classes">
    <slot />
  </label>
</template>

<script setup>
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  muted: {
    type: Boolean,
    default: false
  }
});

const classes = computed(() =>
  cn(
    'text-sm font-medium text-slate-100',
    props.muted && 'text-slate-400'
  )
);
</script>
