//------------------------------------ Le boutton des notifications--------------------------------------------------//
var buttonNotification = document.querySelector('#buttonNotification');
buttonNotification.addEventListener('click', () => {
    var icon = document.getElementById('icon');
    if (icon.classList.value === 'fa fa-angle-double-up') {
        icon.classList.value = 'fa fa-angle-double-down'
    } else {
        icon.classList.value = 'fa fa-angle-double-up'
    }
    var bar = document.querySelector('.notificationbar');
    var barVisibility = document.querySelector('.notificationBarVisibility');
    bar.classList.toggle('sidebar');
    barVisibility.classList.toggle('visibleText')
});
//--------------------------------------------------------------------------------------------------------------------//



// ---------------------------------- Afficher la date ---------------------------------//
const monthNames = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

const d = new Date();
document.getElementById('dateAujourdhui').innerHTML = d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
//---------------------------------------------------------------------------------------//




// afficher les positions reçu pour chaque semaine sous forme d'un courbe 
var url = "http://127.0.0.1:3000/home/homePositionsAPI";
fetch(url)
    .then(async(resp) => await resp.json())
    .then(async function(data) {
        var positionData = await data
        var chartPositionsData = []
        for (var i = 0; i <= positionData.length - 1; i++) {
            chartPositionsData.push(positionData[i]['result'])
        }

        //----------------------------------- l'affichage de la courbe --------------------------//
        const ctx = document.getElementById('myChart').getContext('2d');
        const xlabels = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: xlabels,
                datasets: [{
                    label: 'Nombre des positions reçue pour cette semaine',
                    data: chartPositionsData,
                    backgroundColor: [
                        'rgba(255, 100, 150, 0.5)',
                        'rgba(255, 100, 150, 0.5)',
                        'rgba(255, 100, 150, 0.5)',
                        'rgba(255, 100, 150, 0.5)',
                        'rgba(255, 100, 150, 0.5)',
                        'rgba(255, 100, 150, 0.5)',
                        'rgba(255, 100, 150, 0.5)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',

                    ],
                    borderWidth: 0.5
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })



// afficher la meteo d'ajourd'hui 
var url = "http://127.0.0.1:3000/home/weatherAPI";
fetch(url)
    .then(async(resp) => await resp.json())
    .then(async function(data) {
        var weatherData = await data
        document.getElementById('weather').innerHTML = weatherData["temp"] + " º C"
    })


// afficher le morris de la BMS
var url = 'http://127.0.0.1:3000/home/PrevBMS_API'

fetch(url)
    .then((resp) => resp.json())
    .then(async function(data) {
        var dataAPI = await data
            // dataAPI.TotalBMS
        const ctx = document.getElementById("serverstatus03").getContext("2d")
        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    'Total BMS',

                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [dataAPI.TotalBMS, 50],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                    ],
                }],

            }

        });
    });

// afficher le Moris de la PREVISION
var url = 'http://127.0.0.1:3000/home/PrevBMS_API'

fetch(url)
    .then((resp) => resp.json())
    .then(async function(data) {
        var dataAPI = await data
            // dataAPI.TotalBMS
        const ctx = document.getElementById("serverstatus01").getContext("2d")
        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    'Total PREV',

                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [dataAPI.TotalPREV, 50],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                }],

            }

        });
    });







// var date = new Date();
// if (date.getMinutes() === 00) {
//     var url = 'http://127.0.0.1:3000/home/notificationAPI'

//     fetch(url)
//         .then((resp) => resp.json())
//         .then(async function(data) {
//             var dataAPI = await data
//             console.log(dataAPI)

//             dataAPI.forEach(notif => {
//                 if ((notif['TM'] === 'DIs') || (notif['TM'] === 'DIS')) {
//                     var notif = notifAll('', notif['NA'] + ' a envoyer une SOS ' + notif['TI'][0] + notif['TI'][1] + ':' + notif['TI'][2] + notif['TI'][3], 'n4', 'error', 5000, false, true, false, "right", "bottom");
//                 }
//                 if (notif['TM'] === 'POS') {
//                     var notif = notifAll('', notif['NA'] + ' a envoyer une Position ' + notif['TI'][0] + notif['TI'][1] + ':' + notif['TI'][2] + notif['TI'][3], 'n1', 'success', 5000, false, true, false, "right", "bottom");
//                 }

//             });

//         });


// }