<script setup lang="ts">
definePageMeta({ ssr: false, layout: "admin" })

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
@import './styles/progress.css';
</style>
