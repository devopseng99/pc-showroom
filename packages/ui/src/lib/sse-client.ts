type SSEHandler = (event: any) => void;

const USE_STATIC = !import.meta.env.VITE_API_URL;

export function createSSEClient(onEvent: SSEHandler) {
  // In static mode, SSE is not available — return a no-op client
  if (USE_STATIC) {
    return { close() {} };
  }

  let es: EventSource | null = null;
  let retryTimeout: ReturnType<typeof setTimeout> | null = null;

  function connect() {
    es = new EventSource("/api/events/stream");

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent(data);
      } catch {}
    };

    es.onerror = () => {
      es?.close();
      retryTimeout = setTimeout(connect, 3000);
    };
  }

  connect();

  return {
    close() {
      es?.close();
      if (retryTimeout) clearTimeout(retryTimeout);
    },
  };
}
