import { user } from "@nextui-org/react";

export const getContactos =() =>{
    const json = JSON.parse(sessionStorage.getItem("contactos"))
    const contactos = {};
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            contactos[key] = Object.keys(json[key]).map(Number);
        }
    }
    return contactos;
}
export const getApodos = () => {
    return JSON.parse(sessionStorage.getItem("contactos"))
}

export const getHives = () => {
    return JSON.parse(sessionStorage.getItem("hives"))
}

export const getUsuarios = () => {
    return JSON.parse(sessionStorage.getItem("usuarios"))
}

export const getGrupos = () => {
    return JSON.parse(sessionStorage.getItem("grupos"));
}

export const getGruposPublicosForUser = (userId) => {
    var grupos = getGrupos();
    var gruposPublicos = {};
    for(const id in grupos) {
        var incluyeUsuario = (grupos[id].integrantes).includes(parseInt(userId));
        var esPublico = grupos[id].publico === true;
        if(esPublico && !incluyeUsuario) {
            gruposPublicos[id] = grupos[id];
        }
    }
    return gruposPublicos;
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

export const getDonaciones =() =>{
    return JSON.parse(sessionStorage.getItem("donaciones"))
}

export const getInvitados =() =>{
    return JSON.parse(sessionStorage.getItem("invitados"))
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

export const agregarIntegrante = (userId, grupoId) => {
    let grupos = getGrupos();
    grupos[parseInt(grupoId)].integrantes.push(parseInt(userId));
    sessionStorage.setItem("grupos", JSON.stringify(grupos));
    let hives = getHives();
    hives[parseInt(userId)].push(parseInt(grupoId));
    sessionStorage.setItem("hives", JSON.stringify(hives));
}