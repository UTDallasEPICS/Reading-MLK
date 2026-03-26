<script setup lang="ts">
definePageMeta({ ssr: false })

const {
  announcementSubTab,
  newAnnouncement,
  announcementFilterWeek,
  filteredAnnouncements,
  isAnnouncementActive,
  addAnnouncement,
  deleteAnnouncement,
} = useAdmin()
</script>

<template>
  <div class="ann-wrap">

    <!-- Header + tab switcher -->
    <div class="ann-header">
      <div>
        <h2 class="ann-title">Announcements</h2>
        <p class="ann-sub">Direct communication with your students</p>
      </div>

      <div class="tab-switcher">
        <button
          class="tab-btn"
          :class="announcementSubTab === 'creation' ? 'active' : ''"
          @click="announcementSubTab = 'creation'"
        >Post Announcement</button>
        <button
          class="tab-btn"
          :class="announcementSubTab === 'history' ? 'active' : ''"
          @click="announcementSubTab = 'history'"
        >Announcement History</button>
      </div>
    </div>

    <!-- ══════════════════════════════ -->
    <!--  POST VIEW                    -->
    <!-- ══════════════════════════════ -->
    <div v-if="announcementSubTab === 'creation'" class="post-grid">

      <!-- Form card -->
      <div class="form-card">

        <!-- Title + icon -->
        <div>
          <label class="field-label">Announcement Title</label>
          <div class="title-row">
            <input v-model="newAnnouncement.title" type="text" placeholder="e.g., Book Fair Next Week!" class="input-field flex-grow" />
            <select v-model="newAnnouncement.icon" class="icon-select">
              <option value="⚠️">⚠️ Alert</option>
              <option value="🌟">🌟 Star</option>
              <option value="🎉">🎉 Party</option>
              <option value="🔔">🔔 Bell</option>
              <option value="📅">📅 Date</option>
              <option value="🍎">🍎 Apple</option>
              <option value="📖">📖 Book</option>
              <option value="🏆">🏆 Trophy</option>
            </select>
          </div>
        </div>

        <!-- Dates -->
        <div class="dates-grid">
          <div>
            <label class="field-label italic">Publish From</label>
            <input v-model="newAnnouncement.startDate" type="date" class="input-field" />
          </div>
          <div>
            <label class="field-label">Till Date (Optional)</label>
            <div class="relative">
              <input v-model="newAnnouncement.endDate" type="date" class="input-field" />
              <button v-if="newAnnouncement.endDate" class="clear-btn" @click="newAnnouncement.endDate = ''">✕</button>
            </div>
          </div>
        </div>

        <!-- Week + Day -->
        <div class="dates-grid">
          <div>
            <label class="field-label">Week Starting</label>
            <input v-model="newAnnouncement.weekStart" type="date" class="input-field" />
          </div>
          <div>
            <label class="field-label">Day</label>
            <select v-model="newAnnouncement.day" class="input-field">
              <option v-for="d in ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']" :key="d">{{ d }}</option>
            </select>
          </div>
        </div>

        <!-- Content -->
        <div>
          <label class="field-label">Message Content</label>
          <textarea v-model="newAnnouncement.content" rows="4"
            placeholder="What would you like to share with your students?"
            class="textarea-field" />
        </div>

        <button class="btn-post" @click="addAnnouncement">Post Announcement</button>
      </div>

      <!-- Live preview -->
      <div class="preview-panel">
        <h4 class="preview-label">Live Student Preview</h4>
        <div class="preview-card">
          <div class="preview-icon">{{ newAnnouncement.icon }}</div>
          <div class="preview-body">
            <div class="preview-title">{{ newAnnouncement.title || 'Your Title Here' }}</div>
            <span class="preview-dates">
              {{ newAnnouncement.startDate || 'Start Date' }}
              {{ newAnnouncement.endDate ? ' to ' + newAnnouncement.endDate : '(Ongoing)' }}
            </span>
            <p class="preview-content">{{ newAnnouncement.content || 'Your message will appear here...' }}</p>
          </div>
        </div>
      </div>

    </div>

    <!-- ══════════════════════════════ -->
    <!--  HISTORY VIEW                 -->
    <!-- ══════════════════════════════ -->
    <div v-if="announcementSubTab === 'history'" class="history-wrap">

      <!-- Filter -->
      <div class="filter-bar">
        <div>
          <label class="field-label">View Week Starting</label>
          <input v-model="announcementFilterWeek" type="date" class="input-field w-auto" />
        </div>
      </div>

      <!-- List -->
      <div class="ann-list">
        <div
          v-for="ann in filteredAnnouncements"
          :key="ann.id"
          class="ann-item"
          :class="isAnnouncementActive(ann) ? 'ann-active' : 'ann-expired'"
        >
          <div class="ann-icon" :class="isAnnouncementActive(ann) ? 'icon-active' : 'icon-expired'">
            {{ ann.icon }}
          </div>

          <div class="ann-content">
            <div class="ann-top-row">
              <h4 class="ann-item-title" :class="isAnnouncementActive(ann) ? '' : 'expired-text'">
                {{ ann.title }}
              </h4>
              <div class="ann-meta-pills">
                <span v-if="isAnnouncementActive(ann)" class="pill green">Active</span>
                <span v-else class="pill gray">Expired</span>
                <span class="pill neutral">{{ ann.day }}</span>
                <span class="pill neutral">
                  {{ ann.startDate }} {{ ann.endDate ? 'to ' + ann.endDate : '(Ongoing)' }}
                </span>
                <button class="delete-btn" @click="deleteAnnouncement(ann.id)">✕</button>
              </div>
            </div>
            <p class="ann-item-body" :class="isAnnouncementActive(ann) ? '' : 'expired-text'">
              {{ ann.content }}
            </p>
          </div>
        </div>

        <div v-if="filteredAnnouncements.length === 0" class="empty-state">
          <span class="text-5xl block mb-4">🏜️</span>
          <p>No announcements found for this filter.</p>
          <button class="clear-filter" @click="announcementFilterWeek = ''">Clear all filters</button>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
/* ── Wrap ── */
.ann-wrap { max-width: 72rem; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }

/* ── Header ── */
.ann-header {
  display: flex; flex-direction: column; gap: 1rem;
  justify-content: space-between; align-items: flex-start;
}
@media (min-width: 768px) { .ann-header { flex-direction: row; align-items: center; } }
.ann-title { font-size: 1.875rem; font-weight: 500; color: #111827; }
.ann-sub   { color: #6b7280; font-weight: 500; margin-top: 0.25rem; }

/* ── Tab switcher ── */
.tab-switcher {
  display: flex; background: #eef2ff; padding: 0.375rem;
  border-radius: 0.75rem; border: 1px solid #e0e7ff;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
}
.tab-btn {
  padding: 0.625rem 1.5rem; border-radius: 0.625rem;
  font-weight: 500; border: none; cursor: pointer;
  transition: all 0.3s; background: transparent; color: #818cf8;
}
.tab-btn:hover { color: #4f46e5; }
.tab-btn.active { background: white; color: #3730a3; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

/* ── Post grid ── */
.post-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 1280px) { .post-grid { grid-template-columns: 1fr 1fr; } }

/* ── Form card ── */
.form-card {
  background: white; padding: 1.25rem; border-radius: 0.75rem;
  border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  display: flex; flex-direction: column; gap: 1.25rem;
}

/* ── Fields ── */
.field-label { display: block; font-size: 0.75rem; font-weight: 500; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
.field-label.italic { font-style: italic; }
.title-row { display: flex; gap: 0.5rem; }
.input-field {
  width: 100%; font-size: 1rem; font-weight: 500; color: #1f2937;
  border: 2px solid #f8fafc; border-radius: 0.75rem;
  padding: 0.75rem 1.25rem; outline: none; transition: border-color 0.15s;
  background: #f8fafc;
}
.input-field:focus { border-color: #6366f1; background: white; }
.flex-grow { flex: 1 1 0%; }
.icon-select {
  width: 7rem; font-size: 0.875rem; font-weight: 500;
  border: 2px solid #f8fafc; border-radius: 0.75rem; padding: 0.75rem 0.5rem;
  outline: none; transition: border-color 0.15s; background: #f8fafc; color: #374151; cursor: pointer;
}
.icon-select:focus { border-color: #6366f1; background: white; }
.dates-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.relative { position: relative; }
.clear-btn { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: #d1d5db; cursor: pointer; font-size: 1rem; }
.clear-btn:hover { color: #f87171; }
.textarea-field {
  width: 100%; font-size: 1rem; font-weight: 500; color: #1f2937;
  border: 2px solid #f8fafc; border-radius: 0.75rem;
  padding: 1rem 1.25rem; outline: none; transition: border-color 0.15s;
  resize: none; background: #f8fafc;
}
.textarea-field:focus { border-color: #6366f1; background: white; }
.btn-post {
  width: 100%; padding: 1rem; background: #4f46e5; color: white;
  border: none; border-radius: 0.75rem; font-weight: 500; font-size: 1.25rem;
  cursor: pointer; transition: background 0.15s;
  box-shadow: 0 10px 25px rgba(99,102,241,0.25);
}
.btn-post:hover { background: #4338ca; }

/* ── Preview ── */
.preview-panel {
  background: rgba(238,242,255,0.3); padding: 2rem; border-radius: 0.75rem;
  border: 2px dashed #e0e7ff; display: flex; flex-direction: column; justify-content: center;
}
.preview-label { font-size: 0.75rem; font-weight: 500; color: #818cf8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem; text-align: center; }
.preview-card {
  background: white; padding: 1.5rem; border-radius: 2.5rem;
  border: 1px solid #f3f4f6; box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  display: flex; gap: 1.5rem; align-items: flex-start;
}
.preview-icon {
  padding: 1rem; background: #eef2ff; border-radius: 1rem;
  font-size: 2.5rem; flex-shrink: 0; border: 1px solid #e0e7ff;
  display: flex; align-items: center; justify-content: center;
  min-width: 5rem; min-height: 5rem;
}
.preview-body { flex: 1; margin-top: 0.25rem; }
.preview-title { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem; }
.preview-dates { display: inline-block; padding: 0.25rem 0.75rem; background: #f3f4f6; color: #374151; border-radius: 9999px; font-size: 0.625rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
.preview-content { color: #6b7280; font-weight: 500; line-height: 1.6; }

/* ── History ── */
.history-wrap { display: flex; flex-direction: column; gap: 1rem; }
.filter-bar { background: rgba(238,242,255,0.5); padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e0e7ff; display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; }
.w-auto { width: auto; }
.ann-list { display: flex; flex-direction: column; gap: 0.75rem; }

.ann-item {
  padding: 1.25rem; border-radius: 0.75rem; border: 2px solid;
  display: flex; gap: 1.25rem; align-items: flex-start;
  transition: all 0.2s; position: relative; overflow: hidden;
}
.ann-active  { background: white;   border-color: #a5b4fc; box-shadow: 0 2px 8px rgba(165,180,252,0.2); }
.ann-active:hover  { border-color: #6366f1; }
.ann-expired { background: #f9fafb; border-color: #f3f4f6; opacity: 0.7; }
.ann-expired:hover { opacity: 1; }

.ann-icon {
  padding: 1rem; border-radius: 0.75rem; font-size: 1.875rem; flex-shrink: 0;
  border: 1px solid; display: flex; align-items: center; justify-content: center;
  min-width: 5rem; min-height: 5rem; transition: transform 0.2s;
}
.ann-item:hover .ann-icon { transform: scale(1.1); }
.icon-active  { background: #eef2ff; border-color: #e0e7ff; }
.icon-expired { background: #f3f4f6; border-color: #e5e7eb; }

.ann-content   { flex: 1; margin-top: 0.25rem; }
.ann-top-row   { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
.ann-item-title { font-size: 1.25rem; font-weight: 700; color: #1f2937; }
.ann-item-body  { font-weight: 500; line-height: 1.6; color: #4b5563; }
.expired-text   { color: #9ca3af; }
.ann-meta-pills { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; flex-shrink: 0; margin-left: 1rem; }

.pill { padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.5625rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.pill.green   { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
.pill.gray    { background: #e5e7eb; color: #6b7280; border: 1px solid #d1d5db; }
.pill.neutral { background: #f3f4f6; color: #4b5563; }

.delete-btn { background: none; border: none; color: #fca5a5; cursor: pointer; font-size: 1rem; transition: color 0.15s; margin-left: 0.5rem; }
.delete-btn:hover { color: #ef4444; }

.empty-state { text-align: center; padding: 5rem 1rem; background: white; border-radius: 0.75rem; border: 4px dashed #f3f4f6; color: #9ca3af; font-weight: 500; }
.clear-filter { margin-top: 1rem; background: none; border: none; color: #6366f1; font-weight: 500; font-size: 0.75rem; text-transform: uppercase; cursor: pointer; text-decoration: underline; }
</style>
