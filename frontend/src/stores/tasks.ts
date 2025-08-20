import { defineStore } from 'pinia';
import api from '../services/api';

type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string | null;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
};

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: { items: [] as Task[], total: 0 },
  }),
  actions: {
    async fetch(params: Record<string, unknown>) {
      const cleaned = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null),
      );
      const { data } = await api.get('/tasks', { params: cleaned });
      // Evita trocar a referência do objeto para manter reatividade estável
      this.tasks.items = data.items ?? [];
      this.tasks.total = data.total ?? 0;
      // Debug em dev
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[store:tasks] fetch -> items', this.tasks.items.length, 'total', this.tasks.total);
      }
    },
    async create(payload: Partial<Task>) {
      await api.post('/tasks', payload);
    },
    async update(id: string, payload: Partial<Task>) {
      await api.patch(`/tasks/${id}`, payload);
    },
    async remove(id: string) {
      await api.delete(`/tasks/${id}`);
    },
  },
});
