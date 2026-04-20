"use client";

import { useState, useEffect } from "react";
import { User } from "@frontend/context/AuthContext";
import styles from "../admin.module.css";
import { Trash2, UserPlus, Search } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className={styles.tableTitle}>
        <div>
          <h1>User Management</h1>
          <p>Add, edit, or remove users from the system.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className={styles.actionBtn} 
              style={{ paddingLeft: '40px', width: '250px', background: '#f1f5f9' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.logoutBtn} style={{ background: 'var(--primary)', color: 'white' }}>
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>System ID</th>
              <th>Linked Child</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td style={{ fontWeight: 700 }}>{user.username}</td>
                <td>
                  <span className={`${styles.badge} ${
                    user.role === 'ADMIN' ? styles.badgeAdmin : 
                    user.role === 'PARENT' ? styles.badgeParent : styles.badgeChild
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{user.id}</td>
                <td>
                  {user.role === 'PARENT' ? (
                    users.find(u => u.id === user.childId)?.username || 'Not Linked'
                  ) : '-'}
                </td>
                <td>
                  <button className={styles.actionBtn} onClick={() => deleteUser(user.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
