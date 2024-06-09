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
            campoItem.innerHTML = `<label id="item${contadorItems}"> ● ${nombreItem}</label>`;
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

    return <><Card classNameName='p-4'>
            <form id="crearShopListForm">
                <ImageContainer rightImageSrc='/public/images/listaDeCompras.png'/>

                <div className="form-group">

                    <div className="form-group-item item-nombre-grupo">
                        
                        <label htmlFor="nombreGrupo">Nombre del grupo:</label>

                        <Input
                            className='form-group-item'
                            classNames={{
                            label: ["text-black/50 dark:text-white/90"],
                            input: [
                                "bg-yellow-300",
                                "text-black/90 dark:text-white/90"
                            ],
                            innerWrapper: "bg-yellow-300",
                            inputWrapper: [
                                "shadow-md",
                                "!bg-yellow-300",
                                "dark:bg-blue-500/60",
                                "backdrop-blur-xl",
                                "backdrop-yellow-300",
                                "hover:bg-yellow-300",
                                "dark:hover:bg-default/70",
                                "group-data-[focus=false]:bg-yellow-200/50",
                                "dark:group-data-[focus=false]:bg-default/60",
                                "!cursor-text",
                            ],
                            }} type="text" id="nombreGrupo" name="nombreGrupo"
                        />

                    </div>
                </div>

                <div className="form-group">
                    <label className="form-group-item">Integrantes:</label>
                

                    <div className="form-group-item">

                        <Input classNames={{
                                label: ["text-black/50 dark:text-white/90"],
                                input: [ 
                                    "bg-yellow-300",
                                    "text-black/90 dark:text-white/90"
                                ],
                                innerWrapper: "bg-yellow-300",
                                inputWrapper: [
                                    "shadow-md",
                                    "!bg-yellow-300",
                                    "dark:bg-blue-500/60",
                                    "backdrop-blur-xl",
                                    "backdrop-yellow-300",
                                    "hover:bg-yellow-300",
                                    "dark:hover:bg-default/70",
                                    "group-data-[focus=false]:bg-yellow-200/50",
                                    "dark:group-data-[focus=false]:bg-default/60",
                                    "!cursor-text",
                                ],
                                }} disabled color='warning' id="nombreIntegrante1" name="nombreIntegrante1" value={usuarios[currentUser].nombre + " (Yo)"}></Input>
                    </div>

                    <div id="contactosContainer" className="form-group-item">
                    </div>

                    <div id="integrantesContainer" className="form-group-item"></div>

                    <div className="form-group-item">
                        <button type="button" id="agregarIntegranteBtn">+</button>
                    </div>  

                    <div className="form-group-item flex searchContainer">

                        <Input
                                classNames={{
                                label: ["text-black/50 dark:text-white/90"],
                                input: [
                                    "bg-yellow-300",
                                    "text-black/90 dark:text-white/90"
                                ],
                                innerWrapper: "bg-yellow-300",
                                inputWrapper: [
                                    "shadow-md",
                                    "!bg-yellow-300",
                                    "dark:bg-blue-500/60",
                                    "backdrop-blur-xl",
                                    "backdrop-yellow-300",
                                    "hover:bg-yellow-300",
                                    "dark:hover:bg-default/70",
                                    "group-data-[focus=false]:bg-yellow-200/50",
                                    "dark:group-data-[focus=false]:bg-default/60",
                                    "!cursor-text",
                                ],
                                }} id="searchUsername" name="searchUsername"placeholder="Nombre de usuario fuera de mi colmena"
                        />

                        <Button className="submitBtn" id="executeSearch" color="warning" >Agregar</Button>

                    </div>

                </div>

                <div className="form-group">

                    <label className="form-group-item" style={{marginBottom: '5px'}}>Artículos:</label>

                    <div className="form-group-item flex searchContainer">
                        <Input classNames={{
                                label: ["text-black/50 dark:text-white/90"],
                                input: [
                                    "bg-yellow-300",
                                    "text-black/90 dark:text-white/90"
                                ],
                                innerWrapper: "bg-yellow-300",
                                inputWrapper: [
                                    "shadow-md",
                                    "!bg-yellow-300",
                                    "dark:bg-blue-500/60",
                                    "backdrop-blur-xl",
                                    "backdrop-yellow-300",
                                    "hover:bg-yellow-300",
                                    "dark:hover:bg-default/70",
                                    "group-data-[focus=false]:bg-yellow-200/50",
                                    "dark:group-data-[focus=false]:bg-default/60",
                                    "!cursor-text",
                                ],
                                }} id="addItem" name="addItem" placeholder="Nombre del artículo"/>
                    
                        <Button className="submitBtn" id="agregarItem" >Agregar artículo</Button>
                    </div>

                    <div id="itemsContainer" className="form-group"></div>

                </div>

                <div style={{margin: "20px", display: "flex", gap: "5px"}} >
                    <Button className="submitBtn font-semibold fs-5" type="submit">Crear</Button>
                    <Button as={Link} className="cancelarBtn font-semibold fs-5" href='/home'>Cancelar</Button>
                </div>

            </form>
            </Card></>
}
