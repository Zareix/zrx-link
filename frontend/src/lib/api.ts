import { hc } from 'hono/client';

import { AppType } from '../../../backend/src';

const createApiClient = (token: string) =>
  hc<AppType>(window.env.apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default createApiClient;
