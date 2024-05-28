<template>
    <div class="wrapper" ref="wrapper" >
        <div class="settings" ref="settings" >
            <button class="settings__edit" @click="emit('editTodo', true)">
                <img src="@/img/edit.png" alt="">
                <p>Изменить</p>
            </button>

            <h5 class="settings__title">Приоритет</h5>
            <div class="settings__priority">
                <button class="settings__flag" @click="setFlag('red')">
                    <img src="@/img/red-flag.png" alt="">
                </button>
                <button class="settings__flag" @click="setFlag('orange')">
                    <img src="@/img/orange-flag.png" alt="">
                </button>
                <button class="settings__flag" @click="setFlag('blue')">
                    <img src="@/img/blue-flag.png" alt="">
                </button>
                <button class="settings__flag" @click="setFlag('grey')">
                    <img src="@/img/flag.png" alt="">
                </button>
            </div>

            <VueDatePicker 
                placeholder="Дата и время"
                v-model="datetime"
                @update:model-value="handleDate"
            ></VueDatePicker>

            <button class="settings__delete" @click="deleteTodo">
                <img src="@/img/delete.png" alt="">
                <p>Удалить</p>
            </button>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex';
import { onMounted, onUnmounted } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

interface Todo {
  id: string,
  title: string,
  desc: string,
  flag: number,
  datetime: string
}

const props = defineProps<{
    todo: Todo,
    buttonCoord: DOMRect | undefined,
}>()

const settings = ref<HTMLElement | null>(null)
const store = useStore()
const wrapper = ref<HTMLElement | null>(null)
const datetime = ref(props.todo.datetime)

function handleDate(date: string) {
    store.dispatch('setDatetime', {id: props.todo.id, datetime: date})
}
function setFlag(flag: string) {
    switch(flag) {
        case 'grey':
            store.dispatch('setFlag', {id: props.todo.id, flag: 0})
            emit('closeSettings')
            break
        case 'blue':
            store.dispatch('setFlag', {id: props.todo.id, flag: 1})
            emit('closeSettings')
            break
        case 'orange':-
            store.dispatch('setFlag', {id: props.todo.id, flag: 2})
            emit('closeSettings')
            break
        case 'red':
            store.dispatch('setFlag', {id: props.todo.id, flag: 3})
            emit('closeSettings')
            break
    }
}
function clickOutside(event: MouseEvent) {
    if (event.target === wrapper.value) {
      emit('closeSettings')
    }
}

function onRight(right: number, top: number, left: number): void {
    if (settings.value) {
        settings.value.style.left = right + 10 + 'px'
        settings.value.style.top = top - 10 + 'px'

        if (settings.value.getBoundingClientRect().right > window.innerWidth ) {
            settings.value.style.left = left - 220 + 'px'
            settings.value.style.top = top + 50 + 'px'
        }
        if (settings.value.getBoundingClientRect().bottom > window.innerHeight ) {
            settings.value.style.left = right + 10 + 'px'
            settings.value.style.top = top - 40 + 'px'
        }
    }
}
onMounted(() => {
    window.addEventListener('click', clickOutside)
    if (props.buttonCoord) {
        onRight(props.buttonCoord.right, props.buttonCoord.top, props.buttonCoord.left)
    }
})

onUnmounted(() => {
    window.removeEventListener('click', clickOutside)
})
function deleteTodo() {
    store.dispatch('deleteTodo', props.todo.id)
}

const emit = defineEmits<{
    editTodo: [isEdit: boolean],
    closeSettings: [],
}>()

</script>

<style scoped>
.wrapper {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}
.settings {
    height: auto;
    width: 220px;
    border-radius: 10px;
    box-shadow: 0px 0px 8px 0px rgba(34, 60, 80, 0.2);
    padding: 10px;
    position: absolute;
    z-index: 10;
    background-color: white;

    display: flex;
    flex-direction: column;
    gap: 15px;
}
.settings__title {
    color: rgb(124, 124, 124);
}
.settings__edit, .settings__delete{
    display: flex;
    align-items: center;
    gap: 10px;

    width: 100%;
    transition: all 0.3s ease;
    padding: 10px;
    border-radius: 3px;
    font-size: 15px
}
.settings__edit:hover, .settings__delete:hover, .settings__flag:hover {
    background-color: rgba(232, 232, 232, 0.862);
}

.settings__edit > img {
    height: 20px;
}
.settings__priority {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
}
.settings__flag {
    padding: 8px;
    border-radius: 2px;
    transition: all 0.3s ease;

    display: flex;
    align-items: center;
}
.settings__flag > img, .settings__datetime > img, .settings__delete > img{
    height: 20px;
}
</style>