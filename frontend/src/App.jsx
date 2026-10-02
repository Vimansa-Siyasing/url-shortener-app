import { useState } from 'react';
import './App.css';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : '';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setShortUrl(data.shortUrl);
      }
    } catch {
      setError('Cannot reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paste your long URL here"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {shortUrl && (
        <div className="result">
          <p>Your short URL:</p>
          <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
        </div>
      )}
    </div>
  );
}

export default App;