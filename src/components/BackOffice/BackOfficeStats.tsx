import { useEffect, useState } from "react";
import { Pie, PieChart, Cell, Legend } from "recharts";
import "./BackOfficeStats.css";
import { officeDetail, officeDetailTable } from "../../services/http";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { Link } from "react-router-dom";
interface pieChunk {
  key: string;
  value: number;
}
interface propertyMap {
  builtin_index_bytes: number;
  builtin_index_count: number;
  bytes: number;
  composite_index_bytes: number;
  composite_index_count: number;
  count: number;
  entity_bytes: number;
  kind_name?: string;
}
const COLORS = ["#5297de", "lightgrey", "gold", "orangered"];
function BackOfficeStats() {
  const [dataUsers, setDataUsers] = useState<pieChunk[]>([]);
  const [dataMarkers, setDataMarkers] = useState<pieChunk[]>([]);
  const [tableContent, setTableContent] = useState<propertyMap[]>([]);
  useEffect(() => {
    officeDetailTable().then(
      (response) => {
        let array = response.data.map((i: any) => {
          return i.propertyMap;
        });
        setTableContent(array);
      },
      (error) => {
      }
    );
    officeDetail().then(
      (response) => {
        setDataUsers([
          { key: "Administradores", value: response.data.roleAdmin },
          { key: "Moderadores", value: response.data.roleMod },
          { key: "Parceiros", value: response.data.rolePartner },
          { key: "Utilizadores", value: response.data.roleUser },
        ]);
        setDataMarkers([
          { key: "Ações", value: response.data.action },
          { key: "Ofertas", value: response.data.offer },
          { key: "Doações", value: response.data.donate },
          { key: "Pedidos", value: response.data.request },
        ]);
      },
      (error) => {
      }
    );
  }, []);

  return (
    <>
      <div className="pie-charts-wrapper">
        {dataUsers.length > 0 && (
          <PieChart width={500} height={500}>
            <Pie
              data={dataUsers}
              cx={250}
              cy={250}
              outerRadius={200}
              dataKey="value"
              nameKey="key"
              label
            >
              {dataUsers.map((entry: pieChunk, index: number) => (
                <Cell
                  key={`Cell-value-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        )}
        {dataMarkers.length > 0 && (
          <PieChart width={500} height={500}>
            <Pie
              data={dataMarkers}
              cx={250}
              cy={250}
              outerRadius={200}
              dataKey="value"
              nameKey="key"
              label
            >
              {dataMarkers.map((entry: pieChunk, index: number) => (
                <Cell
                  key={`Cell-value-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Legend layout="horizontal" align="center" />
          </PieChart>
        )}
        {dataUsers.length > 0 && (
          <p className="script">
            No 1º gráfico circular podemos ver a distribuição de roles dos
            utilizadores. Temos {dataUsers[3].value} utilizadores,{" "}
            {dataUsers[1].value} moderadores, {dataUsers[2].value} parceiros e{" "}
            {dataUsers[0].value} administradores.
          </p>
        )}
        {dataMarkers.length > 0 && (
          <p className="script">
            No 2º gráfico circular podemos ver a distribuição de eventos. Há{" "}
            {dataMarkers[3].value} pedidos, {dataMarkers[1].value} ofertas,{" "}
            {dataMarkers[2].value} doações e {dataMarkers[0].value} ações.
          </p>
        )}
      </div>
      <div className="back-office-table-wrapper">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow className="table-header-footer">
                <TableCell>Kind Name</TableCell>
                <TableCell>Builtin Index Bytes</TableCell>
                <TableCell>Builtin Index Count</TableCell>
                <TableCell>Bytes</TableCell>
                <TableCell>Composite Index Bytes</TableCell>
                <TableCell>Composite Index Count</TableCell>
                <TableCell>Entity Bytes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableContent.map((row: propertyMap, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {" "}
                    {row.kind_name === "Users" ? (
                      <Link to={`/backoffice/utilizadores`}>
                        {row.kind_name}
                      </Link>
                    ) : row.kind_name === "Marker" ? (
                      <Link to={`/backoffice/pedidos`}>{row.kind_name}</Link>
                    ) : row.kind_name ? (
                      row.kind_name
                    ) : (
                      "Total"
                    )}
                  </TableCell>
                  <TableCell> {row.builtin_index_bytes}</TableCell>
                  <TableCell>{row.builtin_index_count}</TableCell>
                  <TableCell>{row.bytes}</TableCell>
                  <TableCell>{row.composite_index_bytes}</TableCell>
                  <TableCell>{row.composite_index_count}</TableCell>
                  <TableCell>{row.entity_bytes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default BackOfficeStats;
