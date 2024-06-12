<template>
    <div class="content">
        <MyTextArea v-model="title" :rows="1" class="content__title" placeholder="Название задачи"></MyTextArea>
        <MyTextArea v-model="desc" :rows="1" class="content__desc" placeholder="Описание"></MyTextArea>

        <hr class="content__line">

        <div class="content__btns">
            <div class="content__close" @click="emit('closeAddTodo', false)">
                <img src="@/img/close.png" alt="" class="content__img">
            </div>
            <div  @click="addEditTodo" :class="[!title ? 'content__send-off' : 'content__send']">
                <img src="@/img/send.png" alt="" class="content__img">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import MyTextArea from './UI/MyTextArea.vue'
import { defineEmits } from 'vue'
import { defineProps } from 'vue'
import { ref } from 'vue'
import { useStore } from 'vuex';

const props = defineProps<{
    id?: string,
    title?: string,
    desc?: string,
    isEdit?: boolean,
    date: string,
}>()

const store = useStore()
const title = ref(props.title)
const desc = ref(props.desc)

function addEditTodo() {
    if (title.value != undefined) {
        if (props.isEdit) {
            store.dispatch('editTodo', {
                id: props.id,
                title: title.value,
                desc: desc.value
            })
            emit('closeAddTodo', false)
        }
        else {
            const date = new Date(props.date)
            store.dispatch('addTodo', {
                title: title.value,
                desc: desc.value,
                flag: 0,
                datetime: new Date(date.setHours(date.getHours() + 1)).toISOString(),
                done: false
            })
            emit('closeAddTodo', false)
        }
    }
}

const emit = defineEmits<{
  closeAddTodo: [visible: boolean]
}>()

</script>

<style scoped>
.content:first-child {
  margin-top: 0px;
}
.content {
    height: auto;
    width: 300px;
    border: solid 1px rgb(199, 199, 199);
    border-radius: 10px;
    padding: 10px;
    margin-top: 25px;

    display: flex;
    flex-direction: column;
}
input, textarea {
    border: none;
    outline: none;
    width: 100%;
    height: auto;
    resize: none;
    overflow: hidden;
    overflow-wrap: break-word;
}
.content__title {
    font-size: 15px;
    font-weight: bold;
}
.content__title::placeholder {
    font-weight: bold;
    font-size: 15px;
}
.content__desc {
    margin-top: 10px;
}
.content__line {
    height: 1px;
    background-color: rgb(217, 217, 217);
    border: none;
    margin-top: 6px;
}
.content__btns {
    margin-top: 10px;

    display: flex;
    justify-content: end;
    gap: 5px;
}
.content__close, .content__send, .content__send-off {
    height: 30px;
    width: 30px;
    padding: 5px;
    border-radius: 3px;
    transition: all 0.3s ease;

    display: flex;
    align-items: center;
    justify-content: center;
}
.content__close {
    background-color: rgb(210, 210, 210);
}
.content__close:hover {
    background-color: rgb(186, 186, 186);
}
.content__send {
    background-color: rgb(75, 171, 255);
}
.content__send:hover {
    background-color: rgb(57, 163, 255);
}
.content__send-off {
    background-color: rgb(107, 186, 255);
    cursor: url('../img/forbidden.png'), auto;
}
.content__img {
    height: 15px;
}
</style>