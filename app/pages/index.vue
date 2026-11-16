<script setup lang="ts">
import { useWeather } from '../composables/useWeather'

definePageMeta({ title: 'Welcome' })
const user = useAuthUser()
const { fetchWeather } = useWeather()
const weather = ref<Awaited<ReturnType<typeof fetchWeather>> | null>(null)
const weatherError = ref('')
const weatherLoading = ref(true)

onMounted(async () => {
  try {
    weather.value = await fetchWeather()
  } catch {
    weatherError.value = 'Unable to load weather right now.'
  } finally {
    weatherLoading.value = false
  }
})
</script>

<template>
  <div class="welcome-page">
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card pa-6" rounded="lg">
          <div v-if="user" class="d-flex align-center mb-4">
            <v-avatar size="56" class="mr-4">
              <v-img :src="user.picture" :alt="user.name" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">Welcome, {{ user.name }}!</div>
              <div class="text-body-2 text-medium-emphasis">
                Here's a quick overview of what you can do.
              </div>
            </div>
          </div>
          <div v-else>
            <div class="text-h4 font-weight-bold">Welcome!</div>
            <div class="text-body-1 text-medium-emphasis mt-2">
              Scan a QR code or check the weather in your area.
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-1">
      <v-col cols="12" md="6">
        <v-card to="/scan" hover rounded="lg" class="feature-card pa-5" height="100%">
          <v-avatar color="primary" variant="tonal" rounded="lg" class="mb-3">
            <v-icon>mdi-qrcode-scan</v-icon>
          </v-avatar>
          <div class="text-h6 font-weight-medium">QR Scanner</div>
          <div class="text-body-2 text-medium-emphasis mt-1">
            Scan a QR code with your device camera.
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card to="/weather" hover rounded="lg" class="feature-card pa-5" height="100%">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-h6 font-weight-medium">Weather</div>
            <v-avatar color="secondary" variant="tonal" rounded="lg">
              <v-icon>mdi-weather-partly-cloudy</v-icon>
            </v-avatar>
          </div>
          <div v-if="weatherLoading" class="text-body-2 text-medium-emphasis">
            Loading current weather...
          </div>
          <v-alert v-else-if="weatherError" type="error" variant="tonal" density="compact">
            {{ weatherError }}
          </v-alert>
          <template v-else-if="weather">
            <div class="text-h4 font-weight-bold">
              {{ Math.round(weather.current.temp_c) }}°C
            </div>
            <div class="text-body-1">{{ weather.current.condition.text }}</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ weather.location.name }}, {{ weather.location.region }}
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.welcome-page {
  max-width: 1100px;
  margin: 0 auto;
}

.welcome-card {
  border-left: 4px solid #8bd5c5;
}

.feature-card {
  border: 1px solid rgba(148, 180, 204, 0.12);
  transition: border-color 150ms ease;
}

.feature-card:hover {
  border-color: rgba(139, 213, 197, 0.5);
}
</style>
