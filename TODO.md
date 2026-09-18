# TODO

## Активні TODO

- SSE live-трансляція повідомлень по клієнту а не по чату
- Кастомні класи помилок (`DatabaseError extends Error`, з `cause`) + `fastify.setErrorHandler` (зараз хендлери просто `throw new Error(...)`).

## Відкладені TODO

Подумати як розбити repositories/chats.ts та chats_to_users, таблиці тісно пов'язані і запит по чатам точно буде вести на список учасників
- Винести окремий `ChatsToUsersRepository` (`ChatMembersRepository`) для таблиці `chats_to_users` — зараз `ChatRepository.getOne()`/`create()` звертаються напряму до двох таблиць, що порушує усталений патерн "один репозиторій = одна таблиця".
- Ввести сервісний шар (`services/chat_service.ts`, `ChatService`): координація кількох репозиторіїв в одній транзакції (наприклад `createChat` — insert в `chats` + `chats_to_users`). Методи репозиторіїв мають приймати executor (`Knex | Knex.Transaction`, за замовчуванням `this.knex`), щоб сервіс міг передати їм спільну транзакцію.
- "Знайти/створити direct-чат між двома користувачами" — реалізувати в `ChatService` (не в репозиторії), використовуючи прості методи репозиторіїв.
- Валідація "direct chat = рівно 2 учасники" — зараз рантайм-перевірка в хендлері `createChat`; розглянути tuple-тип (`[User['id'], User['id']]`) і перенесення перевірки в `ChatService`, коли з'явиться сервісний шар.

### DTO / validation
- Подивитись у бік написання JSON Schema в окремих `.json`-файлах і конвертації в типи через `json-schema-to-type` (порівняти з поточним підходом через `json-schema-to-ts` + `as const satisfies JSONSchema` прямо в `.ts`-файлах — які трейдофи).

### Config
- Config as plugin: https://github.com/fastify/env-schema + https://www.npmjs.com/package/dotenv
  Приклад: https://www.nazarboyko.com/articles/building-production-apis-with-nodejs-and-fastify#config-as-a-plugin

### Live-трансляція повідомлень (SSE) для кількох інстансів
Зараз (крок 1) трансляція повідомлень через SSE реалізована на `EventEmitter` в межах одного процесу Node.js. Якщо застосунок буде запущено в кількох інстансах — `EventEmitter` не спрацює, бо кожен процес має свою пам'ять і SSE-з'єднання користувача А може опинитись в іншому процесі, ніж той, що обробляє `POST /api/messages` від користувача Б.
- Варіант 1: `LISTEN/NOTIFY` в PostgreSQL — вже є ця БД в проєкті, новий інструмент вчити не треба.
- Варіант 2: RabbitMQ — новий інструмент, важча інфраструктура, ближче до "справжніх" мікросервісів.

### Project example from fastify founder
https://github.com/delvedor/fastify-example/blob/main/routes/admin.js
- Подивитись використання плагінів
- Як створює роути
- Пакети які можуть бути корисні
