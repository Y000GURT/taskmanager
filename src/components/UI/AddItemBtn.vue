<template>
    <button class="add-item">
        Добавить задачу
    </button>
</template>

<script setup lang="ts">

</script>

<style scoped>
.add-item {
  margin-top: 20px;
  font-weight: bold;
  height: 30px;
  width: 150px;
  background-color: rgb(147, 208, 255);
  border-radius: 15px;
  align-self: center;
  transition: all 0.4s ease;
}
.add-item:hover {
  background-color: rgb(112, 193, 255);
  color: white;
}
</style>