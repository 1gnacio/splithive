import React from "react";
import {Card, CardBody, CardFooter, Image, Link} from "@nextui-org/react";


export default function App() {

  return (
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-2" style={{ margin: "30px"}}>
          {list.map((item, index) => (
            <Card href={item.path} as={Link} style={{ margin: "3px"  }} shadow="sm" key={index} isPressable >
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