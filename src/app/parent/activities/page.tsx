"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import { useChild } from "@frontend/context/ChildContext";
import { 
  Plus, 
  Settings2, 
  Eye, 
  EyeOff, 
  PlusCircle, 
  Trophy,
  Save,
  Loader2,
  Edit3,
  Layers,
  User,
  CheckCircle2,
  Lock,
  X
} from "lucide-react";
import { Button } from "@frontend/components/Common/Button";
import styled from "styled-components";

const ActivityCard = styled.div<{ $isEditing?: boolean }>`
  background: white;
  border-radius: 24px;
  padding: 30px;
  margin-bottom: 25px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
  border: 2px solid ${props => props.$isEditing ? "var(--primary-light)" : "transparent"};
  transition: all 0.3s ease;

  @media (max-width: 600px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f8fafc;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .title-area {
    display: flex;
    align-items: center;
    gap: 12px;
    h3 { margin: 0; color: #1e293b; font-weight: 800; }
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 15px;
    @media (max-width: 480px) {
      flex-wrap: wrap;
      gap: 10px;
    }
  }
`;

const ActivityItem = styled.div<{ $disabled?: boolean, $isEditing?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: ${props => props.$disabled ? "#f8fafc" : "white"};
  border: 1px solid ${props => props.$disabled ? "#e2e8f0" : "#f1f5f9"};
  border-radius: 16px;
  margin-bottom: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary-light);
    background: #fffafa;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
  }

  .name-part {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${props => props.$disabled ? "#94a3b8" : "#1e293b"};
    font-weight: 600;
    @media (max-width: 600px) {
      width: 100%;
    }
  }

  .item-controls {
    display: flex;
    align-items: center;
    gap: 15px;
    @media (max-width: 600px) {
      width: 100%;
      justify-content: space-between;
    }
  }
`;

const ScoringToggle = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  margin-right: 15px;

  button {
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .active {
    background: white;
    color: #be123c;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .inactive {
    background: transparent;
    color: #64748b;
  }
`;

const Badge = styled.span<{ $variant?: "success" | "warning" | "info" }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${props => {
    if (props.$variant === "success") return "#dcfce7";
    if (props.$variant === "info") return "#e0f2fe";
    return "#fee2e2";
  }};
  color: ${props => {
    if (props.$variant === "success") return "#166534";
    if (props.$variant === "info") return "#0369a1";
    return "#991b1b";
  }};
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  width: 70px;
  text-align: center;
  font-weight: 700;
  color: #be123c;
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  &:disabled {
    background: #f8fafc;
    border-color: #f1f5f9;
    color: #94a3b8;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  padding: 30px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
  position: relative;
`;

const FormField = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 700;
    color: #1e293b;
    font-size: 0.9rem;
  }
  input {
    width: 100%;
    padding: 12px;
    border: 2px solid #f1f5f9;
    border-radius: 12px;
    font-size: 1rem;
    &:focus {
      outline: none;
      border-color: #be123c;
    }
  }
`;

export default function ActivitiesManagement() {
  const { selectedChild } = useChild();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Local state for pending changes
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  // Modal states
  const [showCatModal, setShowCatModal] = useState(false);
  const [showActModal, setShowActModal] = useState<{ catId: string, catName: string } | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatPoints, setNewCatPoints] = useState(5);
  const [newActName, setNewActName] = useState("");

  const fetchActivities = async () => {
    if (!selectedChild) return;
    try {
      const res = await fetch(`/api/activities?userId=${selectedChild.id}`);
      const data = await res.json();
      setCategories(data.categories || []);
      setPendingChanges(data.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedChild]);

  const handleToggleCategoryVisibility = (catId: string) => {
    setPendingChanges(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, enabled: !cat.enabled } : cat
    ));
  };

  const handleToggleActivityVisibility = (catId: string, actId: string) => {
    setPendingChanges(prev => prev.map(cat => 
      cat.id === catId ? {
        ...cat,
        activities: cat.activities.map((act: any) => 
          act.id === actId ? { ...act, enabled: !act.enabled } : act
        )
      } : cat
    ));
  };

  const handleUpdateCategoryPoints = (catId: string, points: number) => {
    setPendingChanges(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, pointsPerItem: points } : cat
    ));
  };

  const handleUpdateActivityPoints = (catId: string, actId: string, points: number) => {
    setPendingChanges(prev => prev.map(cat => 
      cat.id === catId ? {
        ...cat,
        activities: cat.activities.map((act: any) => 
          act.id === actId ? { ...act, effectivePoints: points } : act
        )
      } : cat
    ));
  };

  const handleToggleScoringMode = (catId: string) => {
    setPendingChanges(prev => prev.map(cat => 
      cat.id === catId ? { 
        ...cat, 
        scoringMode: cat.scoringMode === "GROUP" ? "INDIVIDUAL" : "GROUP" 
      } : cat
    ));
  };

  const handleCreateCategory = async () => {
    if (!selectedChild || !newCatName) return;
    setSaving(true);
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "category",
          userId: selectedChild.id,
          name: newCatName,
          pointsPerItem: newCatPoints
        })
      });
      if (res.ok) {
        setShowCatModal(false);
        setNewCatName("");
        await fetchActivities();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCreateActivity = async () => {
    if (!selectedChild || !showActModal || !newActName) return;
    setSaving(true);
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "activity",
          userId: selectedChild.id,
          categoryId: showActModal.catId,
          name: newActName
        })
      });
      if (res.ok) {
        setShowActModal(null);
        setNewActName("");
        await fetchActivities();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedChild) return;
    setSaving(true);
    try {
      for (const cat of pendingChanges) {
        await fetch("/api/activities", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "category",
            userId: selectedChild.id,
            id: cat.id,
            enabled: cat.enabled,
            pointsPerItem: cat.pointsPerItem,
            scoringMode: cat.scoringMode
          })
        });

        for (const act of cat.activities) {
          await fetch("/api/activities", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "activity",
              userId: selectedChild.id,
              id: act.id,
              enabled: act.enabled,
              points: act.effectivePoints
            })
          });
        }
      }
      setIsEditing(false);
      await fetchActivities();
    } finally {
      setSaving(false);
    }
  };

  if (!selectedChild) return (
    <div className="welcome-card">
      <div className="welcome-text">
        <h1>Manage Activities</h1>
        <p>Please select a child to manage their activity list.</p>
      </div>
    </div>
  );

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}><Loader2 className="animate-spin" size={40} color="#be123c" /></div>;

  return (
    <div>
      <section className="welcome-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="welcome-text">
          <h1>Activity <span style={{ color: '#be123c' }}>Settings</span></h1>
          <p>Customize points and visibility for {selectedChild.username}.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={() => { setIsEditing(false); setPendingChanges(categories); }}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span style={{ marginLeft: '8px' }}>Save Changes</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 size={18} style={{ marginRight: '8px' }} /> Edit Configuration
            </Button>
          )}
        </div>
      </section>

      {pendingChanges.map((cat) => (
        <ActivityCard key={cat.id} $isEditing={isEditing}>
          <CategoryHeader>
            <div className="title-area">
              <Layers size={24} color="#be123c" />
              <div>
                <h3>{cat.name}</h3>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  {!cat.enabled && <Badge>Hidden from Child</Badge>}
                  {cat.userId && <Badge $variant="success">Custom Category</Badge>}
                </div>
              </div>
            </div>
            
            <div className="controls">
              <ScoringToggle>
                <button 
                  className={cat.scoringMode === "GROUP" ? "active" : "inactive"}
                  disabled={!isEditing}
                  onClick={() => handleToggleScoringMode(cat.id)}
                >
                  Group
                </button>
                <button 
                  className={cat.scoringMode === "INDIVIDUAL" ? "active" : "inactive"}
                  disabled={!isEditing}
                  onClick={() => handleToggleScoringMode(cat.id)}
                >
                  Individual
                </button>
              </ScoringToggle>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={18} color="#eab308" />
                <Input 
                  type="number" 
                  value={cat.pointsPerItem}
                  disabled={!isEditing}
                  onChange={(e) => handleUpdateCategoryPoints(cat.id, parseInt(e.target.value))}
                />
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>pts</span>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => handleToggleCategoryVisibility(cat.id)}
                disabled={!isEditing}
                style={{ padding: '8px', color: cat.enabled ? '#0ea5e9' : '#94a3b8' }}
              >
                {cat.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
              </Button>
            </div>
          </CategoryHeader>

          {cat.activities.map((act: any) => (
            <ActivityItem key={act.id} $disabled={!act.enabled} $isEditing={isEditing}>
              <div className="name-part">
                {act.enabled ? <CheckCircle2 size={18} color="#10b981" /> : <Lock size={18} color="#94a3b8" />}
                <span>{act.name}</span>
                {act.userId && <Badge $variant="info">Custom</Badge>}
                {!act.enabled && <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>(Hidden)</span>}
              </div>
              
              <div className="item-controls">
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Input 
                    type="number" 
                    value={act.effectivePoints}
                    disabled={!isEditing || cat.scoringMode === "GROUP"}
                    onChange={(e) => handleUpdateActivityPoints(cat.id, act.id, parseInt(e.target.value))}
                    style={{ width: '60px', padding: '6px' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>pts</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => handleToggleActivityVisibility(cat.id, act.id)}
                  disabled={!isEditing}
                  style={{ padding: '6px', color: act.enabled ? '#0ea5e9' : '#f43f5e' }}
                >
                  {act.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                </Button>
              </div>
            </ActivityItem>
          ))}

          {isEditing && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '15px', border: '1px dashed #e2e8f0', textAlign: 'center' }}>
              <Button 
                variant="ghost" 
                style={{ color: '#be123c', fontSize: '0.85rem' }}
                onClick={() => setShowActModal({ catId: cat.id, catName: cat.name })}
              >
                <Plus size={16} style={{ marginRight: '5px' }} /> Add Activity to {cat.name}
              </Button>
            </div>
          )}
        </ActivityCard>
      ))}

      {!isEditing && (
        <ActivityCard style={{ border: '2px dashed #e2e8f0', background: 'transparent', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>✨</div>
          <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>Need more categories?</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>You can create custom categories specifically for {selectedChild.username}.</p>
          <Button variant="secondary" onClick={() => setShowCatModal(true)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Create New Category
          </Button>
        </ActivityCard>
      )}

      {/* Modals */}
      {showCatModal && (
        <ModalOverlay onClick={() => setShowCatModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, fontWeight: 800 }}>New Category</h2>
              <X size={24} style={{ cursor: 'pointer' }} onClick={() => setShowCatModal(false)} />
            </div>
            <FormField>
              <label>Category Name</label>
              <input 
                type="text" 
                placeholder="e.g. Science Project" 
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
              />
            </FormField>
            <FormField>
              <label>Default Points per Activity</label>
              <input 
                type="number" 
                value={newCatPoints}
                onChange={e => setNewCatPoints(parseInt(e.target.value))}
              />
            </FormField>
            <Button fullWidth onClick={handleCreateCategory} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : "Create Category"}
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}

      {showActModal && (
        <ModalOverlay onClick={() => setShowActModal(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, fontWeight: 800 }}>Add Activity</h2>
              <X size={24} style={{ cursor: 'pointer' }} onClick={() => setShowActModal(null)} />
            </div>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Adding to <b>{showActModal.catName}</b></p>
            <FormField>
              <label>Activity Name</label>
              <input 
                type="text" 
                placeholder="e.g. Read for 30 mins" 
                value={newActName}
                onChange={e => setNewActName(e.target.value)}
              />
            </FormField>
            <Button fullWidth onClick={handleCreateActivity} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : "Add Activity"}
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
}
