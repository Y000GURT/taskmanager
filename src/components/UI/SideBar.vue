<template>
    <div class="sidebar" :class="{'sidebar-off' : !isVisible}">

        <div class="sidebar__header">
            <div class="sidebar__name" @click="openSettings" ref="header">
                <p>{{ store.getters.firstName }}</p>
                <img src="@/img/arrow.png" alt="" class="sidebar__img-arrow">
            </div>

            <button class="sidebar__toggle" @click="emit('close')" :class="{'sidebar__toggle-off' : !isVisible}">
                    <img src="@/img/sidebar.png" alt="">
            </button>

            <AccountSetings v-if="visibleAccountSettings" @close="closeAccountSettings"></AccountSetings>

            <div class="sidebar__wrappet-setting" ref="wrapper" v-if="visible">
                <div class="sidebar__setting">
                <button class="sidebar__settings" @click="openAccountSettings">
                    <img class="sidebar__set-img" src="@/img/settings.png" alt="">
                    Настройки
                </button>
                <button class="sidebar__logout" @click="logout">
                    <img class="sidebar__log-img" src="@/img/logout.png" alt="">
                    Выйти
                </button>
            </div>
            </div>
        </div>

        <button class="sidebar__add-todo" @click="openModal">
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
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex'
import AccountSetings from '../accountSettings/AccountSetings.vue';

const store = useStore()
const visible = ref(false)
const visibleAccountSettings = ref(false)
const wrapper = ref<HTMLElement | null>(null)

interface Props {
    isVisible: boolean,
    page: string,
}

defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'openModal', value: boolean): void
}>()

function openModal() {
    emit('openModal', true)
}
function logout() {
    store.dispatch('logout')
}

function clickOutside(event: MouseEvent) {
    if (event.target === wrapper.value) {
      visible.value = false
    }
}
function openSettings() {
    visible.value = true
}
function closeSetting() {
    visible.value = false
}
function openAccountSettings() {
    visibleAccountSettings.value = true
    closeSetting()
}

function closeAccountSettings() {
    visibleAccountSettings.value = false
}

onMounted(() => {
    window.addEventListener('click', clickOutside)
})

onUnmounted(() => {
    window.removeEventListener('click', clickOutside)
})
</script>

<style scoped>
.sidebar {
    min-width: 280px;
    min-height: 100%;
    padding: 13px;
    background-color: rgb(223, 240, 255);
    font-size: 15px;
    transition: all 0.4s ease;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
    gap: 20px;

    font-weight: bold;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
    transition: all 0.3s ease;
    overflow: hidden;
}
.sidebar__name:hover {
    background-color: rgb(199, 228, 255);
}
.sidebar__name:active {
    transform: scale(1.1);
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
.sidebar__toggle-off {
    transform: translate(60px, 0);
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
.sidebar__wrappet-setting {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}
.sidebar__setting {
    position: absolute;
    left: 5px;
    top: 45px;
    height: auto;
    width: 180px;
    background-color: white;
    border-radius: 5px;
    box-shadow:  0px 0px 14px 3px rgba(34, 60, 80, 0.2);
    font-size: 50px;
    padding: 10px;

    display: flex;
    flex-direction: column;
    align-content: flex-start;
}
.sidebar__settings {
    margin-bottom: 20px;
}
.sidebar__settings, .sidebar__logout {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    gap: 10px;

    border-radius: 5px;
    padding: 8px;
    font-size: 16px;
    transition: all 0.4s ease;
}
.sidebar__settings:hover, .sidebar__logout:hover {
    background-color: rgb(234, 234, 234);
}
.sidebar__set-img {
    height: 17px;
}
.sidebar__log-img {
    height: 15px;
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
.sidebar__link > p {
    line-height: 20px;
}
.sibebar__projects {
    width: 100%;
    margin-top: 30px;
}
.projects__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 10px;
    border-radius: 5px;
    transition: all 0.3s ease;
    cursor: pointer;
}
.projects__header:hover {
    background-color: rgb(199, 228, 255);
}
.projects__header:hover .projects__img {
    opacity: 100%;
}

.projects__header > p {
    line-height: 13px;
}
.projects__add {
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
}
.projects__img {
    opacity: 0;
    transition: all 0.3s ease;
}
.projects__img:hover {
    transform: scale(1.3);
}

@media (max-width:1025px) { 
    .sidebar__toggle {
        transform: translate(60px, 0);
    }
    .sidebar__toggle-off {
        transform: translate(0, 0);
    }
}
</style>