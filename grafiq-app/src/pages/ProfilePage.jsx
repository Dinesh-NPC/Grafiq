import { useState } from 'react';
import { C } from '../styles/designTokens';
import { Panel } from '../components/shared';
import { Icon } from '../components/Icons';

// Profile Page with View and Edit modes
export const ProfilePage = ({ setPage }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Dinesh",
    email: "dinesh@example.com",
    role: "Lead Designer",
    company: "Creative Studios",
    location: "Mumbai, India",
    bio: "Passionate about creating beautiful designs and AI-powered solutions.",
    phone: "+91 98765 43210",
    website: "https://dinesh.design"
  });

  const [editData, setEditData] = useState(profile);

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fade-in" style={{ padding: "32px 36px", overflowY: "auto", height: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="syne" style={{ fontSize: 32, fontWeight: 800, color: C.text, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 8 }}>
            Profile
          </h1>
          <p style={{ fontSize: 15, color: C.textMuted }}>Manage your account settings and preferences</p>
        </div>
        {!isEditing && (
          <button className="btn-primary" onClick={() => setIsEditing(true)}>
            <Icon.Edit style={{ width: 16, height: 16, marginRight: 6 }} />
            Edit Profile
          </button>
        )}
        {isEditing && (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-ghost" onClick={handleCancel}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
        
        {/* Left - Avatar & Basic Info */}
        <Panel style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ 
            width: 120, height: 120, borderRadius: "50%", 
            background: `linear-gradient(135deg, ${C.accent}, ${C.ai})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 48, fontWeight: 800, color: "white",
            marginBottom: 20, fontFamily: "Syne, sans-serif"
          }}>
            {profile.name.charAt(0)}
          </div>
          <h2 className="syne" style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            {isEditing ? editData.name : profile.name}
          </h2>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16 }}>
            {isEditing ? editData.role : profile.role}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: C.accentDim, borderRadius: 20, marginBottom: 24 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.success }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>Active</span>
          </div>
          
          <div style={{ width: "100%", paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", color: C.textMuted, fontSize: 14 }}>
              <Icon.Mail /> {isEditing ? editData.email : profile.email}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", color: C.textMuted, fontSize: 14 }}>
              <Icon.MapPin /> {isEditing ? editData.location : profile.location}
            </div>
          </div>
        </Panel>

        {/* Right - Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* About Section */}
          <Panel style={{ padding: 24 }}>
            <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>About</h3>
            {isEditing ? (
              <textarea 
                value={editData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                style={{
                  width: "100%", minHeight: 100, padding: 12,
                  background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: 8, color: C.text, fontSize: 14,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  resize: "vertical"
                }}
              />
            ) : (
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{profile.bio}</p>
            )}
          </Panel>

          {/* Personal Information */}
          <Panel style={{ padding: 24 }}>
            <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 20 }}>Personal Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { label: "Full Name", field: "name", icon: <Icon.User /> },
                { label: "Email Address", field: "email", icon: <Icon.Mail /> },
                { label: "Phone Number", field: "phone", icon: <Icon.Phone /> },
                { label: "Location", field: "location", icon: <Icon.MapPin /> },
                { label: "Company", field: "company", icon: <Icon.Briefcase /> },
                { label: "Website", field: "website", icon: <Icon.Globe /> },
              ].map((item, i) => (
                <div key={i}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {item.label}
                  </label>
                  {isEditing ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                      <span style={{ color: C.textMuted }}>{item.icon}</span>
                      <input 
                        type="text"
                        value={editData[item.field]}
                        onChange={(e) => handleChange(item.field, e.target.value)}
                        style={{
                          flex: 1, background: "transparent", border: "none",
                          color: C.text, fontSize: 14,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          outline: "none"
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.bg, borderRadius: 8, color: C.text, fontSize: 14 }}>
                      <span style={{ color: C.textMuted }}>{item.icon}</span>
                      {profile[item.field]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          {/* Account Stats */}
          <Panel style={{ padding: 24 }}>
            <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 20 }}>Account Statistics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { label: "Templates Created", value: "342", color: C.accent },
                { label: "Total Views", value: "12.4K", color: C.ai },
                { label: "Collaborators", value: "8", color: C.success },
                { label: "Projects", value: "156", color: C.warning },
              ].map((stat, i) => (
                <div key={i} style={{ padding: 16, background: C.bg, borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, fontFamily: "Syne, sans-serif" }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </Panel>

        </div>
      </div>
    </div>
  );
};
