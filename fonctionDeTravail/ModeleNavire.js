function navireModel(ID, NA, ID_VMS, ID_REG, IMEI, ICCID, RC, KEY_AES, DABeg, DAEnd) {
    this.ID = ID;
    this.NA = NA;
    this.ID_VMS = ID_VMS;
    this.ID_REG = ID_REG;
    this.IMEI = IMEI;
    this.ICCID = ICCID;
    this.RC = RC;
    this.KEY_AES = KEY_AES;
    this.DABeg = DABeg;
    this.DAEnd = DAEnd;
}

module.exports = navireModel;