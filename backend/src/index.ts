import { Hono } from 'hono';
import { cors } from 'hono/cors';

import api from './api';
import db from './db';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = new Hono()
  .use('/api/*', cors())
  .route('/api', api)
  .get('/:slug', async (c) => {
    const slug = c.req.param('slug');
    const url = await db.get(`links:${slug}`);
    if (!url) {
      return c.text('Not found', 404);
    }
    return c.redirect(url);
  });

export default {
  port,
  fetch: app.fetch,
};

export type AppType = typeof app;
