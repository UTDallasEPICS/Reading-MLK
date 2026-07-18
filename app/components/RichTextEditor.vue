<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  rows?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// ── Refs ──
const editorRef = ref<HTMLDivElement | null>(null)
const colorWrapRef = ref<HTMLElement | null>(null)
const showColorPicker = ref(false)
const fontSizeInput = ref('16')
const isComposing = ref(false)

// ── Active formatting state ──
const isBold = ref(false)
const isItalic = ref(false)
const isUnderlined = ref(false)

// ── Font options ──
const fonts = [
  'Inter',
  'Roboto',
  'Times New Roman',
  'Comic Sans MS',
  'Georgia',
  'Courier New',
  'Poppins',
  'Outfit',
  'Arial',
]

const presetSizes = ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '64', '72']

const presetColors = [
  '#000000', '#434343', '#666666', '#999999',
  '#E53E3E', '#DD6B20', '#D69E2E', '#38A169',
  '#3182CE', '#5A67D8', '#805AD5', '#D53F8C',
]

// ── Saved selection ──
// We save/restore the selection so that toolbar interactions
// (which steal focus from the contenteditable) don't lose the
// user's cursor position.
let savedRange: Range | null = null

function saveSelection() {
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0 && editorRef.value?.contains(sel.anchorNode)) {
    savedRange = sel.getRangeAt(0).cloneRange()
  }
}

function restoreSelection() {
  if (savedRange && editorRef.value) {
    editorRef.value.focus()
    const sel = window.getSelection()
    if (sel) {
      sel.removeAllRanges()
      sel.addRange(savedRange)
    }
  }
}

// ── Sync content ──
watch(() => props.modelValue, (newVal) => {
  if (editorRef.value && editorRef.value.innerHTML !== newVal) {
    editorRef.value.innerHTML = newVal || ''
  }
})

onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue
  }
})

function onInput() {
  if (isComposing.value) return
  if (editorRef.value) {
    emit('update:modelValue', editorRef.value.innerHTML)
  }
  updateActiveStates()
}

function onCompositionStart() { isComposing.value = true }
function onCompositionEnd() {
  isComposing.value = false
  onInput()
}

// ── Update active formatting indicators ──
function updateActiveStates() {
  isBold.value = document.queryCommandState('bold')
  isItalic.value = document.queryCommandState('italic')
  isUnderlined.value = document.queryCommandState('underline')
}

function onSelectionChange() {
  if (editorRef.value?.contains(document.activeElement)) {
    updateActiveStates()
    saveSelection()
  }
}

onMounted(() => {
  document.addEventListener('selectionchange', onSelectionChange)
})
onUnmounted(() => {
  document.removeEventListener('selectionchange', onSelectionChange)
})

// ── Formatting commands ──
function execCmd(command: string, value?: string) {
  restoreSelection()
  document.execCommand('styleWithCSS', false, 'true')
  document.execCommand(command, false, value)
  saveSelection()
  onInput()
}

function applyBold() { execCmd('bold') }
function applyItalic() { execCmd('italic') }
function applyUnderline() { execCmd('underline') }

function applyFont(font: string) {
  execCmd('fontName', font)
}

function applyFontSize(size: string) {
  const num = parseInt(size, 10)
  if (!num || num < 1 || num > 200) return
  fontSizeInput.value = String(num)

  restoreSelection()
  document.execCommand('styleWithCSS', false, 'true')

  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)

  if (range.collapsed) {
    // If no text is selected, create a span with a zero-width space
    // and place the cursor inside it so subsequent typing uses the size.
    const span = document.createElement('span')
    span.style.fontSize = `${num}px`
    span.innerHTML = '&#8203;' // Zero-width space
    range.insertNode(span)
    
    // Move cursor inside the span after the zero-width space
    range.setStart(span.childNodes[0], 1)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    saveSelection()
    onInput()
    return
  }

  // Use execCommand fontSize with a marker value, then replace the
  // generated tags with <span style="font-size:Npx">
  document.execCommand('fontSize', false, '7')

  if (editorRef.value) {
    // Depending on the browser and styleWithCSS, it might generate <font size="7"> or <span style="font-size: xxx">
    // We look for elements that have font-size or size=7
    const fontElements = Array.from(editorRef.value.querySelectorAll('font[size="7"], span[style*="font-size"]'))
    fontElements.forEach((el) => {
      // Only replace if it matches the marker we just injected
      if (el.getAttribute('size') === '7' || (el as HTMLElement).style.fontSize === '-webkit-xxx-large' || (el as HTMLElement).style.fontSize === '48px') {
        const replacement = document.createElement('span')
        replacement.style.fontSize = `${num}px`
        replacement.innerHTML = el.innerHTML
        el.parentNode?.replaceChild(replacement, el)
      }
    })
  }

  saveSelection()
  onInput()
}

function applyColor(color: string) {
  execCmd('foreColor', color)
  showColorPicker.value = false
}

function onCustomColor(e: Event) {
  const target = e.target as HTMLInputElement
  applyColor(target.value)
}

function onFontSizeKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    applyFontSize(fontSizeInput.value)
  }
}

function onFontSizeBlur() {
  applyFontSize(fontSizeInput.value)
}

function selectPresetSize(size: string) {
  fontSizeInput.value = size
  applyFontSize(size)
}

// ── Click-outside for color picker ──
function onDocumentClick(e: MouseEvent) {
  if (colorWrapRef.value && !colorWrapRef.value.contains(e.target as Node)) {
    showColorPicker.value = false
  }
}

watch(showColorPicker, (open) => {
  if (open) {
    document.addEventListener('mousedown', onDocumentClick)
  } else {
    document.removeEventListener('mousedown', onDocumentClick)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onDocumentClick)
})

// ── Computed height ──
const editorMinHeight = computed(() => {
  const r = props.rows ?? 4
  return `${r * 1.8}em`
})
</script>

<template>
  <div class="rte-wrapper">
    <!-- ── Toolbar ── -->
    <div class="rte-toolbar">
      <!-- Font Family -->
      <select
        class="rte-select rte-font-select"
        @change="applyFont(($event.target as HTMLSelectElement).value)"
        title="Font Family"
      >
        <option value="" disabled selected>Font</option>
        <option v-for="f in fonts" :key="f" :value="f" :style="{ fontFamily: f }">{{ f }}</option>
      </select>

      <!-- Font Size: combo input + dropdown -->
      <div class="rte-size-combo">
        <input
          v-model="fontSizeInput"
          type="text"
          class="rte-size-input"
          title="Font Size"
          @keydown="onFontSizeKeydown"
          @blur="onFontSizeBlur"
          @focus="saveSelection"
        />
        <div class="rte-size-dropdown">
          <button
            v-for="s in presetSizes"
            :key="s"
            class="rte-size-option"
            :class="{ active: fontSizeInput === s }"
            @mousedown.prevent="selectPresetSize(s)"
          >{{ s }}</button>
        </div>
      </div>

      <span class="rte-divider" />

      <!-- Bold / Italic / Underline with active state -->
      <button
        class="rte-btn"
        :class="{ 'rte-btn-active': isBold }"
        @mousedown.prevent="applyBold"
        title="Bold"
      >
        <span style="font-weight: 800;">B</span>
      </button>
      <button
        class="rte-btn"
        :class="{ 'rte-btn-active': isItalic }"
        @mousedown.prevent="applyItalic"
        title="Italic"
      >
        <span style="font-style: italic; font-family: serif; font-weight: 600; font-size: 16px;">I</span>
      </button>
      <button
        class="rte-btn"
        :class="{ 'rte-btn-active': isUnderlined }"
        @mousedown.prevent="applyUnderline"
        title="Underline"
      >
        <span style="text-decoration: underline; font-weight: 600;">U</span>
      </button>

      <span class="rte-divider" />

      <!-- Color Picker -->
      <div class="rte-color-wrap" ref="colorWrapRef">
        <button
          class="rte-btn rte-color-btn"
          @mousedown.prevent.stop="saveSelection(); showColorPicker = !showColorPicker"
          title="Text Color"
        >
          <span class="rte-color-icon">A</span>
          <span class="rte-color-bar" />
        </button>

        <!-- Color popup -->
        <div v-show="showColorPicker" class="rte-color-popup" @mousedown.stop>
          <div class="rte-color-grid">
            <button
              v-for="c in presetColors"
              :key="c"
              class="rte-color-swatch"
              :style="{ background: c }"
              @mousedown.prevent="applyColor(c)"
              :title="c"
            />
          </div>
          <div class="rte-color-custom">
            <label class="rte-color-custom-label">
              Custom:
              <input type="color" class="rte-color-custom-input" @input="onCustomColor" value="#000000" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Editable area ── -->
    <div
      ref="editorRef"
      class="rte-editor"
      contenteditable="true"
      :data-placeholder="placeholder || 'Start typing...'"
      :style="{ minHeight: editorMinHeight }"
      @input="onInput"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
      @mouseup="updateActiveStates"
      @keyup="updateActiveStates"
    />
  </div>
</template>

<style scoped>
.rte-wrapper {
  border: 2px solid #f1f5f9;
  border-radius: 0.75rem;
  overflow: visible;
  transition: border-color 0.2s;
  background: #fff;
}
.rte-wrapper:focus-within {
  border-color: #6366f1;
}

/* ── Toolbar ── */
.rte-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 0.75rem 0.75rem 0 0;
  flex-wrap: wrap;
  position: relative;
}

.rte-select {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 6px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
}
.rte-select:hover { border-color: #a5b4fc; }
.rte-select:focus { border-color: #6366f1; }

.rte-font-select {
  max-width: 130px;
}

/* ── Size combo ── */
.rte-size-combo {
  position: relative;
}
.rte-size-input {
  width: 42px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 6px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  text-align: center;
  outline: none;
  transition: border-color 0.15s;
}
.rte-size-input:hover { border-color: #a5b4fc; }
.rte-size-input:focus { border-color: #6366f1; }

.rte-size-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 9999;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-height: 200px;
  overflow-y: auto;
  min-width: 52px;
}
.rte-size-combo:focus-within .rte-size-dropdown {
  display: flex;
  flex-direction: column;
}
.rte-size-option {
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: background 0.1s;
}
.rte-size-option:hover {
  background: #eef2ff;
  color: #4338ca;
}
.rte-size-option.active {
  background: #e0e7ff;
  color: #4338ca;
  font-weight: 700;
}

/* ── Buttons ── */
.rte-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.rte-btn:hover {
  background: #e0e7ff;
  border-color: #c7d2fe;
  color: #4338ca;
}

/* Active state for B/I/U toggles */
.rte-btn-active {
  background: #4338ca;
  border-color: #4338ca;
  color: #fff;
}
.rte-btn-active:hover {
  background: #3730a3;
  border-color: #3730a3;
  color: #fff;
}

.rte-divider {
  width: 1px;
  height: 20px;
  background: #e2e8f0;
  margin: 0 4px;
  flex-shrink: 0;
}

/* ── Color picker ── */
.rte-color-wrap {
  position: relative;
}
.rte-color-btn {
  flex-direction: column;
  gap: 1px;
  width: 32px;
  height: 32px;
}
.rte-color-icon {
  font-weight: 800;
  font-size: 14px;
  line-height: 1;
}
.rte-color-bar {
  display: block;
  width: 16px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #e53e3e, #d69e2e, #3182ce, #805ad5);
}

.rte-color-popup {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 9999;
  margin-top: 6px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  padding: 12px;
  min-width: 180px;
}
.rte-color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 10px;
}
.rte-color-swatch {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}
.rte-color-swatch:hover {
  border-color: #6366f1;
  transform: scale(1.15);
}
.rte-color-custom {
  border-top: 1px solid #e2e8f0;
  padding-top: 8px;
}
.rte-color-custom-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
}
.rte-color-custom-input {
  width: 28px;
  height: 28px;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 4px;
  background: none;
}

/* ── Editor area ── */
.rte-editor {
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 400;
  color: #1f2937;
  line-height: 1.7;
  outline: none;
  overflow-y: auto;
  word-wrap: break-word;
  word-break: break-all;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.rte-editor:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}
</style>
