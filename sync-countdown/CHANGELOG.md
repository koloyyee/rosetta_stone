# Changelog — sync-countdown overhaul

All changes made during the UI polish + testing session.

---

## Spring Backend (`spring-sync-countdown/`)

### Bugfixes

| Fix | File | Before | After |
|-----|------|--------|-------|
| Missing `owner` column | `schema.sql` | FK referenced column that didn't exist | Added `owner VARCHAR(100) REFERENCES users(username)` to `rooms` table |
| `name` not unique | `schema.sql` | No uniqueness constraint, but insert uses `ON CONFLICT (name)` | Added `UNIQUE` to `name` column |
| `stop()` only worked on RUNNING | `TimerService.java` | `if (timer.state == RUNNING)` | `if (timer.state == RUNNING \|\| timer.state == PAUSED)` |
| Timer map leak | `TimerService.java` | Finished/stopped rooms stayed in `timers` forever | `timers.remove(roomId)` added in both stop() and when transitioning to FINISHED |
| `extend()` set duration absolutely | `TimerService.java` | `timer.duration = duration` (replaces) | `timer.duration += additionalSeconds` (adds) |
| Resume time drift | `TimerService.java` | `now - (duration - remaining) - 1` hack | `elapsed = duration - remaining; startTime = now - elapsed` (no drift) |
| @Scheduled ticked STOPPED rooms | `TimerService.java` | `if (RUNNING \|\| STOPPED)` | `if (RUNNING)` only |
| Security headers disabled | `SecurityConfig.java` | `headers.disable()` | `headers.frameOptions(f -> f.sameOrigin()).contentSecurityPolicy(...)` |
| Dead GreetingController | `rooms/controllers/GreetingController.java` | Scratch controller with `System.out.println` | **Deleted** |
| Missing seed user check | `SyncCountdownApplication.java` | `ApplicationRunner` always called `createUser` — crashed on restart | Added `userExists()` guard before creating |
| `@SendTo` commented out on stop | `RoomsController.java` | `// @SendTo(...)` on `stopTimer` | Uncommented — frontend now receives stop updates |
| H2 for tests | `pom.xml` + test resources | H2 commented out, tests required Postgres | H2 added (runtime scope), test profile with H2 config, test schema |
| Double bcrypt hash | Angular `auth.service.ts` | `bcrypt.hashSync(password, 10)` then server hashed again | Sends raw password, server handles hashing |

### Tests added

| Test class | File | What it tests |
|---|---|---|
| `TimerServiceTest` | `rooms/services/TimerServiceTest.java` | 10 tests — start/pause/resume/stop/extend state transitions, schedule filtering, record persistence |
| `RoomsControllerTest` | `rooms/controllers/RoomsControllerTest.java` | 5 tests — GET rooms, GET by ID, POST with admin, extend, missing room |
| `AuthControllerTest` | `auth/AuthControllerTest.java` | 3 tests — signup success, duplicate signup error, token endpoint |
| `BookingRecordControllerTest` | `book_records/controllers/BookingRecordControllerTest.java` | 2 tests — GET all records, GET by primary key |
| `RoomsRepositoryTest` | `rooms/repositories/RoomsRepositoryTest.java` | 1 test — context loads |
| `SyncCountdownApplicationTests` | root | context load with `@ActiveProfiles("test")` |

**22 Spring tests total — all passing.**

---

## Angular Frontend (`ng-sync-countdown/`)

### UI Polish

| Component | Change |
|---|---|
| **Listing** | Gradient header with "Browse Rooms", empty state with `meeting_room` icon + "No rooms yet" message, hover cards on room items, admin-only FAB button |
| **RoomPreview** | Card layout with room name, status badge ("In Progress" / "Paused" / "Stopped" / "Empty"), animated green pulse dot for RUNNING, chevron_right icon |
| **RoomComponent** | Large mono-space timer (7xl), gradient amber background, status indicator with pulse, back button, icon buttons (play/pause/stop) replacing text buttons |

### Structural fixes

| Fix | Details |
|---|---|
| Nested `<router-outlet>` removed | HomepageComponent had a stray `<router-outlet>` inside `<main>` — removed |
| 404 wildcard route added | New `NotFoundComponent` at `/not-found` with amber-themed 404 page |
| AuthGuard applied | Previously provided but never attached to any route — now guards `/rooms` |
| `SetDurationDialog` reference | Referenced `.scss` file that didn't exist — removed |
| `environment.prod.ts` | Missing `apiUrl` field — added |
| Client-side bcrypt removed | `auth.service.ts` was double-hashing passwords — now sends plaintext |

### Tests fixed / added

All 16 original spec files were trivial "should create" tests with some having broken imports or DI.

| Spec | Fix / additions |
|---|---|
| `app.component.spec.ts` | Fixed "should render title" → "should render router outlet" |
| `has-role.directive.spec.ts` | Rewrote with TestBed + host component (was `new HasRoleDirective()` with no DI) |
| `jwt.service.spec.ts` | Fixed import (`JwtServiceService` → `JwtService`). Added: set/get/remove/expiry/decode/user tests |
| `auth.service.spec.ts` | Rewrote with `HttpTestingController`. Added: login (Basic auth header), login error, logout, signup |
| `auth-guard.service.spec.ts` | Fixed import (`AuthGuardService` → `AuthGuard`). Added: allows with token, redirects without |
| `rooms.service.spec.ts` | Added: findAll, findById, saveRoom with `HttpTestingController` |
| `rooms-layout.component.spec.ts` | Fixed import (`RoomsPageComponent` → `RoomsLayoutComponent`). Added proper providers |
| `listing.component.spec.ts` | Fixed import path (`../../listing` → `./listing`). Added `findAll` mock |
| `room.component.spec.ts` | Added proper providers for `ActivatedRoute`, `AuthService`, `RoomsService`, `WebSocketService`, `JwtService` |
| `room-preview.component.spec.ts` | Added room input + "renders room name" assertion |
| `new-room-dialog.component.spec.ts` | Added form validation tests |
| `set-duration-dialog.component.spec.ts` | Fixed import path (`../set-duration` → `./set-duration`) |
| `login.component.spec.ts` | Added: form validation, submit behavior, error display, service call verification |
| `homepage.component.spec.ts` | Added: renders welcome heading, has CTA buttons |
| `signup.component.spec.ts` | Added `HttpClient` + `AuthService` mock providers |
| `websocket.service.spec.ts` | Fixed import (`WebsocketService` → `WebSocketService`) |

**44 Angular tests total — all passing.**

---

## E2E Testing (Playwright)

Installed at `sync-countdown/` root:

- `@playwright/test` + Chromium browser
- `playwright.config.ts` — `baseURL: http://localhost:4200`, chromium only, trace on first retry
- `e2e/app.spec.ts` — home page rendering, auth flow (login/signup forms), navigation, 404 page
- `e2e/rooms.spec.ts` — room listing after login, room navigation
- Scripts: `npm run e2e`, `e2e:ui`, `e2e:report`

---

## React Router Frontend (`rr-sync-countdown/`)

Was an unmodified scaffold. Now:

- **`vitest`** + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom` installed
- **`vitest.config.ts`** — jsdom environment, globals, setup file
- **`test/setup.ts`** — jest-dom matchers
- **3 vitest tests** for `ErrorBoundary` logic (404, 500, generic error)
- **Custom amber-themed homepage** — matching the Angular app's design, replacing the stock React Router welcome page
- **Stub routes** — `/login`, `/signup`, `/rooms` with placeholder content

---

## Development

```bash
# Backend (requires PostgreSQL via Docker)
cd spring-sync-countdown
docker compose up db -d
./mvnw spring-boot:run

# Angular frontend
cd ng-sync-countdown
npm start

# React Router frontend
cd rr-sync-countdown
npm run dev

# Run tests
cd spring-sync-countdown && ./mvnw test -Dspring.profiles.active=test
cd ng-sync-countdown && npx ng test --watch=false --browsers=ChromeHeadless
cd rr-sync-countdown && npx vitest run
cd .. && npx playwright test        # requires both backend + frontend running
```
