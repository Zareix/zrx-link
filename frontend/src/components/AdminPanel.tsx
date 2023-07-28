import { For, Match, Switch } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';

import AddLink from './AddLink';
import { useApiClient } from '../App';

const AdminPanel = () => {
  const apiClient = useApiClient();
  const query = createQuery(
    () => ['links', 'all'],
    () => apiClient.api.links.$get().then((res) => res.json())
  );

  return (
    <section class="my-4">
      <h1 class="text-3xl font-bold">Admin Panel</h1>
      <Switch>
        <Match when={query.isLoading}>
          <p>Loading...</p>
        </Match>
        <Match when={query.isError}>
          <p>An error occurred</p>
        </Match>
        <Match when={query.isSuccess}>
          <div class="relative overflow-x-auto mt-4 w-full">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 border ">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Slug
                  </th>
                  <th scope="col" class="px-6 py-3">
                    URL
                  </th>
                </tr>
              </thead>
              <tbody>
                <For each={query.data}>
                  {(link) => (
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        /{link.slug}
                      </th>
                      <td class="px-6 py-4">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {link.url}
                        </a>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Match>
      </Switch>
      <hr class="my-4" />
      <AddLink />
    </section>
  );
};

export default AdminPanel;
