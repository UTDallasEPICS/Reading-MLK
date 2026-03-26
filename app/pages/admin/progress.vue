<script setup lang="ts">
definePageMeta({ ssr: false })

const { searchStudent, sortStudent, filteredAndSortedStudents } = useAdmin()
</script>

<template>
  <div class="progress-wrap">

    <div class="progress-header">
      <h2 class="progress-title">Class Progress</h2>

      <div class="progress-controls">
        <!-- Search -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchStudent"
            type="text"
            placeholder="Search student..."
            class="search-input"
          />
        </div>

        <!-- Sort -->
        <select v-model="sortStudent" class="sort-select">
          <option value="tickets">Sort by Tickets</option>
          <option value="streak">Sort by Streak</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table class="progress-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Tickets</th>
            <th>Weekly Streak</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredAndSortedStudents" :key="student.id">
            <td>
              <div class="student-cell">
                <div class="student-avatar">{{ student.initials }}</div>
                <span>{{ student.name }}</span>
              </div>
            </td>
            <td>
              <span class="badge gray">{{ student.tickets }}</span>
            </td>
            <td>
              <span class="badge gray">🔥 {{ student.streak }}</span>
            </td>
            <td class="last-active">{{ student.lastActive }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.progress-wrap  { max-width: 64rem; margin: 0 auto; }

.progress-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}
@media (min-width: 768px) {
  .progress-header { flex-direction: row; justify-content: space-between; align-items: flex-end; }
}

.progress-title { font-size: 2.25rem; font-weight: 500; color: #111827; }

.progress-controls { display: flex; gap: 1rem; }

.search-box   { position: relative; }
.search-icon  { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.875rem; pointer-events: none; }
.search-input {
  padding: 0.5rem 1rem 0.5rem 2.25rem;
  border: 2px solid #f1f5f9;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: border-color 0.15s;
  width: 16rem;
}
.search-input:focus { border-color: #a5b4fc; }

.sort-select {
  padding: 0.5rem 1rem;
  border: 2px solid #f1f5f9;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  background: white;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
}
.sort-select:focus { border-color: #a5b4fc; }

/* ── Table ── */
.table-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(148,163,184,0.15);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.progress-table { width: 100%; border-collapse: collapse; text-align: left; }

.progress-table thead { background: #f9fafb; border-bottom: 1px solid #e5e7eb; }

.progress-table th {
  padding: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-table tbody tr { border-bottom: 1px solid #f3f4f6; transition: background 0.15s; }
.progress-table tbody tr:last-child { border-bottom: none; }
.progress-table tbody tr:hover { background: rgba(238,242,255,0.5); }

.progress-table td { padding: 1rem; }

.student-cell { display: flex; align-items: center; gap: 0.75rem; font-weight: 500; color: #1f2937; }

.student-avatar {
  width: 2rem; height: 2rem;
  border-radius: 9999px;
  background: #e0e7ff;
  color: #4338ca;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 900;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-weight: 500; }
.badge.gray { background: #f3f4f6; color: #374151; }

.last-active { color: #6b7280; font-weight: 500; font-size: 0.875rem; }
</style>
