
    export const getContactos =() =>{
            return JSON.parse(sessionStorage.getItem("contactos"))
    }

    export const getHives =() =>{
        return JSON.parse(sessionStorage.getItem("hives"))
    }
    export const getUsuarios =() =>{
        return JSON.parse(sessionStorage.getItem("usuarios"))
    }
    export const getGrupos =() =>{
        return JSON.parse(sessionStorage.getItem("grupos"))
    }
    export const getGastos =() =>{
        return JSON.parse(sessionStorage.getItem("gastos"))
    }

    export const getCurrentUser = () =>{
        return JSON.parse(sessionStorage.getItem("userID"))
    }
