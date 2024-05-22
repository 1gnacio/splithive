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

export const getCurrentUser =() =>{
    return JSON.parse(sessionStorage.getItem("userID"))
}

export const getSaldos =() =>{
    var metaSaldos = JSON.parse(sessionStorage.getItem("saldos"))
    return metaSaldos ? metaSaldos : {}
}

export const getUserByUsername = (username) => {
    const usuarios = getUsuarios();
    for(const id in usuarios) {
        if(usuarios[id].usuario === username) {
            return {
                ...usuarios[id],
                id: id
            };
        }
    }
    return null;
}
