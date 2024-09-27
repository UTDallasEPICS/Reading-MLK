<template>
    <div class="accountSelectionWindow-overlay">
        <div class="accountSelectionWindow-content">
            <h2>Select Account Type</h2>
            <button @click="navigateToParent" class="account-button">Parent</button>
            <button @click="navigateToFaculty" class="account-button">Faculty</button>
            <button @click="navigateToStudent" class="account-button">Student</button>
            <button @click="closeAccountSelectionWindow" class="account-button close-button">Close</button>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    showAccountSelectionWindow: {
      type: Boolean,
      required: true,
    },
  },
  created() {
    console.log('Account Selection Window component rendered!');
  },
  methods: {
    navigateToParent() {
      this.$router.push('/createparent');
      this.closeAccountSelectionWindow();
    },
    navigateToFaculty() {
      this.$router.push('/createfaculty');
      this.closeAccountSelectionWindow();
    },
    navigateToStudent() {
      this.$router.push('/createstudent');
      this.closeAccountSelectionWindow();
    },
    closeAccountSelectionWindow() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.accountSelectionWindow-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.accountSelectionWindow-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.account-button {
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.account-button:hover {
  background-color: rgb(240, 235, 235);
}

.close-button {
  background-color: red;
  color: white;
}

.close-button:hover {
  background-color: darkred;
}
</style>
