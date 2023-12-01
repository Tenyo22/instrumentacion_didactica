'use client'

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import React, { useState } from 'react'

const page = () => {
    const [materias, setMaterias] = useState([
        { "clave": "1", "materias": "materias" },
        { "clave": "2", "materias": "materias" },
        { "clave": "3", "materias": "materias" },
        { "clave": "4", "materias": "materias" },
        { "clave": "5", "materias": "materias" },
        { "clave": "6", "materias": "materias" },
        { "clave": "7", "materias": "materias" },
        { "clave": "8", "materias": "materias" },
        { "clave": "9", "materias": "materias" },
        { "clave": "10", "materias": "materias" },
        { "clave": "11", "materias": "materias" },
        { "clave": "12", "materias": "materias" },
        { "clave": "13", "materias": "materias" },
        { "clave": "14", "materias": "materias" },
        { "clave": "15", "materias": "materias" },
        { "clave": "16", "materias": "materias" },
        { "clave": "17", "materias": "materias" },
        { "clave": "18", "materias": "materias" },
        { "clave": "19", "materias": "materias" },
        { "clave": "20", "materias": "materias" },
        { "clave": "21", "materias": "materias" },
        { "clave": "22", "materias": "materias" },
        { "clave": "23", "materias": "materias" },
        { "clave": "24", "materias": "materias" },
        { "clave": "25", "materias": "materias" },
        { "clave": "26", "materias": "materias" },
    ])
    const columns = [
        { id: 'materia', label: 'Materia' },
        { id: 'clave', label: 'Clave' },
        { id: 'ht', label: 'HT' },
        { id: 'hp', label: 'HP' },
        { id: 'cr', label: 'CR' },
        { id: 'semestre', label: 'Semestre' }
    ]

    const rowsPerPageOptions = [5, 10, 25]

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <section>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>{column.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {materias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <TableRow key={row.clave} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component='th' scope='row'>{row.materias}</TableCell>
                                    <TableCell component='th' scope='row'>{row.clave}</TableCell>
                                    <TableCell component='th' scope='row'>{row.materias}</TableCell>
                                    <TableCell component='th' scope='row'>{row.materias}</TableCell>
                                    <TableCell component='th' scope='row'>{row.materias}</TableCell>
                                    <TableCell component='th' scope='row'>{row.materias}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="section"
                    count={materias.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </section>
        </>
    )
}

export default page