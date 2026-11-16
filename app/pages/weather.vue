<template>
  <v-container fluid class="weather-page pa-0">
    <v-row align="center">
      <v-col cols="12" md="5">
        <div class="d-flex align-center">
          <v-avatar color="primary" variant="tonal" rounded="lg" class="mr-3">
            <v-icon>mdi-weather-partly-cloudy</v-icon>
          </v-avatar>
          <div>
            <div class="text-h4 font-weight-bold">Weather</div>
            <div class="text-body-2 text-medium-emphasis">
              See what's happening now and what's coming next.
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="mt-2 mb-4">
      <v-col cols="12">
        <v-autocomplete
          v-model="selectedLocation"
          v-model:search="locationSearch"
          :items="locationOptions"
          :loading="searchLoading"
          item-title="title"
          item-value="value"
          label="Search for a city"
          placeholder="Enter a city name"
          prepend-inner-icon="mdi-map-marker"
          variant="solo"
          rounded="lg"
          hide-details="auto"
          clearable
          no-filter
          @update:search="searchLocations"
          @update:model-value="selectLocation"
        />
      </v-col>
    </v-row>

    <v-alert v-if="searchError" type="warning" variant="tonal" class="mb-4">
      {{ searchError }}
    </v-alert>
    <v-alert v-if="weatherError" type="error" variant="tonal" class="mb-4">
      <div class="d-flex flex-wrap align-center justify-space-between ga-3">
        <span>{{ weatherError }}</span>
        <v-btn
          variant="text"
          color="error"
          prepend-icon="mdi-refresh"
          @click="loadWeather(selectedLocation || 'San Fernando')"
        >
          Try again
        </v-btn>
      </div>
    </v-alert>

    <div v-if="loading && !weather" class="weather-loading">
      <v-progress-circular indeterminate color="primary" size="44" />
      <div class="text-body-1 text-medium-emphasis mt-4">Loading weather...</div>
    </div>

    <template v-else-if="weather">
      <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-3" />

      <v-card rounded="lg" class="weather-hero pa-5 pa-md-8" elevation="1">
        <v-row align="center" class="position-relative">
          <v-col cols="12" sm="7">
            <div class="d-flex align-center mb-1">
              <v-icon size="17" class="mr-1">mdi-map-marker</v-icon>
              <div class="text-overline">RIGHT NOW</div>
            </div>
            <div class="text-h5 font-weight-medium">{{ weather.location.name }}</div>
            <div class="text-body-2 weather-muted">
              {{ weather.location.region
              }}<span v-if="weather.location.region">, </span>{{ weather.location.country }}
            </div>
            <div class="d-flex align-center mt-5">
              <div class="weather-temperature">{{ Math.round(weather.current.temp_c) }}°</div>
              <div class="weather-condition ml-4">
                <v-img
                  :src="`https:${weather.current.condition.icon}`"
                  :alt="weather.current.condition.text"
                  width="72"
                  height="72"
                />
                <div class="text-body-1 font-weight-medium">
                  {{ weather.current.condition.text }}
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="5" class="text-sm-right">
            <div class="weather-local-time d-inline-block text-left pa-4">
              <div class="d-flex align-center weather-muted">
                <v-icon size="18" class="mr-2">mdi-clock-outline</v-icon>
                <span class="text-body-2">Local time</span>
              </div>
              <div class="text-h5 font-weight-bold mt-2">
                {{ formatLocalTime(weather.location.localtime) }}
              </div>
              <div class="text-body-2 weather-muted mt-1">
                {{ formatLocalDate(weather.location.localtime, weather.location.tz_id) }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <v-row class="mt-1">
        <v-col v-for="item in weatherDetails" :key="item.label" cols="6" sm="3">
          <v-card
            rounded="lg"
            class="weather-detail pa-4"
            :class="`weather-detail--${item.tone}`"
            elevation="1"
            height="100%"
          >
            <div class="d-flex align-center text-medium-emphasis">
              <span class="detail-icon mr-2" :class="`detail-icon--${item.tone}`">
                <v-icon size="18">{{ item.icon }}</v-icon>
              </span>
              <span class="text-body-2">{{ item.label }}</span>
            </div>
            <div class="text-h6 font-weight-bold mt-3" :class="`detail-value--${item.tone}`">
              {{ item.value }}<span class="text-body-2 ml-1">{{ item.unit }}</span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-1">
        <v-col cols="12" md="6">
          <v-card rounded="lg" class="forecast-panel pa-4 pa-md-6" elevation="1">
            <div class="d-flex align-center mb-4">
              <v-avatar color="secondary" variant="tonal" size="36" class="mr-3">
                <v-icon size="20">mdi-clock-time-four-outline</v-icon>
              </v-avatar>
              <div class="text-h6 font-weight-bold">Coming up today</div>
            </div>
            <v-row>
              <v-col v-for="hour in hourlyForecast" :key="hour.time" cols="4" sm="2">
                <v-sheet rounded="lg" class="hourly-item text-center py-3 px-1">
                  <div class="text-body-2 text-medium-emphasis">{{ formatHour(hour.time) }}</div>
                  <v-img
                    :src="`https:${hour.condition.icon}`"
                    :alt="hour.condition.text"
                    width="42"
                    height="42"
                    class="mx-auto my-2"
                  />
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ Math.round(hour.temp_c) }}°
                  </div>
                  <div class="text-caption rain-chance">
                    <v-icon size="14">mdi-weather-rainy</v-icon>
                    {{ hour.chance_of_rain }}%
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card rounded="lg" class="forecast-panel pa-4 pa-md-6" elevation="1">
            <div class="d-flex align-center mb-2">
              <v-avatar color="primary" variant="tonal" size="36" class="mr-3">
                <v-icon size="20">mdi-calendar-week</v-icon>
              </v-avatar>
              <div class="text-h6 font-weight-bold">Next 3 days</div>
            </div>
            <v-list>
              <v-list-item
                v-for="day in dailyForecast"
                :key="day.date"
                class="forecast-day px-3"
              >
                <template #prepend>
                  <div class="forecast-date text-body-2 font-weight-medium">
                    {{ formatForecastDate(day.date, weather.location.tz_id) }}
                  </div>
                </template>
                <template #title>
                  <div class="d-flex align-center">
                    <v-img
                      :src="`https:${day.day.condition.icon}`"
                      :alt="day.day.condition.text"
                      width="40"
                      height="40"
                      class="forecast-icon mr-2"
                    />
                    <span class="text-body-2">{{ day.day.condition.text }}</span>
                  </div>
                </template>
                <template #append>
                  <div class="text-body-2 text-no-wrap">
                    <span class="forecast-high font-weight-bold">
                      {{ Math.round(day.day.maxtemp_c) }}°
                    </span>
                    <span class="forecast-low ml-3">
                      {{ Math.round(day.day.mintemp_c) }}°
                    </span>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { useWeather, type WeatherLocationOption, type WeatherResponse } from '../composables/useWeather'

definePageMeta({ title: 'Weather' })

const { fetchWeather, searchLocations: fetchLocationOptions } = useWeather()
const weather = ref<WeatherResponse | null>(null)
const selectedLocation = ref<string | null>('San Fernando')
const locationSearch = ref('San Fernando')
const locationOptions = ref<WeatherLocationOption[]>([])
const loading = ref(true)
const searchLoading = ref(false)
const weatherError = ref('')
const searchError = ref('')
const hourlyForecast = computed(() => {
  const currentWeather = weather.value
  if (!currentWeather) return []

  const currentHour = Number(currentWeather.location.localtime.slice(11, 13))
  return (currentWeather.forecast.forecastday[0]?.hour ?? [])
    .filter((hour) => Number(hour.time.slice(11, 13)) >= currentHour)
    .slice(0, 6)
})
const dailyForecast = computed(() => weather.value?.forecast.forecastday ?? [])
const weatherDetails = computed(() => {
  if (!weather.value) return []

  const current = weather.value.current
  return [
    { label: 'Feels like', value: Math.round(current.feelslike_c), unit: '°C', icon: 'mdi-thermometer', tone: 'orange' },
    { label: 'Humidity', value: current.humidity, unit: '%', icon: 'mdi-water-percent', tone: 'blue' },
    { label: 'Wind', value: Math.round(current.wind_kph), unit: 'km/h', icon: 'mdi-weather-windy', tone: 'green' },
    { label: 'UV index', value: current.uv, unit: '', icon: 'mdi-white-balance-sunny', tone: 'purple' },
  ]
})

let searchTimeout: ReturnType<typeof setTimeout> | undefined
let searchRequestId = 0
let weatherRequestId = 0

async function loadWeather(location: string) {
  const requestId = ++weatherRequestId
  loading.value = true
  weatherError.value = ''

  try {
    const result = await fetchWeather(location)
    if (requestId === weatherRequestId) weather.value = result
  } catch {
    if (requestId === weatherRequestId) {
      weather.value = null
      weatherError.value = 'Unable to load weather for the selected location.'
    }
  } finally {
    if (requestId === weatherRequestId) loading.value = false
  }
}

function selectLocation(location: string | null) {
  if (location) void loadWeather(location)
}

function searchLocations(search: string | null) {
  if (searchTimeout) clearTimeout(searchTimeout)
  const requestId = ++searchRequestId
  const query = search?.trim() ?? ''
  searchError.value = ''

  if (query.length < 2) {
    locationOptions.value = []
    searchLoading.value = false
    return
  }

  searchTimeout = setTimeout(async () => {
    searchLoading.value = true
    try {
      const results = await fetchLocationOptions(query)
      if (requestId === searchRequestId) locationOptions.value = results
    } catch {
      if (requestId === searchRequestId) {
        locationOptions.value = []
        searchError.value = 'Unable to search locations. Please try again.'
      }
    } finally {
      if (requestId === searchRequestId) searchLoading.value = false
    }
  }, 300)
}

function formatLocalTime(localtime: string) {
  return localtime.slice(11)
}

function formatLocalDate(localtime: string, timeZone: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone,
  }).format(new Date(`${localtime.slice(0, 10)}T12:00:00Z`))
}

function formatForecastDate(date: string, timeZone: string) {
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', timeZone })
    .format(new Date(`${date}T12:00:00Z`))
}

function formatHour(time: string) {
  return time.slice(11)
}

onMounted(() => {
  void loadWeather('San Fernando')
})

onBeforeUnmount(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchRequestId++
  weatherRequestId++
})
</script>

<style scoped>
.weather-page {
  max-width: 1100px;
  margin: 0 auto;
}

.weather-hero {
  color: white;
  background: linear-gradient(125deg, #1d3452, #176b70);
}

.weather-muted {
  color: rgba(255, 255, 255, 0.78);
}

.weather-condition,
.weather-local-time {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.weather-condition {
  padding: 8px 14px 10px;
}

.weather-local-time {
  min-width: 220px;
}

.weather-temperature {
  color: #fff1cb;
  font-size: clamp(4.5rem, 12vw, 7rem);
  font-weight: 300;
  line-height: 1;
}

.weather-detail {
  border-top: 3px solid transparent;
}

.weather-detail--orange { border-top-color: #f0c878; }
.weather-detail--blue { border-top-color: #89aee6; }
.weather-detail--green { border-top-color: #8bd5c5; }
.weather-detail--purple { border-top-color: #aa99d2; }

.detail-icon {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.detail-icon--orange, .detail-value--orange { color: #f0c878; }
.detail-icon--blue, .detail-value--blue { color: #89aee6; }
.detail-icon--green, .detail-value--green { color: #8bd5c5; }
.detail-icon--purple, .detail-value--purple { color: #aa99d2; }
.detail-icon--orange { background: rgba(240, 200, 120, 0.12); }
.detail-icon--blue { background: rgba(137, 174, 230, 0.12); }
.detail-icon--green { background: rgba(139, 213, 197, 0.12); }
.detail-icon--purple { background: rgba(170, 153, 210, 0.12); }

.forecast-panel {
  border: 1px solid rgba(148, 180, 204, 0.12);
}

.hourly-item {
  height: 100%;
  border: 1px solid rgba(139, 213, 197, 0.14);
  background: rgba(139, 213, 197, 0.04);
}

.rain-chance { color: #8bd5c5; }

.forecast-day {
  border-radius: 12px;
}

.forecast-day:hover { background: rgba(139, 213, 197, 0.05); }
.forecast-icon { padding: 4px; border-radius: 50%; background: rgba(139, 213, 197, 0.08); }
.forecast-high { color: #f0c878; }
.forecast-low { color: #89aee6; }

.weather-loading {
  display: grid;
  min-height: 320px;
  align-content: center;
  justify-items: center;
}

.forecast-date { width: 72px; }

.forecast-day + .forecast-day {
  border-top: 1px solid rgba(148, 180, 204, 0.1);
}

@media (max-width: 600px) {
  .forecast-date { width: 52px; }

  .weather-condition {
    padding: 6px 9px 8px;
  }

  .weather-local-time {
    min-width: 0;
  }
}
</style>
