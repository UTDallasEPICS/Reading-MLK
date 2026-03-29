<script setup lang="ts">
definePageMeta({ ssr: false })
const { students } = useAdmin()
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-gray-900 mb-8">Class Progress 📊</h2>

    <div class="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Student</th>
            <th class="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Books Read</th>
            <th class="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Weekly Streak</th>
            <th class="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Last Active</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="student in students" :key="student.id" class="hover:bg-blue-50/50 transition">
            <td class="p-6 font-bold text-gray-800">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white flex items-center justify-center text-xs font-black shadow-md">
                  {{ student.initials }}
                </div>
                {{ student.name }}
              </div>
            </td>
            <td class="p-6">
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-bold">
                📚 {{ student.books }}
              </span>
            </td>
            <td class="p-6">
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100 text-orange-700 font-bold">
                👑 {{ student.streak }}
              </span>
            </td>
            <td class="p-6 text-gray-500 font-medium text-sm">{{ student.lastActive }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
