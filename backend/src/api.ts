import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
// import { z } from 'zod';
// import { zValidator } from '@hono/zod-validator';

import db from './db';

const api = new Hono()
  .get('/health', (c) => c.json({ status: 'ok' }))
  .use('/*', bearerAuth({ token: process.env.ADMIN_TOKEN ?? '' }))
  .get('/login', (c) => c.json({ status: 'ok' }))
  .get('/links', async (c) => {
    const keys = await db.keys('links:*');
    return c.jsonT(
      await Promise.all(
        keys.map(async (key) => ({
          slug: key.replace('links:', ''),
          url: (await db.get(key)) ?? 'Unknown',
        }))
      )
    );
  })
  .post(
    '/links',
    //   zValidator(
    //     'json',
    //     z.object({
    //       slug: z.string(),
    //       url: z.string(),
    //     })
    //   ),
    async (c) => {
      // const link = c.req.valid('json');
      const link = await c.req.json();
      const { slug, url } = link;

      const res = await db.set(`links:${slug}`, url);
      if (!res) {
        return c.text('An error occured', 500);
      }

      return c.text(res);
    }
  );

export default api;

export type ApiType = typeof api;
