<template>
  <div class="main" :class="{'main-left' : !isVisibleSidebar}">
    
    <transition name="modal">
      <ModalAddTodo v-if="visibleModal" @close="closeModal"></ModalAddTodo>
    </transition>

    <SideBar @open-modal="openModal" :isVisible="isVisibleSidebar" page="today" @close="closeSidebar"/>

    <div class="todo-list">
      <header>
        <h2>Сегодня</h2>
      </header>

      <div class="todos">
        <TodoListDay v-if="overdueAmount" overdue="Просрочено" :date="new Date()" :isArchive="false"></TodoListDay>
        <TodoListDay :date="new Date()" :isArchive="false"></TodoListDay>
      </div>

    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, ref, onBeforeMount } from 'vue'
import SideBar from './UI/SideBar.vue'
import TodoListDay from './TodoListDay.vue'
import ModalAddTodo from './ModalAddTodo.vue'
import store from '@/store';

const isVisibleSidebar = ref(true)
const visibleModal = ref(false)

function openModal(visible: boolean) {
  visibleModal.value = visible
}
function closeModal(visible: boolean) {
  visibleModal.value = visible
}
function closeSidebar() {
  isVisibleSidebar.value = !isVisibleSidebar.value
}
const overdueAmount = computed(() => {
  return store.getters.overdueTodos.length
})

onBeforeMount(() => {
  try {
    store.dispatch('getTodos')
  } catch (error) {
    alert(error)
  }
})
</script>

<style scoped>

.main {
  display: flex;
  height: 100%;
  width: 100%;
  transition: all 0.4s ease;
}
.todo-list {
  width: 100%;
  height: 100%;
  padding: 50px 30px 30px;
  transition: all 0.4s ease;
}
.todos {
  display: flex;
  align-items: flex-start;
  gap: 30px;

  height: 100%;
  width: auto;
  max-width: calc(100vw - 280px);
  overflow: auto;
}
.todos::-webkit-scrollbar {
  height: 8px;
}
.todos::-webkit-scrollbar-thumb {
  background-color: #cecece; 
  border-radius: 5px; 
}

.todos::-webkit-scrollbar-track {
  background-color: none; 
}
.main-left {
  transform: translate(-280px, 0);
}

.modal-enter-active {
  animation: modal 0.3s ease-out;
}

.modal-leave-active {
  animation: modal 0.3s ease-in reverse;
}

@keyframes modal {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>