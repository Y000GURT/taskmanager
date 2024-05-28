<template>
    <div class="content__email">
        <div>
            <label for="newEmail">Новый Email</label> <br>
            <input type="text" id="newEmail" v-model.trim="newEmail">
        </div>

        <div>
            <label for="confirmEmail"> Подтвердите Email</label> <br>
            <input type="text" id="confirmEmail" v-model.trim="confirmEmail">
        </div>

        <transition-group name="disappear">
            <div  v-show="errorsExist" class="content__errors" v-for="item in errors" :key="item.name">
              {{item.name}}
            </div>
        </transition-group>

        <div class="actions">
            <button class="actions__cansel" @click="emit('cansel')">Отмена</button>
            <button :class="[forbiddenSend ? 'actions__change-off' : 'actions__change']" @click="changeEmail">Изменить Email</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits } from 'vue'
import { useStore } from 'vuex'

interface Errors {
  name: string,
}

const store = useStore()
const errors = ref<Errors[]>([])
const newEmail = ref('')
const confirmEmail = ref('')
const errorEmail = 'Некорректная почта'
const errorEquals = 'Поля должны быть одинаковыми'
const emit = defineEmits<{
    (e: 'cansel'): void,
}>()

const errorsExist = computed(() => {
  return !(errors.value.length === 0)
})
const forbiddenSend = computed(() => {
    return !confirmEmail.value.length || !newEmail.value.length || errorsExist.value
})

watch(newEmail, () => {
    let regex = /^\S+@\S+\.\S+$/

    if (!regex.test(newEmail.value)) {
        if (!findError(errorEmail)) {
            errors.value.push({
                name: errorEmail,
            })
        }
    }
    else {
        errors.value = errors.value.filter(item => item.name !== errorEmail)
    }
})

watch(confirmEmail, () => {
    if(confirmEmail.value !== newEmail.value) {
        if (!findError(errorEquals)) {
            errors.value.push({
                name: errorEquals
            })
        }
    }
    else {
        errors.value = errors.value.filter(item => item.name !== errorEquals)
    }
})
function findError(str: string) {
  return errors.value.find(item => item.name === str)
}
function changeEmail() {
    try {
        store.dispatch('changeEmail', newEmail.value)
    } 
    catch (error) {
        alert(error)
    }
    emit('cansel')
}
</script>

<style scoped>
.content__email {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 15px;
}
label {
    font-weight: bold;
}
input {
    padding: 5px;
    outline: none;
    border: solid 1px rgb(196, 196, 196);
    border-radius: 4px;
    font-size: 15px;
    width: 300px
}
.content__errors {
  color: rgb(255, 74, 74);
}
.actions {
    display: flex;
    justify-content: space-around;
}
.actions__cansel {
    padding: 10px 40px;
    font-size: 15px;
    border-radius: 4px;
    background-color: rgb(235, 234, 234);
    color: rgb(69, 69, 69);
    transition: all 0.2s ease;
}
.actions__cansel:hover {
    background-color: rgb(194, 194, 194);
}
.actions__change, .actions__change-off {
    padding: 10px 40px;
    font-size: 15px;
    border-radius: 4px;
    background-color: rgb(91, 179, 255);
    color: white;
    transition: all 0.2s ease;
}
.actions__change:hover {
    background-color: rgb(58, 163, 255);
}
.actions__change-off {
    padding: 10px 40px;
    font-size: 15px;
    border-radius: 4px;
    color: white;
    background-color: rgb(107, 186, 255);
    cursor: url('@/img/forbidden.png'), auto;
}

.disappear-enter-active,
.disappear-leave-active {
  transition: all 0.5s ease;
}

.disappear-enter-from,
.disappear-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>