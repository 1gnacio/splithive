import React from 'react';
import { useState } from 'react';
import { getGrupos, getDonaciones, getUsuarios, getCurrentUser, agregarIntegrante } from "../utils/utilities"
import {Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, Progress} from '@nextui-org/react';
import inputStyle from "../styles/form.module.css"
import {HeartIcon} from './HeartIcon';
import "../styles/btn.css"


export default function RecaudacionDisplay(props) {
    let [id,setId] = useState(props.id);
    let [grupos, setGrupos] = useState(getGrupos());
    let [grupo, setGrupo] = useState(grupos[id]);
    let [donaciones, setDonaciones] = useState(getDonaciones());
    let [usuarios, setUsuarios] = useState(getUsuarios());

    const user = getCurrentUser();
    const isUserInGroup = (grupo.integrantes).includes(parseInt(user));

    const [formDonacion, setfFormDonacion] = useState(false);

    const switchFormDonacion = () => setfFormDonacion(!formDonacion);

    const [montoDonacion, setMontoDonacion] = useState(0);
    const [mensajeDonacion, setMensajeDonacion] = useState('');

    const handleMonto = (event) => {
        setMontoDonacion(event.target.value);
    }

    const handleMensaje = (event) => {
        setMensajeDonacion(event.target.value);
    }

    var suma = 0;
    grupo.donaciones.map((id, index) =>
        suma += donaciones[id].monto
    )
    var porcentajeProgreso = suma * 100 / grupo.objetivo

    var labelProgreso = (suma < grupo.objetivo) ? "Lleguemos a los $" + grupo.objetivo + '!' : "Meta Cumplida!"

    const nombreDonante = (id) =>{
        if (donaciones[id].donante != -1)  { return usuarios[donaciones[id].donante].nombre}
        else{
            return "Anonimo"
        }
    }
    const enviarDonacion = (e) => {
        e.preventDefault()

        var fecha = new Date()

        var anio = fecha.getFullYear()
        var mes = fecha.getMonth() + 1
        var dia = fecha.getDate()

        var fechaString = dia + '/' + mes + '/' + anio
        
        var usuario;
        if (!user){
            usuario = -1;
        }
        else{
            usuario = user
        }
        var nuevaDonacion = {donante: usuario , fecha: fechaString, monto: Number(montoDonacion), mensaje: mensajeDonacion}

        console.log(nuevaDonacion)

        var maxID = 0
        for (const id in donaciones) {
            if (donaciones.hasOwnProperty(id)) {
                if (Number(id) > Number(maxID)) {
                    maxID = Number(id)
                }
            }
        }

        donaciones[maxID + 1] = nuevaDonacion

        grupo.donaciones.push(maxID + 1)

        sessionStorage.setItem("donaciones", JSON.stringify(donaciones))

        sessionStorage.setItem("grupos", JSON.stringify(grupos))

        window.location.reload()
    }

    const addToHive = (id) => {
        agregarIntegrante(user, id);
        window.location.reload()
      };

    return (
        <div className="p-5">
            <Card className='p-4' style={{background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39"}}>
                <CardHeader>
                    <h4 className="font-bold text-large" style={{color: "black"}}>
                        {grupo.nombre}
                    </h4>
                </CardHeader>
                <CardBody>
                    <Tabs aria-label="Options" variant="underlined" radius="full">
                        <Tab key="info" title="Info">
                            <Card style={{background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39"}}>
                                <CardBody>
                                    <Progress size="lg" color="warning" style={{color:"black"}} label={labelProgreso} value={porcentajeProgreso}/>
                                    {suma >= grupo.objetivo ? (
                                        <p style={{color: "black"}}>Cumplimos con el objetivo!! Muchas gracias a aquellos que colaboraron!!</p>
                                    ) : (
                                        <p style={{color: "black"}}>Vamos ${suma}! Faltan ${grupo.objetivo - suma} para cumplir nuestro objetivo!</p>
                                    )}
                                    <div>
                                        <Button className="submitBtn" style={{marginBottom: '10px', marginTop: '10px'}} color="warning" onClick={() => {switchFormDonacion()}}>Donar!</Button>
                                        {formDonacion && (
                                            <Card style={{background: "#FEFCE8", borderWidth: "1px", borderColor: "#F5A524"}} className="donacionPopup" id="crearDonacion">
                                                <CardHeader style={{color: 'black'}}>Ingrese los datos!</CardHeader>
                                                <CardBody>
                                                    <form>
                                                        <label style={{color: 'black'}}>Monto:</label><br/>
                                                        <input className={inputStyle.formInputStyle} type="number" value={montoDonacion} onChange={handleMonto}/><br/>
                                                        <label style={{color: 'black'}}>Mensaje:</label><br/>
                                                        <input className={inputStyle.formInputStyle} type="text" value={mensajeDonacion} onChange={handleMensaje}/><br/>
                                                        <Button style={{marginTop: '15px'}} onClick={enviarDonacion} color="warning" type="submit">Enviar donación</Button>
                                                    </form>
                                                </CardBody>
                                            </Card>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>  
                        </Tab>
                        <Tab key="donaciones" title="Donaciones">
                            {grupo.donaciones.length === 0 ? (
                                <p style={{color:"#FEFCE8"}}>No se han recibido donaciones aún.</p>
                            ) : (
                                grupo.donaciones.map((id, index) =>
                                    <Card key={id} style={{background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39", marginBottom: "10px"}}>
                                        <CardBody>
                                            <p style={{color: "black"}}>𝗗𝗼𝗻𝗮𝗻𝘁𝗲: {nombreDonante(id)}</p>
                                            <p style={{color: "black"}}>𝗠𝗼𝗻𝘁𝗼: ${donaciones[id].monto}</p>
                                            <p style={{color: "black"}}>𝗙𝗲𝗰𝗵𝗮: {donaciones[id].fecha}</p>
                                            <p style={{color: "black"}}>𝗠𝗲𝗻𝘀𝗮𝗷𝗲: {(donaciones[id].mensaje != '') ? donaciones[id].mensaje : "No se adjuntó mensaje."}</p>
                                        </CardBody>
                                    </Card>
                                )
                            )}
                        </Tab>

                    </Tabs>

                </CardBody>
                <CardFooter>

                    {user && (
                        <Button href='/home' as={Link} color="warning" showAnchorIcon variant="solid">
                            My Hive
                        </Button>
                    )}

                    <Button style={{marginLeft: "10px"}} href='/publico' as={Link} color="warning" showAnchorIcon variant="solid">
                        Mas grupos publicos
                    </Button>

                    {user && !isUserInGroup && (
                        <Button style={{marginLeft: "320px"}} onClick={() => {addToHive(id)}}
                        isIconOnly aria-label="Like" title="Add to my hive" color="warning" className="btn-grupo unirse-btn">
                            <HeartIcon  />
                        </Button>
                    )}

                    
                </CardFooter>
            </Card>
        </div>
    );
}
