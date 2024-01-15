<template>
    <div class="content">
        <input v-model="title" type="text" class="content__title" placeholder="Название задачи">
        <textarea v-model="desc" type="text" class="content__desc" placeholder="Описание" :rows="descRows"> </textarea>

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

import { defineEmits, onMounted, watch } from 'vue'
import { defineProps } from 'vue'
import { ref } from 'vue'
import { useStore } from 'vuex';

const props = defineProps<{
    id?: number,
    title?: string,
    desc?: string,
    isEdit?: boolean,
}>()

const store = useStore()
const title = ref(props.title)
const desc = ref(props.desc)
const descRows = ref(1)

function addEditTodo() {
    if (title.value !== '') {
        if (props.isEdit) {
            store.commit('editTodo', {
                id: props.id,
                title: title.value,
                desc: desc.value,
            })
            emit('closeAddTodo', false)
        }
        else {
            store.commit('addTodo', {
                id: Date.now(),
                title: title.value,
                desc: desc.value,
            })
            title.value = ''
            desc.value = ''
        }
    }
}
onMounted(() => {
    if (desc.value) {
        descRows.value = Math.ceil((desc.value?.length |  1 ) / 30)
    }
})
watch(desc, () => {
    if (desc.value) {
        descRows.value = Math.ceil((desc.value?.length |  1 ) / 30)
    }
})
const emit = defineEmits<{
  closeAddTodo: [visible: boolean]
}>()

</script>

<style scoped>
.content {
    height: auto;
    width: 300px;
    border: solid 1px rgb(199, 199, 199);
    border-radius: 10px;
    padding: 10px;
    margin-top: 20px;

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
.content > input {
    font-weight: bold;
}
.content > textarea {
    margin-top: 10px;
}
.content__title {
    font-size: 15px;
}
.content__title::placeholder {
    font-weight: bold;
    font-size: 15px;
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