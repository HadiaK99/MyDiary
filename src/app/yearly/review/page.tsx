import Header from "@frontend/components/Navigation/Header";

export default function YearlyReview() {
  return (
    <div className={styles.container}>
      <Header />

      <section className={`${styles.mainCard} glass animate-fade-in`}>
        <h2>Celebrating My Growth! 🎉</h2>
        <p>You've completed an incredible journey this year. Let's look back at your resolutions.</p>

        <div className={styles.focusReview}>
          <h3>My Annual Focuses</h3>
          <div className={styles.focusList}>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.focusItem}>
                <div className={styles.focusText}>
                  <strong>Goal #{i}:</strong>
                  <span>Improve my Salah focus and read daily.</span>
                </div>
                <div className={styles.checkArea}>
                  <label>Did I achieve it?</label>
                  <select>
                    <option>Yes, I did! 🌟</option>
                    <option>Almost there! ✨</option>
                    <option>Working on it! 💪</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.reflectionArea}>
          <h3>My Big Achievements</h3>
          <textarea placeholder="Write down the things you are most proud of this year..."></textarea>
          
          <h3 style={{ marginTop: '30px' }}>What I learned</h3>
          <textarea placeholder="What are the biggest lessons you learned this year?"></textarea>
        </div>

        <div className={styles.footer}>
          <button className="pill-btn">Finish Year-end Review</button>
        </div>
      </section>
    </div>
  );
}
