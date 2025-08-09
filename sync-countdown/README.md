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
- [x] React Router v7 frontend
- [ ] Clojure(Script) implementation
- [ ] Angular implementation
