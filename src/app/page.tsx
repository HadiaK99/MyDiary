import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className="glass" style={{ padding: '8px 16px', borderRadius: '40px' }}>
          <span style={{ fontWeight: 600 }}>🌟 MyDiary</span>
        </div>
        <Link href="/onboarding" className="btn" style={{ fontSize: '0.8rem', opacity: 0.6 }}>⚙️ Settings</Link>
      </header>

      {/* Hero Section */}
      <section className={`${styles.hero} animate-fade-in`}>
        <div className={styles.heroText}>
          <h1>Welcome back, <span style={{ color: 'var(--primary)' }}>Hero!</span></h1>
          <p>Ready to record your amazing day and reach your goals?</p>
          <Link href="/diary/weekly/1" className="primary-btn" style={{ marginTop: '20px', display: 'inline-block' }}>
            Start Today's Entry 📝
          </Link>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/cover.png"
            alt="My Diary Illustration"
            width={500}
            height={400}
            style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            priority
          />
        </div>
      </section>

      {/* Grid Section */}
      <section className={styles.grid}>
        <Link href="/diary/weekly/1" className={`${styles.card} glass`} style={{ cursor: 'pointer' }}>
          <h3>📅 This Week</h3>
          <div className={styles.stat}>
            <span className={styles.statValue}>4/7</span>
            <span className={styles.statLabel}>Days Logged</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '60%' }}></div>
          </div>
        </Link>

        <div className={`${styles.card} glass`}>
          <h3>✨ Spiritual Goal</h3>
          <p>Prayer focus: <strong>Fajr</strong></p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>You've hit this 3 times this week!</p>
        </div>

        <div className={`${styles.card} glass`}>
          <h3>📚 Reading List</h3>
          <p>Next book: <strong>The Brave Lion</strong></p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.actions}>
        <h2>What's next?</h2>
        <div className={styles.actionButtons}>
          <Link href="/monthly/analysis/april" className={`${styles.actionCard} glass`}>
            <span>📊</span>
            <h4>Monthly Analysis</h4>
          </Link>
          <Link href="/monthly/planning/may" className={`${styles.actionCard} glass`}>
            <span>🎯</span>
            <h4>Next Month Planning</h4>
          </Link>
          <Link href="/yearly/review" className={`${styles.actionCard} glass`}>
            <span>🏆</span>
            <h4>Yearly Review</h4>
          </Link>
        </div>
      </section>
    </div>
  );
}
