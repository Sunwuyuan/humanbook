<template>
  <button
    :class="classes"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'md'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50',
    props.variant === 'default' && 'bg-slate-100 text-slate-950 hover:bg-slate-200',
    props.variant === 'secondary' && 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    props.variant === 'ghost' && 'bg-transparent text-slate-100 hover:bg-slate-900',
    props.variant === 'danger' && 'bg-rose-500 text-white hover:bg-rose-400',
    props.size === 'sm' && 'h-8 px-3',
    props.size === 'md' && 'h-10 px-4',
    props.size === 'lg' && 'h-11 px-6'
  )
);
</script>
