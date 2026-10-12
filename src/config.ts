export namespace Config {
  export type DBConfig = {
    db_url: string,
    client: string
  }

  export type APIConfig = {
    port: number
  }

  export type JWTConfig = {
    secret: string,
    issuer: string,
    expiresIn: number
  }

  export type RabbitMQConfig = {
    rabbit_url: string
  }

  export type Root = {
    db: DBConfig,
    api: APIConfig,
    jwt: JWTConfig,
    rabbit: RabbitMQConfig
  }
}


try {
  process.loadEnvFile()
} catch {
  // .env файл не знайдено — покладаємось на змінні середовища, передані ззовні (Docker, CI тощо)
}

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

export const config: Config.Root = {
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
  },
  rabbit: {
    rabbit_url: `amqp://${envOrThrow("RABBITMQ_USER")}:${envOrThrow("RABBITMQ_PASSWORD")}@${envOrThrow("RABBITMQ_HOST")}:5672`
  }
}