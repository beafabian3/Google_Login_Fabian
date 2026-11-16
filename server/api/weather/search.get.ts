export default defineEventHandler(async (event) => {
  const search = getQuery(event).q
  if (typeof search !== 'string' || !search.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A location search query is required.',
    })
  }

  return await fetchWeatherApi('search.json', { q: search })
})
