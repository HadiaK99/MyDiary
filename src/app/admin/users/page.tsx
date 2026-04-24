"use client";

import { useState, useEffect } from "react";
import { User } from "@shared/types";
import { Trash2, UserPlus, Search } from "lucide-react";
import UserEditor from "@frontend/components/Admin/UserEditor";
import { Button } from "@frontend/components/Common/Button";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (active && data.users) setUsers(data.users);
    };
    fetchUsers();
    return () => { active = false; };
  }, [refreshTrigger]);

  const deleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setRefreshTrigger(v => v + 1); // Refresh list
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
            setRefreshTrigger(v => v + 1);
          }}
        />
      )}

      <div className="table-title">
        <div>
          <h1>User Management</h1>
          <p style={{ color: '#64748b' }}>Add, edit, or remove users from the system.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search users..." 
              style={{ 
                padding: '10px 15px 10px 40px', 
                width: '250px', 
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'inherit',
                fontWeight: 600
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setShowUserModal(true)}
            style={{ padding: '0 20px', height: '40px' }}
            className="hide-text-on-mobile"
          >
            <UserPlus size={18} style={{ marginRight: '8px' }} /> <span className="hide-text-on-mobile">Add User</span>
          </Button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Linked Child</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 700 }}>{user.username}</td>
                  <td>
                    <span className={`badge ${
                      user.role === 'ADMIN' ? 'badge-admin' : 
                      user.role === 'PARENT' ? 'badge-parent' : 'badge-child'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.role === 'PARENT' ? (
                      users.find(u => u.id === user.childId)?.username || 'Not Linked'
                    ) : '-'}
                  </td>
                  <td>
                    <Button variant="ghost" onClick={() => deleteUser(user.id)} style={{ padding: '8px' }}>
                      <Trash2 size={16} color="#ef4444" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
