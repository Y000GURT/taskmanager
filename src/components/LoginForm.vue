<template>
  <div class="wrapper">
    <div class="content">

      <div class="content__logo">
        <img src="@/img/done.png" alt="logo">
        <h1>To-Do</h1>
      </div>

      <div class="content__fields">
        <input type="text" @focus="onFocus" @blur="offFocus" :class="{'content__field': true, 'content__field-error': errors.length !== 0 && isFocus}" placeholder="Почта" v-model="inputLogin">
        <input type="password" class="content__field" placeholder="Пароль" v-model="inputPassword">

        <transition-group name="disappear">
          <div  v-show="isFocus" class="content__errors" v-for="item in errors" :key="item.id">
            {{item.name}}
          </div>
        </transition-group>

        <button class="content__log-in" @click="logIn">Войти</button>
      </div>

      <div class="content__forgot-sign">
        <a href="">Забыли пароль?</a>
        <a href="">Зарегистрироваться</a>
      </div>
    </div>

  </div>
</template>

<script setup lang='ts'>
import { ref, watch} from 'vue'
import { useRouter } from 'vue-router';

interface Errors {
  id: number,
  name: string,
}

const inputLogin = ref('')
const inputPassword = ref('')
const errors = ref<Errors[]>([])
const isFocus = ref(false)
const router = useRouter()

function onFocus() {
  isFocus.value = true
}
function offFocus() {
  isFocus.value = false
}
function logIn() {
  router.push('/today')
}
watch(inputLogin, () => {
  if (!/^\S+@\S+\.\S+$/.test(inputLogin.value)) {
    if (errors.value.length === 0) {
      errors.value.push({
      id: 1,
      name: 'Некорректная почта'
    })
    }
  }
  else {
    errors.value.pop()
  }
})
</script>

<style scoped>

.wrapper {
  height: 100%;
  width: 100%;
  background-color: rgb(244, 250, 255);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.content {
  height: 60%;
}
/* ===================ЛОГОТИП===================== */
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

/* ===================ПОЛЯ ВВОДА===================== */
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
.content__log-in:hover {
  background-color: #1f8ffe;
}


.content__forgot-sign {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  text-decoration: underline;
  cursor: pointer;
}
.content__forgot-sign > a {
  color: #a4a4a4;
}
.content__forgot-sign > a:first-child:hover, .content__forgot-sign > a:last-child:hover{
  color: #7b7b7b;
}
</style>