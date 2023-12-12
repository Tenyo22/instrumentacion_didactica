const { getId } = require("../auth/token");
const { default: apiConfig } = require("../config/apiConfig");
const { getPeriodo } = require("../jefedivision/periodo");
const { getPlan, getMaterias, getMateriasEspecialidad } = require("./materias");

const API = apiConfig.apiDocentes
const token = localStorage.getItem("token");

let idDocente = 0
let docente = []
let allMaterias = []
let materiasDocente = []
let materias = []
let tipoEvidencias = []
let periodo = []
let plan = ''

module.exports.getPlanActual = async () => {
    const { planActual } = await getPlan()
    plan = planActual
}

module.exports.getAllMaterias = async () => {
    const { materias } = await getMaterias(plan)
    // console.log(materias)
    allMaterias = materias
    const materiasEspecialidad = await getMateriasEspecialidad()
    materiasEspecialidad.map(mat => {
        const existeMateria = allMaterias.some(m => m.clave_materia === mat.clave_materia_especialidad)
        if (!existeMateria) {
            const obj = {
                clave_materia: mat.clave_materia_especialidad,
                nombre_materia: mat.nombreMateria,
                ht: mat.ht,
                hp: mat.hp,
                cr: mat.cr,
                semestre: mat.semestre,
                status: mat.status
            }
            allMaterias.push(obj)
        }
    })
    return allMaterias
    console.log(allMaterias)
}

module.exports.getPeriodoAct = async () => {
    const { periodoActual } = await getPeriodo()
    periodo = periodoActual
    return { periodoActual }
}

module.exports.getDocente = async () => {
    idDocente = getId()
    try {
        const result = await fetch(`${API}/docentes/usuario/${idDocente}`, {
            headers: {
                'Authorization': "Bearer " + token,
                'Content-Type': 'application/json',
            }
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json()
                docente = data
                // console.log(data)
            }
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports.getMateriasDocente = async () => {
    try {
        const result = await fetch(`${API}/materiadocente/${docente.id}?periodo=${periodo.id_periodo}`, {
            headers: {
                "Authorization": "Bearer" + token,
                "Content-Type": "application/json",
            }
        })
        if (result.ok) {
            const data = await result.json()
            materiasDocente = data
            // console.log(data)
        }

    } catch (e) {
        console.error(e)
    }
}

module.exports.filterMaterias = () => {
    materias = []
    // console.log(allMaterias)
    materiasDocente.map(asig => {
        const clave = asig.clave_materia
        const materiaEncontrada = allMaterias.find(mat => mat.clave_materia === clave)

        if (materiaEncontrada) {
            materias.push({
                clave: clave,
                materia: materiaEncontrada.nombre_materia,
                semestre: materiaEncontrada.semestre,
            })
        }
    })
    materias.sort((a, b) => parseInt(a.semestre, 10) - parseInt(b.semestre, 10))

    const abreviaturaSemestre = (numero) => {
        const abreviaturas = ['1ro', '2do', '3ro', '4to', '5to', '6to', '7mo', '8vo', '9no']
        return abreviaturas[numero - 1] || `${numero}to`
    }

    const materiasSemestre = materias.reduce((acc, materia) => {
        const { semestre, materia: nombreMateria, clave } = materia
        const abreviatura = abreviaturaSemestre(Number(semestre))

        acc[abreviatura] = acc[abreviatura] || []
        acc[abreviatura].push({ clave, nombreMateria })
        return acc
    }, {})

    // console.log(materiasSemestre)
    // console.log(materias)
    return { materiasSemestre }
}

module.exports.getTipoEvidencias = async () => {
    tipoEvidencias = []
    try {
        const result = await fetch(`${API}/evidencias`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json()
                tipoEvidencias = data
                return { tipoEvidencias }
                // console.log(tipoEvidencias)
            }
        }
    } catch (e) {
        console.error(e)
    }
}