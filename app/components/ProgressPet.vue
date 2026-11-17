<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      mode?: 'background' | 'form' | 'store'
      reaction?: 'idle' | 'next' | 'complete' | 'eat' | 'drink'
      reactionKey?: number
      showDialogue?: boolean
    }>(),
    { mode: 'background', reaction: 'idle', reactionKey: 0, showDialogue: true }
  )

  const { student } = useCurrentStudent()
  const { pet, loadPet } = useProgressPet()
  const animation = ref('idle')
  let animationTimer: ReturnType<typeof setTimeout> | undefined

  const dialogue = computed(() => {
    if (!props.showDialogue || !pet.value) return ''
    if (pet.value.thirst <= 60 && pet.value.hunger <= 60)
      return "I'm feeling tired. Could I have food and water?"
    if (pet.value.thirst <= 60) return "I'm thirsty. Can I have some water?"
    if (pet.value.hunger <= 60) return "I'm hungry. Can I have some food?"
    return ''
  })

  const isTired = computed(() =>
    Boolean(pet.value && pet.value.hunger <= 60 && pet.value.thirst <= 60)
  )

  watch(
    () => [props.reaction, props.reactionKey],
    () => {
      if (animationTimer) clearTimeout(animationTimer)
      animation.value = props.reaction
      if (props.reaction === 'complete') return
      animationTimer = setTimeout(
        () => {
          animation.value = 'idle'
        },
        props.reaction === 'next'
          ? 1800
          : props.reaction === 'eat' || props.reaction === 'drink'
            ? 900
            : 750
      )
    },
    { immediate: true }
  )

  watch(
    () => student.value?.id,
    (studentId) => {
      if (studentId) loadPet()
    },
    { immediate: true }
  )
  onBeforeUnmount(() => {
    if (animationTimer) clearTimeout(animationTimer)
  })
</script>

<template>
  <div
    v-if="pet"
    class="progress-pet"
    :class="[`pet-${mode}`, `pet-motion-${animation}`, { 'pet-is-tired': isTired }]"
  >
    <div v-if="dialogue" class="pet-dialogue" role="status">{{ dialogue }}</div>
    <PetSprite :type="pet.type" :stage="pet.stage" :alt="`${pet.stageName} ${pet.type}`" />
  </div>
</template>

<style scoped>
  .progress-pet {
    position: relative;
    width: 11rem;
    height: 9rem;
    transform-origin: 50% 100%;
    z-index: 30;
  }
  .progress-pet::before,
  .progress-pet::after {
    position: absolute;
    z-index: 2;
    color: #fbbf24;
    opacity: 0;
    pointer-events: none;
    text-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
  }
  .progress-pet::before {
    content: '✦';
    top: 8%;
    left: 4%;
    font-size: 1.8rem;
  }
  .progress-pet::after {
    content: '★';
    top: 0;
    right: 4%;
    font-size: 1.35rem;
  }
  .pet-background {
    position: fixed;
    right: 1rem;
    bottom: 0.5rem;
    pointer-events: none;
    opacity: 0.96;
  }
  .pet-form {
    position: fixed;
    right: 1rem;
    bottom: 0.5rem;
    pointer-events: none;
    z-index: 210;
  }
  .pet-store {
    width: min(17rem, 58vw);
    height: 13rem;
  }
  .pet-dialogue {
    position: absolute;
    right: 70%;
    top: -0.5rem;
    width: 12rem;
    border: 2px solid #e5e7eb;
    border-radius: 1rem 1rem 0.25rem 1rem;
    background: rgba(255, 255, 255, 0.96);
    padding: 0.65rem 0.8rem;
    color: #374151;
    font-size: 0.8rem;
    font-weight: 700;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  }
  .pet-store .pet-dialogue {
    right: auto;
    left: 94%;
    top: 1rem;
    width: 10rem;
    border-radius: 1rem 1rem 1rem 0.25rem;
  }
  .pet-motion-next {
    animation: pet-question-celebrate 1.65s cubic-bezier(0.22, 0.8, 0.25, 1);
  }
  .pet-motion-complete {
    animation: pet-finale 2.6s cubic-bezier(0.22, 0.8, 0.25, 1) both;
  }
  .pet-form.pet-motion-complete {
    right: 7vw;
    bottom: 5vh;
    width: min(18rem, 42vw);
    height: min(14.5rem, 34vw);
    z-index: 260;
  }
  .pet-motion-eat,
  .pet-motion-drink {
    animation: pet-care-hop 0.85s ease-out;
  }
  .pet-is-tired.pet-motion-idle {
    filter: saturate(0.8);
  }
  @keyframes pet-question-celebrate {
    0% {
      transform: translateY(0) scale(1);
    }
    12% {
      transform: translateY(4px) scaleX(1.1) scaleY(0.88);
    }
    36% {
      transform: translateY(-38px) scaleX(0.92) scaleY(1.12);
    }
    54% {
      transform: translateY(-42px) scale(1.04);
    }
    72% {
      transform: translateY(0) scaleX(1.12) scaleY(0.86);
    }
    84% {
      transform: translateY(-9px) scaleX(0.97) scaleY(1.05);
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }
  @keyframes pet-finale {
    0% {
      opacity: 0;
      transform: translate(150px, 28px) scale(0.45);
    }
    10% {
      opacity: 1;
      transform: translateY(8px) scaleX(1.14) scaleY(0.84);
    }
    28% {
      transform: translate(-18px, -58px) rotate(-5deg) scaleX(0.9) scaleY(1.14);
    }
    42% {
      transform: translateY(4px) rotate(2deg) scaleX(1.16) scaleY(0.82);
    }
    57% {
      transform: translate(14px, -34px) rotate(5deg) scaleX(0.94) scaleY(1.1);
    }
    70% {
      transform: translateY(3px) rotate(-2deg) scaleX(1.12) scaleY(0.86);
    }
    80% {
      transform: translateY(-12px) rotate(-2deg) scaleX(0.97) scaleY(1.07);
    }
    88% {
      transform: translateY(-5px) rotate(2deg) scaleX(1.02) scaleY(1.04);
    }
    94% {
      transform: translateY(5px) rotate(-1deg) scaleX(1.05) scaleY(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  @keyframes pet-care-hop {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    18% {
      transform: translateY(3px) scaleX(1.05) scaleY(0.94);
    }
    48% {
      transform: translateY(-16px) scaleX(0.98) scaleY(1.04);
    }
    72% {
      transform: translateY(2px) scaleX(1.04) scaleY(0.95);
    }
    86% {
      transform: translateY(-3px) scaleY(1.01);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .progress-pet {
      animation: none !important;
    }
  }
  @media (max-width: 640px) {
    .pet-background,
    .pet-form {
      width: 8.25rem;
      height: 6.75rem;
      opacity: 0.82;
    }
    .pet-form.pet-motion-complete {
      right: 4vw;
      bottom: 6vh;
      width: 13.5rem;
      height: 11rem;
    }
    .pet-dialogue {
      display: none;
    }
  }
</style>
