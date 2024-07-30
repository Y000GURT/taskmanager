<template>
    <div class="main" :class="{'main-left' : !isVisible}">
        <transition name="modal">
            <ModalAddTodo v-if="visibleModal" @close="closeModal"></ModalAddTodo>
        </transition>
        <SideBar @open-modal="openModal" :isVisible="isVisible" page="upcoming" @close="closeSidebar"/>

        <div class="todo-list">
            <header>
                <h2>{{ date }}</h2>
                <div class="control">
                    <button :class="[isNow ? 'control__prev-off' : 'control__prev']" @click="prev"><img class="control__img" src="../img/left-arrow.png" alt=""></button>
                    <button class="control__now" @click="now">Сегодня</button>
                    <button class="control__next" @click="next"><img class="control__img" src="../img/right-arrow.png" alt=""></button>
                </div>
            </header>

            <div class="todos" ref="todos">
                <TodoListDay v-for="date in dates" :key="date.toISOString()" :date="date" :isArchive="false"></TodoListDay>
            </div>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import SideBar from './UI/SideBar.vue'
import TodoListDay from './TodoListDay.vue'
import ModalAddTodo from './ModalAddTodo.vue'

const store = useStore()
const isVisible = ref(true)
const todos = ref<HTMLElement>()
const dates = ref<Date[]>([])
const primordialDates = ref<Date[]>()
const visibleModal = ref(false)
const nowDate = ref(new Date(Date.now()))


const date = computed(() => {
    const month = new Date().toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric',
    })
    return month[0].toUpperCase() + month.slice(1)
})
function getDates(now: Date) {
    for (let i = 1; i <= 7; i++) {
        const nextDay = new Date(new Date().setFullYear(now.getFullYear() , now.getMonth(), now.getDate() + i))
        dates.value.push(nextDay)
    }
}
function next() {
    const date = dates.value[dates.value.length - 1]
    dates.value.length = 0
    getDates(date)
    if (todos.value) {
        todos.value.scrollTo({left: 0, behavior: 'smooth'})
    }
}
function now() {
    dates.value.length = 0
    getDates(nowDate.value)
    if (todos.value) {
        todos.value.scrollTo({left: 0, behavior: 'smooth'})
    }
}
function prev() {
    if (!isNow.value) {
        const date = new Date(firstDate.value.setDate(firstDate.value.getDate() - 8))
        dates.value.length = 0
        getDates(date)
        if (todos.value) {
            todos.value.scrollTo({left: 0, behavior: 'smooth'})
        }
    } else { return }
}
const firstDate = computed(() => {
    return dates.value[0]
})
const isNow = computed(() => {
    const today = new Date()
    let tomorrow = new Date(today.setDate(today.getDate() + 1));
    if (primordialDates.value) {
        return primordialDates.value[0].getDate() === tomorrow.getDate()
    }
    return null
})
function openModal(visible: boolean) {
  visibleModal.value = visible
}
function closeModal(visible: boolean) {
  visibleModal.value = visible
}
onMounted( () => {
    getDates(nowDate.value)
    primordialDates.value = dates.value
})
onMounted(() => {
    let isMouseDown = false;
    let startX:any, scrollLeft:any;

    if (todos.value) {
        todos.value.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            todos.value!.style.cursor = 'grabbing'
            startX = event.pageX - todos.value!.offsetLeft;
            scrollLeft = todos.value!.scrollLeft;
        });

        todos.value.addEventListener('mousemove', (event) => {
            if (!isMouseDown) return;
            event.preventDefault();
            const x = event.pageX - todos.value!.offsetLeft;
            const scroll = (x - startX) * 1;
            todos.value!.scrollLeft = scrollLeft - scroll;
        });

        todos.value.addEventListener('mouseup', () => {
            isMouseDown = false;
            todos.value!.style.cursor = 'grab'
        });

        todos.value.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
    }
})
onBeforeMount(() => {
  try {
    store.dispatch('getTodos')
  } catch (error) {
    alert(error)
  }
})
function closeSidebar() {
    isVisible.value = !isVisible.value

    if (todos.value) {
        todos.value.style.maxWidth = '100vw'
    }
}
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
    padding: 50px 0px 30px 30px;
    transition: all 0.4s ease;
}
.todos {
    display: flex;
    align-items: flex-start;
    gap: 30px;

    height: 97%;
    width: auto;
    max-width: calc(100vw - 320px);
    overflow-x: scroll;
    cursor: pointer;
}
.todos::-webkit-scrollbar {
    height: 6px;
}
.todos::-webkit-scrollbar-thumb {
    background-color: #d0d0d0; 
    border-radius: 5px; 
}

.todos::-webkit-scrollbar-track {
    background-color: none; 
}
.main-left {
    transform: translate(-280px, 0);
}
header {
    display: flex;
    justify-content: space-between;
    height: 50px;

    padding: 0 30px 0 0;
}
.control {
    display: flex;
    align-self: flex-end;

    border: solid 1px rgb(232, 232, 232);
    border-radius: 3px;
}
.control__prev, .control__now, .control__next, .control__prev-off {
    height: 15px;
    padding: 13px;
    transition: all 0.4s ease;
    
    display: flex;
    justify-content: center;
    align-items: center;
}
.control__prev:hover, .control__now:hover, .control__next:hover {
    background-color: #ebebebc0;
}
.control__now {
    border-left: solid 1px rgb(232, 232, 232);
    border-right: solid 1px rgb(232, 232, 232);
    font-size: 15px;
}
.control__now:active {
    font-size: 14px;
}
.control__prev:active .control__img, .control__next:active .control__img {
    height: 14px
}
.control__prev-off {
    cursor: url('../img/forbidden.png'), auto;
}
.control__img {
    height: 12px;
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

@media (max-width:1025px) { 
  .todos {
    max-width: 100%;
  }
  .main {
    display: flex;
    height: 100%;
    width: 100%;
    transition: all 0.4s ease;
    transform: translate(-280px, 0);
  }
  .main-left {
    transform: translate(0px, 0);
  }
}
</style>