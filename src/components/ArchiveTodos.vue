<template>
  <div class="main" :class="{'main-left' : !isVisible}">

      <SideBar :isVisible="isVisible" page="archive" @close="closeSidebar"/>

      <div class="todo-list">
          <header>
              <h2>Архив</h2>
          </header>

          <TodoListDay :isArchive="true"></TodoListDay>
      </div>

  </div>
</template>

<script setup lang='ts'>
import { ref} from 'vue'
import SideBar from './UI/SideBar.vue'
import TodoListDay from './TodoListDay.vue'

const isVisible = ref(true)

function closeSidebar() {
  isVisible.value = !isVisible.value
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
  padding: 50px 30px 30px;
  transition: all 0.4s ease;
}
.main-left {
  transform: translate(-280px, 0);
}
</style>