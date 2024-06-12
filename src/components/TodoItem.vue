<template>
    <div class="todo-item" v-if="!isEditing">
        <button @click="doneTodo" :class="{'todo-item__check' : true, 'todo-item__check-red'  : props.todo.flag === 3, 'todo-item__check-blue'  : props.todo.flag === 1, 'todo-item__check-orange'  : props.todo.flag === 2}">
          <img src="@/img/check.png" alt="">
        </button>

        <div class="todo-item__main">
          <p class="todo-item__name">{{ props.todo.title }}</p>
          <p class="todo-item__desc">{{ props.todo.desc }}</p>

          <div class="todo-item__time" v-if="time !== ''">
            <img src="@/img/clock.png" alt="">
            <p>{{ time }}</p>
          </div>
        </div>
        <button class="todo-item__more" @click="openSettings" ref="button" v-if="!props.isArchive">
          <img src="@/img/more.png" alt="">
        </button>
    </div>

    <AddTodo v-else @closeAddTodo="closeAddTodo" :date="new Date().toISOString()" :id="props.todo.id" :title="props.todo.title" :desc="props.todo.desc" :isEdit="true"></AddTodo>
    <TodoSettings v-if="isVisibleSettings" ref="todoSettings" @editTodo="editTodo" :buttonCoord="getButtonCoord()" @closeSettings="closeSettings" :todo="props.todo"></TodoSettings>

</template>

<script setup lang="ts">

import { computed, ref } from 'vue'
import TodoSettings from './TodoSettings.vue'
import { defineProps } from 'vue'
import AddTodo from './AddTodo.vue'
import store from '@/store';

interface Todo {
  id: string,
  title: string,
  desc: string,
  flag: number,
  datetime: string
}
interface Props {
  todo: Todo,
  isArchive: boolean,
}

const props = defineProps<Props>()
const isEditing = ref(false)
const isVisibleSettings = ref(false)
const button = ref<HTMLElement | null>(null)

function openSettings() {
  isVisibleSettings.value = true
}
function closeSettings() {
  isVisibleSettings.value = false
}
function editTodo(isEdit: boolean) {
  isEditing.value = isEdit
  isVisibleSettings.value = false
}
function closeAddTodo() {
  isEditing.value = false
}

const time = computed(() => {
  if (props.todo.datetime) {
    const date = new Date(props.todo.datetime)
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
  } else {
    return ''
  }
})
function doneTodo() {
  if (props.isArchive) {
    store.dispatch('deleteTodo', props.todo.id)
    store.dispatch('getDoneTodos')
  } else {
    store.dispatch('setDoneTodo', props.todo)
  }
}
function getButtonCoord() {
  return button.value?.getBoundingClientRect()
}
</script>

<style scoped>
.todo-list__day > p {
  font-weight: bold;
}
.todo-item:not(:first-child) {
  margin-top: 25px;
}
.todo-item {
  padding: 10px;
  height: auto;
  width: 300px;
  border: solid 1px rgb(224, 224, 224);
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0px 0px 4px rgba(182, 182, 182, 0.345);

  display: flex;
  align-items: flex-start;
}
.todo-item:hover {
  box-shadow: 0px 0px 8px rgba(182, 182, 182, 0.527);
  border: solid 1px rgb(204, 204, 204);
}
.todo-item__check {
  border: solid 2px rgb(182, 182, 182);
  border-radius: 50%;
  transition: all 0.3s ease;

  display: flex;
  align-items: center;
}
.todo-item__check:active {
  transform: scale(115%);
}
.todo-item__check-red {
  border: solid 2px rgb(255, 60, 60);
  background-color: rgb(255, 170, 170);
}
.todo-item__check-orange {
  border: solid 2px rgb(255, 133, 46);
  background-color: rgb(255, 184, 133);
}
.todo-item__check-blue {
  border: solid 2px rgb(46, 150, 255);
  background-color: rgb(137, 196, 255);
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
  font-size: 17px;
}
.todo-item__desc {
  word-wrap: break-word;
  color: #565656;
  line-height: 12px;
  font-size: 14px;
  margin-top: 7px;
}
.todo-item__time {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 15px;
}
.todo-item__time > img {
  height: 15px;
}
.todo-item__time > p {
  font-size: 13px;
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