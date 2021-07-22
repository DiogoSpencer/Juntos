import { useEffect, useState } from "react";
import { Pie, PieChart, Cell, Legend, PieLabelRenderProps } from "recharts";
import "./BackOfficeStats.css";
import { getMarkers, officeDetail } from "../../services/http";
import { Point } from "../Map/Map";
interface pieChunk {
  key: string;
  value: number;
}
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
function BackOfficeStats() {
  const [dataUsers, setDataUsers] = useState<pieChunk[]>([]);
  const [dataMarkers, setDataMarkers] = useState<pieChunk[]>([]);
  useEffect(() => {
    officeDetail().then(
      (response) => {
        console.log(response);
        setDataUsers([
          { key: "Admins", value: response.data.roleAdmin },
          { key: "Mods", value: response.data.roleMod },
          { key: "Partners", value: response.data.rolePartner },
          { key: "Users", value: response.data.roleUser },
        ]);
        setDataMarkers([
          { key: "Actions", value: response.data.action },
          { key: "Offers", value: response.data.offer },
          { key: "Donations", value: response.data.donate },
          { key: "Requests", value: response.data.request },
        ]);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <div>
      <h1>Informação Geral</h1>
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
    </div>
  );
}

export default BackOfficeStats;
