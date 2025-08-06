<template lang="pug">
.wrapper-200.p-6.rounded-lg.max-w-md.mx-auto(style="background-color: #123A6B;")
  div.bg-white.p-6.rounded-lg.shadow-md.max-w-md.w-full
    h2.text-4xl.font-semibold.text-center.drop-shadow-lg.p-4 Submission Report

    .flex.items-start.mb-6
      img.book-cover.w-24.h-32.object-cover.rounded(
        src="/allthelightwecannotsee.svg"
        alt="Cover of All The Light We Cannot See"
      )

      .ml-4
        h3.text-xl.font.pt-2 All The Light We Cannot See
        p.text-gray-700 By Anthony Doerr
       

    ul.list-disc.list-inside.text-gray-800.space-y-2
      li
        span.font-medium Generic Points Earned: 
        span.font-bold 45 points
      li
        span.font-medium Total Points Earned: 
        span.font-bold 50 points
      li
        span.font-medium Time Spent: 
        span.font-bold 1 hour 30 mins
      li
        span.font-medium Date Submitted: 
        span.font-bold 4/23/25
  </template>

  <script setup>
  // if you want to drive these values from props, uncomment and use:
  //
  // defineProps({
  //   coverSrc: { type: String, required: true },
  //   title:    { type: String, required: true },
  //   author:   { type: String, required: true },
  //   genericPoints: { type: Number, required: true },
  //   totalPoints:   { type: Number, required: true },
  //   timeSpent:     { type: String, required: true },
  //   dateSubmitted: { type: String, required: true },
  // })
  </script>

  <style scoped>
  .book-cover {
    /* you can tweak the aspect ratio or add a box-shadow if you like */

      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 0.25rem;

  }
  </style>
