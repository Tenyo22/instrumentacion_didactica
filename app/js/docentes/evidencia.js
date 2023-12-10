const { default: Swal } = require("sweetalert2")
const { default: apiConfig } = require("../config/apiConfig")
const { getId } = require("../auth/token")
const { getPeriodo } = require("../jefedivision/periodo")

const API = apiConfig.apiDocentes
const token = localStorage.getItem("token")

module.exports.validatePDF = (file) => {
    if (file.type !== 'application/pdf') {
        Swal.fire({
            icon: 'info',
            title: 'El tipo de archivo debe ser PDF!',
        })
        return false
    }
    return true
}

module.exports.insertFiles = async (periodo, materia, evidencia, files) => {
    const idUsuario = getId()
    const fecha = new Date().toISOString()
    const requestData = {
        periodo: periodo,
        idUsuario: idUsuario,
        claveMateria: materia,
        tipoEvidencia: evidencia,
        name: "",
        fechaEntrega: fecha,
        archivos: files
    }

    const name = evidencia.replace(/\s+/g, '_')
    requestData.name = name
    // console.log(name)

    const formData = new FormData()
    Object.entries(requestData).forEach(([key, value]) => {
        if (key === 'archivos') {
            value.forEach((file, index) => {
                formData.append(`archivos`, file)
            })
        } else {
            formData.append(key, value)
        }
    })

    // console.log(formData)
    // for (const pair of formData.entries()) {
    //     console.log(pair[0] + ', ' + pair[1])
    //     console.log(pair[0] + ', ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    // }
    try {
        const result = await fetch(`${API}/evidenciadocente`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            body: formData,
        })
        if (result.ok) {
            if (result.status === 201) {
                // console.log('OK')
                await Swal.fire({
                    icon: 'success',
                    title: 'Evidencia(s) Enviadas!',
                })
                window.location.reload()
            }
        }
    } catch (e) {
        console.error(e)
    }


}

module.exports.getEvidencias = async (materia, evidencia) => {
    const idUsuario = getId()
    const { periodoActual } = await getPeriodo()
    const idPeriodo = periodoActual.id_periodo

    // console.log(evidencia)
    // console.log(idUsuario)
    // console.log(idPeriodo, materia)
    try {
        const result = await fetch(`${API}/evidenciadocente/${idUsuario}?clave=${materia}&idPeriodo=${idPeriodo}&evidencia=${evidencia}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json()
                // console.log('OK')
                // console.log(data)
                return { data }
            }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.getFileSize = (encodedFile) => {
    const decodedFile = atob(encodedFile)
    return (decodedFile.length / 1024).toFixed(2) + ' KB'
}

module.exports.formatFechaEntrega = (fecha) => {
    const fechaEntrega = new Date(fecha)
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return fechaEntrega.toLocaleDateString('es-ES', opcionesFecha);
}

module.exports.getFileName = (encodedFile) => {
    try {
        // Convertir cadena base64 a ArrayBuffer
        const binaryString = window.atob(encodedFile)
        const binaryLen = binaryString.length
        const bytes = new Uint8Array(binaryLen)

        for (let i = 0; i < binaryLen; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }

        // Obtener los primeros bytes para extraer informacion del encabezado del archivo
        const headerBytes = bytes.slice(0, 100)

        // Convertir los bytes a una cadena para buscar el nombre del archivo
        const headerString = String.fromCharCode.apply(null, headerBytes);

        // Implementa la lógica para extraer el nombre del archivo del encabezado
        // Esto depende completamente de cómo se codifican y almacenan tus archivos
        // Aquí asumimos que el nombre está en algún lugar del encabezado.
        const regex = /filename="(.*?)"/;
        const match = headerString.match(regex);

        if (match && match[1]) {
            return match[1];
        }
    } catch (error) {
        console.error('Error al obtener el nombre del archivo:', error);
    }
    return 'Archivo sin nombre'
}

module.exports.viewFile = (file) => {
    const fileContentBase64 = file.archivo;

    // Convierte el contenido del archivo de base64 a un Blob
    const byteCharacters = atob(fileContentBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Crea una URL del Blob y ábrela en una nueva ventana
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');

}