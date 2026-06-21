import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './admin.module.css';

const EMPTY = {
  id: null, title: '', slug: '', excerpt: '', body: '',
  image_url: '', image_alt: '', author: 'LiveChainNews', category: 'News',
  published: true, featured: false, tags: [], faq: '',
};

const CATEGORIES = ['News', 'Analysis', 'Bitcoin', 'Ethereum', 'DeFi', 'NFT', 'Regulation', 'Altcoin', 'Learn', 'Blog'];

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [tweets, setTweets] = useState([]);
  const [tweetUrl, setTweetUrl] = useState('');
  const [tweetNote, setTweetNote] = useState('');
  const [listings, setListings] = useState([]);
  const [listingForm, setListingForm] = useState({ name: '', website: '', logo_url: '', description: '', category: 'DeFi', package: 'Basic', featured: false });

  const headers = () => ({
    'Content-Type': 'application/json',
    'x-admin-password': password,
  });

  async function login() {
    const res = await fetch('/api/admin/articles', { headers: headers() });
    if (res.ok) {
      setAuthed(true);
      setArticles(await res.json());
      loadTweets();
      loadListings();
    } else {
      setMsg('Wrong password.');
    }
  }

  async function loadArticles() {
    const res = await fetch('/api/admin/articles', { headers: headers() });
    if (res.ok) setArticles(await res.json());
  }


  async function uploadImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg('Uploading image...');
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({ fileName: file.name, fileData: reader.result }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setForm((prev) => ({ ...prev, image_url: data.url }));
          setMsg('Image uploaded!');
        } else {
          setMsg('Upload failed: ' + (data.error || 'unknown'));
        }
      } catch (err) {
        setMsg('Upload error: ' + err.message);
      }
    };
    reader.readAsDataURL(file);
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
    const faqText = Array.isArray(a.faq)
      ? a.faq.map((f) => `${f.question} | ${f.answer}`).join('\n')
      : (a.faq || '');
    setForm({ ...a, faq: faqText });
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

  async function loadTweets() {
    const res = await fetch('/api/tweets');
    if (res.ok) setTweets(await res.json());
  }

  async function addTweet() {
    if (!tweetUrl) { setMsg('Tweet URL is required.'); return; }
    const res = await fetch('/api/tweets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, url: tweetUrl, note: tweetNote }),
    });
    if (res.ok) { setTweetUrl(''); setTweetNote(''); loadTweets(); setMsg('Tweet added!'); }
    else setMsg('Error adding tweet.');
  }

  async function deleteTweet(id) {
    if (!confirm('Delete this tweet?')) return;
    const res = await fetch('/api/tweets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id }),
    });
    if (res.ok) loadListings();
  }

  async function loadListings() {
    const res = await fetch('/api/listings');
    if (res.ok) setListings(await res.json());
  }

  async function saveListing() {
    if (!listingForm.name || !listingForm.website) { setMsg('Name and website are required.'); return; }
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, ...listingForm }),
    });
    if (res.ok) { setListingForm({ name: '', website: '', logo_url: '', description: '', category: 'DeFi', package: 'Basic', featured: false }); loadListings(); setMsg('Project listed!'); }
    else setMsg('Error adding listing.');
  }

  async function deleteListing(id) {
    if (!confirm('Delete this listing?')) return;
    const res = await fetch('/api/listings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id }),
    });
    if (res.ok) loadListings();
  }

  async function deleteTweet(id) {
    if (!confirm('Delete this tweet?')) return;
    const res = await fetch('/api/tweets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id }),
    });
    if (res.ok) loadTweets();
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
              <label className={styles.label}>Image alt text (SEO — describe the image with keywords)</label>
            <input className={styles.input} value={form.image_alt || ''}
              onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
              placeholder="bitcoin price chart 2026 green candles" />
            <label style={{ display: 'inline-block', marginTop: 8, padding: '8px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              📤 Upload image from computer
              <input type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} />
            </label>
            {form.image_url && (
              <img src={form.image_url} alt="preview" style={{ display: 'block', marginTop: 10, maxWidth: '100%', maxHeight: 160, borderRadius: 8, border: '1px solid var(--border)' }} />
            )}

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

<label className={styles.label}>Tags (separate with comma — ex: bitcoin, etf, regulation)</label>
            <input className={styles.input}
              value={Array.isArray(form.tags) ? form.tags.join(', ') : ''}
              onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
              placeholder="bitcoin, etf, regulation..." />
            <label className={styles.label}>Excerpt (short summary)</label>
            <textarea className={styles.textarea} rows={2} value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="One or two sentences shown in the article list..." />


            <label className={styles.label}>Body (full article � supports line breaks)</label>
            <textarea className={styles.textarea} rows={14} value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Write your article here..." />
            <label className={styles.label}>FAQ (optional — one per line, format: Question? | Answer)</label>
            <textarea className={styles.textarea} rows={5} value={form.faq || ''}
              onChange={(e) => setForm({ ...form, faq: e.target.value })}
              placeholder={"What is Bitcoin? | Bitcoin is the first cryptocurrency...\nIs Bitcoin safe? | Bitcoin's network is secure, but..."} />

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

          {/* TWEETS SECTION */}
          <div className={styles.list} style={{ marginTop: 32 }}>
            <h2 className={styles.sectionTitle}>Analysis Tweets ({tweets.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <input
                className={styles.input}
                placeholder="Tweet URL (https://x.com/user/status/...)"
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
              />
              <input
                className={styles.input}
                placeholder="Note (optional — ex: Bullish BTC setup)"
                value={tweetNote}
                onChange={(e) => setTweetNote(e.target.value)}
              />
              <button className={styles.btnPrimary} onClick={addTweet}>Add Tweet</button>
            </div>
            {tweets.length === 0 && <p className={styles.empty}>No tweets added yet.</p>}
            {tweets.map((t) => (
              <div key={t.id} className={styles.listItem}>
                <div className={styles.listInfo}>
                  <div className={styles.listTitle} style={{ fontSize: 13 }}>{t.url}</div>
                  {t.note && <div className={styles.listMeta} style={{ color: '#00e676' }}>{t.note}</div>}
                </div>
                <div className={styles.listActions}>
                  <button className={styles.btnSmallDanger} onClick={() => deleteTweet(t.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

   {/* LISTINGS SECTION */}
          <div className={styles.list} style={{ marginTop: 32 }}>
            <h2 className={styles.sectionTitle}>Project Listings ({listings.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <input className={styles.input} placeholder="Project name" value={listingForm.name} onChange={(e) => setListingForm({ ...listingForm, name: e.target.value })} />
              <input className={styles.input} placeholder="Website (https://...)" value={listingForm.website} onChange={(e) => setListingForm({ ...listingForm, website: e.target.value })} />
              <input className={styles.input} placeholder="Logo URL (https://...)" value={listingForm.logo_url} onChange={(e) => setListingForm({ ...listingForm, logo_url: e.target.value })} />
              <textarea className={styles.textarea} rows={2} placeholder="Short description" value={listingForm.description} onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })} />
              <select className={styles.input} value={listingForm.category} onChange={(e) => setListingForm({ ...listingForm, category: e.target.value })}>
                {['DeFi','NFT','Exchange','Gaming','Infrastructure','DAO','Other'].map((c) => <option key={c}>{c}</option>)}
              </select>
              <select className={styles.input} value={listingForm.package} onChange={(e) => setListingForm({ ...listingForm, package: e.target.value })}>
                {['Basic','Pro','Premium'].map((p) => <option key={p}>{p}</option>)}
              </select>
              <label className={styles.check}>
                <input type="checkbox" checked={listingForm.featured} onChange={(e) => setListingForm({ ...listingForm, featured: e.target.checked })} />
                Featured project
              </label>
              <button className={styles.btnPrimary} onClick={saveListing}>Add Listing</button>
            </div>
            {listings.length === 0 && <p className={styles.empty}>No listings yet.</p>}
            {listings.map((l) => (
              <div key={l.id} className={styles.listItem}>
                <div className={styles.listInfo}>
                  <div className={styles.listTitle}>{l.name}</div>
                  <div className={styles.listMeta}>
                    <span className={styles.cat}>{l.category}</span>
                    <span className={styles.cat}>{l.package}</span>
                    {l.featured && <span className={styles.feat}>★ Featured</span>}
                  </div>
                </div>
                <div className={styles.listActions}>
                  <button className={styles.btnSmallDanger} onClick={() => deleteListing(l.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
