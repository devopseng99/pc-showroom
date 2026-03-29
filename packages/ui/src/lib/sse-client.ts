type SSEHandler = (event: any) => void;

export function createSSEClient(onEvent: SSEHandler) {
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
