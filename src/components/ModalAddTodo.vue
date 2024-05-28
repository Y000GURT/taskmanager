<template>
    <div class="wrapper" @click="close">
        <form class="content" @click.stop="">

            <MyTextArea v-model="title" :rows="1" class="title" placeholder="Название задачи"></MyTextArea>
            <MyTextArea v-model="desc" :rows="1" class="desc" placeholder="Описание"></MyTextArea>

            <div class="dops">
                <select class="priority" v-model="priority">
                    <option value="3">
                        <img src="@/img/red-flag.png" alt="">
                        <p>Приоритет 4</p>
                    </option>
                    <option value="2">
                        <img src="@/img/orange-flag.png" alt="">
                        <p>Приоритет 3</p>
                    </option>
                    <option value="1">
                        <img src="@/img/blue-flag.png" alt="">
                        <p>Приоритет 2</p>
                    </option>
                    <option value="0">
                        <img src="@/img/flag.png" alt="">
                        <p>Приоритет 1</p>
                    </option>
                </select>

                <VueDatePicker 
                    placeholder="Дата и время"
                    v-model="datetime"
                ></VueDatePicker>
            </div>

            <div class="actions">
                <button @click="close" class="actions__close">Отмена</button>
                <button @click.prevent="addTodo" :class="[!title ? 'actions__add-off' : 'actions__add']">Добавить задачу</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import MyTextArea from './UI/MyTextArea.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref, defineEmits } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const title = ref('')
const desc = ref('')
const datetime = ref()
const priority = ref(3)

const emit = defineEmits<{
    (e: 'close', value: boolean): void,
}>()

function close(e: Event) {
    e.preventDefault()
    emit('close', false)
}
function addTodo() {
    const todo = {
        title: title.value,
        desc: desc.value,
        flag: priority.value,
        datetime: datetime.value !== undefined ? datetime.value : (new Date().setHours(new Date().getHours() + 1)),
        done: false
    }
    store.dispatch('addTodo', todo)
    emit('close', false)
}
</script>

<style scoped>
.wrapper {
    height: 60%;
    width: 100%;
    z-index: 10;
    position: absolute;

    display: flex;
    justify-content: center;
    align-items: center
}
.content {
    width: 500px;
    height: auto;
    padding: 10px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgb(140, 140, 140);

    display: flex;
    flex-direction: column;
    gap: 10px;
}

select {
    width: 100%;
    border: solid 1px rgb(222, 222, 222);
    padding: 6px;
    border-radius: 4px;
    font-size: 15px;
    color: #727272;
}
.title {
    font-size: 20px;
    font-weight: bold;
}
.desc {
    font-size: 16px
}
textarea {
    border: none;
    outline: none;
    width: 100%;
    height: auto;
    resize: none;
    overflow: hidden;
    overflow-wrap: break-word;
}
.dops {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}
.actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
.actions__add, .actions__close, .actions__add-off  {
    padding: 10px;
    border-radius: 5px;
    font-size: 15px;

    transition: all 0.3s ease;
}
.actions__add {
    background-color: rgb(98, 187, 255);
    color: white;
}
.actions__add:hover {
    background-color: rgb(58, 170, 255);
}
.actions__add-off {
    background-color: rgb(147, 208, 255);
    color: white;
    cursor: url('../img/forbidden.png'), auto;
}
.actions__close {
    background-color: #eeeeee;
    color: #4e4e4e;
}
.actions__close:hover {
    background-color: #d3d3d3;
}
</style>