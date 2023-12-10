const { default: Swal } = require("sweetalert2");
const { default: apiConfig } = require("../config/apiConfig");
const { TableContainer, Paper, TableHead, Table, TableRow, TableCell, TableBody, TablePagination, TextField } = require("@mui/material")


// const API = "http://localhost:8081"
const API = apiConfig.apiMaterias
const token = localStorage.getItem("token");

let materias = []

module.exports.getClasificacionMaterias = async (setCompetencia) => {
    const res = await fetch(`${API}/clasificacion_cacei`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    const data = await res.json()
    // console.log(data)
    // const uniqueCompetencia = data.filter(compe => !competencia.some(exists => exists.id === compe.id))
    // competencia.push(...uniqueCompetencia)
    setCompetencia(data)
}

module.exports.getMaterias = async () => {
    materias = []
    const result = await fetch(`${API}/materias`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    const data = await result.json()
    // console.log(data)
    if (result.ok) {
        const uniqueData = data.filter(mat => !materias.some(exists => exists.clave_materia === mat.clave_materia))
        materias.push(...uniqueData)
        return { materias }
    }
    // console.log(materias)
}

module.exports.validateData = (data) => {
    if (data.competencia === '0') {
        Swal.fire({
            title: "Competencia?",
            text: "La Competencia no es valida!",
            icon: "question"
        })
        return false
    }

    const dataEmpty = Object.values(data).some(value => typeof value === "string" && value.trim() === '')
    if (dataEmpty) {
        Swal.fire({
            title: "Campo Vacio",
            text: "Por favor, complete todos los campos!",
            icon: "info"
        })
        return false
    }
    // console.log(data);

    return true
}

module.exports.insertMateria = async (obj, plan, fetchData, clean) => {
    const data = {
        "clave_materia": obj.clave,
        "planEstudios": {
            "clave": plan
        },
        "clasificacionCACEI": {
            "id": obj.competencia
        },
        "nombre_materia": obj.materia,
        "ht": `${obj.ht}`,
        "hp": `${obj.hp}`,
        "cr": `${obj.ht + obj.hp}`,
        "semestre": `${obj.semestre}`,
        "status": "y"
    }
    const result = await fetch(`${API}/materias`, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (result.ok) {
        if (result.status === 201) {
            fetchData()
            clean()
            Swal.fire({
                icon: "success",
                title: "Materia Guardada!"
            })
        } else {
            const mensaje = await result.json()
            // console.log(mensaje)
            Swal.fire({
                icon: "info",
                title: mensaje.mensaje
            })
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Ocurrio un error!"
        })
    }
    // console.log(data)
}

module.exports.TablaMaterias = ({ rowsPerPageOptions, rowsPerPage, page, searchText, handleSearch, handleChangePage, handleChangeRowsPerPage }) => {

    const columns = [
        { id: 'materia', label: 'Materia' },
        { id: 'clave', label: 'Clave' },
        { id: 'ht', label: 'HT' },
        { id: 'hp', label: 'HP' },
        { id: 'cr', label: 'CR' },
        { id: 'semestre', label: 'Semestre' }
    ]

    const filteredData = materias.filter((row) => {
        return (row.nombre_materia.includes(searchText) || row.clave_materia.includes(searchText));
    })

    return <section className="mb-5">
        <TextField
            label="Buscar por materia o Clave..."
            variant="outlined"
            onChange={handleSearch}
            fullWidth
            margin="normal"
        />
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                    <TableRow>
                        <TablePagination className="mt-2"
                            rowsPerPageOptions={rowsPerPageOptions}
                            // component="section"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableRow>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id}>{column.label}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow key={row.clave_materia} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component='th' scope='row'>{row.nombre_materia}</TableCell>
                            <TableCell component='th' scope='row'>{row.clave_materia}</TableCell>
                            <TableCell component='th' scope='row'>{row.ht}</TableCell>
                            <TableCell component='th' scope='row'>{row.hp}</TableCell>
                            <TableCell component='th' scope='row'>{row.cr}</TableCell>
                            <TableCell component='th' scope='row'>{row.semestre}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </section>

}