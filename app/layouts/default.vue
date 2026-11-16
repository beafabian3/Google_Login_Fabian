<script setup lang="ts">
const drawer = ref(true)
const route = useRoute()
const user = useAuthUser()

const navItems = [
  { title: 'Welcome', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'Scan', icon: 'mdi-qrcode-scan', to: '/scan' },
  { title: 'Weather', icon: 'mdi-weather-partly-cloudy', to: '/weather' },
]

function handleLogout() {
  clearAuthUser()
  navigateTo('/login')
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" permanent class="app-drawer">
      <div v-if="user" class="pa-4 d-flex align-center">
        <v-avatar size="40" class="mr-3">
          <v-img :src="user.picture" :alt="user.name" />
        </v-avatar>
        <div class="text-truncate">
          <div class="text-body-2 font-weight-medium text-truncate">{{ user.name }}</div>
          <div class="text-caption text-medium-emphasis text-truncate">{{ user.email }}</div>
        </div>
      </div>

      <v-divider />

      <v-list nav density="comfortable">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :active="route.path === item.to"
          rounded="lg"
        />
      </v-list>

      <template #append>
        <v-divider />
        <v-list nav>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            rounded="lg"
            @click="handleLogout"
          />
        </v-list>
        <div class="text-center text-caption text-medium-emphasis pb-2">
          © {{ new Date().getFullYear() }}
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar flat class="app-bar">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>{{ route.meta.title || 'App' }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid class="page-container">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
html,
body,
.v-application {
  background: #101a2b !important;
}

.app-drawer {
  border-right: 1px solid rgba(148, 180, 204, 0.12) !important;
  background: #121f32 !important;
}

.app-bar {
  border-bottom: 1px solid rgba(148, 180, 204, 0.1);
  background: #101a2b !important;
}

.page-container {
  max-width: 1280px;
  padding: 24px;
}

.v-list-item--active {
  color: #8bd5c5 !important;
}

@media (max-width: 600px) {
  .page-container {
    padding: 16px;
  }
}
</style>
