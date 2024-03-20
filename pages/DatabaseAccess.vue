<template>
    <div>
        <div>
            <h2 class="text-center text-3xl font-bold mt-4"  style="margin-top: 35px">View Database</h2>
      <h3 class="text-center text-s font-bold" style="margin-top: 10px">View the full database and Import/Export</h3>
      <br>

      <div class="flex items-center justify-center sm:col-span-6">
        <input type="file" @change="handleFileSelect" accept=".xlsx, .csv">
        <button type="button" class="rounded-md bg-green-500 px-3 py-2 text-lg font-semibold text-white shadow-sm
        hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-green-600" @click.prevent="importData">Import</button>
        <button type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm
        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-indigo-600" @click.prevent="exportData">Export</button>
       
      </div>
      <Notification :isVisible="isImportSuccessful" :message="successMessage" />
      <Notification :isVisible="isError" :message="errorMessage" />
      <Loading :isLoading = "isLoading" />
        </div>
    </div>
</template>

<script setup>
import Notification from "~/components/Notification.vue";
import { ref } from "vue";
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
const clearSuccessMessage = () => {
  isImportSuccessful.value = false;
   successMessage.value = '';
};
</script>