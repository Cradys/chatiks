type DBConfig = {
  db_url: string,
  client: string
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
  db: DBConfig,
  api: APIConfig,
  jwt: JWTConfig
}

process.loadEnvFile()

/*
TODO
config as plugin 
https://github.com/fastify/env-schema + https://www.npmjs.com/package/dotenv
example - https://www.nazarboyko.com/articles/building-production-apis-with-nodejs-and-fastify#config-as-a-plugin
*/

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const config: Config = {
  db: {
    db_url: envOrThrow("DB_URL"),
    client: envOrThrow("CLIENT")
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