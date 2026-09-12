# TODO

## DTO / validation
- Подивитись у бік написання JSON Schema в окремих `.json`-файлах і конвертації в типи через `json-schema-to-type` (порівняти з поточним підходом через `json-schema-to-ts` + `as const satisfies JSONSchema` прямо в `.ts`-файлах — які трейдофи).

## Config
- Config as plugin: https://github.com/fastify/env-schema + https://www.npmjs.com/package/dotenv
  Приклад: https://www.nazarboyko.com/articles/building-production-apis-with-nodejs-and-fastify#config-as-a-plugin
