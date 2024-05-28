<template>
  <router-view></router-view>
</template>

<script setup lang='ts'>
import { useStore } from 'vuex'
import {onBeforeMount} from 'vue'

const store = useStore()

onBeforeMount(() => {
  store.dispatch('autoLogin')
})

</script>

<style>

</style>