import React, {useEffect, useState} from "react";
import {officeDetailAppEngine} from "../../services/http";
import {Data} from "@react-google-maps/api";
import {Line, XAxis, YAxis, LineChart, Legend } from "recharts";
import classes from "../HelpForms/MapDetails.module.css";


export default function BackOfficeAppEngine() {
    const [data, setData] = useState<any>()
    const[filter, setFilter] = useState<string>("GAE_INST")
    const[start, setStart] = useState<number>(1800000)

    useEffect(() => {
        officeDetailAppEngine(new Date().getTime(), filter, 10, new Date().getTime() - start).then((response) => {
            console.log(response)
            setData(response.data)
            },
            (error) => {
                console.log(error);
            })
    }, [filter, start])
    const handleFilterChange = (event:any) => {
        setFilter(
            event.target.value);
    };
    const handleStartChange = (event:any) => {
        setStart(parseFloat(event.target.value)
            );
    };

    const formatter = (secs: number) => {
        let d: Date = new Date(secs * 1000)
        if (start === 900000 || start === 1800000  || start === 3600000 || start === 21600000 || start === 43200000 || start === 86400000 ) {
            d = rounder(d)
            return `${d.getHours()}:${d.getMinutes()}`
        }
        return `${d.getDay()}/${d.getMonth()}/${d.getFullYear()}`
    }
    const rounder = (d: Date) => {
        d.setMilliseconds(Math.round(d.getMilliseconds() / 1000) * 1000);
        d.setSeconds(Math.round(d.getSeconds() / 60) * 60);
        d.setMinutes(Math.round(d.getMinutes() / 15) * 15);
        return d;
    }


    return (
        <div>
            <label >
                Selecione a estatistica que pretende visualizar:
                <select
                    value={filter}
                    onChange={handleFilterChange}
                >
                    <option value="GAE_INST">GAE Instances</option>
                    <option value="GAE_MEM">GAE Memory</option>
                    <option value="GAE_SENT_BYTES">GAE Sent Bytes</option>
                    <option value="GAE_RECEIBED_BYTES">GAE Received Bytes</option>
                    <option value="GAE_CPU_USAGE">GAE CPU Usage</option>
                    <option value="GAE_CPU_CORES">GAE CPU Cores</option>
                    <option value="STORAGE_OBJECT_COUNT">Storage Object Count</option>
                    <option value="STORAGE_TOTAL_BYTES">Storage Total Bytes</option>
                    <option value="CACHE_HIT_RATIO">Cache Hit Ratio</option>
                    <option value="CACHE_USED_SIZE">Cache Used Size</option>
                    <option value="DATASTORE_REQUEST_COUNT">Datastore Request Count</option>
                    <option value="DATASTORE_WRITE_COUNT">Datastore Write Count</option>
                    <option value="DATASTORE_READ_SIZES">Datastore Read Sizes</option>
                    <option value="DATASTORE_WRITE_SIZES">Datastore Write Sizes</option>
                </select>
            </label>
            <label>
                Selecione desde que altura pretende ver:
                <select
                    value={start}
                    onChange={handleStartChange}>
                    <option value={900000}>15 minutos atrás</option>
                    <option value={1800000}>30 minutos atrás</option>
                    <option value={3600000}>1 hora atrás</option>
                    <option value={21600000}>6 horas atrás</option>
                    <option value={43200000}>12 horas atrás</option>
                    <option value={86400000}>24 horas atrás</option>
                    <option value={172800000}>2 dias atrás</option>
                    <option value={432000000}>5 dias atrás</option>
                    <option value={1296000000}>15 dias atrás</option>
                    <option value={2629800000}>1 mês atrás</option>
            </select>
            </label>
            {filter === "GAE_INST" ?
            <LineChart width={800} height={400} data = {data}>
                <XAxis scale={"time"} tickCount={10} angle={-45} dataKey="timestamp" height={40}
                       domain={["dataMin","dataMax"]} tickFormatter={formatter}/>
                <YAxis type = "number" dataKey="data"/>
                <Line type = "monotone" dataKey = "active" stroke = "#ff9f36" dot = {false} />
                <Line type = "monotone" dataKey = "idle" stroke = "#3385d9" dot = {false} />
                <Line type = "monotone" dataKey = "lameduck" stroke = "#ff0000" dot = {false}/>
                <Line type = "monotone" dataKey = "loading" stroke = "#008000" dot = {false}/>
                <Legend/>
            </LineChart>
            :
                <LineChart width={800} height={400} data = {data}>
                    <XAxis scale={"time"} tickCount={10} angle={-45} dataKey="timestamp" height={40}
                           domain={["dataMin","dataMax"]} tickFormatter={formatter}/>
                    <YAxis type = "number" dataKey="data" />
                    <Line type = "monotone" dataKey = "data" stroke = "#ff9f36" dot = {false} />
                </LineChart> }
        </div>
    )
}