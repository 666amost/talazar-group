// Drizzle configuration (lightweight, without importing drizzle-kit types to avoid dependency)
// If you reinstall drizzle-kit, you can reintroduce the Config type for validation.
export default {
  schema: './app/lib/db.server.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
};
