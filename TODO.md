# TODO

## Активні TODO

- SSE live-трансляція повідомлень (крок 1, single-process) — механізм перевірено на тестовому роуті, перенести в "бойовий" код:
  - Перенести логіку з `test_sse` (`src/handler/sse_test_handler.ts`) у нормальний хендлер, напр. `getChatSse` в `chats_handler.ts`, роут `GET /api/chats/:id/sse`.
  - Типізація `chat_id` з `params` через DTO/schema замість тимчасового `as {chat_id: string}`.
  - Перевірка, що користувач, який відкриває SSE, дійсно учасник цього чату (авторизація підписки).
  - Прибрати тестовий роут `/sse/:chat_id` і `sse_test_handler.ts`, коли "бойовий" варіант запрацює.
  - Подумати над форматом даних, що йдуть у `reply.sse.send({data: message})` — чи `message` як є з БД, чи окремий DTO для SSE-payload.
- DTO + роути для повідомлень: `POST /api/messages`, `GET /api/messages`.
- Кастомні класи помилок (`DatabaseError extends Error`, з `cause`) + `fastify.setErrorHandler` (зараз хендлери просто `throw new Error(...)`).
- Перевірити консистентність `User['id']`/`Chats['id']` типізації по всьому коду.
- Дрібне: чи винести `as const satisfies JSONSchema`/`Record<any, JSONSchema>` через generic-хелпер (`defineSchema<const T>`) — рішення відкладено.

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
