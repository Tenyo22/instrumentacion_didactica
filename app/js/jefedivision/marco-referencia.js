import Cookies from "js-cookie"

const { default: Swal } = require("sweetalert2")
const { default: apiConfig } = require("../config/apiConfig")
const { getMaterias } = require("./materias")
const { getPlanActualEstudios } = require("./plan-estudios")

const API = apiConfig.apiCacei
// const token = localStorage.getItem("token")
const token = Cookies?.get("token") || "none"
let atributosEgreso = []
let criterioDesempenio = []
let indicadores = []
let indicadorMaterias = []
let allMaterias = []

module.exports.getMarcoReferencia = async () => {
    try {
        const result = await fetch(`${API}/marcoreferencia/active`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const marcoReferencia = await result.json()
                return { marcoReferencia }
            }
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports.getAtributosEgreso = async (mr, setAtributos) => {
    // console.log(mr)
    try {
        const result = await fetch(`${API}/atributos?mr=${mr}`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json()
                const dataUniq = data.filter(atri => !atributosEgreso.some(exists => exists.id === atri.id))
                atributosEgreso.push(...dataUniq)
                setAtributos(atributosEgreso)
                // console.log(atributosEgreso)
            }
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports.getCriterioDesempenio = async (mr) => {
    try {
        const result = await fetch(`${API}/criterios?mr=${mr}`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json()
                const dataUniq = data.filter(crit => !criterioDesempenio.some(exists => exists.id === crit.id))
                criterioDesempenio.push(...dataUniq)
                // console.log(criterioDesempenio)
            }
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports.getIndicadores = async (mr) => {
    try {
        const result = await fetch(`${API}/indicador?mr=${mr}`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                indicadores = []
                const data = await result.json()
                const dataUniq = data.filter(indi => !indicadores.some(exists => exists.id === indi.id))
                indicadores.push(...dataUniq)
                // console.log(indicadores)
            }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.getIndicadoresMaterias = async () => {
    try {
        const result = await fetch(`${API}/indicadormateria`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                indicadorMaterias = []
                const data = await result.json()
                const dataUniq = data.filter(mat => !indicadorMaterias.some(exists => exists.id === mat.id))
                indicadorMaterias.push(...dataUniq)
            }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.getAllMaterias = async () => {
    const { planActual } = await getPlanActualEstudios()
    const { materias } = await getMaterias(planActual)
    allMaterias = materias
    // console.log(allMaterias)
}

module.exports.listarCriterios = (setCriterios, atributo) => {
    // console.log(criterioDesempenio)
    const filter = criterioDesempenio.filter(obj => obj.atributoDesempenio.id === atributo.id)
    // console.log(filter)
    setCriterios(filter)
}

module.exports.listarIndicadores = (setIndicadores, criterio) => {
    // console.log(criterio)
    // console.log(indicadores)
    const filter = indicadores.filter(obj => obj.criterioDesempenio.id === criterio.id)
    // console.log(filter)
    setIndicadores(filter)
}

module.exports.validateField = (fields, dialog) => {

    const getNestedFieldValue = (object, fieldName) => {
        const keys = fieldName.split('.');
        let value = object;
        for (const key of keys) {
            if (value && value.hasOwnProperty(key)) {
                value = value[key];
            }
        }

        return value;
    };

    for (const fieldName in fields) {
        const value = getNestedFieldValue(fields, fieldName);

        // Validar si el campo está vacío
        if (value === '') {
            // console.error(`El campo "${fieldName}" está vacío.`);
            Swal.fire({
                icon: 'info',
                title: 'Por favor, complete todos los campos!',
                target: document.getElementById(dialog)
            })
            // return `El campo "${fieldName}" está vacío.`; // Retorna el mensaje de error
            return false
        }
    }
    return true
    // console.log('Todos los campos están llenos. Validación exitosa.');
}

module.exports.saveMarcoReferencia = async (form) => {
    // console.log(form)
    try {
        const result = await fetch(`${API}/marcoreferencia`, {
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
                    icon: 'success',
                    title: 'Marco de referencia creado!',
                    target: document.getElementById('dialogMR')
                })
                return true
            } else {
                const mensaje = await result.json()
                await Swal.fire({
                    icon: 'info',
                    title: mensaje.mensaje,
                    target: document.getElementById('dialogMR')
                })
            }
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Ocurrio un error!',
                target: document.getElementById('dialogMR')
            })
        }
    } catch (error) {
        console.error(error)
    }
    return false
}

module.exports.deleteMarcoReferencia = async (marcoReferencia) => {
    // console.log(marcoReferencia)
    try {
        await fetch(`${API}/marcoreferencia/${marcoReferencia.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
    } catch (e) {
        console.error(e)
    }
}

module.exports.deleteIndicadores = async (mr) => {
    try {
        await fetch(`${API}/indicador/all/${mr.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports.deleteCriterios = async (mr) => {
    try {
        await fetch(`${API}/criterios/all/${mr.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
    } catch (e) {
        console.error(e)
    }
}

module.exports.deleteAtributosEgreso = async (mr) => {
    try {
        const result = await fetch(`${API}/atributos/all/${mr.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
            }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.saveAtributoEgreso = async (mr_id, form, fetchData) => {
    let data = form
    data.marcoReferencia.id = mr_id
    data.status = 'y'
    // console.log(form)
    // console.log(data)
    try {
        const result = await fetch(`${API}/atributos`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        if (result.ok) {
            if (result.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Atributo de Egreso Registrado!',
                    target: document.getElementById('dialogAtributo')
                })
                await fetchData()
            }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.saveCriterioDesempenio = async (atributo, form, fetchData) => {
    let data = form
    data.atributoDesempenio.id = atributo.id
    data.status = 'y'
    // console.log(data)
    try {
        const result = await fetch(`${API}/criterios`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        if (result.ok) {
            if (result.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Criterio de Desempeño Agregado!',
                    target: document.getElementById('dialogCriterio')
                })
                await fetchData()
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrio un error',
                target: document.getElementById('dialogCriterio')
            })
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.saveIndicador = async (form, fetchData) => {
    let data = form
    data.status = 'y'
    // console.log(data)
    try {
        const result = await fetch(`${API}/indicador`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        if (result.ok) {
            if (result.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Indicador Asignado!',
                    target: document.getElementById('dialogIndicador')
                })
                await fetchData()
            }
        }
    } catch (e) {
        console.error(e)
    }

}

module.exports.listarMaterias = (indicador) => {
    // console.log(indicador)
    // console.log(allMaterias)
    // console.log(indicadorMaterias)

    const materiaIndicador = indicadorMaterias.filter(elemento => elemento.indicador.id === indicador.id)
    // console.log(materiaIndicador)
    const materiasNoAsignadas = allMaterias.filter(mat => !materiaIndicador.some(indi => indi.claveMateria === mat.clave_materia))
    const materiasAsignadas = allMaterias.filter(mat => materiaIndicador.some(indi => indi.claveMateria === mat.clave_materia))

    return { materiasNoAsignadas, materiasAsignadas }
    // console.log(materiasAsignadas)
    // console.log(materiasNoAsignadas)
}

module.exports.saveMateriasIndicador = async (indicadorActivo, materias) => {
    const dataDelete = {
        "indicador": {
            "id": indicadorActivo.id
        },
        "claveMateria": "",
        "status": "y"
    }
    try {
        await fetch(`${API}/indicadormateria/indicador/${indicadorActivo.id}`, {
            method: "PUT",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataDelete),
        })
    } catch (e) {
        console.error(e)
    }

    for (const mat of materias) {
        const data = {
            "indicador": {
                "id": indicadorActivo.id
            },
            "claveMateria": mat.clave_materia,
            "status": "y"
        }
        try {
            const result = await fetch(`${API}/indicadormateria`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
        } catch (err) {
            console.error(err)
        }
    }

    await Swal.fire({
        icon: "success",
        title: "Materia(s) Guardada(s)!",
    })
    // console.log(dataDelete)
    // console.log(indicadorActivo)
    // console.log(materias)
}