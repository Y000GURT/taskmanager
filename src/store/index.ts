import { createStore } from 'vuex'

const todos = [{
  id: 1,
  title: 'Сходить за хлебом',
  desc: 'В магазин Магнит, около дома который',
  flag: 0
},
{
  id: 2,
  title: 'Сняться в фильме вместо Уилла Смита',
  desc: 'Сказали, он потерял форму и нужен кто-то спортивный',
  flag: 3
},
{
  id: 3,
  title: 'Написать сценарий для фильма "Пельмени переходят в атаку"',
  desc: 'Заплатят 1к рублей',
  flag: 1
},
{
  id: 4,
  title: 'Полететь на Марс',
  desc: 'Илон сказал, что я ему нужен',
  flag: 0
},
{
  id: 5,
  title: 'Приласкать котенка',
  desc: 'Какой же день без котиков',
  flag: 2
},
]
interface Todo {
  id: number,
  title: string,
  desc: string,
  flag: number,
}

interface State {
  todos: Todo[],
  doneTodos: Todo[],
  futureTodos: Todo[],
}

export default createStore({
  state: (): State => ( {
    todos: todos,
    doneTodos: [],
    futureTodos: [],
  }),
  getters: {
  },
  mutations: {
    addTodo(state: State, todo: Todo) {
      state.todos.push(todo)
    },
    addDoneTodo(state: State, todo: Todo) {
      state.doneTodos.push(todo)
    },
    deleteTodo(state: State, id: number) {
      state.todos = state.todos.filter(item => item.id !== id)
    },
    deleteDoneTodo(state: State, id: number) {
      state.doneTodos = state.doneTodos.filter(item => item.id !== id)
    },
    editTodo(state: State, todo: Todo) {
      state.todos = state.todos.map(item => {
        if (item.id === todo.id) {
          item.title = todo.title
          item.desc = todo.desc
        }
        return item
      })
    },
    editDoneTodo(state: State, todo: Todo) {
      state.doneTodos = state.doneTodos.map(item => {
        if (item.id === todo.id) {
          item.title = todo.title
          item.desc = todo.desc
        }
        return item
      })
    },
    changeFlagTodo(state: State, { id, flag }) {
      state.todos = state.todos.map(item => {
        if (item.id === id) {
          item.flag = flag
        }
        return item
      })
    },
    changeFlagDoneTodo(state: State, { id, flag }) {
      state.doneTodos = state.doneTodos.map(item => {
        if (item.id === id) {
          item.flag = flag
        }
        return item
      })
    },
    sortedTodos(state: State) {
      state.todos = state.todos.sort((todo1, todo2) => todo2.flag - todo1.flag)
    },
    sortedDoneTodos(state: State) {
      state.doneTodos = state.todos.sort((todo1, todo2) => todo2.flag - todo1.flag)
    }
  },
  actions: {
  },
  modules: {
  }
})
