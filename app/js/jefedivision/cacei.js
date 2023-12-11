const { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } = require("@mui/material");
const { default: Swal } = require("sweetalert2");
const { default: apiConfig } = require("../config/apiConfig");

// const API = "http://localhost:8081"
const API = apiConfig.apiMaterias

const token = localStorage.getItem("token");
let competencia = []

const clearCompetencia = () => {
    competencia = [];
}

module.exports.getClasificacion = async () => {
    const res = await fetch(`${API}/clasificacion_cacei`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    const data = await res.json()
    // console.log(data)
    const uniqueCompetencia = data.filter(compe => !competencia.some(exists => exists.id === compe.id))
    competencia.push(...uniqueCompetencia)
    return { competencia }
    // console.log(competencia)
}

module.exports.createClasificacion = async (data, fetchData) => {
    data.status = 'y'
    // console.log(data)
    const response = await fetch(`${API}/clasificacion_cacei`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    // console.log(response)
    if (response.ok) {
        if (response.status === 201) {
            clearCompetencia()
            fetchData()
            await Swal.fire({
                icon: "success",
                title: "Clasificacion agregada con Exito!"
            })
        } else {
            const res = await response.json()
            Swal.fire({
                icon: 'info',
                title: res.mensaje
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: "Ocurrio un Error!"
        })
    }
    // console.log(res)
}

module.exports.updateClasificacion = async (data, fetchData) => {
    // console.log(data)
    const response = await fetch(`${API}/clasificacion_cacei/${data.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        if (response.status === 200) {
            clearCompetencia()
            fetchData()
            Swal.fire({
                icon: "success",
                title: "Clasificacion Actualizada con Exito!"
            })
        } else {
            const res = await response.json()
            Swal.fire({
                icon: 'info',
                title: res.mensaje
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: "Ocurrio un Error!"
        })
    }
}

module.exports.deleteCompetencia = async (competencia, fetchData) => {
    // console.log(competencia)
    const response = await fetch(`${API}/clasificacion_cacei/${competencia.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    if (response.ok) {
        if (response.status === 200) {
            clearCompetencia()
            fetchData()

            Swal.fire({
                icon: "success",
                title: "Clasificacion Eliminada con Exito!"
            })
        } else {
            const res = await response.json()
            Swal.fire({
                icon: 'info',
                title: res.mensaje
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: "Ocurrio un Error!"
        })
    }
}

module.exports.TablaCacei = ({ onEditar, onDelete }) => {
    // console.log(competencia)

    return <section>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Competencia Academica</TableCell>
                        <TableCell className="">Color</TableCell>
                        <TableCell className="text-center">Opciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {competencia.map(compe => (
                        <TableRow key={compe.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">{compe.descripcion}</TableCell>
                            <TableCell component="th" scope="row" className="">
                                <i className="bi bi-square-fill border rounded-3 border-dark fs-2" style={{ color: compe.color }}></i> {compe.color}
                            </TableCell>
                            <TableCell component="th" scope="row" className="text-center">
                                <button type="button" className="btn btn-info ms-2" onClick={() => onEditar(compe)}>
                                    <i className="bi bi-pencil-fill"></i>
                                </button>
                                <button type="button" className="btn btn-danger ms-2" onClick={() => onDelete(compe)}>
                                    <i className="bi bi-trash-fill"></i>
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </TableContainer>
    </section>
}