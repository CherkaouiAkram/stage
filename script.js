var text ;
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       text = this.responseText;
       console.log(text);
      }
    };
    //xhttp.open("GET","villes.csv", true);
    xhttp.open("GET","T.850HPA.24H.json", true);
    xhttp.send();
}
loadDoc();




















































/*function a(text){
    console.log(text);
    var tab = [];
    var ligne = text.split('\r\n');
    var header = ligne[0].split(',');
    console.log(header);
    for(var i=1;i<ligne.length;i++){
     var obj = {};
     var newLine = ligne[i].split(',');
     for(var j=0;j<newLine.length;j++){
       obj[header[j]]= newLine[j];
     }
     console.log(obj);
     tab.push(obj);
    }
    console.log(tab);
    console.log(tab[0].longitude);
    console.log(tab[0].laltitude);
  var mymap = L.map('mapid').setView([31.791702, -7.092620], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        }).addTo(mymap);
  for(var k=0;k<tab.length;k++){
    var marker = L.marker([parseFloat(tab[k].laltitude),parseFloat(tab[k].longitude)]).addTo(mymap);
    marker.bindPopup("<div><p style: background ='green'>Ville :</p>" + tab[k].ville + "</div>" + "<div>laltitude :" +tab[k].laltitude + "</div>" + "<div>longitude :" +tab[k].longitude +"</div>");
  }
  var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
  }).addTo(mymap);
}*/

