<template>
    <textarea 
      :class="['textarea', scrollActive && 'scroll-active']"
      :value="modelValue"
      @input="tralala($event), increaseRows()" 
      type="text" 
      ref="textarea" 
      :rows="currentRows"
      maxlength="200">
    </textarea>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted} from 'vue'

interface Props {
  rows: number,
  modelValue?: string,
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const textarea = ref<HTMLTextAreaElement | null>(null)
const currentRows = ref(props.rows)
const scrollActive = ref(false)

function tralala(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value)
}
function increaseRows() {
  if (textarea.value) {
    const scrollHeight = textarea.value.scrollHeight
    const clientHeight = textarea.value.clientHeight

    if(scrollHeight > 70) {
      scrollActive.value = true
      return
    } 
    else {
      scrollActive.value = false
    }

    if (scrollHeight > clientHeight) {
      currentRows.value++;
    } 
  }
}
onMounted(() => {
  if (textarea.value) {
    const scrollHeight = textarea.value.scrollHeight
    const clientHeight = textarea.value.clientHeight
    currentRows.value = Math.ceil(scrollHeight / clientHeight)
  }
})
</script>

<style scoped>
.scroll-active {
  overflow-y: scroll;
}
.textarea::-webkit-scrollbar {
  width: 8px;
}
.textarea::-webkit-scrollbar-thumb {
  background-color: #cecece; 
  border-radius: 5px; 
}

::-webkit-scrollbar-track {
  background-color: transparent; 
}
</style>