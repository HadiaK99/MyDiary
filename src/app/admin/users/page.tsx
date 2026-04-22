"use client";

import { useState, useEffect } from "react";
import { User } from "@frontend/context/AuthContext";
import styles from "../admin.module.css";
import { Trash2, UserPlus, Search } from "lucide-react";
import UserEditor from "@frontend/components/Admin/UserEditor";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.users) setUsers(data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchUsers(); // Refresh list
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {showUserModal && (
        <UserEditor 
          onClose={() => setShowUserModal(false)}
          onSave={() => {
            setShowUserModal(false);
            fetchUsers();
          }}
        />
      )}

      <div className={styles.tableTitle}>
        <div>
          <h1>User Management</h1>
          <p>Add, edit, or remove users from the system.</p>
        </div>
        <div className={styles.tableActions}>
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
          <button 
            className={styles.submitBtn} 
            onClick={() => setShowUserModal(true)}
            style={{ padding: '0 20px', height: '40px' }}
          >
            <UserPlus size={18} /> <span className={styles.btnText}>Add User</span>
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th className={styles.hideOnMobile}>System ID</th>
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
                <td className={`${styles.hideOnMobile}`} style={{ fontFamily: 'monospace', color: '#64748b' }}>{user.id}</td>
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
