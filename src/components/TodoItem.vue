<template>
    <div class="todo-item" v-if="!isEditing">
        <button @click="doneTodo" :class="{'todo-item__check' : true, 'todo-item__check-red'  : props.todo.flag === 3, 'todo-item__check-blue'  : props.todo.flag === 1, 'todo-item__check-orange'  : props.todo.flag === 2}">
          <img src="@/img/check.png" alt="">
        </button>

        <div class="todo-item__main">
          <p class="todo-item__name">{{ props.todo.title }}</p>
          <p class="todo-item__desc">{{ props.todo.desc }}</p>
        </div>

        <button class="todo-item__more" @click="visibilitySettings" ref="button" v-if="!props.isArchive">
          <img src="@/img/more.png" alt="">
        </button>
    </div>

    <AddTodo v-else @closeAddTodo="closeAddTodo" :id="props.todo.id" :title="props.todo.title" :desc="props.todo.desc" :isEdit="true"></AddTodo>
    <TodoSettings @editTodo="editTodo" @closeSettings="closeSettings" ref="todoSettings" v-show="isVisibleSettings" :visibilitySettings="visibilitySettings" :todo="props.todo"></TodoSettings>

</template>

<script setup lang="ts">

import { ref } from 'vue'
import TodoSettings from './TodoSettings.vue'
import { defineProps } from 'vue'
import AddTodo from './AddTodo.vue'
import store from '@/store';

interface Todo {
  id: number,
  title: string,
  desc: string,
  flag: number,
}
interface Props {
  todo: Todo,
  isArchive: boolean,
}

const props = defineProps<Props>()
const isEditing = ref(false)
const isVisibleSettings = ref(false)
const button = ref<HTMLElement | null>(null)
const todoSettings = ref<InstanceType<typeof TodoSettings> | null>(null)

function visibilitySettings() {
  isVisibleSettings.value = !isVisibleSettings.value

  if (isVisibleSettings.value) {
    if (button.value && todoSettings.value && isVisibleSettings.value) {
      const buttonCoord = button.value.getBoundingClientRect()
      todoSettings.value.onRight(buttonCoord.right, buttonCoord.top)
    }
  }
}

function closeSettings() {
  isVisibleSettings.value = false;
}
function editTodo(isEdit: boolean) {
  isEditing.value = isEdit
  isVisibleSettings.value = false
}

function closeAddTodo() {
  isEditing.value = false
}

function doneTodo() {
  if (props.isArchive) {
    store.commit('deleteDoneTodo', props.todo.id)
  } else {
    store.commit('addDoneTodo', props.todo)
    store.commit('deleteTodo', props.todo.id)
  }
}
</script>

<style scoped>
.todo-list__day > p {
  font-weight: bold;
}
.todo-item:not(:first-child) {
  margin-top: 20px;
}
.todo-item {
  padding: 10px;
  height: auto;
  width: 300px;
  border: solid 1px rgb(224, 224, 224);
  border-radius: 10px;
  transition: all 0.3s ease;

  display: flex;
  align-items: flex-start;
  /* justify-content: space-between; */
}
.todo-item:hover {
  box-shadow: 0px 0px 10px 0px rgba(182, 182, 182, 0.345);
}
.todo-item__check {
  border: solid 2px rgb(182, 182, 182);
  border-radius: 50%;
  transition: all 0.4s ease;

  display: flex;
  align-items: center;
}
.todo-item__check:active {
  transform: scale(115%);
}
.todo-item__check-red {
  border: solid 2px rgb(255, 46, 46);
}
.todo-item__check-orange {
  border: solid 2px rgb(255, 133, 46);
}
.todo-item__check-blue {
  border: solid 2px rgb(46, 150, 255);
}
.todo-item__check > img {
  height: 15px;
  opacity: 0;
  transition: all 0.3s ease;
}
.todo-item__check > img:hover {
  opacity: 70%;
}
.todo-item__main {
  width: 80%;
  margin-left: 10px;
}
.todo-item__name {
  word-wrap: break-word;
  line-height: 14px;
}
.todo-item__desc {
  word-wrap: break-word;
  line-height: 12px;
  font-size: 13px;
  margin-top: 5px;
}
.todo-item__more {
  transition: all 0.3s ease;
  border-radius: 5px;
  padding: 3px;
  
  display: flex;
  align-items: center;
}
.todo-item__more:hover {
  background-color: rgb(233, 233, 233);
}
.todo-item__more > img {
  height: 20px;
}
</style>