<template>
    <div class="wrapper" @mousedown="emit('close')">

        <div class="content" @mousedown.stop>
            <header>
                <h2>Настройки</h2>
            </header>

            <hr>

            <div class="settings">
                <component 
                    :is="settingsComponent" 
                    @change-email="changeEmail" 
                    @change-password="changePassword"
                    @cansel="allSettings">
                </component>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Component, shallowRef, defineEmits } from 'vue'
import AllSettings from './AllSettings.vue'
import EmailSettings from './EmailSettings.vue'
import PasswordSettings from './PasswordSettings.vue'

const settingsComponent = shallowRef<Component>(AllSettings)
const emit = defineEmits<{
    (e: 'close'): void
}>()
function changeEmail() {
    settingsComponent.value = EmailSettings
}

function changePassword() {
    settingsComponent.value = PasswordSettings
}
function allSettings() {
    settingsComponent.value = AllSettings 
}
</script>

<style scoped>
.wrapper {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(41, 41, 41, 0.625);

    display: flex;
    justify-content: center;
    align-items: center;
}
.content{
    background-color: white;
    height: auto;
    width: 500px;
    padding: 15px;
    border-radius: 10px;
}
.settings{
    height: 100%;
    width: 100%;
}
hr {
    background-color: rgb(204, 204, 204);
    height: 1px;
    outline: none;
    border: none;
    margin: 10px 0;
}
</style>