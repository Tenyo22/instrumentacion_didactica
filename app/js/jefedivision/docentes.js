const { default: axios } = require("axios");
const { default: apiConfig } = require("../config/apiConfig");
const { default: Swal } = require("sweetalert2");
const { getUsuariosDocentes } = require("./usuarios");
const { getMaterias } = require("./materias");
const { TableHead, TableRow, TableCell, Checkbox, TableBody, List, ListItem, ListItemText } = require("@mui/material");

// const API = "http://localhost:8083"
const API = apiConfig.apiDocentes
const token = localStorage.getItem("token");

let docentes = []
let todasMaterias = [] // Todas las materias que se tienen registradas
let todasMateriasDocentes = [] // Materias del docente seleccionado con todos los atributos
let materiasDocente = [] // Materias del docente seleccionado pero con la clave y nombre de materia

module.exports.getDocentes = async (setDocentes) => {
    try {
        const res = await fetch(`${API}/docentes/active`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (res.ok) {
            if (res.status === 200) {
                const data = await res.json()
                const uniqueDocente = data.filter(doc => !docentes.some(exists => exists.id === doc.id))
                docentes.push(...uniqueDocente)
                // console.log(docentes)
                setDocentes(data)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "Ocurrio un error!"
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: "Ocurrio un error!"
            })
        }
    } catch (e) {
        // console.log('error')
    }
}

module.exports.getUsuariosDoc = async (setUsuarios) => {
    const { data } = await getUsuariosDocentes()
    // console.log(data)
    const uniqueUsuarios = data.filter(user => !docentes.some(exists => exists.id_usuario === user.id_usuario))
    // console.log(uniqueUsuarios)
    setUsuarios(uniqueUsuarios)

}

module.exports.getAllMaterias = async () => {
    const { materias } = await getMaterias()
    todasMaterias = materias
}

module.exports.getMateriasDocentes = async () => {
    try {
        const result = await fetch(`${API}/materiadocente`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                todasMateriasDocentes = []
                const data = await result.json()
                // todasMateriasDocentes.push(data)
                // console.log(data)
                data.map(data => {
                    todasMateriasDocentes.push(data)
                })
                // console.log(todasMateriasDocentes)
            }
        }
    } catch (e) {

    }
}

module.exports.getMateriasDocente = async (docente) => {
    // console.log(docente)
    const result = await fetch(`${API}/materiadocente/${docente.id}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    if (result.ok) {
        const dataMateriaDocente = await result.json()
        if (result.status === 200) {
            materiasDocente = []
            dataMateriaDocente.map(asig => {
                const clave = asig.clave_materia
                const materiaEncontrada = todasMaterias.find(mat => mat.clave_materia === clave)

                if (materiaEncontrada) {
                    materiasDocente.push({
                        clave: clave,
                        materia: materiaEncontrada.nombre_materia,
                    })
                }
            })

            // console.log(materiasDocente)
            // console.log(materiasAll)
            // console.log(dataMateriaDocente)
            return { materiasDocente }
        } else {
            console.log(dataMateriaDocente)
        }
    }
    // const data = []
    // console.log(docente)
    // console.log(todasMaterias)
    // todasMateriasDocentes.map(doc => {
    //     // console.log(doc)
    //     if(docente.id === doc.id){
    //         const materiaEncontrada = todasMaterias.find(mat => mat.clave_materia === clave)
    //         // data.push({
    //         //     clave: clave,
    //         //     materia: materiaEncontrada.nombre_materia,
    //         // })
    //         // data.push(doc)
    //     }
    // })
    // console.log(data)

}

module.exports.validateDataDocente = (form) => {
    // console.log(form)
    if (form.nombre_docente === '') {
        Swal.fire({
            icon: 'info',
            title: "Por favor, coloque el nombre del docente!",
            target: document.getElementById("dialog")
        })
        return false;
    }
    if (form.ape1 === '') {
        Swal.fire({
            icon: 'info',
            title: "Por favor coloque el primer apellido del docente!",
            target: document.getElementById("dialog")
        })
        return false;
    }
    if (form.id_usuario === 0 || form.id_usuario === '') {
        Swal.fire({
            icon: 'info',
            title: "Seleccione un usuario!",
            target: document.getElementById("dialog")
        })
        return false
    }
    return true
}

module.exports.saveDocente = async (form) => {
    console.log(form)
    try {
        const result = await fetch(`${API}/docentes`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        })
        if (result.ok) {
            if (result.status === 201) {
                await Swal.fire({
                    icon: 'info',
                    title: 'Docente Agregado!',
                    target: document.getElementById("dialog")
                })
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Ocurrio un error!',
                    target: document.getElementById("dialog")
                })
            }
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Ocurrio un error!',
                target: document.getElementById("dialog")
            })
        }
    } catch (e) {
        console.log(e)
    }
}


module.exports.materiasNoAsignadas = () => {
    // console.log(todasMaterias)
    // console.log(materiasDocente)

    const listaMaterias = todasMaterias.filter(mat => !materiasDocente.some(exists => exists.clave === mat.clave_materia))
    // console.log(listaMaterias)
    return { listaMaterias }
}


module.exports.insertMaterias = async (docente, materias, periodo) => {
    // console.log(docente)
    // console.log(materias)
    // console.log(periodo.id_periodo)
    
    for (const mat of materias) {
        const data = {
            "docente": {
                "id": docente.id
            },
            "clave_materia": mat,
            "id_periodo": periodo.id_periodo,
            "status": "y"
        }
        console.log(data)

        try {
            const response = await fetch(`${API}/materiadocente`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                if (response.status !== 201) {
                    await Swal.fire({
                        icon: "error",
                        title: "Ocurrio un Error!"
                    })
                    break
                }
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Ocurrio un Error!"
                })
                break
            }
        } catch (err) {
            console.error(err)
            break
        }
    }
    await Swal.fire({
        icon: "success",
        title: "Materia(s) Asignada(s)!"
    })
}