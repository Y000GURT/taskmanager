import { createStore } from 'vuex'
import authModule from './auth/index'

interface Todo {
  id: string,
  title: string,
  desc: string,
  flag: number,
  datetime: string
  done: boolean,
}

interface State {
  todos: Todo[],
  doneTodos: Todo[],
}

export default createStore({
  modules: {
    auth: authModule,
  },
  state: (): State => ( {
    todos: [],
    doneTodos: [],
  }),
  getters: {
    notDoneTodos(state: State) {
      return state.todos.filter((todo: Todo) => !todo.done)
    },
    overdueTodos(state: State) {
      return state.todos.filter((todo: Todo) => (new Date(todo.datetime) < new Date(Date.now()) && !todo.done))
    },
    doneTodos(state: State) {
      return state.doneTodos
    },
  },
  mutations: {
    setTodos(state: State, todos: Todo[]) {
      state.todos = todos
    },
    setDoneTodos(state: State, doneTodos: Todo[]) {
      state.doneTodos = doneTodos
    },
  },
  actions: {
    async getDoneTodos(context: any) {
      const userId = context.getters.userId

      const response = await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/todos.json`)

      const responseData = await response.json()
      const todos = []

      for (const key in responseData) {
        if(responseData[key].done) {
          const todo = {
            id: key,
            ...responseData[key]
          }
          todos.push(todo)
        }
      }
      context.commit('setDoneTodos', todos)
    },
    async getTodos(context: any) { 
      const userId = context.getters.userId

      const response = await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/todos.json`)

      const responseData = await response.json()

      if (!response.ok) {
          const error = new Error(`${responseData.error.code}: ${responseData.error.message}`)
          throw error
      }
      const todos = []

      for (const key in responseData) {
        const todo = {
            id: key,
            ...responseData[key]
        }
        todos.push(todo)
      }
      context.commit('setTodos', todos)
    },
    async addTodo(context: any, payload: any) {
      const userId = context.getters.userId

      const todo = {
        title: payload.title,
        desc: payload.desc ? payload.desc : '',
        flag: payload.flag,
        datetime: payload.datetime,
        done: payload.done
      }
      await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/todos.json`, {
        method: 'POST',
        body: JSON.stringify(todo)
      })

      context.dispatch('getTodos')
    },
    async editTodo(context: any, todo: Todo) {
      const userId = context.getters.userId
      const currentTodo = context.state.todos.find((item: Todo) => item.id === todo.id)

      await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/todos/${todo.id}.json`, {
        method: 'PUT',
        body: JSON.stringify({
          title: todo.title,
          desc: todo.desc ? todo.desc : '',
          flag: currentTodo.flag,
          datetime: currentTodo.datetime,
          done: currentTodo.done,
        })
      })

      context.dispatch('getTodos')
    },
    async setFlag(context: any, todo: Todo) {
      const userId = context.getters.userId
      const currentTodo = context.state.todos.find((item: Todo) => item.id === todo.id)

      await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/todos/${todo.id}.json`, {
        method: 'PUT',
        body: JSON.stringify({
          title: currentTodo.title,
          desc: currentTodo.desc,
          flag: todo.flag,
          datetime: currentTodo.datetime,
          done: currentTodo.done,
        })
      })
      context.dispatch('getTodos')
    },
    async setDatetime(context: any, todo: Todo) {
      const userId = context.getters.userId
      const currentTodo = context.state.todos.find((item: Todo) => item.id === todo.id)

      await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/todos/${todo.id}.json`, {
        method: 'PUT',
        body: JSON.stringify({
          title: currentTodo.title,
          desc: currentTodo.desc,
          flag: currentTodo.flag,
          datetime: todo.datetime,
          done: currentTodo.done,
        })
      })
      context.dispatch('getTodos')
    },
    async setDoneTodo(context: any, todo: Todo) {
      const userId = context.getters.userId

      await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/todos/${todo.id}.json`, {
        method: 'PUT',
        body: JSON.stringify({
          title: todo.title,
          desc: todo.desc,
          flag: todo.flag,
          datetime: todo.datetime,
          done: true,
        })
      })

      context.dispatch('getTodos')
    },
    async deleteTodo(context: any, todoId: string) {
      const userId = context.getters.userId

      await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/todos/${todoId}.json`, {
        method: 'DELETE'
      })
      context.dispatch('getTodos')
    },
  }
})
