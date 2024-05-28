<template>
  <div class="wrapper">

    <div class="content">
      <div class="content__logo">
        <img src="@/img/done.png" alt="logo">
        <h1>To-Do</h1>
      </div>

      <form v-if="mode === 'log-in'" @submit.prevent="submitForm">

        <div class="content__fields">
          <input type="text" :class="{'content__field': true, 'content__field-error': errors.length !== 0 }" placeholder="Почта" v-model.trim="inputLogin">
          <input type="password" :class="{'content__field': true, 'content__field-error': errors.length !== 0 }" placeholder="Пароль" v-model.trim="inputPassword">

          <transition-group name="disappear">
            <div  v-show="errorsExist" class="content__errors" v-for="item in errors" :key="item.name">
              {{item.name}}
            </div>
          </transition-group>

          <button :class="{'content__log-in': true, 'content__log-in-off': errors.values.length !== 0}">Войти</button>
        </div>
      </form>

      <form v-else @submit.prevent="submitForm">

        <div class="content__fields">
          <input type="text" :class="{'content__field': true, 'content__field-error': errors.length !== 0}" placeholder="Имя" v-model.trim="firstName">
          <input type="text" :class="{'content__field': true, 'content__field-error': errors.length !== 0 }" placeholder="Фамилия" v-model.trim="lastName">
          <input type="email"  :class="{'content__field': true, 'content__field-error': errors.length !== 0}" placeholder="Почта" v-model.trim="inputLogin">
          <input type="password"  :class="{'content__field': true, 'content__field-error': errors.length !== 0}" placeholder="Пароль" v-model.trim="inputPassword">

          <transition-group name="disappear">
            <div  v-show="errorsExist" class="content__errors" v-for="item in errors" :key="item.name">
              {{item.name}}
            </div>
          </transition-group>

          <button :class="{'content__log-in': true, 'content__log-in-off': errors.values.length !== 0}">Зарегистрироваться</button>
        </div>
      </form>

      <button v-if="mode === 'log-in'" class="content__signup" @click="switchMode('sign-up')">Зарегистрироваться</button>
      <button v-if="mode === 'sign-up'" class="content__signup" @click="switchMode('log-in')">Авторизоваться</button>
    </div>

  </div>
</template>

<script setup lang='ts'>
import { computed, ref, watch} from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

interface Errors {
  name: string,
}

const store = useStore()
const router = useRouter()
const mode = ref('log-in')
const firstName = ref('')
const lastName = ref('')
const inputLogin = ref('')
const inputPassword = ref('')
const errors = ref<Errors[]>([])
const errorFirstName = 'Поле Имя не должно быть пустым'
const errorLastName = 'Поле Фамилия не должно быть пустым'
const errorEmail = 'Некорректная почта'
const errorPasLen = 'Пароль меньше 6 символов'
const errorPasAlphabet = 'Пароль должен содержать только латинские символы'

function switchMode(mod: string) {
  mode.value = mod
}

async function submitForm() {
  if (errors.value.length !== 0) {
    return
  }

  if (mode.value === 'sign-up') {
    try {
      await store.dispatch('signup', {
        email: inputLogin.value,
        password: inputPassword.value,
        firstName: firstName.value,
        lastName: lastName.value,
      })
      router.push('/today')
    }
    catch(error) {
      alert(error)
    }
  } else {
    try {
      await store.dispatch('login', {
        email: inputLogin.value,
        password: inputPassword.value
      })
      router.push('/today')
    } catch (error) {
      alert(error)
    }
  }

}

const errorsExist = computed(() => {
  return !(errors.value.length === 0)
})

watch(firstName, () => {
  if (firstName.value.length === 0) {
    if (!findError(errorFirstName)) {
      errors.value.push({
        name: errorFirstName
      })
    }
  }
  else {
    errors.value = errors.value.filter(item => item.name !== errorFirstName)
  }
})

watch(lastName, () => {
  if (lastName.value.length === 0) {
    if (!findError(errorLastName)) {
      errors.value.push({
        name: errorLastName
      })
    }
  }
  else {
    errors.value = errors.value.filter(item => item.name !== errorLastName)
  }
})

watch(inputLogin, () => {
  let regex = /^\S+@\S+\.\S+$/

  if (!regex.test(inputLogin.value)) {
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

watch(inputPassword, () => {
  let regex = /[^a-zA-Z0-9]/g

  if (inputPassword.value.length < 6) {
    if (!findError(errorPasLen)) {
      errors.value.push({
      name: errorPasLen
    })
    }
  }
  else {
    errors.value = errors.value.filter(item => item.name !== errorPasLen)
  }
  if(regex.test(inputPassword.value)) {
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

function findError(str: string) {
  return errors.value.find(item => item.name === str)
}
</script>

<style scoped>

.wrapper {
  height: 100%;
  width: 100%;
  background-color: rgb(244, 250, 255);

  display: flex;
  flex-direction: column;
  align-items: center;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: 150px;
}

.content__logo {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 40px;
  cursor: pointer;
}
.content__logo > img {
  height: 80px;
}
.content__logo > h1 {
  font-size: 70px;
  color: transparent;
  background: linear-gradient(45deg, #349aff, #1068c6);
  background-clip: text;
}
.content__fields {
  background-color: rgb(215, 235, 254);
  border-radius: 15px;
  height: auto;
  width: 400px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}
.content__field, .content__log-in {
  width: 100%;
  height: 45px;
  border-radius: 7px;
  outline: none;
  border: none;
  font-size: 18px;

  background-color: white;
}
.content__field {
  padding: 10px;
}
.content__field-error {
  border: solid 2px rgb(255, 74, 74)
}
.content__errors {
  color: rgb(255, 74, 74);
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
.content__log-in {
  color: white;
  background-color: #349aff;
  transition: all 0.5s ease;
}
.content__log-in-off {
  cursor: url('../img/forbidden.png'), auto;
}
.content__log-in:hover {
  background-color: #1f8ffe;
}

.content__signup {
  margin-top: 10px;
  font-size: 16px;
  color: #a5a5a5;
  transition: all 0.2s ease;
  cursor: pointer;

  align-self: flex-end;
}
.content__signup:hover {
  color: #7e7e7e;
  text-decoration: underline;
}

</style>