import React, { useState, useEffect, useRef } from 'react';
import Service from '../../utils/http';
import './ProfilePage.css';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Tiny toast helper                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 3000);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div className={`profile-toast ${type}`}>
      {type === 'success' ? '✓ ' : '✗ '}
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main Component                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
const ProfilePage = () => {
  const service = new Service();

  /* ── State ── */
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ name: '', email: '' });
  const [toast, setToast]     = useState(null);   // { message, type }
  const fileInputRef          = useRef(null);

  /* ── Fetch user on mount ── */
  const fetchUser = async () => {
    try {
      const res = await service.get('user/me');
      setUser(res);
      setForm({ name: res.name || '', email: res.email || '' });
    } catch (err) {
      console.error(err);
      showToast('Failed to load user data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  /* ── Helpers ── */
  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await service.put('user/me', form);
      setUser((prev) => ({ ...prev, ...form }));
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you absolutely sure? This will permanently delete your account and all data. This action CANNOT be undone.'
    );
    if (!confirmed) return;
    try {
      await service.delete('user/me');
      showToast('Account deleted. Redirecting…', 'success');
      setTimeout(() => (window.location.href = '/'), 2000);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete account.', 'error');
    }
  };

  /* ── Avatar placeholder ── */
  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'User')}&background=005ab4&color=fff&bold=true&size=128`;

  /* ── Loading / Error states ── */
  if (loading) {
    return (
      <div className="profile-root profile-skeleton">
        <div>
          <div className="spinner" />
          Loading your profile…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-root profile-skeleton">
        <div>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          User not found.
        </div>
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div className="profile-root">
      {/* ── Top Nav ── */}
      <nav className="profile-topnav">
        <div className="profile-topnav-inner">
          <span className="profile-topnav-logo">Lynx</span>
          <div className="profile-topnav-links">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/profile" className="active">Profile</a>
          </div>
          <button
            className="profile-topnav-logout"
            onClick={() => {
              /* TODO: wire logout action */
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="profile-layout">
        {/* ── Sidebar ── */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar-user">
            <div className="profile-sidebar-avatar-ring">
              <img src={avatarSrc} alt={form.name} />
            </div>
            <div>
              <div className="profile-sidebar-name">{form.name || 'User'}</div>
              <div className="profile-sidebar-plan">
                {user.plan ? `${user.plan} Plan` : 'Pro Plan'}
              </div>
            </div>
          </div>

          <nav className="profile-sidebar-nav">
            <a href="/links">
              <span className="material-symbols-outlined">link</span>
              Links
            </a>
            <a href="/analytics">
              <span className="material-symbols-outlined">leaderboard</span>
              Analytics
            </a>
            <a href="/profile" className="active-nav">
              <span className="material-symbols-outlined">settings</span>
              Settings
            </a>
            <a href="/help">
              <span className="material-symbols-outlined">help</span>
              Help
            </a>
          </nav>
        </aside>

        {/* ── Main ── */}
        <main className="profile-main">
          {/* Ambient glows */}
          <div className="ambient-glow-1" />
          <div className="ambient-glow-2" />

          <div className="profile-content">
            {/* Header */}
            <header className="profile-header">
              <h1>Profile Settings</h1>
              <p>Manage your account preferences and security settings.</p>
            </header>

            {/* ── Central Glass Card ── */}
            <section className="glass-panel">
              {/* Avatar */}
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar-ring">
                    <img src={avatarSrc} alt={form.name} />
                  </div>
                  {/* Hidden file input for avatar upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      /* TODO: upload avatar via service.put / form-data */
                      const file = e.target.files?.[0];
                      if (file) showToast('Avatar upload coming soon!', 'success');
                    }}
                  />
                  <button
                    className="profile-avatar-edit-btn"
                    title="Change avatar"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>

                <h2 className="profile-display-name">{form.name || 'User'}</h2>
                <span className="profile-plan-badge">
                  {user.plan ? `${user.plan} Member` : 'PRO MEMBER'}
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSave}>
                <div className="profile-form-grid">
                  {/* Full Name */}
                  <div className="profile-form-field">
                    <label className="profile-form-label" htmlFor="profile-name">
                      Full Name
                    </label>
                    <input
                      id="profile-name"
                      className="profile-form-input"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="profile-form-field">
                    <label className="profile-form-label" htmlFor="profile-email">
                      Email Address
                    </label>
                    <input
                      id="profile-email"
                      className="profile-form-input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  {/* Plan */}
                  <div className="profile-form-field full-width">
                    <label className="profile-form-label">Plan Type</label>
                    <div className="profile-plan-row">
                      <div className="profile-plan-info">
                        <span className="material-symbols-outlined">workspace_premium</span>
                        <span className="profile-plan-name">
                          {user.plan || 'Pro Individual'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="profile-upgrade-btn"
                        onClick={() => showToast('Upgrade flow coming soon!', 'success')}
                      >
                        UPGRADE
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save */}
                <div className="profile-save-row">
                  <button
                    id="profile-save-btn"
                    type="submit"
                    className={`profile-save-btn${saving ? ' loading' : ''}`}
                  >
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </section>

            {/* ── Security ── */}
            <section className="glass-panel">
              <h3 className="section-title">
                <span className="material-symbols-outlined">lock</span>
                Security
              </h3>

              <div className="security-item">
                <div>
                  <div className="security-item-title">Change Password</div>
                  <div className="security-item-desc">
                    Update your account credentials regularly.
                  </div>
                </div>
                <button
                  id="change-password-btn"
                  className="security-btn-outline"
                  type="button"
                  onClick={() => showToast('Password reset email sent!', 'success')}
                >
                  Update
                </button>
              </div>

              <div className="security-item">
                <div>
                  <div className="security-item-title">Two-Factor Authentication</div>
                  <div className="security-item-desc">
                    Add an extra layer of security to your account.
                  </div>
                </div>
                <button
                  id="enable-2fa-btn"
                  className="security-btn-enable"
                  type="button"
                  onClick={() => showToast('2FA setup coming soon!', 'success')}
                >
                  Enable
                </button>
              </div>
            </section>

            {/* ── Danger Zone ── */}
            <section className="danger-zone">
              <h3>Danger Zone</h3>
              <p>
                Permanently delete your account and all associated data. This action
                cannot be undone.
              </p>
              <button
                id="delete-account-btn"
                className="danger-delete-btn"
                type="button"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </section>
          </div>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="profile-footer">
        <div className="profile-footer-logo">Lynx</div>
        <div className="profile-footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/docs">API Docs</a>
        </div>
        <p className="profile-footer-copy">
          © {new Date().getFullYear()} Lynx Technologies. All rights reserved.
        </p>
      </footer>

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
