# TODO

## Активні TODO

- "Знайти/створити direct-чат між двома користувачами" — реалізувати в `ChatService` (не в репозиторії), використовуючи прості методи репозиторіїв.
- Реалізувати реальні хендлери замість заглушок: `GET /api/chats`, `POST /api/chats`.
- DTO + роути для повідомлень: `POST /api/messages`, `GET /api/messages`.
- Валідація "direct chat = рівно 2 учасники" — tuple-тип (`[User['id'], User['id']]`) і/чи рантайм-перевірка (актуально для `ChatService.createChat`).
- Кастомні класи помилок (`DatabaseError extends Error`, з `cause`) + `fastify.setErrorHandler`.
- Перевірити консистентність `User['id']`/`Chats['id']` типізації по всьому коду.
- Дрібне: `import { Entities }` без `type` в `repositories/chats.ts` — для консистентності зі стилем інших файлів мало б бути `import type { Entities }`.
- Дрібне: чи винести `as const satisfies JSONSchema`/`Record<any, JSONSchema>` через generic-хелпер (`defineSchema<const T>`) — рішення відкладено.

## Відкладені TODO

Подумати як розбити repositories/chats.ts та chats_to_users, таблиці тісно пов'язані і запит по чатам точно буде вести на список учасників
- Винести окремий `ChatsToUsersRepository` (`ChatMembersRepository`) для таблиці `chats_to_users` — зараз `ChatRepository.getOne()`/`create()` звертаються напряму до двох таблиць, що порушує усталений патерн "один репозиторій = одна таблиця".
- Ввести сервісний шар (`services/chat_service.ts`, `ChatService`): координація кількох репозиторіїв в одній транзакції (наприклад `createChat` — insert в `chats` + `chats_to_users`). Методи репозиторіїв мають приймати executor (`Knex | Knex.Transaction`, за замовчуванням `this.knex`), щоб сервіс міг передати їм спільну транзакцію.

### DTO / validation
- Подивитись у бік написання JSON Schema в окремих `.json`-файлах і конвертації в типи через `json-schema-to-type` (порівняти з поточним підходом через `json-schema-to-ts` + `as const satisfies JSONSchema` прямо в `.ts`-файлах — які трейдофи).

### Config
- Config as plugin: https://github.com/fastify/env-schema + https://www.npmjs.com/package/dotenv
  Приклад: https://www.nazarboyko.com/articles/building-production-apis-with-nodejs-and-fastify#config-as-a-plugin

### Project example from fastify founder
https://github.com/delvedor/fastify-example/blob/main/routes/admin.js
- Подивитись використання плагінів
- Як створює роути
- Пакети які можуть бути корисні
