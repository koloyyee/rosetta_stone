# Rosetta Stone — Learning Through Projects

A multi-language learning project that implements the same problems across Clojure, Java, JavaScript/TypeScript, Swift, Go, and C. Inspired by The Primegean's 5-step method and the Pragmatic Programmer's exercises.

---

## Project Structure

```
rosetta-stone/
├── automation/          # CLIs in multiple languages (filewatcher, reminders)
├── http_get/            # HTTP GET request → same endpoint in 5 languages
├── kata/                # LeetCode-style coding kata solutions
├── misc/                # Small standalone exercises (Pi digits, case conversion)
├── simple-server/       # Java HTTP server (SimpleFileServer + programmatic)
├── snake/               # Game design doc (no code yet)
├── sync-countdown/      # Flagship multi-stack distributed countdown app
│   ├── spring-sync-countdown/  # Spring Boot 3.4 backend (Java 21)
│   ├── ng-sync-countdown/      # Angular 20 frontend
│   ├── rr-sync-countdown/      # React Router v7 frontend (early scaffold)
│   └── clj-sync-countdown/     # Clojure backend (early scaffold)
└── unix/                # Unix CLI reimplementations (cat, ls, grep, sort, etc.)
```

---

## Languages & Tools

| Language | Where | Key Tools |
|----------|-------|-----------|
| **Java 21** | automation, http_get, kata, simple-server, sync-countdown/spring, unix | Maven, Spring Boot 3.4.5, Spring Security, Spring WebSocket, Nimbus JOSE+JWT, jbang |
| **Clojure 1.12** | http_get, kata/clj, sync-countdown/clj-sync-countdown, unix/clojure | deps.edn, babashka, tools.cli, tools.build |
| **JavaScript/TypeScript** | http_get, kata/js, misc/js-ts, sync-countdown/ng, sync-countdown/rr | Angular 20, React Router v7, RxJS, Tailwind CSS 4, @stomp/rx-stomp, bcryptjs, pino |
| **Swift 6** | http_get, kata/swift, misc/swift, unix/swift | Swift Package Manager, Foundation, FileManager |
| **Go** | http_get | net/http |
| **C** | unix/c | stdio, unistd, stdlib |

Many Java files use a `///usr/bin/env jbang` shebang for single-file execution.

---

## sync-countdown — Distributed Countdown Timer

The most complex subproject: a **real-time synchronized countdown timer** with STOMP WebSocket communication, JWT auth, and PostgreSQL persistence.

### Architecture

```
┌─────────────────────┐      STOMP/WS       ┌──────────────────┐
│  Angular 20 (ng)    │ ◄──────────────────► │  Spring Boot 3.4  │
│  localhost:4200     │    /topic/timer/*    │  localhost:8080   │
│  @stomp/rx-stomp    │                      │  PostgreSQL       │
└─────────────────────┘                      └──────────────────┘
```

### Spring Backend (`spring-sync-countdown/`)

**Build:** Maven, Java 21, Spring Boot 3.4.5 → `mvn spring-boot:run`

**Key packages:**
- `config/` — `SecurityConfig` (JWT, CORS, security filter chain), `WebSocketConfig` (STOMP broker, JWT channel interceptor)
- `auth/` — `AuthController` (`/auth/signup`, `/auth/token`), `TokenService` (1-hour JWT, RSA-signed via Nimbus)
- `rooms/controllers/` — `RoomsController` (REST: CRUD rooms + STOMP: start/pause/resume/stop timer), `GreetingController` (STOMP hello world)
- `rooms/services/` — `TimerService` (in-memory ConcurrentHashMap timer state, `@Scheduled` 1-second broadcasts via `SimpMessagingTemplate`)
- `rooms/models/` — `Room` record, `RoomStatus` enum, `RoomUser` record
- `rooms/repositories/` — `RoomsRepository` (Spring Data JDBC, `ListCrudRepository<Room, UUID>`)
- `book_records/` — Persistence for completed timer sessions

**WebSocket:**
- STOMP endpoint: `/portfolio`, `/timer`
- Broker prefix: `/topic` (simple broker)
- App destination prefix: `/app`
- JWT extracted from STOMP `CONNECT` frame's `Authorization` header
- Alternative raw Jakarta WebSocket also exists but is commented out (`non_stomp/`)

**Security:** Stateless JWT. RSA key pair. CORS: `localhost:4200` and `localhost:5173`.

**Database:** `schema.sql` — tables: `users`, `authorities`, `rooms`, `room_users`, `booking_records`. PostgreSQL for production, H2 available commented out.

**Config:** `application.properties` — datasource, JWT cert paths, logging at TRACE for security.

### Angular Frontend (`ng-sync-countdown/`)

**Build:** Angular CLI 20 → `npm start` (ng serve, localhost:4200)

**Routing:** `/` (Homepage), `/login`, `/signup`, `/rooms` (layout with lazy `Listing` + `Room` children)

**Auth flow:**
1. `SignupComponent` → bcrypt-hash password client-side → POST `/auth/signup`
2. `LoginComponent` → Basic auth POST `/auth/token` → receive JWT → store via `JwtService` (localStorage)
3. `tokenInterceptor` attaches `Bearer` token to all HTTP requests (skip via `Skip` header for auth endpoints)
4. `apiInterceptor` prepends `http://localhost:8080` base URL

**Services:**
- `AuthService` — `BehaviorSubject<CurrentUser>`, login/signup/logout, `isAuthenticated$`/`isAdmin$` observables
- `JwtService` — localStorage CRUD, JWT decode/expiry check
- `RoomsService` — HTTP CRUD for rooms
- `WebSocketService` — `rxjs/webSocket` raw WebSocket (connects to `ws://localhost:8080/ws/timer/{roomId}?token=...`)
- `RoomComponent` — STOMP via `@stomp/rx-stomp` for timer start/pause/resume/stop and real-time countdown display
- `HasRoleDirective` — structural directive for role-based template rendering
- `AuthGuard` — `CanActivate` route guard

**UI:** Angular Material (azure-blue theme) + Tailwind CSS 4

**spec files exist for:** app.component, auth-guard, auth.service, has-role.directive, jwt.service, homepage, listing, room, room-preview, new-room-dialog, set-duration-dialog, rooms-layout, rooms.service, websocket.service, login, signup

### React Router Frontend (`rr-sync-countdown/`)

Scaffolded with React Router v7 + Vite 5 + Tailwind CSS 4. SSR enabled. Only a home page (`/routes/home.tsx`) exists — no custom timer logic yet.

### Clojure Backend (`clj-sync-countdown/`)

Scaffolded via `deps-new`. Only a greeting function — no custom logic yet.

---

## Other Subprojects

### `automation/`
- `java/filewatcher/` — `WatchService`-based directory monitoring (Maven)
- `java/reminders/` — Job scheduler + file watcher + email reminders (Java 17, virtual threads, DelayQueue)

### `http_get/`
- Same endpoint (`https://dummyjson.com/users/1`) in Clojure, Go, Java, JS (ESM `fetch`), Swift

### `kata/`
- 10 Java kata files (jbang), 7 Clojure kata (deps.edn), 2 JS kata, 4 Swift kata
- Topics: phone numbers, duplicate encoding, length-of-last-word, max-product, merge-sorted-array, etc.

### `simple-server/`
- Java HTTP server demo: `SimpleFileServer` (Java 18+) + programmatic `HttpServer` with predicate routing

### `unix/`
- Reimplementations of `cat`, `ls`, `grep`, `less`, `sort`, `tail`, `wc` in:
  - **C** (cat only), **Clojure** (5 commands), **Java** (6 commands via jbang), **Swift** (cat only)

### `misc/`
- Pi-to-Nth-digit (JS, Swift), case-style-converter (JS)

---

## Development

- **Spring Boot:** `cd sync-countdown/spring-sync-countdown && ./mvnw spring-boot:run`
- **Angular:** `cd sync-countdown/ng-sync-countdown && npm start`
- **PostgreSQL:** `docker compose up db` in spring-sync-countdown
- **Angular tests:** `cd sync-countdown/ng-sync-countdown && npm test` (Karma + Jasmine)
- **Spring tests:** `./mvnw test` in spring-sync-countdown (JUnit 5 + Spring Boot Test)
