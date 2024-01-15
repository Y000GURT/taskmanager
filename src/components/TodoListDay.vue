<template>
    <div class="day" v-if="!props.isArchive">
        <p>6 января</p>

        <div class="day__todos">
          <TodoItem v-for="todo in store.state.todos" :key="todo.id" :todo="todo" :isArchive="false"></TodoItem>
        </div>

        <AddItemBtn @click="visibilityAddTodo" v-if="!isVisibleAddTodo"></AddItemBtn>

        <AddTodo v-else @closeAddTodo="closeAddTodo"></AddTodo>
    </div>

    <div class="day" v-else>
        <p v-if="store.state.doneTodos.length > 0">Выполнено</p>
        <p v-else>Пустой архив</p>

        <div class="day__todos">
          <TodoItem v-for="todo in store.state.doneTodos" :key="todo.id" :todo="todo" :isArchive="true"></TodoItem>
        </div>
    </div>
</template>

<script setup lang="ts">

import AddItemBtn from './UI/AddItemBtn.vue'
import TodoItem from './TodoItem.vue'
import AddTodo from './AddTodo.vue'
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import { defineProps } from 'vue'

const props = defineProps<{
  isArchive: boolean,
}>()

const store = useStore();
const isVisibleAddTodo = ref(false)

onMounted(() => {
  store.commit('sortedTodos')
})

function visibilityAddTodo() {
  isVisibleAddTodo.value = !isVisibleAddTodo.value
}

function closeAddTodo(visible: boolean) {
  isVisibleAddTodo.value = visible;
}
</script>

<style scoped>
.day {
  margin-top: 50px;
  
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
}
.day__todos {
  height: auto;
  max-height: 500px;
  overflow: auto;
  margin-top: 20px;
}
.day__todos::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #cecece; 
  border-radius: 5px; 
}

::-webkit-scrollbar-track {
  background-color: none; 
}
</style>