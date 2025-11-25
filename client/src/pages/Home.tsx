import * as React from 'react';
const { useEffect, useState } = React;

export default function Home() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (mounted && data && data.status) setStatus(String(data.status));
      })
      .catch((err) => {
        if (mounted) setStatus('error');
        console.error('Health check failed', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h2>PDM App running</h2>
      <p>API Health: {status ?? 'loading...'}</p>
    </div>
  );
}
