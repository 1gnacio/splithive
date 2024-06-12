import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue } from "@nextui-org/react";
import { wishes as wishesObject } from "../../public/wishes.astro";
import { getGrupos, getUsuarios, getCurrentUser, agregarIntegrante } from "../utils/utilities";

// Convert the wishes object to an array
const wishes = Object.keys(wishesObject).map(key => ({ id: Number(key), ...wishesObject[key] }));

export default function App(props) {
  const [id, setId] = useState(props.id);
  const [grupos, setGrupos] = useState(getGrupos());
  const [grupo, setGrupo] = useState(grupos[id]);
  const [usuarios, setUsuarios] = useState(getUsuarios());

  const user = getCurrentUser();

  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  // Filter wishes based on grupo.deseos
  const filteredWishes = wishes.filter(wish => grupo.deseos.includes(wish.id));

  const pages = Math.ceil(filteredWishes.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredWishes.slice(start, end);
  }, [page, filteredWishes]);

  return (
    <div>
      <Table removeWrapper
        aria-label="Example table with client side pagination"
        bottomContent={
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
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "link" ? (
                    <a href={item[columnKey]} target="_blank" rel="noopener noreferrer" className="link-style">
                      Más detalles
                    </a>
                  ) : columnKey === "comprado" ? (
                    item[columnKey] === false ? "Pendiente" : "Cumplido 🖤"
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
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
