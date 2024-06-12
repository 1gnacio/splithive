import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, Button } from "@nextui-org/react";
import { wishes as wishesObject } from "../../public/wishes.astro";
import { getGrupos, getUsuarios, getCurrentUser, agregarIntegrante,getWishes } from "../utils/utilities";

// Convert the wishes object to an array

export default function App(props) {
  const [id, setId] = useState(props.id);
  const [grupos, setGrupos] = useState(getGrupos());
  const [grupo, setGrupo] = useState(grupos[id]);
  const [usuarios, setUsuarios] = useState(getUsuarios());
  const [wishes,setWishes] = [props.wishes,props.setWishes]

  const user = getCurrentUser();

  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  // Filter wishes based on grupo.deseos
  const filteredWishes = grupo.deseos
  const pages = Math.ceil(filteredWishes.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredWishes.slice(start, end);
  }, [page, filteredWishes]);


  const handlePurchase = (item) =>{
    wishes[item].comprado = true
    setWishes({
      ...wishes,
      [item]:wishes[item]
    })
    sessionStorage.setItem('wishes', JSON.stringify(wishes))
  }

  return (
    <div>
      <Table removeWrapper
        aria-label="Example table with client side pagination"
        bottomContent={
          <>
          <div className="flex justify-center" style={{ marginBottom: "10px" }}>
            <Pagination
              isCompact
              showControls
              color="warning"
              variant="light"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
          </>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="nombre">NOMBRE</TableColumn>
          <TableColumn key="link">LINK</TableColumn>
          <TableColumn key="comprado">ESTADO</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {items.map(item =>{
            return(
            <TableRow key={item}>
              <TableCell>
                {wishes[item].nombre}
              </TableCell>
              <TableCell>
              <a href={wishes[item].link} target="_blank" rel="noopener noreferrer" className="link-style">
                      Más detalles
                    </a>
              </TableCell>
              <TableCell>
                {!wishes[item].comprado ? (
                    <Button 
                      onClick={(e) => handlePurchase(item)} 
                      style={{width: "fit-content"}} 
                      color="warning" 
                      variant="flat"
                    >
                        Cumplir el deseo
                    </Button>
                ) : (
                  "🧡 Cumplido"
                )}
            </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
      <style jsx>{`
        .link-style {
          color: orange;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
