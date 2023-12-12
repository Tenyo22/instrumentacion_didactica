const { default: apiConfig } = require("../config/apiConfig")

const API = apiConfig.apiMaterias
const token = localStorage.getItem("token");

let materias = []

module.exports.getPlan = async () => {
    try {
        const result = await fetch(`${API}/planestudios`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            const data = await result.json()
            const planActual = data[0].clave
            return { planActual }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.getMaterias = async (planActual) => {
    materias = []
    // console.log(planActual)
    const result = await fetch(`${API}/materias?plan=${planActual}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    if (result.ok) {
        const data = await result.json()
        // console.log(data)
        const uniqueData = data.filter(mat => !materias.some(exists => exists.clave_materia === mat.clave_materia))
        materias.push(...uniqueData)
        return { materias }
    }
    // console.log(materias)
}

module.exports.getMateriasEspecialidad = async () => {
    try {
        const result = await fetch(`${API}/especialidadmaterias`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json()
                const uniqueMaterias = data.filter(mat => !materias.some(exists => exists.clave_materia_especialidad === mat.clave_materia_especialidad))
                materias.push(...uniqueMaterias)
                return materias
                // console.log(data)
                // console.log(materias)
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrio un error!'
            })
        }
    } catch (e) {
        console.error(e)
    }
}