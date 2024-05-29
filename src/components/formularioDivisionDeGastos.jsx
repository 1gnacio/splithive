import { useEffect, useState } from 'react';
import { contactos } from '../../public/contactos.astro';
import { Button, Card, Input, Link, Select, SelectItem,  } from '@nextui-org/react';
import { getHives, getUserByUsername, getUsuarios, getGrupos, getCurrentUser, getInvitados } from "../utils/utilities"
import ImageContainer from '../components/groupsForms/ImageContainer'
import '../styles/global.css'
import '../styles/formGroups.css'

export default function FormularioDivisionDeGastos() {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [grupos, setGrupos] = useState(getGrupos());
    const [usuarios, setUsuarios] = useState(getUsuarios());
    const [hive_userActual, setHive_userActual] = useState(getHives());
    const [userContacts, setUserContacts] = useState(contactos[currentUser] || [])
    const [userContactsNames, setUserContactsNames] = useState(userContacts.map(id => usuarios[id]?.nombre || `Usuario ${id}`));
    const [invitados, setInvitados] = useState([])
    const [invitadosTodos, setInvitadosTodos] = useState(getInvitados())
    const [nombreInvitado, setNombreInvitado] = useState("");

    useEffect(() => {
        document.getElementById('agregarIntegranteBtn').addEventListener('click', function() {
            var integrantesContainer = document.getElementById('integrantesContainer');
            var contadorIntegrantes = integrantesContainer.children.length + 2;
            var nuevoCampoIntegrante = document.createElement('div');
            var contactosDisponibles = userContactsNames.filter(name => {
                // Comprobar si el contacto ya ha sido seleccionado
                return ![...integrantesContainer.querySelectorAll('select')].some(select => select.value === name);
            });

            nuevoCampoIntegrante.innerHTML = `
            <select id="nombreIntegrante${contadorIntegrantes}" name="nombreIntegrante${contadorIntegrantes}" className="custom-select">
                <option value="">Selecciona un integrante</option>
                ${contactosDisponibles.map(name => `<option value="${name}">${name}</option>`).join('')}
            </select>`;
            integrantesContainer.appendChild(nuevoCampoIntegrante);
        });

        document.getElementById('executeSearch').addEventListener('click', function() {
            const username = document.getElementById('searchUsername').value;
            const user = getUserByUsername(username);
            console.log("User: ", user);
            if (user) {
                var contadorIntegrantes = integrantesContainer.children.length + 2;
                var nuevoCampoIntegrante = document.createElement('div');
                nuevoCampoIntegrante.innerHTML = `
                    <select disabled id="nombreIntegrante${contadorIntegrantes}" name="nombreIntegrante${contadorIntegrantes}" className="custom-select added-user">
                        <option selected value="${user.usuario}">${user.usuario}</option>
                    </select>`;
                integrantesContainer.appendChild(nuevoCampoIntegrante);
                document.getElementById('searchUsername').value = "";
            } else {
                alert('El usuario no existe');
            }
        });

        var userContactsMap = {};
        userContacts.forEach(id => {
            var nombre = usuarios[id]?.nombre || `Usuario ${id}`;
            userContactsMap[nombre] = id;
        });
    }, [])

    function crearGrupo(event) {
        event.preventDefault(); 
        var integrantesContainer = document.getElementById('integrantesContainer');
        var nombreGrupo = document.getElementById('nombreGrupo').value;
        var integrantes = [];
        integrantes.push(currentUser)
        var maximo = 0;
        for (const key in grupos){
            if (grupos.hasOwnProperty(key)){
                if (Number(key) > Number(maximo)){
                    maximo = Number(key);
                }
            }
        }
        
        hive_userActual[currentUser].push(maximo+1)
        for (var i = 2; i <= integrantesContainer.children.length + 1; i++) {
            console.log(`nombreIntegrante${i}`)
            var nombreIntegrante = document.getElementById(`nombreIntegrante${i}`).value;
            var id_integrante = userContactsMap[nombreIntegrante]; 
            if (id_integrante != null) {
                integrantes.push(Number(id_integrante));
                hive_userActual[id_integrante].push(maximo+1);
            } 
            // Agrego no contacto al grupo
            else {
                let user = getUserByUsername(nombreIntegrante);
                integrantes.push(Number(user.id));
                hive_userActual[user.id].push(maximo+1);
            }
        }

        var nuevoGrupo = { nombre: nombreGrupo, integrantes: integrantes, tipo: "gastos", gastos: [] };

        if (invitados.length > 0) {
            const count = Object.keys(invitadosTodos).length
            const nuevoInvitados = {...invitadosTodos};

            invitados.forEach((e, index) => {
                nuevoInvitados[count + index] = e
            });

            nuevoGrupo.invitados = invitados.map((e, index) => index + count)

            sessionStorage.setItem('invitados', JSON.stringify(nuevoInvitados))
        }

        grupos[maximo+1] = nuevoGrupo;
        sessionStorage.setItem('grupos', JSON.stringify(grupos));

        sessionStorage.setItem("hives", JSON.stringify(hive_userActual));


        function actualizarListaGrupos() {
            var contenedorGrupos = document.getElementById('grupos');
            contenedorGrupos.innerHTML = ''; 

            hive_userActual[currentUser].forEach(i => {
                var grupo = grupos[i];
                console.log(grupo)
                var grupoElemento = document.createElement('div');

                var cantidadIntegrantes = grupo.integrantes.length + (grupo.invitados?.length ?? 0);
                grupoElemento.innerHTML = '<h2>' + grupo.nombre + '</h2><p>Cantidad de integrantes: ' + cantidadIntegrantes + '</p>';

                var enlaceDetalle = document.createElement('a');
                enlaceDetalle.classNameList.add('grupo-card');
                enlaceDetalle.href = 'grupos/' + (i);
                
                enlaceDetalle.appendChild(grupoElemento);
                contenedorGrupos.appendChild(enlaceDetalle);
            });
        }

        window.location.href = '/home';

        actualizarListaGrupos();

        document.getElementById('crearGrupoFormulario').reset();
        document.getElementById('integrantesContainer').innerHTML = '';
    }

    return <><Card classNameName='p-4'>

    <form id="crearGrupoFormulario" onSubmit={crearGrupo}>

        
        <ImageContainer rightImageSrc='/public/images/gastos.png'/>
                    
        <div className="form-group">
            <label htmlFor="nombreGrupo">Nombre del grupo:</label>
            <input type="text" id="nombreGrupo" name="nombreGrupo" className="input-field" />
        </div>

        <div id="containerIntegrante1" className="form-group">
            <label htmlFor="nombreIntegrante1">Integrantes:</label>
            <div className="searchContainer">
                <Input endContent={<Button id="executeSearch" color='warning'>Agregar</Button>} id="searchUsername" name="searchUsername" label="Ingresar nombre de usuario" color='warning' />
            </div>
        </div>

        <div>
            <Input disabled color='warning' id="nombreIntegrante1" name="nombreIntegrante1" value={usuarios[currentUser].nombre + " (Yo)"}></Input>
        </div>

        <div id="integrantesContainer">
        </div>

        <div className="form-group">
            <button type="button" id="agregarIntegranteBtn">+</button>
        </div>

        <div className="form-group">
            <label>Invitados:</label>
            <div className="searchContainer">
                <Input endContent={<Button className="submitBtn" onClick={() => {
                    if (invitados.some(x => x.nombre == nombreInvitado)) {
                        alert("Ya existe un invitado con ese nombre")
                    } else {
                        const nuevoInvitados = [ ...invitados ];
                        nuevoInvitados.push({ nombre: nombreInvitado });
                        setInvitados(nuevoInvitados)
                        console.log(nuevoInvitados);
                    }
                }}>Agregar</Button>} label="Nombre del invitado" value={nombreInvitado} onValueChange={setNombreInvitado} color='warning' />
                
            </div>
        </div>

        <div id='invitadosContainer'>
            {invitados.map((x, index) => {
                return <Input key={index} disabled value={x.nombre} color='warning'></Input>
            })}
        </div>

        <div style={{marginTop: "60px"}}>
            <Button className="submitBtn font-semibold fs-5" type="submit">Crear</Button>
            <Button as={Link} className="cancelarBtn font-semibold fs-5" href='/home'>Cancelar</Button>
        </div>
    </form>
</Card></>
}