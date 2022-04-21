const NA = document.getElementById('NA')
const ID_VMS = document.getElementById('ID_VMS')
const IMEI = document.getElementById('IMEI')
const RC = document.getElementById('RC')
const KEY_AES = document.getElementById('KEY_AES')
const formSubmit = document.getElementById('form')

console.log('test')

formSubmit.addEventListener('submit', (e) => {
    let messages = []
    console.log(NA.value)
    console.log(ID_VMS.value)
    console.log(IMEI.value)
    console.log(RC.value)
    console.log(KEY_AES.value)

    if (NA.value.length < 2) {
        messages.push("'NA' Il faut que la longueur minimuim est 2")
    }

    if (NA.value === "NA") {
        messages.push("'NA' Erreur entrer un vrai NA")
    }

    if (ID_VMS.value.length < 7) {
        messages.push("'ID_VMS' Il faut que la longueur minimuim est ID_VMS")
    }

    if (IMEI.value.length < 15) {
        messages.push("'ID_VMS' Il faut que la longueur minimuim est ID_VMS")
    }


    if (RC.value.length < 6) {
        messages.push("'ID_VMS' Il faut que la longueur minimuim est ID_VMS")
    }

    if (KEY_AES.value.length < 32) {
        messages.push("'ID_VMS' Il faut que la longueur minimuim est ID_VMS")
    }





    if (messages.length > 0) {
        e.preventDefault()
        console.log(messages)
    }
})