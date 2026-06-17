import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import Navbar from '../components/Navbar';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';

const fetcher = (url) => fetch(url).then((r) => r.json());

const CATEGORIES = ['All', 'DeFi', 'NFT', 'Exchange', 'Gaming', 'Infrastructure', 'DAO', 'Other'];

export default function Listings() {
  const { data: listings } = useSWR('/api/listings', fetcher);
  const list = Array.isArray(listings) ? listings : [];

  const featured = list.filter((l) => l.featured);
  const regular = list.filter((l) => !l.featured);

  return (
    <>
      <Head>
        <title>Crypto Project Listings – LiveChainNews</title>
        <meta name="description" content="Discover the best crypto projects listed on LiveChainNews. DeFi, NFT, exchanges, gaming and more." />
        <link rel="canonical" href="https://livechainnews.com/listings" />
      </Head>
      <PriceTicker />
      <Navbar />
      <main className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Project Listings</h1>
            <p style={{ color: '#888', fontSize: 15 }}>Discover and explore the best crypto projects.</p>
          </div>
          <Link href="/advertise" style={{
            padding: '10px 24px',
            background: '#00e676',
            color: '#000',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
          }}>
            🚀 List Your Project
          </Link>
        </div>

        {list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#fff' }}>Be the first listed project!</h2>
            <p style={{ marginBottom: 24 }}>No projects listed yet. Get featured in front of thousands of crypto enthusiasts.</p>
            <Link href="/advertise" style={{
              padding: '10px 24px',
              background: '#00e676',
              color: '#000',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
            }}>Get Listed →</Link>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#00e676', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>⭐ Featured Projects</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                  {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
                </div>
              </div>
            )}

            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#888', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>All Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {regular.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function ProjectCard({ project }) {
  return (
    <a href={project.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#111',
        border: `1px solid ${project.featured ? '#00e676' : '#222'}`,
        borderRadius: 12,
        padding: 24,
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#00e676'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = project.featured ? '#00e676' : '#222'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          {project.logo_url ? (
            <img src={project.logo_url} alt={project.name} width={44} height={44} style={{ borderRadius: 10, objectFit: 'contain', background: '#1a1a1a' }} />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪙</div>
          )}
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{project.name}</div>
            <div style={{ fontSize: 11, color: '#00e676', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{project.category}</div>
          </div>
          {project.featured && (
            <div style={{ marginLeft: 'auto', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 6, padding: '2px 8px', fontSize: 10, color: '#00e676', fontWeight: 700 }}>FEATURED</div>
          )}
        </div>
        {project.description && (
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, margin: 0 }}>{project.description}</p>
        )}
      </div>
    </a>
  );
}