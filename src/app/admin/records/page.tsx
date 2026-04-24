"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar, 
  User as UserIcon,
  ChevronRight,
  ChevronLeft,
  X as CloseIcon
} from "lucide-react";
import RecordEditor from "@frontend/components/Admin/RecordEditor";

interface User {
  id: string;
  username: string;
  role: string;
}

interface DiaryEntry {
  id: string;
  date: string;
  score: number;
  rating: string;
  data: string;
}

const ITEMS_PER_PAGE = 10;

export default function UserRecords() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        // Only show child users
        if (data.users) setUsers(data.users.filter((u: User) => u.role === "CHILD"));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const fetchEntries = async (userId: string) => {
    setLoadingEntries(true);
    try {
      const res = await fetch(`/api/diary?userId=${userId}`);
      const data = await res.json();
      if (data.entries) setEntries(data.entries);
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setDateFilter(""); 
    setCurrentPage(1);
    fetchEntries(user.id);
  };

  const deleteEntry = async (date: string) => {
    if (!selectedUser) return;
    if (confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      await fetch("/api/diary", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, date }),
      });
      fetchEntries(selectedUser.id);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => a.username.localeCompare(b.username));

  // Filter ONLY by date if selected
  const filteredEntries = entries.filter(e => {
    if (!dateFilter) return true;
    return e.date === dateFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, selectedUser]);

  return (
    <div className={styles.recordsContainer}>
      <div className={styles.tableTitle} style={{ flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1>User Record Management</h1>
          <p>Browse, add, or fix daily journal entries for child users.</p>
        </div>
        {selectedUser && (
          <div className={styles.tableActions}>
            <button 
              className={styles.submitBtn} 
              onClick={() => { setEditingEntry(null); setShowEditor(true); }}
              style={{ width: 'fit-content' }}
            >
              <Plus size={18} /> <span className={styles.btnText}>Add New Record</span>
            </button>
          </div>
        )}
      </div>

      <div className={styles.recordsGrid}>
        {/* User Selection Sidebar */}
        <div className={styles.tableContainer} style={{ marginTop: 0, paddingBottom: '10px' }}>
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Search users..."
              className={styles.actionBtn}
              style={{ width: '100%', paddingLeft: '36px', height: '44px', background: '#f8fafc' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Loading users...</p>
            ) : filteredUsers.length > 0 ? filteredUsers.map(user => (
              <div 
                key={user.id}
                className={`${styles.navItem} ${selectedUser?.id === user.id ? styles.active : ''}`}
                style={{ cursor: 'pointer', marginBottom: '4px', justifyContent: 'space-between' }}
                onClick={() => handleUserSelect(user)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <UserIcon size={16} />
                  <span>{user.username}</span>
                </div>
                <ChevronRight size={14} style={{ opacity: selectedUser?.id === user.id ? 1 : 0.3 }} />
              </div>
            )) : (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', fontSize: '0.9rem' }}>No child users found</p>
            )}
          </div>
        </div>

        {/* Entries List Area */}
        <div className={styles.tableContainer} style={{ marginTop: 0 }}>
          {selectedUser ? (
            <>
              <div className={styles.entryHistoryTitle}>
                <h3 style={{ margin: 0 }}>Entry History for {selectedUser.username}</h3>
                
                <div className={styles.filterGroup} style={{ gap: '10px' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <label className={styles.filterLabel} style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Date:</label>
                    <input 
                      type="date"
                      className={`${styles.actionBtn} ${styles.filterControl}`}
                      style={{ height: '36px', fontSize: '0.85rem', width: '130px', padding: '0 10px' }}
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>

                  {dateFilter && (
                    <button 
                      className={styles.actionBtn}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        height: '36px', 
                        padding: '0 12px',
                        background: '#f1f5f9',
                        color: '#ef4444',
                        borderColor: '#fee2e2',
                        fontSize: '0.85rem'
                      }}
                      onClick={() => setDateFilter("")}
                    >
                      <CloseIcon size={14} /> Clear
                    </button>
                  )}

                  <div style={{ color: '#94a3b8', fontSize: '0.83rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '15px' }}>
                    <strong>{filteredEntries.length}</strong> recs
                  </div>
                </div>
              </div>

              {loadingEntries ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div className="animate-pulse" style={{ color: '#1e293b', fontWeight: 600 }}>Fetching records...</div>
                </div>
              ) : filteredEntries.length > 0 ? (
                <>
                  <div className={styles.tableWrapper}>
                    <table className={styles.adminTable}>
                      <thead>
                        <tr>
                          <th style={{ width: '150px' }}>Date</th>
                          <th>Score</th>
                          <th>Performance</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedEntries.map(entry => (
                          <tr key={entry.id}>
                            <td style={{ fontWeight: 700 }} className={styles.nowrap}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={14} style={{ color: '#64748b' }} />
                                {new Date(entry.date).toLocaleDateString()}
                              </div>
                            </td>
                            <td className={styles.nowrap}>
                              <span style={{ fontWeight: 800, color: '#1e293b' }}>{entry.score}</span> pts
                            </td>
                            <td className={styles.nowrap} style={{ minWidth: '140px' }}>
                              <span className={styles.badge} style={{ 
                                background: getRatingColor(entry.rating),
                                color: 'white',
                                display: 'inline-block',
                              }}>
                                {entry.rating}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button 
                                  className={styles.actionBtn}
                                  onClick={() => { setEditingEntry(entry); setShowEditor(true); }}
                                  title="Edit record"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button 
                                  className={styles.actionBtn}
                                  onClick={() => deleteEntry(entry.date)}
                                  title="Delete record"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className={styles.paginationContainer}>
                      <button 
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ''}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button 
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94a3b8' }}>
                  <Calendar size={48} style={{ opacity: 0.1, marginBottom: '15px' }} />
                  <p>{dateFilter ? "No records found for this date." : "No records found for this user."}</p>
                  {!dateFilter && (
                    <button 
                      className={styles.submitBtn} 
                      style={{ marginTop: '20px', background: '#f1f5f9', color: '#475569', boxShadow: 'none' }}
                      onClick={() => { setEditingEntry(null); setShowEditor(true); }}
                    >
                      Create the first record
                    </button>
                  )}
                  {dateFilter && (
                    <button 
                      className={styles.actionBtn} 
                      style={{ margin: '20px auto 0', padding: '10px 20px' }}
                      onClick={() => setDateFilter("")}
                    >
                      View all entries
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '100px 40px', textAlign: 'center', color: '#94a3b8' }}>
              <UserIcon size={64} style={{ opacity: 0.1, marginBottom: '20px' }} />
              <h3>Select a child user to manage their history</h3>
              <p style={{ maxWidth: '400px', margin: '10px auto 0' }}>
                Use the search on the left to find a child account and view or fix their daily diary entries.
              </p>
            </div>
          )}
        </div>
      </div>

      {showEditor && selectedUser && (
        <RecordEditor
          userId={selectedUser.id}
          username={selectedUser.username}
          entry={editingEntry}
          onClose={() => setShowEditor(false)}
          onSave={() => {
            setShowEditor(false);
            fetchEntries(selectedUser.id);
          }}
        />
      )}
    </div>
  );
}

function getRatingColor(rating: string) {
  switch (rating) {
    case "Superstar": return "#8b5cf6";
    case "Doing Great": return "#10b981";
    case "Solid Start": return "#6366f1";
    case "Needs Focus": return "#f97316";
    default: return "#94a3b8";
  }
}
