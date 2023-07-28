FROM oven/bun AS frontend-build

WORKDIR /app

COPY . .

WORKDIR /app/frontend

RUN bun install

RUN bun run build


FROM oven/bun AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y nginx

COPY --from=frontend-build /app/frontend/dist /var/www/html
COPY ./backend ./backend

RUN cd backend && bun install

COPY ./entrypoint.sh .

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]