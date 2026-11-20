<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import AppCard from '@/components/common/AppCard.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppBadge from '@/components/common/AppBadge.vue';
import { useApi } from '@/composables/useApi';
import type { User, CreateUserPayload } from '@/types';

const { getUsers, createUser, deleteUser } = useApi();

const users = ref<User[]>([]);
const isLoading = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const form = reactive<CreateUserPayload>({
  name: '',
  email: '',
  role: 'user',
});

const fetchUsers = async (): Promise<void> => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    const response = await getUsers();
    users.value = response.data;
  } catch (error) {
    errorMessage.value = 'Failed to load users from backend API. Ensure Express is running.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleCreateUser = async (): Promise<void> => {
  if (!form.name || !form.email) return;

  isSubmitting.value = true;
  errorMessage.value = null;
  try {
    const res = await createUser({
      name: form.name,
      email: form.email,
      role: form.role,
    });
    users.value.push(res.data);
    form.name = '';
    form.email = '';
  } catch (error) {
    errorMessage.value = 'Error creating user. Check payload or email uniqueness.';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteUser = async (id: string): Promise<void> => {
  try {
    await deleteUser(id);
    users.value = users.value.filter((u) => u.id !== id);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  void fetchUsers();
});
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__intro">
      <h2 class="dashboard__heading">System Architecture & Standards Dashboard</h2>
      <p class="dashboard__subtext">
        Demonstrating tightly-coupled TypeScript, reusable components, path aliases, and clean code principles.
      </p>
    </div>

    <div v-if="errorMessage" class="dashboard__alert">
      <span>⚠️ {{ errorMessage }}</span>
    </div>

    <div class="dashboard__grid">
      <!-- Users List Card -->
      <AppCard title="Users Directory" subtitle="Loaded dynamically from Express backend" :bordered="true">
        <div v-if="isLoading" class="dashboard__loading">
          Loading users...
        </div>
        <div v-else-if="users.length === 0" class="dashboard__empty">
          No users found.
        </div>
        <ul v-else class="user-list">
          <li v-for="user in users" :key="user.id" class="user-item">
            <div class="user-item__info">
              <span class="user-item__name">{{ user.name }}</span>
              <span class="user-item__email">{{ user.email }}</span>
            </div>
            <div class="user-item__actions">
              <AppBadge :variant="user.role === 'admin' ? 'info' : 'neutral'">
                {{ user.role }}
              </AppBadge>
              <AppButton variant="danger" size="sm" @click="handleDeleteUser(user.id)">
                Delete
              </AppButton>
            </div>
          </li>
        </ul>

        <template #footer>
          <div class="card-footer-action">
            <AppButton variant="outline" size="sm" :loading="isLoading" @click="fetchUsers">
              Refresh Users
            </AppButton>
          </div>
        </template>
      </AppCard>

      <!-- Add User Card -->
      <AppCard title="Add New User" subtitle="Strictly validated with DTOs and Zod" :bordered="true">
        <form class="user-form" @submit.prevent="handleCreateUser">
          <div class="form-group">
            <label class="form-label" for="name">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="form-input"
              placeholder="e.g. Charlie Brown"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="e.g. charlie@example.com"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label" for="role">User Role</label>
            <select id="role" v-model="form.role" class="form-select">
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <AppButton type="submit" variant="primary" :loading="isSubmitting">
            Create User
          </AppButton>
        </form>
      </AppCard>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard__heading {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.dashboard__subtext {
  color: var(--color-text-muted);
  margin-top: 4px;
}

.dashboard__alert {
  padding: 12px 16px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
}

.user-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: var(--radius-sm);
  background-color: #f8fafc;
  border: 1px solid var(--color-border);
}

.user-item__info {
  display: flex;
  flex-direction: column;
}

.user-item__name {
  font-weight: 600;
  font-size: 0.9375rem;
}

.user-item__email {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.user-item__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-footer-action {
  display: flex;
  justify-content: flex-end;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text);
}

.form-input,
.form-select {
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dashboard__loading,
.dashboard__empty {
  padding: 24px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>
