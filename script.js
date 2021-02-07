var text;
fetch("T.850HPA.24H.json").then(obj => obj.json()).then(data => {text = data;console.log(text)}).then(()=>{load()})
function load(){
  var mat=[];
  for(var i=0;i<text[0].header.Ni;i++){ 
    var ligne = [];
    for(var j=0;j<text[0].header.Nj;j++){
      ligne.push(text[0].data[text[0].header.Nj*i+j]);
    }
    mat.push(ligne);
  }
  console.log(mat);
  var lo1 =text[0].header.lo1;
  var dx = text[0].header.di;
  var la1 = text[0].header.la1;
  var dy = text[0].header.dj; 
  var geoTransform = [lo1, dx, 0, la1, 0, dy]
    // regler le parametre intervalsZ (la division des points de l'espace en des isolignes/isobandes)
  var intervalsZ = [-20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 25, 30, 35, 40]
    // regler les couleurs pour les isobandes : retourne un tableau ds lequel le 1er couleur est de l'intervalle le plus bas
  var linesZ = rastertools.isolines(text, geoTransform, intervalsZ)
  // objet geojson pour tracer le cadre qui contourne le tracee
  console.log(linesZ)
  var mymap = L.map('mapid').setView([31.791702, -7.092620], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        }).addTo(mymap);
  L.geoJSON(linesZ).addTo(mymap);
}

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

