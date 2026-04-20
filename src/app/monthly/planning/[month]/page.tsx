import { use } from "react";
import styles from "./planning.module.css";
import Header from "@frontend/components/Navigation/Header";

export default function MonthlyPlanning({ params: paramsPromise }: { params: Promise<{ month: string }> }) {
  const params = use(paramsPromise);
  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.grid}>
        {/* Schedule Section */}
        <section className={`${styles.card} glass`}>
          <h2>My Daily Schedule</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Time / Task</th>
                  <th>Daily</th>
                  <th>Holiday</th>
                </tr>
              </thead>
              <tbody>
                {["Awakening", "School / Study", "TV / Media / Gadgets", "Sports / Exercise", "Sleeping"].map(item => (
                  <tr key={item}>
                    <td>{item}</td>
                    <td><input type="text" placeholder="e.g. 7:00 AM" /></td>
                    <td><input type="text" placeholder="e.g. 9:00 AM" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Goals Section */}
        <section className={`${styles.card} glass`}>
          <h2>Constructive Reading 📚</h2>
          <p>What books or stories will you read this month?</p>
          <textarea placeholder="List your books, titles, and stories..."></textarea>

          <h2 style={{ marginTop: '30px' }}>TV / Media Channels 📺</h2>
          <p>Which programs and channels are allowed?</p>
          <textarea placeholder="List your allowed channels and time limits..."></textarea>
        </section>
      </div>

      <div className={styles.footer}>
        <button className="pill-btn">Save May Planning</button>
      </div>
    </div>
  );
}
