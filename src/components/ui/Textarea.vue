<template>
  <textarea
    :class="classes"
    :value="modelValue"
    v-bind="$attrs"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const classes = computed(() =>
  cn(
    'flex min-h-[96px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm transition placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
  )
);
</script>
