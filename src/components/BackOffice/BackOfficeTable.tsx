import React, {useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {officeDetailTable} from "../../services/http";
import './BackOfficeTable.css'
import {Link} from "react-router-dom";

interface propertyMap{
    builtin_index_bytes: number
    builtin_index_count: number
    bytes: number
    composite_index_bytes: number
    composite_index_count: number
    count: number
    entity_bytes: number
    kind_name?: string
}

export default function BackOfficeTable() {
        const [tableContent, setTableContent] = useState<propertyMap[]>([])
        useEffect(()=>{
            officeDetailTable().then(
                (response) => {
                    let array = response.data.map((i: any)=>{
                        return i.propertyMap
                    })
                    setTableContent(array);
                },
                (error) => {
                    console.log(error);
                }
            );
    }, [])

    return (
        <div className="back-office-table-wrapper">
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead >
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
                        {tableContent.map((row: propertyMap, index:number) => (
                            <TableRow key = {index}>
                                <TableCell> {row.kind_name === "Users" ?
                                    <Link to={`/backoffice/utilizadores`}>
                                        {row.kind_name}
                                    </Link> : row.kind_name ?
                                        <Link to={`/backoffice/pedidos`}>
                                            {row.kind_name}
                                        </Link> : 'Total'}</TableCell>
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
    );
}
