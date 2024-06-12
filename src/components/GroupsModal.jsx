import React, { useState } from "react";
import {Card, CardBody, CardFooter, Image, Link, Button} from "@nextui-org/react";
import groups from "../styles/groups.module.css"

export default function GroupsModal() {
  let [ayuda, setAyuda] = useState(false)
  const list = [
    {
      title: "Division de gastos",
      img: "/images/gastos.png",
      path: "formGrupos/formA",
    },
    {
      title: "Wish-List",
      img: "/images/wishList.png",
      path: "formGrupos/formB",
    },
    {
      title: "Recaudación",
      img: "/images/recaudacion.png",
      path: "formGrupos/formC",
    },
    {
      title: "Lista de compras",
      img: "/images/listaDeCompras.png",
      path: "formGrupos/formD",
    },
  ];

  const explanation = [
    {
      title:"Division de gastos",
      exp: "La aplicación dividirá los gastos de tu grupo",
      path: "formGrupos/formA",
    },
    {
      title: "Wish-List",
      exp: "Elije cosas que te gustaria comprar y que otros lo compren por vos!",
      path: "formGrupos/formB",
    },
    {
      title:"Recaudación",
      exp: "Nececistas ayuda financiera? Este es el grupo indicado",
      path: "formGrupos/formC",
    },
    {
      title:"Lista de compras",
      exp:"Necesitan organizar un asasdo? Lista de compras del super?",
      path: "formGrupos/formD",
    },
  ]

  function handleAyuda(){
    setAyuda(!ayuda)
  }

  return (
    <>
    <Image className={groups.image} width={"30px"} src={"/images/question_mark.png"} onClick={handleAyuda}></Image>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-2" style={{ margin: "30px" }}>
          {!ayuda && list.map((item, index) => (
            <Card href={item.path} as={Link} style={{ margin: "3px"}} shadow="md" key={index} isPressable >

              <CardBody className="overflow-visible flex justify-center items-center">
                <img 
                src= {item.img}
                shadow="sm"
                radius="lg"
                width="100px"
                height="auto"
                alt={item.title}
                className="w-full object-cover "
                />
              </CardBody>

              <CardFooter className="text-small flex justify-center items-center" >
                <b>{item.title}</b>
              </CardFooter>

            </Card>
          ))}
          {ayuda && 
          explanation.map((item,index) =>{
            return(
            <Card href={item.path}as={Link} style={{ margin: "3px"}} shadow="md" key={index} isPressable >

            <CardBody className={groups.textoInfo}>
              {item.exp}
            </CardBody>

            <CardFooter className="text-small flex justify-center items-center" >
              <b>{item.title}</b>
            </CardFooter>

          </Card>
          )})}
      </div>
      </>
  );
}