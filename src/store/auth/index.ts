import router from "@/router"

let timer:ReturnType<typeof setTimeout>

interface User {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    token: string,
    userId: string,
    refreshToken: string,
}
interface State {
    userId: string,
    token: string,
    email: string,
    firstName: string,
    lastName: string,
    refreshToken: string,
  }
export default {
    state() {
        return {
            userId: null,
            token: null,
            email: null,
            firstName: null,
            lastName: null,
            refreshToken: null,
        }
    },
    getters: {
        userId(state: State) {
            return state.userId
        },
        token(state: State) {
            return state.token
        },
        email(state: State) {
            return state.email
        },
        firstName(state: State) {
            return state.firstName
        },
        lastName(state: State) {
            return state.lastName
        },
    },
    mutations: {
        setUser(state: State, payload: User) {
            state.token = payload.token
            state.userId = payload.userId
            state.email = payload.email
            state.firstName = payload.firstName
            state.lastName = payload.lastName
            state.refreshToken = payload.refreshToken
        },
        setFirstName(state: State, payload: string) {
            state.firstName = payload
        },
        setLastName(state: State, payload: string) {
            state.lastName = payload
        },
        setToken(state: State, payload: string) {
            state.token = payload
        },
        setEmail(state: State, payload: string) {
            state.email = payload
        },
        setResfreshToken(state: State, payload: string) {
            state.refreshToken = payload
        }
    },
    actions: {
        async signup(context: any, payload: User) {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAMWZ8UyOXWzN6t_isBVCWJuStz4AV4aJY', {
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                })
            })

            const responseData = await response.json()

            if (!response.ok) {
                const error = new Error(`${responseData.error.code}: ${responseData.error.message}`)
                throw error
            }

            context.commit('setUser', {
                token: responseData.idToken,
                userId: responseData.localId,
                email: responseData.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                refreshToken: payload.refreshToken,
            });

            context.dispatch('addUser', {
                firstName: payload.firstName,
                lastName: payload.lastName
            })

            context.dispatch('saveUserData')
        },
        async login(context: any, payload: User) {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAMWZ8UyOXWzN6t_isBVCWJuStz4AV4aJY', {
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                })
            })
            
            const responseData = await response.json()

            if (!response.ok) {
                const error = new Error(`${responseData.error.code}: ${responseData.error.message}`)
                throw error
            }

            const expiresIn = +responseData.expiresIn * 1000;
            const expirationDate = new Date().getTime() + expiresIn;

            localStorage.setItem('tokenExpiration', `${expirationDate}`);

            timer = setTimeout(function() {
                context.dispatch('autoLogout');
            }, expiresIn);
          

            await context.dispatch('setUserOnLogin', {
                token: responseData.idToken,
                userId: responseData.localId,
                email: responseData.email,
                refreshToken: responseData.refreshToken,
            })
            
            context.dispatch('saveUserData')
        },
        saveUserData(context: any) {
            localStorage.setItem('firstName', context.state.firstName)
            localStorage.setItem('lastName', context.state.lastName)
            localStorage.setItem('userId', context.state.userId)
            localStorage.setItem('token', context.state.token)
            localStorage.setItem('email', context.state.email)
            localStorage.setItem('refreshToken', context.state.refreshToken)
        },
        autoLogin(context: any) {
            const firstName = localStorage.getItem('firstName')
            const lastName = localStorage.getItem('lastName')
            const userId = localStorage.getItem('userId')
            const token = localStorage.getItem('token')
            const email = localStorage.getItem('email')
            const refreshToken = localStorage.getItem('refreshToken')

            const tokenExpiration = localStorage.getItem('tokenExpiration');

            if (tokenExpiration) {
                const expiresIn = +tokenExpiration - new Date().getTime();

                if (expiresIn < 0) {
                    return;
                }

                timer = setTimeout(function() {
                    context.dispatch('autoLogout');
                }, expiresIn);
            }
          
            if(firstName) {
                context.state.firstName = firstName
                context.state.lastName = lastName
                context.state.userId = userId
                context.state.token = token
                context.state.email = email
                context.state.refreshToken = refreshToken
            }

        },
        logout(context: any) {
            localStorage.removeItem('firstName')
            localStorage.removeItem('lastName')
            localStorage.removeItem('userId')
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            localStorage.removeItem('refreshToken')

            localStorage.removeItem('tokenExpiration');

            clearTimeout(timer);

            context.commit('setUser', {
                token: null,
                userId: null,
                email: null,
                firstName: null,
                lastName: null,
                refreshToken: null,
            })
            router.push('/')
        },
        autoLogout(context: any) {
            context.dispatch('logout');
        },
        async addUser(context: any, payload: User) {

            const userId = context.getters.userId
            let response

            if (!payload.lastName) {
                response = await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        firstName: payload.firstName,
                        lastName: context.state.lastName,
                    })
                })
                const responseData = await response.json()

                if (!response.ok) {
                    const error = new Error(`${responseData.error.code}: ${responseData.error.message}`)
                    throw error
                }

                context.commit('setFirstName', payload.firstName)
                localStorage.setItem('firstName', payload.firstName)
            }
            else if (!payload.firstName) {
                response = await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        firstName: context.state.firstName,
                        lastName: payload.lastName,
                    })
                })

                const responseData = await response.json()

                if (!response.ok) {
                    const error = new Error(`${responseData.error.code}: ${responseData.error.message}`)
                    throw error
                }

                context.commit('setLastName', payload.lastName)
                localStorage.setItem('lastName', payload.lastName)
            }
            else {
                response = await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                    })
                })

                const responseData = await response.json()

                if (!response.ok) {
                    const error = new Error(`${responseData.error.code}: ${responseData.error.message}`)
                    throw error
                }
            }


        },
        async setUserOnLogin(context: any, payload: User) {

            const response = await fetch(`https://todo-f6773-default-rtdb.europe-west1.firebasedatabase.app/users/${payload.userId}.json`)

            const responseData = await response.json()

            if (!response.ok) {
                const error = new Error(`${responseData.error.code}: ${responseData.error.message}`)
                throw error
            }

            context.commit('setUser', {
                token: payload.token,
                userId: payload.userId,
                email: payload.email,
                refreshToken: payload.refreshToken,
                firstName: responseData.firstName,
                lastName: responseData.lastName,
            })
            
        },
        async changeEmail(context: any, email: string) {
            try {
                await context.dispatch('refreshToken')

                const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAMWZ8UyOXWzN6t_isBVCWJuStz4AV4aJY', {
                    method: 'POST',
                    body: JSON.stringify({
                        idToken: context.getters.token,
                        email: email,
                        returnSecureToken: true,
                    })
                })

                const responseData = await response.json()

                if (!response.ok) {
                    const error = new Error(`${responseData.error.code}: ${responseData.error.message}`)
                    throw error
                }

                context.commit('setToken', responseData.idToken)
                context.commit('setEmail', responseData.email)

                context.commit('setResfreshToken', responseData.refreshToken)
                localStorage.setItem('refreshToken', responseData.refreshToken)
                
                localStorage.setItem('email', responseData.email)
                localStorage.setItem('token', responseData.idToken)
            }
            catch (error) {
                alert(error)
            }
            

        },
        async changePassword(context: any, password: string) {
            try {
                await context.dispatch('refreshToken')

                const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAMWZ8UyOXWzN6t_isBVCWJuStz4AV4aJY', {
                    method: 'POST',
                    body: JSON.stringify({
                        idToken: context.getters.token,
                        password: password,
                        returnSecureToken: true,
                    })
                })
    
                const responseData = await response.json()
    
                if (!response.ok) {
                    const error = new Error(`${responseData.error.code}: ${responseData.error.message}`)
                    throw error
                }
    
                context.commit('setToken', responseData.idToken)
                localStorage.setItem('token', responseData.idToken)
                context.commit('setResfreshToken', responseData.refreshToken)
                localStorage.setItem('refreshToken', responseData.refreshToken)
            }
            catch (error) {
                alert(error)
            }
        },
        async refreshToken(context: any) {
            const response = await fetch('https://securetoken.googleapis.com/v1/token?key=AIzaSyAMWZ8UyOXWzN6t_isBVCWJuStz4AV4aJY', {
                method: 'POST',
                body: JSON.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: context.state.refreshToken
                })
            })

            const responseData = await response.json()

            if (!response.ok) {
                const error = new Error(`${responseData.error.code}: ${responseData.error.message}`)
                throw error
            }
            
            context.commit('setToken', responseData.id_token)
            localStorage.setItem('token', responseData.id_token)
            context.commit('setResfreshToken', responseData.refresh_token)
            localStorage.setItem('refreshToken', responseData.refresh_token)
        }
    }
}