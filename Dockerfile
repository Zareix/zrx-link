FROM oven/bun AS frontend-build

WORKDIR /app

COPY ./frontend .

RUN bun install


FROM oven/bun AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y nginx

COPY --from=frontend-build /app/dist /var/www/html
COPY ./backend ./backend

RUN cd backend && bun install

COPY ./entrypoint.sh .

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]