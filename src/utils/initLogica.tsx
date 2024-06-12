import {gastos} from "../../public/gastos.astro"
import {contactos} from "../../public/contactos.astro"
import {grupos} from "../../public/grupos.astro"
import {hives} from "../../public/hives.astro"
import {usuarios} from "../../public/usuarios.astro"
import {donaciones} from "../../public/donaciones.astro"
import {invitados} from "../../public/invitados.astro"
import {wishes} from "../../public/wishes.astro"

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

    if (!sessionStorage.getItem('donaciones')) {
        sessionStorage.setItem('donaciones', JSON.stringify(donaciones));
    }

    if (!sessionStorage.getItem('invitados')) {
        sessionStorage.setItem('invitados', JSON.stringify(invitados));
    }
    if (!sessionStorage.getItem('wishes')){
        sessionStorage.setItem('wishes', JSON.stringify(wishes));
    }
}
