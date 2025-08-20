<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-20 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-md" @click="$emit('close')"></div>
      <div class="glass-modal relative z-10 w-full max-w-lg mx-4 p-6 rounded-2xl transition-all">
        <h3 class="text-lg font-semibold mb-3">{{ initial ? 'Editar Tarefa' : 'Nova Tarefa' }}</h3>
        <form @submit.prevent="save">
          <div class="grid gap-3">
            <input v-model="form.title" required placeholder="Título" class="input" />
            <textarea v-model="form.description" rows="3" placeholder="Descrição" class="input"></textarea>
            <div class="grid grid-cols-3 gap-2">
              <select v-model="form.status" class="input">
                <option value="todo">A fazer</option>
                <option value="in_progress">Em progresso</option>
                <option value="done">Concluída</option>
              </select>
              <select v-model="form.priority" class="input">
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
              <input v-model="form.dueDate" type="date" class="input" />
            </div>
            <input v-model="tags" placeholder="Tags separadas por vírgula" class="input" />
          </div>
          <div class="mt-4 flex justify-end gap-2">
            <button type="button" class="btn-secondary" @click="$emit('close')">Cancelar</button>
            <button type="submit" class="btn">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue';
import { useTasksStore } from '../stores/tasks';

const props = defineProps<{ open: boolean; initial: any | null }>();
const emit = defineEmits(['close', 'saved']);
const store = useTasksStore();

const form = reactive({
  title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', tags: [] as string[],
});
const tags = ref('');

watch(() => props.initial, (val) => {
  if (val) {
    Object.assign(form, {
      title: val.title || '',
      description: val.description || '',
      status: val.status || 'todo',
      priority: val.priority || 'medium',
      dueDate: val.dueDate ? val.dueDate.substring(0,10) : '',
      tags: val.tags || [],
    });
    tags.value = form.tags.join(', ');
  } else {
    Object.assign(form, { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', tags: [] });
    tags.value = '';
  }
}, { immediate: true });

const save = async () => {
  form.tags = tags.value.split(',').map(t => t.trim()).filter(Boolean);
  if (props.initial) await store.update(props.initial.id, form);
  else await store.create(form);
  emit('saved');
  emit('close');
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.glass-modal {
  @apply backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20;
  box-shadow: 0 25px 50px rgba(31, 38, 135, 0.2);
}

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
</style>
