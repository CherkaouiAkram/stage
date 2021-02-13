 var text;
 /**Read data from server */
fetch("T.850HPA.24H.json").then(obj => obj.json()).then(data => {text = data;console.log(text)}).then(()=>{load()})

function load(){

  // cree et isitialiser la map  

  var mymap = L.map('mapid').setView([31.791702, -7.092620], 5);
  var baseLayer =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        }).addTo(mymap);

  var googleMap  = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
  }).addTo(mymap);

  /**transform data to matrice */
  var Ni = text[0].header.Ni;
  var Nj = text[0].header.Nj;
  var mat = new Array(Nj);
  for(let j=0;j<Nj;j++){
    mat[j] = new Array(Ni)
    for(let i=0;i<Ni;i++){
      mat[j][i] = text[0].data[j*Ni + i];
    }
  }
    // initialse les paremetre de geotransforme
  var lo1 =text[0].header.lo1;
  var dx = text[0].header.di;
  var la1 = text[0].header.la1;
  var dy = text[0].header.dj; 
  var geoTransform = [lo1, dx, 0, la1, 0, -dy]
    // regler le parametre intervalsZ (la division des points de l'espace en des isolignes/isobandes)
  var intervalsZ = [-20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 25, 30, 35, 40]
    // cree les deux layer pour la tmerature isolines et isoband
  var linesZ = rastertools.isolines(mat, geoTransform, intervalsZ)
  var lineW = rastertools.isobands(mat, geoTransform, intervalsZ)


    // regler les couleurs pour les isobandes : retourne un tableau ds lequel le 1er couleur est de l'intervalle le plus bas
  function getColor(d) {
    return d > 40   ? '#643c32' :
           d > 35   ? '#643c32' :
           d > 30   ? '#a50000' :
           d > 25   ? '#c10000' :
           d > 20   ? '#e11400' :
           d > 15   ? '#ff3200' :
           d > 10   ? '#ff6000' :
           d > 5   ? '#ffa100' :
           d > 0   ? '#ffc13c' :
           d > -5   ? '#ffe978' :
           d > -10   ? '#c9ffbf' :
           d > -15   ? '#b5fbab' :
           d > -20   ? '#97f58d' :
                    '#ffffff';
            }

     // regler les syles pour les isobandes 
    function style(feature) {
    return {
        fillColor: getColor(feature.properties[0].lowerValue),
        weight: 2,
        opacity: 1,
        color: getColor(feature.properties[0].lowerValue),
        dashArray: '3',
        fillOpacity: 0.5
      };
    }

     // regler les syles pour les isolines 
    var myStyle = {
      "color": "black",
      "weight": 2,
      "opacity": 1
    };
    //add les deux layer to the map
 var myLayer = L.geoJSON(linesZ,{
    style:myStyle
   }).addTo(mymap);   

   var mySeondLayer = L.geoJSON(lineW,{
    style:style
  }).addTo(mymap);  


    //cree un layer group pour controler laffichage de toute les marker pour le csv file 
    var layerGroup = L.layerGroup().addTo(mymap);
    //lire le fichier csv file et cree des marker pour chaque ville
    var variable;
    fetch("villes.csv")
      .then(response => response.text())
      .then(text => {
        variable = text
        console.log(variable)
      }).then(()=>{a(variable)});
      function a(variable){
        console.log(variable);
        var tab = [];
        var ligne = variable.split('\r\n');
        var header = ligne[0].split(',');
        for(var i=1;i<ligne.length;i++){
        var obj = {};
        var newLine = ligne[i].split(',');
        for(var j=0;j<newLine.length;j++){
          obj[header[j]]= newLine[j];
        }
        tab.push(obj);
        }
      for(var k=0;k<tab.length;k++){
        var markers = L.marker([parseFloat(tab[k].laltitude),parseFloat(tab[k].longitude)]);
        markers.bindPopup("<div><p style: background ='green'>Ville :</p>" + tab[k].ville + "</div>" + "<div>laltitude :" +tab[k].laltitude + "</div>" + "<div>longitude :" +tab[k].longitude +"</div>");
        layerGroup.addLayer(markers);
      }
    }
 //cree des marker par click pour calclculer la distance entre deux point et afficher le resultat 
  var
  _firstLatLng,
  _firstPoint,
  _secondLatLng,
  _secondPoint,
  _distance,
  _length,
  _polyline 
  var layerGroup2 = L.layerGroup().addTo(mymap);
  // add listeners to click, for recording two points
  mymap.on('click', function(e) {
    //creat marker and pushit into layergroup2s
    var marker = []
    if (!_firstLatLng) {
      _firstLatLng = e.latlng;
      _firstPoint = e.layerPoint;
    var marker = L.marker(_firstLatLng).bindPopup('Point A<br/>' + e.latlng + '<br/>' + e.layerPoint).openPopup();
    layerGroup2.addLayer(marker);
    } else {
      _secondLatLng = e.latlng;
      _secondPoint = e.layerPoint;
      var marker = L.marker(_secondLatLng).addTo(mymap).bindPopup('Point B<br/>' + e.latlng + '<br/>' + e.layerPoint).openPopup();
      layerGroup2.addLayer(marker);
    }

    if (_firstLatLng && _secondLatLng) {
      // draw the line between points
    var polyline = L.polyline([_firstLatLng, _secondLatLng], {
      color: 'red'
      }); 
      layerGroup2.addLayer(polyline);
      refreshDistanceAndLength();
    }
    if(layerGroup2.getLayers().length > 3  ){
      layerGroup2.clearLayers();
      _firstLatLng = null;
      _firstPoint = null;
      _secondLatLng = null;
      _secondPoint =null;
      document.getElementById('distance').innerHTML = null;
      document.getElementById('length').innerHTML = null;
    }
  })

  mymap.on('zoomend', function(e) {
    refreshDistanceAndLength();
  })
  //calculer la distence et afficher resultat 
  function refreshDistanceAndLength() {
    _distance = L.GeometryUtil.distance(mymap, _firstLatLng, _secondLatLng);
    _length = L.GeometryUtil.length([_firstPoint, _secondPoint]);
    document.getElementById('distance').innerHTML = _distance;
    document.getElementById('length').innerHTML = _length;
  }
  //regrouper tout les layer dans layer controle 
    let basemapControl = {
      "My Basemap": baseLayer, // an option to select a basemap (makes more sense if you have multiple basemaps)
      "My streetmap":googleMap,
    }
    let layerControl = {
      "Isolines": myLayer, // an option to show or hide the layer you created from geojson
      "isobands": mySeondLayer,
      "cities": layerGroup,
      "layerGroup2":layerGroup2
    }
  //add le layer controle to the map
  L.control.layers( basemapControl, layerControl ).addTo( mymap )
}