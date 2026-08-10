.PHONY: playwright sb sb-test ng ng-test e2e e2e-ui claude help

help:
	@echo "Usage:"
	@echo "  make playwright   Run Playwright E2E tests (requires Angular + backend running)"
	@echo "  make e2e          Alias for playwright"
	@echo "  make e2e-ui       Run Playwright tests with browser visible"
	@echo "  make sb           Start PostgreSQL then Spring Boot backend"
	@echo "  make sb-test      Run Spring Boot tests (H2, no Postgres needed)"
	@echo "  make ng           Start Angular dev server (localhost:4200)"
	@echo "  make ng-test      Run Angular unit tests"
	@echo "  make claude       reattach to claude container (for debugging)"

playwright e2e:
	npx playwright test

e2e-ui:
	npx playwright test --headed

sb:
	docker compose -f ./spring-sync-countdown/compose.yaml up -d db && \
	echo "Waiting for PostgreSQL to be ready..." && \
	sleep 3 && \
	cd ./spring-sync-countdown && ./mvnw spring-boot:run

sb-test:
	cd ./spring-sync-countdown && ./mvnw test -Dspring.profiles.active=test -Dnet.bytebuddy.experimental=true

ng:
	cd ./ng-sync-countdown && ng serve

ng-test:
	cd ./ng-sync-countdown && ng test --watch=false --browsers=ChromeHeadless

claude:
	claude attach e0aa4ba3
