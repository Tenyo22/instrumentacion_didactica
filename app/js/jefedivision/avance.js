import Cookies from "js-cookie"

const { default: Swal } = require("sweetalert2")
const { default: apiConfig } = require("../config/apiConfig")
const { getMateriasAvance } = require("./materias")

const API = apiConfig.apiDocentes
// const token = localStorage.getItem("token")
const token = Cookies?.get("token") || "none"


let materias = []
let materiasDoc = []
let materiasEvidencia = []

module.exports.getAllMaterias = async (periodo) => {
    materias = []
    const { listaMaterias } = await getMateriasAvance(periodo)
    materias = listaMaterias
    // console.log(allMaterias)
}

module.exports.getMateriasDocente = async (idDoc, periodo) => {
    try {
        const result = await fetch(`${API}/materiadocente/avance/${idDoc}?periodo=${periodo}`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json()
                // console.log(data)
                materiasDoc = data
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrio un error',
            })
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.getEvidenciasByDocentesAndPeriodo = async (periodo, idDoc) => {
    materiasEvidencia = []

    try {
        const result = await fetch(`${API}/evidenciadocente/all/${idDoc}?idPeriodo=${periodo}`, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json()
                materiasEvidencia = data
                // console.log(data)
                // return { materiasEvidencia }
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrio un error',
            })
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.filterMaterias = () => {
    // console.log(materias)
    // console.log(materiasDoc)
    // console.log(materiasEvidencia)
    const indexMateria = materias.reduce((acc, materia) => {
        acc[materia.clave_materia] = materia;
        return acc;
    }, {});

    const materiasFiltradas = materiasDoc.map(matObj => {
        const materiaCorresp = indexMateria[matObj.clave_materia];
        
        return {
            id: matObj.id,
            nombre_materia: materiaCorresp?.nombre_materia,
            clave: matObj.clave_materia,
            cr: materiaCorresp?.cr,
            ht: materiaCorresp?.ht,
            hp: materiaCorresp?.hp,
            semestre: materiaCorresp?.semestre,
            status: materiaCorresp?.status,
            evidencias: [], // Inicializar un array para contener las evidencias
        };
    });

    materiasFiltradas.forEach(mat => {
        const evidencias = materiasEvidencia
            .filter(item => item.materiaDocente.clave_materia === mat.clave)
            .map(evidencia => ({
                idEvidencia: evidencia.id,
                evidencia: {
                    id: evidencia.evidencia.id,
                    descripcion: evidencia.evidencia.descripcion,
                    status: evidencia.evidencia.status,
                },
                fechaEntrega: evidencia.fechaEntrega,
            }));

        mat.evidencias = evidencias;
    });

    // console.log(materiasFiltradas);
    return materiasFiltradas;
}

module.exports.getEvidenciaById = async (id) => {
    await fetch(`${API}/evidenciadocente/id/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.blob())
        .then(blob => {
            // Crear una URL del objeto Blob
            const blobURL = URL.createObjectURL(blob);

            // Abrir una nueva ventana o pestaña con la URL del objeto Blob
            window.open(blobURL, '_blank');
        })
        .catch(error => console.error('Error al descargar el archivo:', error));
}