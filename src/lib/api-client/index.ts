export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data: any = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: any;
  params?: Record<string, string | number | boolean>;
}

async function request<T>(endpoint: string, options: FetchOptions = {}, retries = 0): Promise<T> {
  const { body, params, headers, ...customConfig } = options;

  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const config: RequestInit = {
    ...customConfig,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const req = new Request(url, config);

  try {
    const response = await fetch(req);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(data?.error || "An error occurred", response.status, data);
    }

    return data as T;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new ApiError("Request aborted", 0);
    }
    if (retries > 0 && (!error.status || error.status >= 500 || error.status === 429)) {
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
      return request(endpoint, options, retries - 1);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message, 0);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<FetchOptions, "body">) => request<T>(endpoint, { ...options, method: "GET" }, 2),
  post: <T>(endpoint: string, body: any, options?: FetchOptions) => request<T>(endpoint, { ...options, body, method: "POST" }, 0),
  put: <T>(endpoint: string, body: any, options?: FetchOptions) => request<T>(endpoint, { ...options, body, method: "PUT" }, 0),
  delete: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, { ...options, method: "DELETE" }, 0),
  patch: <T>(endpoint: string, body: any, options?: FetchOptions) => request<T>(endpoint, { ...options, body, method: "PATCH" }, 0),
};
