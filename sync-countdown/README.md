# Distributed Synchronized Countdown Timer

This project is a distributed, synchronized countdown timer implemented in multiple technology stacks. It allows multiple users to join a shared countdown session, where the timer state is synchronized in real-time across all connected clients.

## Background

Originally developed as a gig project using Svelte and Firebase, the timer has since been reimagined and rewritten in modern frameworks and languages to explore different approaches to real-time synchronization and distributed state management.

## Implementations

- **Spring Boot**: Provides a robust backend API for timer management, user sessions, and real-time updates.
- **React Router v7**: Modern React frontend with seamless routing and real-time UI updates.
- **(Planned) Clojure(Script)**: Functional approach to both backend and frontend, leveraging Clojure's strengths in concurrency and state.
- **(Planned) Angular**: Enterprise-ready frontend implementation for broader framework coverage.

## Features

- Real-time countdown synchronization across all clients
- Join or create countdown sessions from different rooms
<!-- - Responsive UI for desktop and mobile
- Extensible architecture for adding new frameworks or languages -->

## Getting Started

Each implementation is located in its own subdirectory:

- `spring-sync-countdown/` — Spring Boot backend
- `rr-sync-countdown/` — React Router v7 frontend
<!-- - `clj-sync-countdown/` — (Planned) Clojure(Script) version
- `ng-sync-countdown/` — (Planned) Angular version -->

## Roadmap

- [x] Spring Boot backend
- [] React Router v7 frontend
- [] Clojure(Script) implementation
- [x] Angular implementation



TODOs
- [] CRUD user/admin
- [] CRUD rooms
- [] invite user via sms or email
- [] boardcast message from admin to users
- [] better UI for display
- [] list records



### DB Design

Schema: sync_countdown

**Users**
- username varchar(100) primary key
- password varchar(60) not null
- enable boolean not null

**Authorities**
- username varchar(100) not null
- authority varchar(50) not null
- constraint fk_authorities_user foreign key(username) references users(username)

**Rooms**
- id uuid primary key
- name varchar(100) not null
- owner varchar(100) fk_owner_name
- start_time timestamp
- end_time timestamp
- is_timer_running boolean default false
- capacity int default 500

**Attendees**
- username varchar(100) primary key

**Room Attendees**
- room_id uuid
- attendee varchar(100) not null fk_room_attendee
- joined_at timestamp
- primary key (room_id, attendee)

**Room Booking View**
- room_id uuid
- room_name varchar(100)
- room_owner varchar(100)
- room_start timestamp
- room_end timestamp
- attendees_count int
- attendees string_agg()

*Indexes*
- ix_auth_username authorities(username, authority)

*trigger*
- check_room_capcity
- update_timer_status