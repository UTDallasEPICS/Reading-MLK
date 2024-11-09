<!-- <template lang="pug">
  .main-container(style="display: flex; flex-direction: column; align-items: center; justify-content: center;")
    .centered-container(style="display: flex; align-items: center; justify-content: center; text-align: center;")
      h1 Welcome to Reading Huddle
    .module-container(style="display: flex; justify-content: center; align-items: center; padding: 20px; border-radius: 20px; background-color: #FFCD98; width: 90vw; gap: 30px;")
      .module(
        :key="index"
        :style="moduleStyles[0]"
        @mouseover="applyHoverStyles(0)"
        @mouseleave="removeHoverStyles(0)"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" style="width: 50px; height: 50px; margin-right: 10px; border-radius: 5px; object-fit: contain;")
        h2(style="font-size: clamp(2vw + 1rem, 2.5rem);") About Us
      .module(
        :key="index"
        :style="moduleStyles[1]"
        @mouseover="applyHoverStyles(1)"
        @mouseleave="removeHoverStyles(1)"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" style="width: 50px; height: 50px; margin-right: 10px; border-radius: 5px; object-fit: contain;")
        h2(style="font-size: clamp(2vw + 1rem, 2.5rem);") Course Homepage
      .module(
        :key="index"
        :style="moduleStyles[2]"
        @mouseover="applyHoverStyles(2)"
        @mouseleave="removeHoverStyles(2)"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" style="width: 50px; height: 50px; margin-right: 10px; border-radius: 5px; object-fit: contain;")
        h2(style="font-size: clamp(2vw + 1rem, 2.5rem);") container 3
</template> -->

<!-- <template lang="pug">
  .main-container(class="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-50")
    .centered-container(class="flex flex-col items-center justify-center text-center space-y-8 md:space-y-10")
      h1(class="text-4xl sm:text-5xl font-bold text-gray-800") Welcome to Reading Huddle
    .module-container(class="flex flex-wrap justify-center items-center gap-8 p-6 rounded-3xl bg-orange-100 w-[90vw] max-w-5xl")
      .module(
        :key="index"
        :style="moduleStyles[0]"
        @mouseover="applyHoverStyles(0)"
        @mouseleave="removeHoverStyles(0)"
        class="flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-white shadow-2xl transition-all transform hover:scale-105 hover:bg-orange-300 hover:shadow-2xl hover:shadow-orange-400 duration-300"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" class="w-20 h-20 rounded-lg object-contain transition-all duration-300 ease-in-out transform hover:scale-110")
        h2(class="text-lg sm:text-xl font-semibold text-gray-700 text-center") About Us
      .module(
        :key="index"
        :style="moduleStyles[1]"
        @mouseover="applyHoverStyles(1)"
        @mouseleave="removeHoverStyles(1)"
        class="flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-white shadow-2xl transition-all transform hover:scale-105 hover:bg-orange-300 hover:shadow-2xl hover:shadow-orange-400 duration-300"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" class="w-20 h-20 rounded-lg object-contain transition-all duration-300 ease-in-out transform hover:scale-110")
        h2(class="text-lg sm:text-xl font-semibold text-gray-700 text-center") Course Homepage
      .module(
        :key="index"
        :style="moduleStyles[2]"
        @mouseover="applyHoverStyles(2)"
        @mouseleave="removeHoverStyles(2)"
        class="flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-white shadow-2xl transition-all transform hover:scale-105 hover:bg-orange-300 hover:shadow-2xl hover:shadow-orange-400 duration-300"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" class="w-20 h-20 rounded-lg object-contain transition-all duration-300 ease-in-out transform hover:scale-110")
        h2(class="text-lg sm:text-xl font-semibold text-gray-700 text-center") Container 3
</template> -->

<!-- <template lang="pug">
  .main-container(class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-10")
    .centered-container(class="flex flex-col items-center justify-center text-center space-y-8")
      h1(class="text-5xl font-extrabold text-white drop-shadow-lg") Welcome to Reading Huddle
    .module-container(class="flex flex-wrap justify-center gap-8 p-6 rounded-2xl bg-white shadow-2xl w-[90vw] max-w-6xl")
      .module(
        :key="index"
        :style="moduleStyles[0]"
        @mouseover="applyHoverStyles(0)"
        @mouseleave="removeHoverStyles(0)"
        class="flex flex-col items-center justify-center gap-6 p-8 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:to-teal-400"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" class="w-16 h-16 rounded-full border-2 border-white object-contain")
        h2(class="text-2xl font-semibold text-white text-center tracking-wide") About Us
      .module(
        :key="index"
        :style="moduleStyles[1]"
        @mouseover="applyHoverStyles(1)"
        @mouseleave="removeHoverStyles(1)"
        class="flex flex-col items-center justify-center gap-6 p-8 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:to-orange-400"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" class="w-16 h-16 rounded-full border-2 border-white object-contain")
        h2(class="text-2xl font-semibold text-white text-center tracking-wide") Course Homepage
      .module(
        :key="index"
        :style="moduleStyles[2]"
        @mouseover="applyHoverStyles(2)"
        @mouseleave="removeHoverStyles(2)"
        class="flex flex-col items-center justify-center gap-6 p-8 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:to-indigo-400"
      )
        img(src="/bookmark.png" alt="Reading Huddle Logo" class="w-16 h-16 rounded-full border-2 border-white object-contain")
        h2(class="text-2xl font-semibold text-white text-center tracking-wide") Container 3
</template> -->




<script setup>
import { ref, reactive } from 'vue';

const showAccountSelectionWindow = ref(false);
const modules = [
  { title: 'About Us' },
  { title: 'Course Homepage' },
  { title: 'Container 3' },
];

const moduleStyles = reactive(modules.map(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80px',
  backgroundColor: '#FFE382',
  padding: '60px 60px',
  borderRadius: '10px',
  width: '1000px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease'
})));

function applyHoverStyles(index) {
  moduleStyles[index].backgroundColor = '#FFBB33'; // Change background color on hover
  moduleStyles[index].transform = 'scale(1.05)'; // Slightly scale the element on hover
  moduleStyles[index].boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Add box shadow on hover
}

function removeHoverStyles(index) {
  moduleStyles[index].backgroundColor = '#FFE382'; // Revert to original background color
  moduleStyles[index].transform = 'scale(1)'; // Revert scaling
  moduleStyles[index].boxShadow = 'none'; // Remove box shadow
}

function openAccountSelectionWindow() {
  console.log('Opening account selection window...');
  showAccountSelectionWindow.value = true;
}

function closeAccountSelectionWindow() {
  console.log('Closing account selection window...');
  showAccountSelectionWindow.value = false;
}
</script>