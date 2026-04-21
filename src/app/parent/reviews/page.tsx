"use client";

import { useState, useEffect } from "react";
import { useAuth, User } from "@frontend/context/AuthContext";
import styles from "../parent.module.css";
import { MessageCircle, Send, Heart, Trash2 } from "lucide-react";

interface Review {
  id: string;
  childId: string;
  parentId: string;
  text: string;
  date: string;
  read: boolean;
}

export default function ParentReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [child, setChild] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.childId) {
        const userRes = await fetch("/api/admin/users");
        const userData = await userRes.json();
        const found = userData.users?.find((u: User) => u.id === user.childId);
        if (found) setChild(found);

        const reviewRes = await fetch(`/api/reviews?childId=${user.childId}`);
        const reviewData = await reviewRes.json();
        if (reviewData.reviews) setReviews(reviewData.reviews);
      }
    };
    fetchData();
  }, [user]);

  const addReview = async () => {
    if (!newReview.trim() || !user || !child) return;

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: child.id,
        text: newReview,
        date: new Date().toLocaleDateString()
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setReviews([data.review, ...reviews]);
      setNewReview("");
      alert("Review sent to your child! ❤️");
    }
  };

  const deleteReview = async (id: string) => {
    const res = await fetch("/api/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  if (!child) return <div>No child linked.</div>;

  return (
    <div>
      <div className={styles.tableTitle}>
        <div>
          <h1>Encouraging Reviews</h1>
          <p>Send a message of love and encouragement to {child.username}.</p>
        </div>
        <Heart size={40} fill="#fb7185" color="#fb7185" />
      </div>

      <div className={styles.tableContainer}>
        <h3>New Review</h3>
        <div style={{ marginTop: '15px' }}>
          <textarea
            className={styles.actionBtn}
            style={{ width: '100%', height: '120px', textAlign: 'left', padding: '15px', background: '#f8fafc' }}
            placeholder={`Tell ${child.username} how proud you are today...`}
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          ></textarea>
          <button
            className={styles.submitBtn}
            style={{ width: 'auto', padding: '10px 30px', marginTop: '15px', marginLeft: 'auto', display: 'flex', gap: '8px' }}
            onClick={addReview}
          >
            Send Message <Send size={18} />
          </button>
        </div>
      </div>

      <div className={styles.reviewSection} style={{ marginTop: '40px' }}>
        <h3>Past Reviews</h3>
        <div style={{ marginTop: '20px' }}>
          {reviews.sort((a, b) => b.id.localeCompare(a.id)).map(review => (
            <div key={review.id} className={styles.reviewCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '5px' }}>{review.date}</h4>
                  <p>{review.text}</p>
                </div>
                <button className={styles.actionBtn} onClick={() => deleteReview(review.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No reviews sent yet.</p>}
        </div>
      </div>
    </div>
  );
}
