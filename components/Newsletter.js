import { useState } from 'react';
import styles from '../pages/index.module.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  async function subscribe() {
    if (!email) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('ok');
        setMessage(data.message || 'Subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (e) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div className="widget">
      <div className="widget-header">
        <div className="widget-title"><span>📧</span> Daily Digest</div>
      </div>
      <div className={styles.newsletter}>
        <h3>Stay ahead of the market</h3>
        <p>Get the top 5 crypto stories every morning — no noise, just signal.</p>
        {status === 'ok' ? (
          <div className={styles.newsletterSuccess}>✓ {message}</div>
        ) : (
          <>
            <input
              type="email"
              placeholder="your@email.com"
              className={styles.newsletterInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && subscribe()}
              disabled={status === 'loading'}
            />
            <button
              className={styles.btnSubscribe}
              onClick={subscribe}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe free →'}
            </button>
            {status === 'error' && <div className={styles.newsletterError}>{message}</div>}
            <div className={styles.newsletterNote}>No spam. Unsubscribe anytime.</div>
          </>
        )}
      </div>
    </div>
  );
}
