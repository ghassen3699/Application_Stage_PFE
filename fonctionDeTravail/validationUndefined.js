function validationUndifined(variable, msg) {
    if (variable === undefined) {
        return msg
    }
    return variable
};

module.exports = validationUndifined;