<template>
    <div class="day" v-if="!props.isArchive">
        <p v-if="overdue" class="day__date">{{ overdue }}</p>
        <p v-else class="day__date">{{ date }} <span>{{ countTodos }}</span></p>

        <div class="day__todos" v-if="todos.length !== 0">
          <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" :isArchive="false"></TodoItem>
        </div>

        <AddItemBtn @click="visibilityAddTodo" v-if="!isVisibleAddTodo && !overdue" ></AddItemBtn>

        <AddTodo v-else-if="!overdue" @closeAddTodo="closeAddTodo" :date="props.date.toISOString()"></AddTodo>
    </div>

    <div class="day" v-else>
        <p v-if="store.state.doneTodos.length > 0" class="day-archive__status">Выполнено</p>
        <p v-else class="day-archive__status">Пустой архив</p>

        <div class="day__todos">
          <TodoItem v-for="todo in store.getters.doneTodos" :key="todo.id" :todo="todo" :isArchive="true"></TodoItem>
        </div>
    </div>
</template>

<script setup lang="ts">

import AddItemBtn from './UI/AddItemBtn.vue'
import TodoItem from './TodoItem.vue'
import AddTodo from './AddTodo.vue'
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { defineProps } from 'vue'

interface Todo {
  id: string,
  title: string,
  desc: string,
  flag: number,
  datetime: string
}

const props = defineProps<{
  isArchive: boolean,
  date: Date,
  overdue?: string,
}>()

const store = useStore();
const isVisibleAddTodo = ref(false)

function visibilityAddTodo() {
  isVisibleAddTodo.value = !isVisibleAddTodo.value
}

function closeAddTodo(visible: boolean) {
  isVisibleAddTodo.value = visible;
}

const countTodos = computed(() => {
  return todos.value.length
})

const todos = computed(() => {
  let todos = store.getters.notDoneTodos
  
  if (props.overdue) {
    return store.getters.overdueTodos
  }

  todos = todos.filter((todo: Todo) => new Date(todo.datetime) > new Date(Date.now())) // убираю просроченные 

  todos = todos.filter((todo: Todo) => { // фильтрация по дате конкретного списка тудушек
    const temp1 = new Date(todo.datetime).getFullYear() + ':' + new Date(todo.datetime).getMonth() + ':' + new Date(todo.datetime).getDate()
    const temp2 = props.date.getFullYear() + ':' + props.date.getMonth() + ':' + props.date.getDate()

    if (temp1 === temp2) {
      return todo
    }
  })

  todos = todos.sort((todo1: Todo, todo2: Todo) => {  // сортировка по флагу и времени
    if (todo2.flag > todo1.flag) return 1
    if (todo2.flag < todo1.flag) return -1
    if (new Date(todo2.datetime) < new Date(todo1.datetime)) return 1
    if (new Date(todo2.datetime) > new Date(todo1.datetime)) return -1

    return 0
  })
  return todos
})
const date = computed(() => {
  if (props.date) {
    const month = new Date(props.date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    })
    return month
  }
  return ''
})
</script>

<style scoped>
.day {
  margin-top: 50px;
  min-width: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
}
.day__date {
  align-self: center;
  font-weight: bold;
}
.day__date > span {
  color: #747474;
  font-weight: normal;
  margin-left: 5px;
  font-size: 14px;
}
.day-archive__status {
  align-self: flex-start;
}
.day__todos {
  height: auto;
  max-height: 500px;
  overflow: auto;
  margin-top: 20px;
  padding: 5px;
}
.day__todos::-webkit-scrollbar {
  width: 8px;
}
.day__todos::-webkit-scrollbar-thumb {
  background-color: #cecece; 
  border-radius: 5px; 
}

.day__todos::-webkit-scrollbar-track {
  background-color: none; 
}
</style>