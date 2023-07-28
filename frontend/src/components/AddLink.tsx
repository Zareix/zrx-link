import { createMutation, useQueryClient } from '@tanstack/solid-query';

import { useApiClient } from '../App';
import { Show } from 'solid-js';

const AddLink = () => {
  const client = useQueryClient();
  const apiClient = useApiClient();

  const linkMutation = createMutation(
    ({ slug, url }: { slug: string; url: string }) =>
      apiClient.api.links.$post({
        json: {
          slug,
          url,
        },
      }),
    {
      onSuccess: () => {
        client.invalidateQueries(['links', 'all']);
      },
    }
  );

  const handleSubmit = (
    e: Event<EventTarget> & {
      submitter: HTMLElement;
    } & {
      currentTarget: HTMLFormElement;
      target: Element;
    }
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const slug = formData.get('slug');
    const url = formData.get('url');
    if (typeof slug === 'string' && typeof url === 'string') {
      linkMutation.mutate({ slug, url });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      class="flex flex-col gap-y-2 mt-5 max-w-sm mx-auto"
    >
      <input
        type="text"
        name="slug"
        placeholder='Slug (e.g. "google")'
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <input
        type="text"
        name="url"
        placeholder='URL (e.g. "https://google.com")'
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <button
        type="submit"
        class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        disabled={linkMutation.isLoading}
      >
        <Show when={!linkMutation.isLoading} fallback={<span>Loading...</span>}>
          Add new
        </Show>
      </button>
      <Show when={linkMutation.isError}>
        <div class="text-red-600 text-center">
          An error occurred, please retry
        </div>
      </Show>
    </form>
  );
};

export default AddLink;
