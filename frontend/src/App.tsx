import {
  Match,
  Show,
  Switch,
  createContext,
  createSignal,
  useContext,
} from 'solid-js';
import { createMutation, createQuery } from '@tanstack/solid-query';

import AdminPanel from './components/AdminPanel';
import createApiClient from './lib/api';

const ApiClientContext = createContext<ReturnType<typeof createApiClient>>(
  createApiClient('')
);

const App = () => {
  const [token, setToken] = createSignal<string>();
  const loginQuery = createMutation((loginToken: string) =>
    createApiClient(loginToken)
      .api.login.$get()
      .then((res) => {
        if (res.status !== 200) throw new Error('Invalid token');
        return res.json();
      })
  );

  return (
    <main class="py-4 px-6">
      <Switch>
        <Match when={!loginQuery.isSuccess}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const token = formData.get('token');
              if (typeof token === 'string') {
                setToken(token);
                loginQuery.mutate(token);
              }
            }}
            class="grid place-content-center gap-3 container h-screen mx-auto"
          >
            <h1 class="text-3xl font-bold text-center">Login</h1>
            <input
              type="password"
              name="token"
              placeholder="Token"
              class="w-[40ch] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              type="submit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              disabled={loginQuery.isLoading}
            >
              <Show
                when={!loginQuery.isLoading}
                fallback={<span>Loading...</span>}
              >
                Submit
              </Show>
            </button>
            <Show when={loginQuery.isError}>
              <div class="text-red-600 text-center">
                An error occurred, please retry
              </div>
            </Show>
          </form>
        </Match>
        <Match when={loginQuery.isSuccess}>
          <ApiClientContext.Provider value={createApiClient(token() ?? '')}>
            <AdminPanel />
          </ApiClientContext.Provider>
        </Match>
      </Switch>
    </main>
  );
};

export default App;

export function useApiClient() {
  return useContext(ApiClientContext);
}
