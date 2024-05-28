<template>
    <div class="content__password">
      <div>
          <label for="newPassword">Новый пароль</label> <br>
          <input type="password" id="newPassword" v-model.trim="newPassword">
      </div>

      <div>
          <label for="confirmPassword"> Подтвердите новый пароль</label> <br>
          <input type="password" id="confirmPassword" v-model.trim="confirmPassword">
      </div>

      <transition-group name="disappear">
          <div  v-show="errorsExist" class="content__errors" v-for="item in errors" :key="item.name">
            {{item.name}}
          </div>
      </transition-group>

      <div class="actions">
          <button class="actions__cansel" @click="emit('cansel')">Отмена</button>
          <button :class="[forbiddenSend ? 'actions__change-off' : 'actions__change']" @click="changePassword">Изменить пароль</button>
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
const newPassword = ref('')
const confirmPassword = ref('')
const errorEquals = 'Поля должны быть одинаковыми'
const errorPasLen = 'Пароль меньше 6 символов'
const errorPasAlphabet = 'Пароль должен содержать только латинские символы'

const emit = defineEmits<{
    (e: 'cansel'): void,
}>()

const errorsExist = computed(() => {
  return !(errors.value.length === 0)
})
const forbiddenSend = computed(() => {
    return !newPassword.value.length || !confirmPassword.value.length || errorsExist.value
})

watch(newPassword, () => {
  let regex = /[^a-zA-Z0-9]/g

  if (newPassword.value.length < 6) {
    if (!findError(errorPasLen)) {
      errors.value.push({
      name: errorPasLen
    })
    }
  }
  else {
    errors.value = errors.value.filter(item => item.name !== errorPasLen)
  }
  if(regex.test(newPassword.value)) {
    if (!findError(errorPasAlphabet)) {
      errors.value.push({
      name: errorPasAlphabet
    })
    }
  }
  else {
    errors.value = errors.value.filter(item => item.name !== errorPasAlphabet)
  }
})
watch(confirmPassword, () => {
    if(confirmPassword.value !== newPassword.value) {
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

function changePassword() {
    try {
        store.dispatch('changePassword', newPassword.value)
    } 
    catch (error) {
        alert(error)
    }
    emit('cansel')
}

function findError(str: string) {
  return errors.value.find(item => item.name === str)
}
</script>

<style scoped>
.content__password {
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