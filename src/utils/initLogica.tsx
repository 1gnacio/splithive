import {gastos} from "../../public/gastos.astro"
import {contactos} from "../../public/contactos.astro"
import {grupos} from "../../public/grupos.astro"
import {hives} from "../../public/hives.astro"
import {usuarios} from "../../public/usuarios.astro"


export default function cargarDatos(){
    if (!sessionStorage.getItem('grupos')) {
        sessionStorage.setItem('grupos', JSON.stringify(grupos));
    } 

    if (!sessionStorage.getItem('hives')) {
        sessionStorage.setItem('hives', JSON.stringify(hives));
    }

    if (!sessionStorage.getItem('gastos')) {
        sessionStorage.setItem('gastos', JSON.stringify(gastos));
    }

    if (!sessionStorage.getItem('usuarios')) {
        sessionStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    if (!sessionStorage.getItem('contactos')) {
        sessionStorage.setItem('contactos', JSON.stringify(contactos));
    }
}
