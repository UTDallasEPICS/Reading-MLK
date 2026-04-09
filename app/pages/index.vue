<template>
  <div class="min-h-screen bg-[#f8efe5] relative overflow-hidden font-sans">
    <div class="absolute inset-0 bg-gradient-to-br from-[#faefe5] via-[#f7eee6] to-[#f4eadf]" />
    <div class="absolute inset-0 pointer-events-none opacity-70">
      <div class="absolute top-16 left-10 h-40 w-40 rounded-full bg-orange-100 blur-3xl" />
      <div class="absolute bottom-24 right-16 h-48 w-48 rounded-full bg-yellow-100 blur-3xl" />
      <div class="absolute top-1/3 right-1/4 h-32 w-32 rounded-full bg-pink-100 blur-2xl" />
    </div>

    <main class="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center">
      <h1 class="text-5xl sm:text-6xl font-black tracking-tight mb-10">
        <span class="text-[#e0674c]">Welcome to</span>
        <span class="text-[#f0a11c]"> ReadingHuddle!</span>
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button
          @click="navigateTo('/auth?role=admin')"
          class="group rounded-[2.25rem] bg-white/85 backdrop-blur border border-white shadow-[0_16px_45px_rgba(0,0,0,0.08)] p-8 sm:p-10 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.12)]"
        >
          <div class="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-[#eef0fb] text-5xl shadow-inner">
            🏫
          </div>

          <h3 class="text-3xl font-black text-[#11182f] mb-3">Faculty & Admin</h3>
          <p class="text-lg text-[#7f8798] font-semibold leading-relaxed">
            Manage students, curriculum & raffles.
          </p>
        </button>

        <button
          @click="navigateTo('/auth?role=reader')"
          class="group rounded-[2.25rem] bg-white/85 backdrop-blur border-2 border-[#f0a11c] shadow-[0_16px_45px_rgba(0,0,0,0.08)] p-8 sm:p-10 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.12)]"
        >
          <div class="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-[#fff8e8] text-5xl shadow-inner">
            ✨
          </div>

          <h3 class="text-3xl font-black text-[#11182f] mb-3">Reading Buddy</h3>
          <p class="text-lg text-[#7f8798] font-semibold leading-relaxed">
            Complete challenges and win prizes!
          </p>
        </button>
      </div>
    </main>
  </div>
</template>