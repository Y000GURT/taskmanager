<template>
    <div class="content__all">

        <div class="name">
            <label for="name">Имя</label>

            <div class="name__field">
                <input type="text" id="name" v-model.trim="firstName">
                <button class="name__btn" v-show="firstNameBtn" @click="changeFirstName">Изменить</button>
            </div>
        </div>

        <div class="name">
            <label for="lastName">Фамилия</label>

            <div class="name__field">
                <input type="text" id="lastName" v-model.trim="lastName">
                <button class="name__btn" v-show="lastNameBtn" @click="changeLastName">Изменить</button>
            </div>
        </div>

        <div class="email">
            <h4>Email</h4>
            <p>{{store.getters.email}}</p>
            <button class="pass__btn" @click="emit('changeEmail')">Изменить Email</button>
        </div>

        <div class="password">
            <h4>Пароль</h4>
            <button class="pass__btn" @click="emit('changePassword')">Изменить пароль</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';
import { useStore } from 'vuex'

const store = useStore()
const firstName = ref(store.getters.firstName)
const lastName = ref(store.getters.lastName)
const firstNameBtn = ref(false)
const lastNameBtn = ref(false)

const emit = defineEmits<{
    (e: 'changeEmail'): void,
    (e: 'changePassword'): void
}>()

watch(firstName, () => {
    if (firstName.value !== store.getters.firstName) {
        firstNameBtn.value = true
    } else {
        firstNameBtn.value = false
    }
})

watch(lastName, () => {
    if (lastName.value !== store.getters.lastName) {
        lastNameBtn.value = true
    } else {
        lastNameBtn.value = false
    }
})

function changeFirstName() {
    try {
        store.dispatch('addUser', {firstName: firstName.value})
        firstNameBtn.value = false
    }
    catch (error) {
        alert(error)
    }
}

function changeLastName() {
    try {
        store.dispatch('addUser', {lastName: lastName.value})
        lastNameBtn.value = false
    }
    catch (error) {
        alert(error)
    }
}
</script>

<style scoped>
.content__all {
    display: flex;
    flex-direction: column;
    gap: 15px;

    margin-top: 10px;
}
.name > label {
    font-weight: bold;
}
.name__field {
    display: flex;
    gap: 10px;
}
.name__field > input {
    padding: 5px;
    outline: none;
    border: solid 1px rgb(196, 196, 196);
    border-radius: 4px;
    font-size: 15px;
    width: 300px
}
.name__field > button {
    background-color: rgb(91, 179, 255);
    padding: 7px 10px;
    color: white;
    font-size: 15px;
    border-radius: 4px;
    transition: all 0.3s ease;
}
.name__field > button:hover {
    background-color: rgb(67, 167, 255);
}
.email, .password {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.email > p {
    color: rgb(77, 77, 77);
}
.pass__btn {
    align-self: flex-start;

    padding: 7px 10px;
    font-size: 15px;
    border-radius: 4px;
    background-color: rgba(243, 243, 243, 0.872);
    color: rgb(69, 69, 69);
    transition: all 0.2s ease;
}
.pass__btn:hover {
    background-color: rgb(239, 239, 239);
}
</style>