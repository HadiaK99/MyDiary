import Header from "@/components/Navigation/Header";

const CATEGORIES = ["Ibadah (Prayers)", "Manners/Ethics", "Study", "Health & Cleanliness", "Media / Gadgets"];

export default function MonthlyAnalysis({ params: paramsPromise }: { params: Promise<{ month: string }> }) {
  const params = use(paramsPromise);
  return (
    <div className={styles.container}>
      <Header />

      <section className={`${styles.analysisCard} glass animate-fade-in`}>
        <h2>How did I do? ✨</h2>
        <p>Reflect on your growth this month.</p>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Excellent</th>
                <th>Good</th>
                <th>Fair</th>
                <th>Poor</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map(cat => (
                <tr key={cat}>
                  <td>{cat}</td>
                  {[1, 2, 3, 4].map(i => (
                    <td key={i} className={styles.cell}>
                      <input type="radio" name={cat} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className={styles.overallRow}>
                <td><strong>OVERALL</strong></td>
                {[1, 2, 3, 4].map(i => (
                  <td key={i} className={styles.cell}>
                    <input type="radio" name="overall" />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.notesArea}>
          <h3>My Reflections</h3>
          <textarea placeholder="What was the best part of this month? What can I improve?"></textarea>
        </div>

        <div className={styles.footer}>
          <button className="pill-btn">Save Analysis</button>
        </div>
      </section>
    </div>
  );
}
