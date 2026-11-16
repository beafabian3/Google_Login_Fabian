export interface WeatherLocationOption {
  title: string
  value: string
}

interface WeatherApiLocation {
  name: string
  region: string
  country: string
  lat: number
  lon: number
}

interface WeatherCondition {
  text: string
  icon: string
}

export interface WeatherResponse {
  location: {
    name: string
    region: string
    country: string
    localtime: string
    tz_id: string
  }
  current: {
    temp_c: number
    feelslike_c: number
    humidity: number
    wind_kph: number
    uv: number
    condition: WeatherCondition
  }
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        condition: WeatherCondition
      }
      hour: Array<{
        time: string
        temp_c: number
        chance_of_rain: number
        condition: WeatherCondition
      }>
    }>
  }
}

export function useWeather() {
  async function fetchWeather(location = 'San Fernando') {
    return await $fetch<WeatherResponse>('/api/weather', {
      query: { location },
    })
  }

  async function searchLocations(search: string) {
    const results = await $fetch<WeatherApiLocation[]>('/api/weather/search', {
      query: { q: search },
    })

    return results.map((location) => ({
      title: [location.name, location.region, location.country]
        .filter(Boolean)
        .join(', '),
      value: `${location.lat},${location.lon}`,
    }))
  }

  return { fetchWeather, searchLocations }
}
