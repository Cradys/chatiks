type DBConfig = {
  db_url: string
}

type APIConfig = {
  port: number
}

type JWTConfig = {
  secret: string,
  issuer: string,
  expiresIn: number
}

type Config = {
  secret: string,
  db: DBConfig,
  api: APIConfig,
  jwt: JWTConfig
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
  secret: envOrThrow("SECRET"),
  db: {
    db_url: envOrThrow("DB_URL")
  },
  api: {
    port: Number(envOrThrow("PORT"))
  },
  jwt: {
    secret: envOrThrow("JWT_SECRET"),
    issuer: envOrThrow("JWT_ISSUER"),
    expiresIn: Number(envOrThrow("EXPIRES_IN"))
  }
}