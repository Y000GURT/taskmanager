<template>
    <div class="settings" ref="settings">
        <button class="settings__edit" @click="emit('editTodo', true)">
            <img src="@/img/edit.png" alt="">
            <p>Изменить</p>
        </button>

        <hr class="settings__line"/>

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

        <hr class="settings__line"/>

        <button class="settings__delete" @click="deleteTodo">
            <img src="@/img/delete.png" alt="">
            <p>Удалить</p>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineExpose } from 'vue'
import { defineProps } from 'vue'
import { useStore } from 'vuex';
import { defineEmits } from 'vue'

const settings = ref<HTMLElement | null>(null)
const store = useStore()

interface Todo {
  id: number,
  title: string,
  desc: string,
  flag: number,
}

const props = defineProps<{
    todo: Todo,
}>()

function onRight(right: number, top: number): void {
    if (settings.value) {
        settings.value.style.left = right + 'px'
        settings.value.style.top = top - 10 + 'px'
    }
}

function setFlag(flag: string) {
    switch(flag) {
        case 'grey':
            store.commit('changeFlagTodo', {id: props.todo.id, flag: 0})
            store.commit('sortedTodos')
            emit('closeSettings')
            break
        case 'blue':
            store.commit('changeFlagTodo', {id: props.todo.id, flag: 1})
            store.commit('sortedTodos')
            emit('closeSettings')
            break
        case 'orange':
            store.commit('changeFlagTodo', {id: props.todo.id, flag: 2})
            store.commit('sortedTodos')
            emit('closeSettings')
            break
        case 'red':
            store.commit('changeFlagTodo', {id: props.todo.id, flag: 3})
            store.commit('sortedTodos')
            emit('closeSettings')
            break
    }

}
function deleteTodo() {
    store.commit('deleteTodo', props.todo.id)
}

const emit = defineEmits<{
    editTodo: [isEdit: boolean],
    closeSettings: [],
}>()
defineExpose({
    onRight
})
</script>

<style scoped>
.settings {
    height: auto;
    width: 200px;
    border-radius: 10px;
    box-shadow: 0px 0px 8px 0px rgba(34, 60, 80, 0.2);
    padding: 10px;
    position: absolute;
    z-index: 10;
    background-color: white;

    display: flex;
    flex-direction: column;
    gap: 5px;
}
.settings__line {
    height: 1px;
    background-color: rgb(217, 217, 217);
    border: none;
    margin-top: 6px;
}
.settings__title {
    color: rgb(124, 124, 124);
}
.settings__edit, .settings__delete {
    display: flex;
    align-items: center;
    gap: 10px;

    width: 100%;
    transition: all 0.3s ease;
    padding: 8px;
    border-radius: 3px;
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
    padding: 5px;
    border-radius: 2px;
    transition: all 0.3s ease;

    display: flex;
    align-items: center;
}
.settings__flag > img{
    height: 20px;
}
.settings__delete > img{
    height: 20px;
}
</style>