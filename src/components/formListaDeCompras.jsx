import ImageContainer from '../components/groupsForms/ImageContainer'
import { useEffect, useState } from 'react';
import { Button, Card, Input, Link } from '@nextui-org/react';
import { getContactos, getApodos, getUserByUsername, getUsuarios, getGrupos, getGastos, getHives, getCurrentUser } from "../utils/utilities"
import '../styles/global.css'
import '../styles/formGroups.css'

export default function FormListaDeCompras(props) {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [usuarios, setUsuarios] = useState(getUsuarios());
    const [userContacts, setUserContacts] = useState(getContactos()[currentUser] || [])
    const [apodos, setApodos] = useState(getApodos()[currentUser]);
    var [grupos, setGrupos] = useState(getGrupos());

    function getApodo(id) {
        if (!apodos || !apodos.hasOwnProperty(id) || apodos[id] == "") {
            return usuarios[id].nombre
        }
        return apodos[id]
    }

    useEffect(() => {
        document.getElementById('agregarIntegranteBtn').addEventListener('click', function() {
            var contadorIntegrantes = contactosContainer.children.length;
            var nuevoCampoIntegrante = document.createElement('div');
            var contactosDisponibles = userContacts.filter(name => {
                // Comprobar si el contacto ya ha sido seleccionado
                var val= ![...contactosContainer.querySelectorAll('select')].some(select => {
                    console.log(select.selectedIndex)
                    return select[select.selectedIndex].value == name
                });
                return val
            });
            
            nuevoCampoIntegrante.innerHTML = `
            <select id="nombreContacto${contadorIntegrantes}" name="nombreContacto${contadorIntegrantes}" class="custom-select">
                <option value="" label="Selecciona un integrante">Selecciona un integrante</option>
                ${contactosDisponibles.map(id => `<option value="${id}">${getApodo(id)}</option>`).join('')}
            </select>`;
            contactosContainer.appendChild(nuevoCampoIntegrante);
            console.log(contadorIntegrantes);
        });

        document.getElementById('executeSearch').addEventListener('click', function() {
            const username = document.getElementById('searchUsername').value;
            const user = getUserByUsername(username);
            if (user) {
                var contadorIntegrantes = integrantesContainer.children.length;
                var nuevoCampoIntegrante = document.createElement('div');
                nuevoCampoIntegrante.innerHTML = `
                    <select disabled id="nombreIntegrante${contadorIntegrantes}" name="nombreIntegrante${contadorIntegrantes}" class="custom-select added-user">
                        <option selected value="${user.id}">${user.usuario}</option>
                    </select>`;
                integrantesContainer.appendChild(nuevoCampoIntegrante);
                document.getElementById('searchUsername').value = "";
                console.log(contadorIntegrantes);
            } else {
                alert('El usuario no existe');
            }
        });

        document.getElementById("agregarItem").addEventListener("click", function () {
            const nombreItem = document.getElementById("addItem").value;
            var contadorItems = itemsContainer.children.length;
            var campoItem = document.createElement("div");
            campoItem.innerHTML = `<label id="item${contadorItems}">${nombreItem}</label>`;
            itemsContainer.appendChild(campoItem);
        });

        document.getElementById("crearShopListForm").addEventListener("submit", function(event) {
            event.preventDefault();
            
            const nombreGrupo = document.getElementById("nombreGrupo").value;
            if (nombreGrupo === "") {
                alert("Se debe ingresar un nombre.");
                window.location.href = '/home';
                document.getElementById('crearShopListForm').reset();
                return;
            }

            var hives = getHives();

            var maxID = 0;
            for (const id in grupos) {
                if (grupos.hasOwnProperty(id)){
                    if (Number(id) > Number(maxID)){
                        maxID = Number(id);
                    }
                }
            }

            var integrantes = [];
            integrantes.push(currentUser);
            hives[currentUser].push(maxID + 1);

            for (var i = 0; i < contactosContainer.children.length; i++) {
                var id = document.getElementById("nombreContacto" + i).value;
                integrantes.push(Number(id));
                hives[id].push(maxID + 1);
            }

            for (var i = 0; i < integrantesContainer.children.length; i++) {
                var id = document.getElementById("nombreIntegrante" + i).value;
                integrantes.push(Number(id));
                hives[id].push(maxID + 1);
            }

            var items = {};
            for (var i = 0; i < itemsContainer.children.length; i++) {
                var item = document.getElementById(`item${i}`).textContent;
                var articulo = {nombre: item, comprado: false, costo: 0};
                items[i] = articulo;
            }

            var nuevaListaCompras = {nombre: nombreGrupo, tipo: "compras", integrantes: integrantes, articulos: items, publico: false};

            grupos[maxID + 1] = nuevaListaCompras;

            sessionStorage.setItem('grupos', JSON.stringify(grupos));

            sessionStorage.setItem("hives", JSON.stringify(hives));

            window.location.href = '/home';

            document.getElementById('crearShopListForm').reset();
        });
    })

    return (
        <Card className='p-4'>
            <form id="crearShopListForm">
                <ImageContainer rightImageSrc='/public/images/listaDeCompras.png'/>

                <div className="form-group flex-row">
                    <div className="form-group-item item-nombre-grupo">
                        <label htmlFor="nombreGrupo">Nombre del grupo:</label>
                        <input type="text" id="nombreGrupo" name="nombreGrupo" className="input-field" />
                    </div>
                </div>

                <div className="form-group">
                    <label>Integrantes:</label>
                </div>

                <div className="form-group">
                    <Input disabled color='warning' value={usuarios[currentUser].nombre + " (Yo)"}></Input>
                </div>

                <div className="form-group">
                    <button type="button" id="agregarIntegranteBtn">+</button>
                </div>

                <div id="contactosContainer" className="form-group"></div>

                <div className="form-group">
                    <Input endContent={<Button id="executeSearch" color='warning'>Agregar usuario</Button>} id="searchUsername" name="searchUsername" label="Nombre de usuario fuera de mi colmena" color='warning' />
                </div>

                <div id="integrantesContainer" className="form-group"></div>

                <div className="form-group">
                    <label style={{marginBottom: '5px'}}>Artículos:</label>
                    <div className="searchContainer">
                        <Input endContent={<Button id="agregarItem" color='warning'>Agregar artículo</Button>} id="addItem" name="addItem" label="Nombre del artículo" color='warning' />
                    </div>
                </div>

                <div id="itemsContainer" className="form-group"></div>

                <div style={{margin: "20px"}}>
                    <Button className="submitBtn font-semibold fs-5" type="submit">Crear</Button>
                    <Button style={{marginLeft: '10px'}} as={Link} className="cancelarBtn font-semibold fs-5" href='/home'>Cancelar</Button>
                </div>
            </form>
        </Card>
    )
}
