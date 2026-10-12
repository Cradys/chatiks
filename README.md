# Chatiks

Навчальний бекенд для чату, побудований на Fastify, Knex, PostgreSQL та RabbitMQ. Мета проєкту — практика роботи з реальним стеком бібліотек: HTTP API, realtime-доставка повідомлень через Server-Sent Events, і масштабування на кілька інстансів застосунку через брокер повідомлень.

## Стек

- **Fastify** — HTTP-сервер та маршрутизація
- **Knex** — query builder і міграції для PostgreSQL
- **PostgreSQL** — зберігання користувачів, чатів і повідомлень
- **RabbitMQ** (`amqplib`) — розсилка повідомлень у реальному часі між інстансами застосунку
- **@fastify/sse** — Server-Sent Events для push-доставки повідомлень клієнту
- **JWT** (`jsonwebtoken`) — автентифікація
- **argon2** — хешування паролів
- **TypeScript**

## Архітектура realtime-доставки

Коли користувач надсилає повідомлення (`POST /api/messages`):

1. Повідомлення зберігається в PostgreSQL
2. Сервер отримує список учасників чату
3. Для кожного учасника повідомлення публікується в RabbitMQ (`direct` exchange `messages`, routing key = `user_id` отримувача)

Коли користувач підключається по SSE (`GET /api/sse`):

1. Створюється ексклюзивна, автоматично видалювана queue, прив'язана до exchange `messages` з binding key = `user_id` цього користувача
2. Consumer читає з цієї queue і пересилає кожне повідомлення клієнту через SSE

Такий підхід дозволяє запускати **кілька інстансів застосунку** одночасно: незалежно від того, на якому інстансі користувач підключений по SSE, а на якому створено повідомлення — RabbitMQ гарантує доставку в правильний інстанс через routing key.

## API

| Метод | Шлях | Опис |
|---|---|---|
| `POST` | `/api/users` | Реєстрація користувача |
| `POST` | `/api/login` | Логін, повертає JWT |
| `POST` | `/api/chats` | Створення чату |
| `GET` | `/api/chats` | Список чатів користувача |
| `GET` | `/api/chats/:id` | Інформація про чат |
| `POST` | `/api/messages` | Надіслати повідомлення в чат |
| `GET` | `/api/messages` | Історія повідомлень чату |
| `GET` | `/api/sse` | Підключення по SSE для отримання нових повідомлень у реальному часі |

Усі роути (крім реєстрації/логіну) вимагають заголовок `Authorization: Bearer <JWT>`.

## Запуск

### Інфраструктура (PostgreSQL + RabbitMQ)

```bash
docker compose up -d database rabbitmq
```

RabbitMQ Management UI буде доступний на `http://localhost:15672`.

### Міграції

```bash
npm run migrate:latest
```

### Застосунок (локально, без Docker)

```bash
npx tsx src/index.ts
```

### Застосунок у Docker (два інстанси для перевірки масштабування)

```bash
docker compose up --build
```

Підніме `app1` на `http://localhost:8080` і `app2` на `http://localhost:8081`, обидва підключені до спільних `database` і `rabbitmq`.

## Змінні середовища

Див. `.env.example`. Для розробки поза Docker скопіюй у `.env` і заповни значеннями. Усередині Docker ці ж значення передаються через `environment:` в `compose.yaml`, з host-іменами сервісів (`database`, `rabbitmq`) замість `localhost`.
