const WEATHER_API_URL = 'https://api.weatherapi.com/v1'

export async function fetchWeatherApi<T>(
  endpoint: string,
  query: Record<string, string | number>
) {
  const { weatherApiKey } = useRuntimeConfig()
  if (!weatherApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Weather API key is not configured.',
    })
  }

  return await $fetch<T>(`${WEATHER_API_URL}/${endpoint}`, {
    query: { ...query, key: weatherApiKey },
  })
}
