var mydata = JSON.parse(bmsINM);
if (mydata.length !== 0) {
    var date = new Date(); // today
    var Entete = ' ';
    var Lang = 4;
    var num = ' N° ';
    var UTC = ' UTC ';
    var DateTimeTran = ' ';


    if (mydata[0]["BMS"].meteorologie_Fr != "") {
        dataMeteorologie = mydata[0]["BMS"].meteorologie_Fr;
        Entete = '<span > Bulletin Météorologique Spécial du </span>';
        Lang = 0;
        DateTimeTran = ' du ';

    }
    if (mydata[0]["BMS"].meteorologie_Ar != "") {
        document.getElementById("table").style.direction = "rtl";
        dataMeteorologie = mydata[0]["BMS"].meteorologie_Ar;
        Entete = '<span > النشرة الجوية الخاصة ليوم </span>';
        Lang = 1;
        num = ' رقم ';
        UTC = ' بالتوقيت العالمي ';
        DateTimeTran = ' ليوم ';
        mydata[0]["BMS"].validite_transition = ' على الساعة  '
        mydata[0]["BMS"].validite_transition2 = ' على الساعة  '
    }
    if (mydata[0]["BMS"].meteorologie_An != "") {
        dataMeteorologie = mydata[0]["BMS"].meteorologie_An;
        Entete = '<span > Special Weather Report of </span>';
        Lang = 2;
        DateTimeTran = ' of ';

    }
    if (mydata[0]["BMS"].phenomeneevolution_Fr != "") {
        dataphenomeneevolution = mydata[0]["BMS"].phenomeneevolution_Fr;
    }
    if (mydata[0]["BMS"].phenomeneevolution_Ar != "") {
        dataphenomeneevolution = mydata[0]["BMS"].phenomeneevolution_Ar;
    }
    if (mydata[0]["BMS"].phenomeneevolution_An != "") {
        dataphenomeneevolution = mydata[0]["BMS"].phenomeneevolution_An;
    }


    var list = [
        ['Avis de', 'Heure de référence', 'Heure de validité', 'Début de validité', 'Fin de validité', 'Zones menacées', 'Éléments météorologies', 'Phénomène générateur et évolution'],
        ['إشعار', 'الوقت المرجعي', 'ساعة الصلاحية', 'بداية الصلاحية', 'نهاية الصلاحية', 'المناطق المهددة', 'العوامل الجوية', 'الحالة الجوية السائدة وتطوراتها'],
        ['Notice of', 'Reference time', 'Validity Hour', 'Beginning of validity', 'End of validity', 'Threatened Areas', 'Weather elements', 'Generative phenomenon and evolution']
    ];

    var html = '<table cellpadding="0" cellspacing="0" border="0" class="display table table-bordered" id="hidden-table-info">';
    html += '<tr><th colspan="2" style="text-align: center;">' + mydata[0]["BMS"].status.toUpperCase() + '</th></tr>';
    html += '<tr"><td>' + list[Lang][0] + '</td>';
    html += '<td style="width:68%;">' + mydata[0]["BMS"].avisde + ' ' + mydata[0]["BMS"].avis_transition + ' ' + mydata[0]["BMS"].avisa + num + mydata[0]["BMS"].avischiffre1 + ' ' + mydata[0]["BMS"].avisstatus1 + ' ' + mydata[0]["BMS"].avisstatus2 + ' ' + mydata[0]["BMS"].avischiffre2 + '</td></tr>';

    html += '<tr><td>' + list[Lang][1] + '</td>';
    html += '<td>' + mydata[0]["BMS"].referenceheure + UTC + DateTimeTran + mydata[0]["BMS"].heurereferencedate + '</td></tr>';

    html += '<tr><td>' + list[Lang][2] + '</td>';
    html += '<td>' + mydata[0]["BMS"].validite_heureheure + '</td></tr>';

    html += '<tr><td>' + list[Lang][3] + '</td>';
    html += '<td>' + mydata[0]["BMS"].validatedebut + ' ' + mydata[0]["BMS"].validite_transition + ' ' + mydata[0]["BMS"].validateheuredebut + UTC + '</td></tr>';

    html += '<tr><td>' + list[Lang][4] + '</td>';
    html += '<td>' + mydata[0]["BMS"].validatefin + ' ' + mydata[0]["BMS"].validite_transition2 + ' ' + mydata[0]["BMS"].validateheurefin + UTC + '</td></tr>';

    html += '<tr><td>' + list[Lang][5] + '</td>';
    html += '<td >' + mydata[0]["BMS"].zone1 + ' ' + mydata[0]["BMS"].zonestatus1 + ' ' + mydata[0]["BMS"].zone2 + ' ' + mydata[0]["BMS"].zonestatus2 + ' ' + mydata[0]["BMS"].zone3 + '</td></tr>';

    html += '<tr><td>' + list[Lang][6] + '</td>';
    html += '<td style="color:#C15913;">' + dataMeteorologie + '</td></tr>';

    html += '<tr><td>' + list[Lang][7] + '</td>';
    html += '<td>' + dataphenomeneevolution + '</td></tr>';


    html += '</table>';
    document.getElementById('table').innerHTML = html;

}



var todayElement = document.getElementById('Today')
var dateToday = new Date()
dateToday = dateToday.getFullYear() + '-' + (dateToday.getMonth() + 1) + '-' + dateToday.getDate()
todayElement.innerHTML = dateToday