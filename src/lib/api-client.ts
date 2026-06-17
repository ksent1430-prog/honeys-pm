export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

export const apiClient = {
  get: <T>(url: string) => fetcher<T>(url, { method: 'GET' }),
  post: <T>(url: string, data: any) => fetcher<T>(url, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(url: string, data: any) => fetcher<T>(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(url: string) => fetcher<T>(url, { method: 'DELETE' }),
};
