<template>
  <div class="relative min-h-screen overflow-hidden bg-[#f8efe5] font-sans">
    <div class="absolute inset-0 bg-gradient-to-br from-[#faefe5] via-[#f7eee6] to-[#f4eadf]" />
    <div class="pointer-events-none absolute inset-0 opacity-70">
      <div class="absolute left-10 top-16 h-40 w-40 rounded-full bg-orange-100 blur-3xl" />
      <div class="absolute bottom-24 right-16 h-48 w-48 rounded-full bg-yellow-100 blur-3xl" />
      <div class="absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-pink-100 blur-2xl" />
    </div>

    <main class="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col items-center justify-center px-5 py-8 sm:px-8">
      <p class="mb-5 text-[11px] font-black uppercase tracking-[0.35em] text-[#c6783f] sm:mb-8">
        Welcome
      </p>

      <div class="grid w-full max-w-6xl grid-cols-1 items-center gap-6 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_minmax(240px,0.9fr)_minmax(260px,1fr)] lg:gap-8">
        <button
          type="button"
          @click="navigateTo('/auth?role=coach')"
          class="group mx-auto flex min-h-[300px] w-full max-w-[340px] flex-col items-start justify-between rounded-[2rem] bg-[#111a3b] p-7 text-left text-white shadow-[0_18px_35px_rgba(15,23,42,0.22)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_45px_rgba(15,23,42,0.28)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#111a3b] sm:min-h-[330px] lg:min-h-[360px] lg:p-8"
        >
          <span class="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-6 w-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 7.5C9.4 5.7 6.4 5.4 3 6.2v11.2c3.4-.8 6.4-.5 9 1.3m0-11.2c2.6-1.8 5.6-2.1 9-1.3v11.2c-3.4-.8-6.4-.5-9 1.3m0-11.2v11.2" />
            </svg>
          </span>
          <span class="block">
            <span class="block text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl">Reading<br />Coach</span>
            <span class="mt-3 block max-w-[18rem] text-sm font-medium leading-snug text-white/80 sm:text-base">
              Manage students and curriculum.
            </span>
            <span class="mt-5 inline-flex rounded-full bg-white px-5 py-2 text-sm font-extrabold text-[#111a3b] transition group-hover:bg-[#f4eadf]">
              Log in
            </span>
          </span>
        </button>

        <div class="order-first flex justify-center py-3 sm:col-span-2 sm:row-start-1 lg:order-none lg:col-span-1 lg:row-start-auto lg:py-0">
          <img
            src="/logo.jpg"
            alt="Reading Huddle — For story time wins"
            class="h-52 w-52 object-contain mix-blend-multiply sm:h-60 sm:w-60 lg:h-[min(30vw,360px)] lg:w-[min(30vw,360px)]"
          />
        </div>

        <button
          type="button"
          @click="navigateTo('/auth?role=reader')"
          class="group mx-auto flex min-h-[300px] w-full max-w-[340px] flex-col items-start justify-between rounded-[2rem] border-2 border-[#eba92f] bg-[#eba92f] p-7 text-left text-[#101936] shadow-[0_18px_35px_rgba(140,90,20,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_45px_rgba(140,90,20,0.25)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#d79520] sm:min-h-[330px] lg:min-h-[360px] lg:p-8"
        >
          <span class="flex h-12 w-12 items-center justify-center rounded-full bg-white/45 text-[#101936]">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-6 w-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 3 2.2 5.1 5.5.5-4.2 3.6 1.3 5.4-4.8-2.9-4.8 2.9 1.3-5.4-4.2-3.6 5.5-.5L12 3Z" />
            </svg>
          </span>
          <span class="block">
            <span class="block text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl">Reading<br />Buddy</span>
            <span class="mt-3 block max-w-[18rem] text-sm font-medium leading-snug text-[#101936]/80 sm:text-base">
              Complete challenges and win prizes!
            </span>
            <span class="mt-5 inline-flex rounded-full bg-[#111a3b] px-5 py-2 text-sm font-extrabold text-white transition group-hover:bg-[#202d58]">
              Log in
            </span>
          </span>
        </button>
      </div>
    </main>
  </div>
</template>
