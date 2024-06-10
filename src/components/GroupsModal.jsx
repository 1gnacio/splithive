import React from "react";
import {Card, CardBody, CardFooter, Image, Link} from "@nextui-org/react";


export default function App() {

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

  return (
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-2" style={{ margin: "30px" }}>
          {list.map((item, index) => (
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
      </div>
  );
}