"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@frontend/components/Common/Button";
import { User, DiaryEntry } from "@shared/types";

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
      } catch {
        // Silent catch for initial load
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

  const handleUserSelect = (user: User): void => {
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
    <div style={{ width: '100%' }}>
      <div className="table-title">
        <div>
          <h1>User Record Management</h1>
          <p style={{ color: '#64748b' }}>Browse, add, or fix daily journal entries for child users.</p>
        </div>
        {selectedUser && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button 
              onClick={() => { setEditingEntry(null); setShowEditor(true); }}
              className="hide-text-on-mobile"
            >
              <Plus size={18} style={{ marginRight: '8px' }} /> <span>Add New Record</span>
            </Button>
          </div>
        )}
      </div>

      <div className="records-grid">
        {/* User Selection Sidebar */}
        <div className="table-container" style={{ marginTop: 0, paddingBottom: '10px' }}>
          <div className="hide-on-mobile" style={{ marginBottom: '20px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Search users..."
              style={{ 
                width: '100%', 
                padding: '10px 10px 10px 36px', 
                height: '44px', 
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontFamily: 'inherit',
                fontWeight: 600
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="mobile-user-select"
            value={selectedUser?.id || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const user = users.find(u => u.id === e.target.value);
              if (user) handleUserSelect(user);
            }}
          >
            <option value="" disabled>Select a child user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>

          <div className="user-selector-list">
            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Loading users...</p>
            ) : filteredUsers.length > 0 ? filteredUsers.map(user => (
              <div 
                key={user.id}
                className={`nav-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                style={{ cursor: 'pointer', justifyContent: 'space-between', display: 'flex', alignItems: 'center', padding: '12px 15px', borderRadius: '12px' }}
                onClick={() => handleUserSelect(user)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '8px', 
                    background: selectedUser?.id === user.id ? 'white' : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: selectedUser?.id === user.id ? 'var(--primary)' : '#64748b'
                  }}>
                    <UserIcon size={16} />
                  </div>
                  <span style={{ fontWeight: 700 }}>{user.username}</span>
                </div>
                <ChevronRight size={14} style={{ opacity: selectedUser?.id === user.id ? 1 : 0.3 }} />
              </div>
            )) : (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', fontSize: '0.9rem', width: '100%' }}>No child users found</p>
            )}
          </div>
        </div>

        {/* Entries List Area */}
        <div className="table-container" style={{ marginTop: 0, minWidth: 0 }}>
          {selectedUser ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0 }}>Entry History for {selectedUser.username}</h3>
                
                <div className="filter-group" style={{ gap: '10px' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Date:</label>
                    <input 
                      type="date"
                      style={{ 
                        height: '36px', 
                        fontSize: '0.85rem', 
                        width: '130px', 
                        padding: '0 10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        background: 'white',
                        fontFamily: 'inherit'
                      }}
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>

                  {dateFilter && (
                    <Button 
                      variant="ghost"
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
                    </Button>
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
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: '150px' }}>Date</th>
                          <th style={{ width: '100px' }}>Score</th>
                          <th style={{ width: '150px' }}>Performance</th>
                          <th style={{ textAlign: 'right', width: '100px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedEntries.map(entry => (
                          <tr key={entry.id}>
                            <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={14} style={{ color: '#64748b' }} />
                                {new Date(entry.date).toLocaleDateString()}
                              </div>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <span style={{ fontWeight: 800, color: '#1e293b' }}>{entry.score}</span> pts
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <span className="badge" style={{ 
                                background: getRatingColor(entry.rating),
                                color: 'white',
                                display: 'inline-block',
                              }}>
                                {entry.rating}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <Button 
                                  variant="ghost"
                                  onClick={() => { setEditingEntry(entry); setShowEditor(true); }}
                                  style={{ padding: '8px' }}
                                  title="Edit record"
                                >
                                  <Edit3 size={16} />
                                </Button>
                                <Button 
                                  variant="ghost"
                                  onClick={() => deleteEntry(entry.date)}
                                  style={{ padding: '8px' }}
                                  title="Delete record"
                                >
                                  <Trash2 size={16} color="#ef4444" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
                      <Button 
                        variant="secondary"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '8px' }}
                      >
                        <ChevronLeft size={18} />
                      </Button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "primary" : "secondary"}
                          onClick={() => setCurrentPage(i + 1)}
                          style={{ minWidth: '40px', padding: '8px' }}
                        >
                          {i + 1}
                        </Button>
                      ))}

                      <Button 
                        variant="secondary"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '8px' }}
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94a3b8' }}>
                  <Calendar size={48} style={{ opacity: 0.1, marginBottom: '15px' }} />
                  <p>{dateFilter ? "No records found for this date." : "No records found for this user."}</p>
                  {!dateFilter && (
                    <Button 
                      variant="secondary"
                      style={{ marginTop: '20px', color: '#475569' }}
                      onClick={() => { setEditingEntry(null); setShowEditor(true); }}
                    >
                      Create the first record
                    </Button>
                  )}
                  {dateFilter && (
                    <Button 
                      variant="ghost"
                      style={{ margin: '20px auto 0', padding: '10px 20px', border: '1px solid #e2e8f0' }}
                      onClick={() => setDateFilter("")}
                    >
                      View all entries
                    </Button>
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
