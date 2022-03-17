// Validee l'input de l'ID_VMS
////////////////////////////////////////////////////////////////////////
function ValidationID_VMS(input) {
    if (input.length === 7) {
        var testVMS = "VMS"
        var testInput = input[0] + input[1] + input[2]
        if (testVMS === testInput) {
            return true
        }
    }
    return false
}
////////////////////////////////////////////////////////////////////////




// validee l'input de REG_ID IMEI et ICCCID
////////////////////////////////////////////////////////////////////////
function Validation_Numbers(input, lengthInput, msg) {
    if (input.length === lengthInput) {
        var listNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        var compteur = 0
        for (let i = 0; i <= input.length; i++) {
            if (input[i] in listNumbers) {
                compteur += 1
            }
        }
        if (compteur === input.length) {
            return true
        }
    }
    return false
}
////////////////////////////////////////////////////////////////////////


// La validation de RC
////////////////////////////////////////////////////////////////////////
function validationRC(input) {
    if (input.length === 6) {
        var listNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        var compteur = 0
        for (let i = 0; i <= input.length; i++) {
            if (input[i] in listNumbers) {
                compteur += 1
            }
        }
        if ((compteur === 5) && (input[1] === "V")) {
            return true
        }
    }
    return false
}
////////////////////////////////////////////////////////////////////////


module.exports.validationRC = validationRC
module.exports.ValidationID_VMS = ValidationID_VMS
module.exports.Validation_Numbers = Validation_Numbers