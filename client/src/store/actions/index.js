export const setLogin = (user) => {
    return {
        type : "SET_LOGIN",
        payload: user
    }
}

export const setLogout = (user) => {
    return {
        type : "SET_LOGOUT",
    }
}