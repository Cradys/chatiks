type DBConfig = {
  db_url: string
}

type APIConfig = {
  port: number
}

type Config = {
  db: DBConfig,
  api: APIConfig
}

process.loadEnvFile()

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const config: Config = {
  db: {
    db_url: envOrThrow("DB_URL")
  },
  api: {
    port: Number(envOrThrow("PORT"))
  }
}