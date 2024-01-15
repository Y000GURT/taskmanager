<template>
    <div class="sidebar" >

        <div class="sidebar__header">
            <div class="sidebar__name">
                <img src="@/img/user.png" alt="" class="sidebar__img-user">
                <p>Алмаз</p>
                <img src="@/img/arrow.png" alt="" class="sidebar__img-arrow">
            </div>
            <button class="sidebar__toggle" @click="emit('close')" :class="{'sidebar__toggle-off' : !isVisible}">
                    <img src="@/img/sidebar.png" alt="">
            </button>
        </div>

        <button class="sidebar__add-todo">
            <div class="sidebar__wrapper-plus">
                <img src="@/img/plus.png" alt="" class="sidebar__plus">
            </div>
            <p>Добавить задачу</p>
        </button>
        
        <nav class="sidebar__menu">
            <router-link to="/archive" class="sidebar__link" :class="{'sidebar__link-active' : page == 'archive'}">
                <img src="@/img/archive.png" alt="">
                <p>Архив</p>
            </router-link>

            <router-link to="/today" class="sidebar__link" :class="{'sidebar__link-active' : page == 'today'}">
                <img src="@/img/today.png" alt="">
                <p>Сегодня</p>
            </router-link>

            <router-link to="/upcomingtodos" class="sidebar__link" :class="{'sidebar__link-active' : page == 'upcoming'}">
                <img src="@/img/calendar.png" alt="">
                <p>Предстоящие</p>
            </router-link>
        </nav>

    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { defineEmits } from 'vue';

interface Props {
    isVisible: boolean,
    page: string,
}

defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void,
}>()
</script>

<style scoped>
.sidebar {
    width: 280px;
    min-height: 100%;
    padding: 13px;
    background-color: rgb(226, 241, 255);
    font-size: 15px;
    transition: all 0.4s ease;
    
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.sidebar-off {
    transform: translate(-280px, 0);
}
.sidebar__toggle-off {
    transform: translate(60px, 0);
}
.sidebar__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.sidebar__name {
    display: flex;
    align-items: center;
    gap: 10px;

    font-weight: bold;
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
    transition: all 0.3s ease;
}
.sidebar__name:hover {
    background-color: rgb(199, 228, 255);
}
.sidebar__img-user {
    height: 30px;
}
.sidebar__img-arrow {
    height: 10px;
}
.sidebar__toggle {
    border-radius: 5px;
    height: 30px;
    width: 33px;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
}
.sidebar__toggle:hover {
    background-color: rgb(199, 228, 255);
}
.sidebar__toggle > img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 70%;
    width: 70%;
}
.sidebar__add-todo {
    width: 100%;
    height: 35px;
    padding: 5px 5px 5px 9px;
    margin-top: 10px;
    border-radius: 5px;
    transition: all 0.3s ease;
    font-size: 13px;

    display: flex;
    align-items: center;
    gap: 8px;
}
.sidebar__add-todo:hover {
    background-color: rgb(199, 228, 255);
}
.sidebar__wrapper-plus {
    height: 20px;
    width: 20px;
    background-color: rgb(70, 166, 255);
    border-radius: 50%;
    
    display: flex;
    align-items: center;
    justify-content: center;
}
.sidebar__plus {
    height: 60%;
}
.sidebar__add-todo > p {
    font-weight: bold;
    color: rgb(70, 166, 255);
}
/* ===================Меню===================== */
.sidebar__menu {
    display: flex;
    flex-direction: column;

    width: 100%;
}
.sidebar__link {
    text-decoration: none;
    color: black;
    border-radius: 5px;
    transition: all 0.3s ease;
    padding: 5px 5px 5px 9px;
    margin-top: 10px;

    display: flex;
    align-items: center;
    gap: 8px;
}
.sidebar__link-active {
    color: rgb(70, 166, 255);
    background-color: rgb(199, 228, 255)
}
.sidebar__link:hover {
    background-color: rgb(199, 228, 255);
}
.sidebar__link > img {
    height: 20px;
    width: 20px;
}
</style>