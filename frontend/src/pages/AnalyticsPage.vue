<template>
  <div class="grid md:grid-cols-2 gap-4">
    <div class="card">
      <div class="font-semibold mb-2">Resumo</div>
      <div class="text-sm opacity-80">Total: {{ total }} tarefas</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useTasksStore } from '../stores/tasks';
const store = useTasksStore();
const total = computed(() => store.tasks.total);
</script>
<style scoped>
.card { @apply p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur shadow-sm; }
</style>
