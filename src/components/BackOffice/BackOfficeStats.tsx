import React, { useEffect, useState } from "react";
import { Pie, PieChart, Cell, Legend } from "recharts";
import "./BackOfficeStats.css";
import {
  getMarkers,
  officeDetail,
  officeDetailTable,
} from "../../services/http";
import { Point } from "../Map/Map";
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
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
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
        console.log(error);
      }
    );
    officeDetail().then(
      (response) => {
        console.log(response);
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
        console.log(error);
      }
    );
  }, []);

  return (
    <>
      <div className="pie-charts-wrapper">
        {dataUsers.length > 0 && (
          <PieChart width={400} height={400}>
            <Pie
              data={dataUsers}
              cx={200}
              cy={200}
              outerRadius={120}
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
          <PieChart width={400} height={400}>
            <Pie
              data={dataMarkers}
              cx={200}
              cy={200}
              outerRadius={120}
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
            <Legend />
          </PieChart>
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
                    ) : row.kind_name ? (
                      <Link to={`/backoffice/pedidos`}>{row.kind_name}</Link>
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
