const { default: Swal } = require("sweetalert2")
const { default: apiConfig } = require("../config/apiConfig")
const { getMaterias } = require("./materias")

const API = apiConfig.apiCacei
const token = localStorage.getItem("token")
let atributosEgreso = []
let criterioDesempenio = []
let indicadores = []
let indicadorMaterias = []
let allMaterias = []

module.exports.getAtributosEgreso = async (setAtributos) => {
    try {
        const result = await fetch(`${API}/atributos`, {
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

module.exports.getCriterioDesempenio = async () => {
    try {
        const result = await fetch(`${API}/criterios`, {
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

module.exports.getIndicadores = async () => {
    try {
        const result = await fetch(`${API}/indicador`, {
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
    const { materias } = await getMaterias()
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
    const filter = indicadores.filter(obj => obj.criterioDesempenio.atributoDesempenio.id === criterio.id)
    // console.log(filter)
    setIndicadores(filter)
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