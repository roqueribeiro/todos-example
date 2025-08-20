<template>
  <div class="space-y-6">
    <!-- Toolbar -->
    <div class="card p-3 flex items-center justify-between gap-3">
      <div class="flex flex-1 gap-2 items-center">
        <div class="relative flex-1">
          <input v-model="filters.search" placeholder="Buscar por título ou descrição..." class="input w-full pl-10" />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none">🔎</span>
        </div>
        <select v-model="filters.status" class="input">
          <option value="">Status</option>
          <option value="todo">A fazer</option>
          <option value="in_progress">Em progresso</option>
          <option value="done">Concluída</option>
        </select>
        <select v-model="filters.priority" class="input">
          <option value="">Prioridade</option>
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-secondary" @click="reload">Atualizar</button>
        <button @click="openCreate" class="btn">Nova Tarefa</button>
      </div>
    </div>

    <TaskModal :open="modalOpen" :initial="current" @close="closeModal" @saved="reload" />

    <!-- List -->
    <div class="grid gap-3">
      <div v-if="tasks.items.length === 0" class="text-sm opacity-70">Nenhuma tarefa encontrada.</div>
      <div v-else v-for="task in tasks.items" :key="task.id" class="card">
        <div class="flex items-start justify-between">
          <div>
            <div class="font-medium">{{ task.title }}</div>
            <div class="text-sm opacity-80" v-if="task.description">{{ task.description }}</div>
            <div class="text-xs mt-1 opacity-70">Status: {{ task.status }} • Prioridade: {{ task.priority }}</div>
          </div>
          <div class="flex gap-2">
            <button class="btn-secondary" @click="edit(task)">Editar</button>
            <button class="btn-danger" @click="remove(task.id)">Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination / Summary -->
    <div class="flex items-center justify-between gap-2">
      <div class="text-xs opacity-70">Total: {{ tasks.total }} itens</div>
      <div class="flex items-center gap-2">
        <button class="btn-secondary" :disabled="page===1" @click="page--; reload()">Anterior</button>
        <span class="text-sm">Página {{ page }}</span>
        <button class="btn-secondary" :disabled="page >= maxPage" @click="page++; reload()">Próxima</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTasksStore } from '../stores/tasks';
import TaskModal from '../components/TaskModal.vue';

const store = useTasksStore();
const { tasks } = storeToRefs(store);
const page = ref(1);
const limit = 10;
const filters = reactive({ status: '', priority: '', search: '' });
const maxPage = computed(() => Math.max(1, Math.ceil(tasks.value.total / limit)));

const modalOpen = ref(false);
const current = ref(null as any);

const reload = async () => {
  await store.fetch({ ...filters, page: String(page.value), limit: String(limit) });
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[TasksPage] after fetch -> items', tasks.value.items.length);
  }
};

const openCreate = () => { current.value = null; modalOpen.value = true; };
const closeModal = () => { modalOpen.value = false; };
const edit = (t: any) => { current.value = t; modalOpen.value = true; };
const remove = async (id: string) => { await store.remove(id); await reload(); };

// Filtros reativos
let searchTimer: number | undefined;
watch(() => filters.search, () => {
  page.value = 1;
  if (searchTimer) window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => reload(), 400);
});
watch(() => [filters.status, filters.priority], () => {
  page.value = 1;
  reload();
});
watch(page, () => reload());

onMounted(reload);
</script>

<style scoped>
.input {
  @apply px-4 py-3 rounded-xl backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700/30 outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 text-sm placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.1);
}

.input:focus {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(31, 38, 135, 0.15);
}

.btn {
  @apply px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm transition-all duration-300 shadow-lg;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.btn-secondary {
  @apply px-4 py-3 rounded-xl backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-700/30 text-sm font-medium transition-all duration-300;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.1);
}

.btn-secondary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(31, 38, 135, 0.15);
}

.btn-danger {
  @apply px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium text-sm transition-all duration-300 shadow-lg;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

.card {
  @apply p-6 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:bg-white/15 dark:hover:bg-gray-800/15;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.15);
}
</style>
