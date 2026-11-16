export default defineEventHandler(async (event) => {
  const location = getQuery(event).location
  if (typeof location !== 'string' || !location.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A weather location is required.',
    })
  }

  return await fetchWeatherApi('forecast.json', {
    q: location,
    days: 3,
    aqi: 'no',
    alerts: 'no',
  })
})
