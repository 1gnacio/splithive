import { useEffect, useState } from 'react';
import { Button, Card, Input, Link } from '@nextui-org/react';
import { getGrupos, getHives, getCurrentUser } from "../utils/utilities"
import ImageContainer from '../components/groupsForms/ImageContainer'
import '../styles/global.css'
import '../styles/formGroups.css'

export default function FormularioDivisionDeGastos() {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [grupos, setGrupos] = useState(getGrupos());
    // const [usuarios, setUsuarios] = useState(getUsuarios());
    const [hive_userActual, setHive_userActual] = useState(getHives());
    // const [userContacts, setUserContacts] = useState(getContactos()[currentUser] || [])
    // const [userContactsNames, setUserContactsNames] = useState(userContacts.map(id => usuarios[id]?.nombre || `Usuario ${id}`));
    // const [apodos, setApodos] = useState(getApodos()[currentUser]);

    useEffect(() => {

        document.getElementById("agregarItem").addEventListener("click", function () {
            const nombreItem = document.getElementById("addItem").value;
            var contadorItems = itemsContainer.children.length;
            var campoItem = document.createElement("div");
            campoItem.innerHTML = `<label id="item${contadorItems}">${nombreItem}</label>`;
            itemsContainer.appendChild(campoItem);
        });

        document.getElementById("crearWishListForm").addEventListener("submit", function(event) {
            event.preventDefault();
            
            const nombreGrupo = document.getElementById("nombreGrupo").value;
            if (nombreGrupo === "") {
                alert("Se debe ingresar un nombre.");
                window.location.href = '/home';
                document.getElementById('crearWishListForm').reset();
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

            // for (var i = 0; i < contactosContainer.children.length; i++) {
            //     var id = document.getElementById("nombreContacto" + i).value;
            //     integrantes.push(Number(id));
            //     hives[id].push(maxID + 1);
            // }

            // for (var i = 0; i < integrantesContainer.children.length; i++) {
            //     var id = document.getElementById("nombreIntegrante" + i).value;
            //     integrantes.push(Number(id));
            //     hives[id].push(maxID + 1);
            // }

            var items = {};
            for (var i = 0; i < itemsContainer.children.length; i++) {
                var item = document.getElementById(`item${i}`).textContent;
                var articulo = {nombre: item, comprado: false, costo: 0};
                items[i] = articulo;
            }

            var nuevaWishList = {nombre: nombreGrupo, tipo: "WishList", integrantes: integrantes, articulos: items, publico: true};

            grupos[maxID + 1] = nuevaWishList;

            sessionStorage.setItem('grupos', JSON.stringify(grupos));

            sessionStorage.setItem("hives", JSON.stringify(hives));

            window.location.href = '/home';

            document.getElementById('crearShopListForm').reset();
        });

        
    }, [])

    // function getApodo(id) {
    //     if (!apodos || !apodos.hasOwnProperty(id) || apodos[id] == "") {
    //         return usuarios[id].nombre
    //     }
    //     return apodos[id]
    // }

    function crearGrupo(event) {
        event.preventDefault(); 
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


        var nuevoGrupo = { 
            nombre: nombreGrupo, 
            integrantes: integrantes, 
            tipo: "WishList", 
            gastos: [], 
            publico: true
        };

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

    <form id="crearWishListForm" onSubmit={crearGrupo}>
        
        <ImageContainer rightImageSrc='/public/images/wishList.png'/>

        <div className="form-group">

                <label htmlFor="nombreGrupo" className='form-group-item'>Nombre de la Wish-List:</label>

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


        <div className="form-group">

                <label htmlFor="nombreGrupo" className='form-group-item'>Items:</label>

                <div className="form-group-item flex">

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
                        }} type="text" id="addItem" name="addItem"
                    />

                    <Button className="submitBtn" id="agregarItem" >Agregar</Button>

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