import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './admin.module.css';

const EMPTY = {
  id: null, title: '', slug: '', excerpt: '', body: '',
  image_url: '', author: 'LiveChainNews', category: 'News',
  published: true, featured: false,
};

const CATEGORIES = ['News', 'Analysis', 'Bitcoin', 'Ethereum', 'DeFi', 'NFT', 'Regulation', 'Altcoin'];

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const headers = () => ({
    'Content-Type': 'application/json',
    'x-admin-password': password,
  });

  async function login() {
    const res = await fetch('/api/admin/articles', { headers: headers() });
    if (res.ok) {
      setAuthed(true);
      setArticles(await res.json());
    } else {
      setMsg('Wrong password.');
    }
  }

  async function loadArticles() {
    const res = await fetch('/api/admin/articles', { headers: headers() });
    if (res.ok) setArticles(await res.json());
  }

  async function save() {
    if (!form.title) { setMsg('Title is required.'); return; }
    setSaving(true);
    setMsg('');
    const method = form.id ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/articles', {
      method,
      headers: headers(),
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setMsg(form.id ? 'Updated!' : 'Published!');
      setForm(EMPTY);
      loadArticles();
    } else {
      const e = await res.json();
      setMsg('Error: ' + (e.error || 'failed'));
    }
  }

  function edit(a) {
    setForm(a);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id) {
    if (!confirm('Delete this article permanently?')) return;
    const res = await fetch('/api/admin/articles', {
      method: 'DELETE',
      headers: headers(),
      body: JSON.stringify({ id }),
    });
    if (res.ok) loadArticles();
  }

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <>
        <Head><title>Admin — LiveChainNews</title><meta name="robots" content="noindex" /></Head>
        <div className={styles.loginWrap}>
          <div className={styles.loginBox}>
            <div className={styles.logo}>
              <span className={styles.live}>Live</span><span className={styles.chain}>Chain</span><span className={styles.news}>News</span>
            </div>
            <h1 className={styles.loginTitle}>Admin Panel</h1>
            <input
              type="password"
              className={styles.input}
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
            />
            <button className={styles.btnPrimary} onClick={login}>Log in</button>
            {msg && <div className={styles.errorMsg}>{msg}</div>}
          </div>
        </div>
      </>
    );
  }

  // ── EDITOR ──
  return (
    <>
      <Head><title>Admin — LiveChainNews</title><meta name="robots" content="noindex" /></Head>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.live}>Live</span><span className={styles.chain}>Chain</span><span className={styles.news}>News</span>
            <span className={styles.adminTag}>admin</span>
          </div>
          <a href="/" className={styles.viewSite}>View site →</a>
        </header>

        <div className={styles.grid}>
          {/* EDITOR FORM */}
          <div className={styles.editor}>
            <h2 className={styles.sectionTitle}>{form.id ? 'Edit article' : 'New article'}</h2>

            <label className={styles.label}>Title</label>
            <input className={styles.input} value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Bitcoin hits new all-time high..." />

            <label className={styles.label}>Slug (URL) — leave empty to auto-generate</label>
            <input className={styles.input} value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="bitcoin-new-ath" />

            <label className={styles.label}>Cover image URL</label>
            <input className={styles.input} value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..." />

            <div className={styles.row}>
              <div style={{ flex: 1 }}>
                <label className={styles.label}>Category</label>
                <select className={styles.input} value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className={styles.label}>Author</label>
                <input className={styles.input} value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
            </div>

            <label className={styles.label}>Excerpt (short summary)</label>
            <textarea className={styles.textarea} rows={2} value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="One or two sentences shown in the article list..." />

            <label className={styles.label}>Body (full article — supports line breaks)</label>
            <textarea className={styles.textarea} rows={14} value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Write your article here..." />

            <div className={styles.checks}>
              <label className={styles.check}>
                <input type="checkbox" checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                Published (visible on site)
              </label>
              <label className={styles.check}>
                <input type="checkbox" checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured (big card on homepage)
              </label>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnPrimary} onClick={save} disabled={saving}>
                {saving ? 'Saving...' : form.id ? 'Update article' : 'Publish article'}
              </button>
              {form.id && (
                <button className={styles.btnGhost} onClick={() => { setForm(EMPTY); setMsg(''); }}>
                  Cancel / New
                </button>
              )}
            </div>
            {msg && <div className={styles.msg}>{msg}</div>}
          </div>

          {/* ARTICLE LIST */}
          <div className={styles.list}>
            <h2 className={styles.sectionTitle}>All articles ({articles.length})</h2>
            {articles.length === 0 && <p className={styles.empty}>No articles yet. Write your first one!</p>}
            {articles.map((a) => (
              <div key={a.id} className={styles.listItem}>
                <div className={styles.listInfo}>
                  <div className={styles.listTitle}>{a.title}</div>
                  <div className={styles.listMeta}>
                    <span className={styles.cat}>{a.category}</span>
                    {a.published
                      ? <span className={styles.pub}>● Published</span>
                      : <span className={styles.draft}>○ Draft</span>}
                    {a.featured && <span className={styles.feat}>★ Featured</span>}
                  </div>
                </div>
                <div className={styles.listActions}>
                  <button className={styles.btnSmall} onClick={() => edit(a)}>Edit</button>
                  <button className={styles.btnSmallDanger} onClick={() => remove(a.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
