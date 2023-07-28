import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
});
try {
  await client.connect();
} catch (e) {
  console.log('Error connecting to redis db :', e);
}

export default client;
