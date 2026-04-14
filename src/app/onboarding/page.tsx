"use client";

import { useState } from "react";
import styles from "./onboarding.module.css";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const finish = () => router.push("/");

  return (
    <div className={styles.container}>
      <div className={`${styles.formCard} glass animate-fade-in`}>
        {/* Progress Bar */}
        <div className={styles.progressHeader}>
          <div className={styles.stepIndicator}>Step {step} of 3</div>
          <div className={styles.progressLine}>
            <div className={styles.progressFill} style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </div>

        {step === 1 && (
          <div className={styles.stepContent}>
            <h1>All About Me! 🌈</h1>
            <p>Let's personalize your diary. Tell us a bit about yourself.</p>
            
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label>My Name</label>
                <input type="text" placeholder="Enter your name" />
              </div>
              <div className={styles.inputGroup}>
                <label>School</label>
                <input type="text" placeholder="Your school name" />
              </div>
              <div className={styles.inputGroup}>
                <label>Date of Birth</label>
                <input type="date" />
              </div>
              <div className={styles.inputGroup}>
                <label>Blood Group</label>
                <input type="text" placeholder="e.g. A+" />
              </div>
            </div>

            <h3>My Favorites</h3>
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label>Color</label>
                <input type="text" placeholder="🎨" />
              </div>
              <div className={styles.inputGroup}>
                <label>Food</label>
                <input type="text" placeholder="🍕" />
              </div>
              <div className={styles.inputGroup}>
                <label>Hobbies</label>
                <input type="text" placeholder="⚽" />
              </div>
              <div className={styles.inputGroup}>
                <label>Goals</label>
                <input type="text" placeholder="🚀" />
              </div>
            </div>

            <button className="primary-btn" style={{ width: '100%', marginTop: '20px' }} onClick={nextStep}>
              Next: My Annual Focuses ➡️
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContent}>
            <h1>Yearly Focuses 🏆</h1>
            <p>What are your big dreams and goals for this year? (Resolutions)</p>
            
            <div className={styles.focusList}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.focusItem}>
                  <span>{i}.</span>
                  <input type="text" placeholder={`Goal #${i}`} />
                </div>
              ))}
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.backBtn} onClick={prevStep}>Back</button>
              <button className="primary-btn" onClick={nextStep}>Next: Month Planning ➡️</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContent}>
            <h1>First Month Plan 📅</h1>
            <p>Let's plan your schedule for the first month.</p>
            
            <div className={styles.inputGroup}>
              <label>What's your main focus this month?</label>
              <textarea placeholder="e.g. Learning a new Surah, or helping at home..."></textarea>
            </div>

            <div className={styles.schedulePreview}>
              {/* Simplified version for now */}
              <div className={styles.inputGroup}>
                <label>Allowed TV/Media programs</label>
                <input type="text" placeholder="List allowed channels..." />
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.backBtn} onClick={prevStep}>Back</button>
              <button className="primary-btn" onClick={finish}>Finish & Open My Diary! 🎉</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
