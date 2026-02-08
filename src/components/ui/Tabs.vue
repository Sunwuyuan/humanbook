<template>
  <TabsRoot
    :class="classes"
    :default-value="defaultValue"
    :model-value="modelValue"
    v-bind="$attrs"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </TabsRoot>
</template>

<script setup>
import { computed } from 'vue';
import { TabsRoot } from 'radix-vue';
import { cn } from '@/lib/utils';

defineProps({
  modelValue: {
    type: String,
    default: undefined
  },
  defaultValue: {
    type: String,
    default: undefined
  }
});

const emit = defineEmits(['update:modelValue']);

const classes = computed(() => cn('w-full'));
</script>
