const { default: Swal } = require("sweetalert2")

module.exports.validatePDF = (file) => {
    if(file.type !== 'application/pdf'){
        Swal.fire({
            icon: 'info',
            title: 'El tipo de archivo debe ser PDF!',
        })
        return false
    }
    return true
}