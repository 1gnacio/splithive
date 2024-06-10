import React from 'react';
import { useState } from 'react';
import { getGrupos, getDonaciones, getUsuarios, getCurrentUser, agregarIntegrante } from "../utils/utilities"
import {Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, Progress} from '@nextui-org/react';
import inputStyle from "../styles/form.module.css"
import {HeartIcon} from './HeartIcon';

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

    var labelProgreso = (suma < grupo.objetivo) ? "Lleguemos a los " + grupo.objetivo + " pesos!" : "Meta Cumplida!"

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
            <Card className='p-4' style={{background: "black"}}>
                <CardHeader>
                    <h4 className="font-bold text-large" style={{color: "gold"}}>
                        {grupo.nombre}
                    </h4>
                </CardHeader>
                <CardBody>
                    <Tabs aria-label="Options" color="warning" radius="full">
                        <Tab key="info" title="Info">
                            <Card style={{background: "black", borderWidth: "2px", borderColor: "gold"}}>
                                <CardBody>
                                    <Progress size="lg" color="warning" style={{color:"gold"}} label={labelProgreso} value={porcentajeProgreso}/>
                                    {suma >= grupo.objetivo ? (
                                        <p style={{color: "gold"}}>Cumplimos con el objetivo!! Muchas gracias a aquellos que colaboraron!!</p>
                                    ) : (
                                        <p style={{color: "gold"}}>Vamos {suma} pesos! Faltan {grupo.objetivo - suma} para cumplir nuestro objetivo!</p>
                                    )}
                                    <div>
                                        <Button style={{marginBottom: '12px'}} color="warning" onClick={() => {switchFormDonacion()}}>Donar!</Button>
                                        {formDonacion && (
                                            <Card style={{background: "black", borderWidth: "2px", borderColor: "gold"}} className="donacionPopup" id="crearDonacion">
                                                <CardHeader style={{color: 'gold'}}>Ingrese los datos!</CardHeader>
                                                <CardBody>
                                                    <form>
                                                        <label style={{color: 'gold'}}>Monto:</label><br/>
                                                        <input className={inputStyle.formInputStyle} type="number" value={montoDonacion} onChange={handleMonto}/><br/>
                                                        <label style={{color: 'gold'}}>Mensaje:</label><br/>
                                                        <input className={inputStyle.formInputStyle} type="text" value={mensajeDonacion} onChange={handleMensaje}/><br/>
                                                        <Button style={{marginTop: '10px'}} onClick={enviarDonacion} color="warning" type="submit">Enviar donación</Button>
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
                                <p style={{color:"gold"}}>No se han recibido donaciones aún.</p>
                            ) : (
                                grupo.donaciones.map((id, index) =>
                                    <Card key={id} style={{background: "black", borderWidth: "2px", borderColor: "gold", marginBottom: "10px"}}>
                                        <CardBody>
                                            <p style={{color: "gold"}}>Donante: {nombreDonante(id)}</p>
                                            <p style={{color: "gold"}}>Monto: {donaciones[id].monto}</p>
                                            <p style={{color: "gold"}}>Fecha: {donaciones[id].fecha}</p>
                                            <p style={{color: "gold"}}>Mensaje: {(donaciones[id].mensaje != '') ? donaciones[id].mensaje : "No se adjuntó mensaje."}</p>
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
                        isIconOnly color="warning" aria-label="Like" title="Add to my hive" className="btn-grupo unirse-btn">
                            <HeartIcon  />
                        </Button>
                    )}

                    
                </CardFooter>
            </Card>
        </div>
    );
}
