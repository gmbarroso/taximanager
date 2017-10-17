var API_URL = "http://myfirstelasticbeanstalkapplication.g2xtaf7nbz.us-east-1.elasticbeanstalk.com/v1/estimates";
var ADH; // Instância de AutocompleteDirectionsHandler



//verificando se o browser é o IE8
function checkIE() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }
}
var IE = checkIE() > 0;

var destinosRec = [];
if(!IE && localStorage.lastDest!=undefined) destinosRec = JSON.parse(localStorage.lastDest);


function initMap() {

  if(IE) return;
  // Definindo configurações do meu mapa
  var mapOptions = {
    mapTypeControl: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeId.ROADMAP,
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    fullscreenControl: false,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    zoomControl: true,
    zoomControlOptions:{
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    center: {lat: -23.5456, lng: -46.6282},
    zoom: 13
  };

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // ponto do usuário sempre centralizado ao mudar o tamanho da tela
  google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  });

  ADH = new AutocompleteDirectionsHandler(map);
}

function AutocompleteDirectionsHandler(map) {

  //IE8 retornando opções de endereços
  if(IE) return;
  // Pedindo permissão ao usuário - Geolocation
  var geocoder = new google.maps.Geocoder;

  var infoWindow = new google.maps.InfoWindow({map: map});
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // console.log(pos);
      // console.log(pos.lat);

      // Retornando Local do usuário em Str
      geocoder.geocode({'location': pos}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            infoWindow.setContent(results[1].formatted_address);
            // console.log(results[1]);
            // console.log(results[1].formatted_address);
            // console.log(results[1].address_components[1].long_name + ', ' + results[1].address_components[3].short_name );
            // infoWindow.open(map, marker);
            document.getElementById('localizacaoUser').innerHTML = '<span>' + results[1].address_components[0].long_name + ', ' + results[1].address_components[1].long_name + ' - ' +  results[1].address_components[3].short_name  + '</span>';
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });

      var symbolOne = {
        path: 'M -2,0 0,-2 2,0 0,2 z',
        strokeColor: '#F00',
        fillColor: '#F00',
        fillOpacity: 1
      };

      var marker = new google.maps.Marker({
        position: pos,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#165dce',
          fillOpacity: 1.0,
          strokeColor: 'black',
          strokeOpacity: 0.4,
          strokeWeight: 10
        },
        map: map,
        title: 'Você está aqui'
      });
      map.setCenter(pos);
    },
    function() {
      //
    });
  }

  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'DRIVING';
  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);

  originAutocomplete = new google.maps.places.Autocomplete(originInput, {placeIdOnly: false});
  destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {placeIdOnly: false});

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
}

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
  var me = this;
  autocomplete.bindTo('bounds', this.map);
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    console.log(place);
    if (!place.place_id) {
      window.alert("Por favor, selecione uma opção da lista de endereços.");
      return;
    }
    var placeDetails = {
      "lat" : place.geometry.location.lat(),
      "lng" : place.geometry.location.lng(),
      "address" : place.formatted_address,
      "district": "",
      "city": "",
      "state": "",
      "name" : place.name
    }

    for (var i = 0; i < place.address_components.length; i++) {
      if (place.address_components[i].types[0] == "sublocality_level_1") {
        placeDetails.district = place.address_components[i].long_name
      } else if (place.address_components[i].types[0] == "street_address") {
        placeDetails.district = place.address_components[i].long_name
      } else {
        placeDetails.district = ""
      }
      console.log(placeDetails.district);

      if (place.address_components[i].types[0] == "administrative_area_level_2") {
        placeDetails.city = place.address_components[i].long_name
      } else {
        placeDetails.city = ""
      }
      // console.log(place.address_components);
      console.log(placeDetails.city);

      if (place.address_components[i].types[0] == "administrative_area_level_1") {
        placeDetails.state = place.address_components[i].short_name
      } else {
        placeDetails.state = ""
      }
      console.log(placeDetails.state);

    }
    console.log(placeDetails);
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
      directions.start = placeDetails;
    } else {
      me.destinationPlaceId = place.place_id;
      directions.end = placeDetails;
    }
    //Rota no automático após o preenchimento dos inputs
    // me.route();

    //Local Storage
    var destinoendereco = placeDetails;
    destinoendereco.local = destinoendereco.address;
    destinoendereco.place_id = place.place_id;
    if (typeof(Storage) !== "undefined" && !IE) {

      // VALIDACAO
      if (destinosRec.length > 3){
        destinosRec.shift();
      };

      destinosRec.push(destinoendereco);

      localStorage.setItem("lastDest", JSON.stringify(destinosRec));
      mostrarLocalStorage();
    }
  });
};

function mostrarLocalStorage(){
  var novos = "<p>Buscas recentes</p><img id='arrowCache' src='./img/grey-arrow.png' onclick='openCacheBox()'><img id='xCache' src='./img/x.png' onclick='closeCacheBox()'><ul id='listaCache'>";
  for (var i = 0; i < destinosRec.length; i++) {
    novos += "<li onclick='selectPoint(" + i + ", \"cac\")'>" + "<b>" + destinosRec[i].name + "</b>" + " - " +  destinosRec[i].address + "</li>";
  }
  novos += "</ul>";
  document.getElementById('cacheBox').innerHTML = novos;
}
AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;

  this.directionsService.route({
    origin: {'placeId': this.originPlaceId},
    destination: {'placeId': this.destinationPlaceId},
    travelMode: this.travelMode
  }, function(response, status) {
    if (status === 'OK') {
      me.directionsDisplay.setDirections(response);

      directions.distance = Math.round(response.routes[0].legs[0].distance.value / 1000);
      directions.duration = Math.round(response.routes[0].legs[0].duration.value / 60);

      getOpcoes(directions);
    } else {
      window.alert('Falha no cálculo da rota: ' + status);
    }
  });
  // hideBox();
};

// Limita o search para somente a partir de 4 caracteres
var isAutocomplete = [false, false];
function verifyAutocomplete(id){
  if(!IE){

    var inputN = (id=='origin-input' ?0:1);
    //return;
    console.log("Verify");
    if(document.getElementById(id).value.length >= 3 && !isAutocomplete[inputN]){
      isAutocomplete[inputN] = true;
      console.log("=4");
      var originAutocomplete = new google.maps.places.Autocomplete(document.getElementById(id), {placeIdOnly: false});

      ADH.setupPlaceChangedListener(originAutocomplete, (inputN==0 ? 'ORIG' : 'DEST'));

    }else if(document.getElementById(id).value.length <= 2){
      isAutocomplete[inputN] = false;
      console.log("<4");

      var contArray = document.getElementsByClassName('pac-container');
      for (var i = 0; i < contArray.length; i++) {
        contArray[i].style.display = "none";
      }
      google.maps.event.clearListeners(document.getElementById(id));
    }
  }
  else{
    //IE8 version
    if(document.getElementById(id).value.length >= 3){                            // MUDAR ESTA CHAVE, PARA ISSO É PRECISO AUTORIZAR O USO DESSA API NA CONTA
      var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyBt2Qh55dqMxFRIVV3ylCwyWuEW09P-y2c&input=" + document.getElementById(id).value;

      var http = new XMLHttpRequest();

      http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

          console.log(this.responseText);

          predictions = JSON.parse(this.responseText).predictions;
          IEAutocomplete("autocomplete-"+id.substring(0, 1));
        }
      };

      http.open("GET", url, true);
      http.send();
    }else{

      document.getElementById("autocomplete-o").innerHTML="";
      document.getElementById("autocomplete-d").innerHTML="";
    }
  }
}

var predictions;
function IEAutocomplete(input){
  var html = "<ul>";
  for (var i = 0; i < predictions.length; i++) {
    html += "<li onclick='selectPoint(" + i + ", \"prd\")'>" + predictions[i].description + "</li>";
    predictions[i].local = predictions[i].description;
    predictions[i].name = "";
  };
  html += "</ul>";

  document.getElementById(input).innerHTML = html;
}

//invertendo a rota e calculando
function inverter() {
  document.getElementById("players").style.display = "inline";

  var input1 = document.getElementById('origin-input').value;
  document.getElementById('origin-input').value = document.getElementById('destination-input').value;
  document.getElementById('destination-input').value = input1;

  var origem = ADH.originPlaceId;
  ADH.originPlaceId = ADH.destinationPlaceId;
  ADH.destinationPlaceId = origem;
  ADH.route();
}

var foco = 1;
function selectPoint(i, j){

  var arrayPlaces;
  switch (j) {
    case "fav":
    arrayPlaces = favoritos;
    break;
    case "cts":
    arrayPlaces = itensCts;
    break;
    case "prd":
    arrayPlaces = predictions;
    break;
    case "cac":             // CASO O SELECTPOINT() VENHA DOS LOCAIS RECENTES EM CACHE                             <------
    arrayPlaces = destinosRec;  // nome do array global que terá os itens recentes em CACHE
    break;
  }

  // console.log(j);

  //operador ternário
  // var arrayPlaces = (j=="fav") ? favoritos : itensCts;
  // console.log(arrayPlaces);

  document.getElementById("box-content").scrollTop = 0;

  if(IE && false){

    document.getElementById("autocomplete-o").innerHTML="";
    document.getElementById("autocomplete-d").innerHTML="";

    console.log(arrayPlaces[i]);                                          // MUDAR ESTA CHAVE, PARA ISSO É PRECISO AUTORIZAR O USO DESSA API NA CONTA
    var url = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBt2Qh55dqMxFRIVV3ylCwyWuEW09P-y2c&placeid=" + arrayPlaces[i].place_id;

    var http = new XMLHttpRequest();
    var focoAtual = foco;
    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        console.log("details:");
        console.log(this.responseText);
        if(focoAtual==1){
          directions.start.lat = JSON.parse(this.responseText).result.geometry.location.lat;
          directions.start.lng = JSON.parse(this.responseText).result.geometry.location.lng;
        }
        else{
          directions.end.lat = JSON.parse(this.responseText).result.geometry.location.lat;
          directions.end.lng = JSON.parse(this.responseText).result.geometry.location.lng;
        }
      }
    };

    http.open("GET", url, true);
    http.send();

  }

  if(foco==1){

    directions.start = arrayPlaces[i];
    document.getElementById('origin-input').value = arrayPlaces[i].name + " - " + arrayPlaces[i].local;

    if(!IE) ADH.originPlaceId = arrayPlaces[i].place_id;

  }else {

    directions.end = arrayPlaces[i];
    document.getElementById('destination-input').value = arrayPlaces[i].name + " - " + arrayPlaces[i].local;

    if(!IE) ADH.destinationPlaceId = arrayPlaces[i].place_id;
  }
  // if(document.getElementById('origin-input').value!='' && document.getElementById('destination-input').value!='') ADH.route();
}

function showBox() {
  document.getElementById('box-content').style.display = "block";
  // document.getElementById('box-content').style.height = "auto";
  document.getElementById('setacima').style.display = "inline";
  document.getElementById('setabaixo').style.display = "none";
  document.getElementById('origin-input').focus();
}

function hideBox() {
  document.getElementById('box-content').style.display = "none";
  // document.getElementById('box-content').style.height = "0px";
  document.getElementById('setacima').style.display = "none";
  document.getElementById('setabaixo').style.display = "inline";

}

function openNav() {
  // x.classList.toggle("change");
  // document.getElementById("sidemenu").style.width = "250px";
  // document.getElementById("map").style.marginTop = "500px";
  // document.getElementById("taxi").style.marginLeft = "250px";
  // document.getElementById("box").style.marginTop = "520px";

  document.getElementById("header").style.height = "500px";
  document.getElementById('subheader').style.display = "inline";
  document.getElementById('hamburger').style.display = "none";
  document.getElementById('exi').style.display = "inline";
  document.getElementById('menu').style.borderBottom = "solid";
  document.getElementById('menu').style.borderColor = "#5c5d60";
  document.getElementById('menu').style.borderWidth = "1px";
}

function menuHist(){
  document.getElementById("header").style.height = "100%";
  document.getElementById("subheader").style.display = "none";
  document.getElementById("politica").style.marginTop = "100%";
  document.getElementById("menuHistorico").style.display = "inline";

}

function closeMenuHist(){
  document.getElementById("header").style.height = "500px";
  document.getElementById("subheader").style.display = "inline";
  document.getElementById("politica").style.marginTop = "380px";
  document.getElementById("menuHistorico").style.display = "none";

}

function menuFav(){
  document.getElementById("header").style.height = "100%";
  document.getElementById("subheader").style.display = "none";
  document.getElementById("politica").style.marginTop = "100%";
  document.getElementById("menuFavorito").style.display = "inline";

}

function closeMenuFav(){
  document.getElementById("header").style.height = "500px";
  document.getElementById("subheader").style.display = "inline";
  document.getElementById("politica").style.marginTop = "380px";
  document.getElementById("menuFavorito").style.display = "none";

}

function closeNav() {
  // document.getElementById("sidemenu").style.width = "0";
  // document.getElementById("map").style.marginLeft = "0";
  // document.getElementById("taxi").style.marginLeft = "50px";
  // document.getElementById("box").style.marginLeft = "20px";

  document.getElementById("header").style.height = "50px";
  document.getElementById('subheader').style.display = "none";
  document.getElementById('hamburger').style.display = "inline";
  document.getElementById('exi').style.display = "none";
  document.getElementById('menu').style.borderBottom = "hidden";
  document.getElementById("menuHistorico").style.display = "none";
  document.getElementById("menuFavorito").style.display = "none";
  document.getElementById("politica").style.marginTop = "380px";

}

function openCacheBox() {
  document.getElementById("cacheBox").style.height = "auto";
  // document.getElementById("cacheBox").style.borderBottom = "none";
  document.getElementById("listaCache").style.display = "inline-block";
  document.getElementById("arrowCache").style.display = "none";
  document.getElementById("xCache").style.display = "inline-block";

}

function closeCacheBox() {
  document.getElementById("cacheBox").style.height = "45px";
  document.getElementById("cacheBox").style.borderBottom = "solid";
  document.getElementById("cacheBox").style.borderWidth = "1px";
  document.getElementById("cacheBox").style.borderColor = "#bbb";
  document.getElementById("listaCache").style.display = "none";
  document.getElementById("arrowCache").style.display = "inline-block";
  document.getElementById("xCache").style.display = "none";

}

function openCtec() {
  document.getElementById("cTec").style.height = "auto";
  // document.getElementById("cTec").style.borderBottom = "none";
  document.getElementById("listaCtec").style.display = "inline-block";
  document.getElementById("arrowCtec").style.display = "none";
  document.getElementById("xCtec").style.display = "inline-block";

}

function closeCtec() {
  document.getElementById("cTec").style.height = "45px";
  document.getElementById("cTec").style.borderBottom = "solid";
  document.getElementById("cTec").style.borderWidth = "1px";
  document.getElementById("cTec").style.borderColor = "#bbb";
  document.getElementById("listaCtec").style.display = "none";
  document.getElementById("arrowCtec").style.display = "inline-block";
  document.getElementById("xCtec").style.display = "none";

}

function openFav() {
  document.getElementById("favMapa").style.height = "auto";
  document.getElementById("listaFav").style.display = "inline-block";
  document.getElementById("arrowFav").style.display = "none";
  document.getElementById("xFav").style.display = "inline-block";
  document.getElementById("newFav").style.display = "inline-block";

}

function closeFav() {
  document.getElementById("favMapa").style.height = "45px";
  document.getElementById("favMapa").style.borderBottom = "solid";
  document.getElementById("favMapa").style.borderWidth = "1px";
  document.getElementById("favMapa").style.borderColor = "#bbb";
  document.getElementById("listaFav").style.display = "none";
  document.getElementById("arrowFav").style.display = "inline-block";
  document.getElementById("xFav").style.display = "none";
  document.getElementById("newFav").style.display = "none";


}


function showPlayers() {
  if(!IE) ADH.route();
  else{
    var http = new XMLHttpRequest();
    var focoAtual = foco;
    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        directions.duration = data.rows[0].elements[0].duration.value/60;
        directions.distance = data.rows[0].elements[0].distance.value/1000;

        getOpcoes(directions);
      }
    };
    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + directions.start.lat + "," + directions.start.lng + "&destinations=" + directions.end.lat + "," + directions.end.lng + "&key=AIzaSyDaMueYa5V3V-KwlbAfqd5EfTh52fpybeE";
    console.log("url:" + url);
    http.open("GET", url, true);
    http.send();
  }
  document.getElementById("players").style.display = "inline";

}

function hidePlayers(){
  document.getElementById("players").style.display = "none";

}

//Recuperando data, mes e dias da semana
var dias = [
  {dia: 0, nome: 'Domingo'},
  {dia: 1, nome: 'Segunda-feira'},
  {dia: 2, nome: 'Terça-feira'},
  {dia: 3, nome: 'Quarta-feira'},
  {dia: 4, nome: 'Quinta-feira'},
  {dia: 5, nome: 'Sexta-feira'},
  {dia: 6, nome: 'Sábado-feira'}
];

var meses = [
  {mes: 0, certo: 1, nome: 'Janeiro'},
  {mes: 1, certo: 2, nome: 'Fevereiro'},
  {mes: 2, certo: 3, nome: 'Março'},
  {mes: 3, certo: 4, nome: 'Abril'},
  {mes: 4, certo: 5, nome: 'Maio'},
  {mes: 5, certo: 6, nome: 'Junho'},
  {mes: 6, certo: 7, nome: 'Julho'},
  {mes: 7, certo: 8, nome: 'Agostos'},
  {mes: 8, certo: 9, nome: 'Setembro'},
  {mes: 9, certo: 10, nome: 'Outubro'},
  {mes: 10, certo: 11, nome: 'Novembro'},
  {mes: 11, certo: 12, nome: 'Dezembro'}
];

var hoje = new Date().getUTCDay();
var dia = new Date().getUTCDate();
var mes = new Date().getUTCMonth();
var ano = new Date().getUTCFullYear();

for(var i = 0; i <= dias.length-1; i++){
  if(dias[i].dia == hoje){
    var diaSemana = dias[i].nome;
  }
};

for(var i = 0; i <= meses.length-1; i++){
  if(meses[i].mes == mes){
    var mesCorreto = meses[i].certo;
  }
};

window.onload = function(){
  document.getElementById('datntim').innerHTML = (diaSemana + ', ' + dia + '/' + mesCorreto + '/' + ano);
  //puxando arrays de outro script e escrevendo no html
  document.getElementById("cTec").innerHTML = htmlCt;

  showFavMapa();
  //document.getElementById('favMapa').innerHTML = mapaHtml;
  // document.getElementById('favoritos').innerHTML = htmlf;
  // document.getElementById('historico').innerHTML = htmlHist;
  mostrarFavoritos();
  getHistorico();

  //
  document.getElementById('origin-input').onfocus = function() {foco=1};
  document.getElementById('destination-input').onfocus = function() {foco=2};
  if(!IE && localStorage.lastDest!=undefined) mostrarLocalStorage();
};



var directions = {};
function getOpcoes(data){

  //recuperando distancia e tempo da corrida e printando
  if (directions.distance > 0 && directions.duration > 0) {
    var corrida = "";
    corrida += "<h3>Seu trajeto: " + directions.distance + " km - " + directions.duration + " min</h3>";
    document.getElementById("corrida").innerHTML = corrida;
  };

  var http = new XMLHttpRequest();

  console.log(http);

  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      mostrarOpcoes(JSON.parse(this.responseText).records);

      console.log(JSON.parse(this.responseText));


    }
  };

  http.open("POST", API_URL, true);
  http.setRequestHeader("Authorization", "65edc9b5-d134-4c8b-9be5-ee2c722f4a54");
  http.send(JSON.stringify(data));
  console.log(data);

}





function mostrarOpcoes(records){
  // ordenar por prestadores
  // records.sort(function(a, b){
  //   var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
  //   if (nameA > nameB) return -1;
  //   if (nameA < nameB) return 1;
  //   return 0;
  // });

  console.log(records);

  var html = '<ul class="listaPrecos"><li><img src="img/' + records[0].modality.name.substring(0, 2) + '.png"/>';

  for (var i = 0; i < records.length; i++) {
    html += "<div class='spacetipo'><span>" + records[i].modality.name + "</span></div><span class='spaceprice'>" + records[i].price + "</span><span>" + (records[i].waiting_time / 60) + " min</span>";
    html += "<div class='a'><a href=''>IR</a></div>"

    if (records[i+1] && records[i].modality.name != records[i+1].modality.name){
      html += '<li><img src="img/' + records[i+1].modality.name.substring(0, 2) + '.png"/>';

      // if (records[i].modality.name == "99 TÁXI 30% off") {
      //   html += "<span>30% off</span><span>" + records[i].price + "</span><span>" + (records[i].waiting_time / 60) + " min</span>";
      // }
    }




  }
  html += "</li></ul>";

  document.getElementById("opcoes").innerHTML = html;

}

function centralizar() {
  initMap();
  document.getElementById('header').style.height = "50px";
  document.getElementById('subheader').style.display = "none";
  document.getElementById('exi').style.display = "none";
  document.getElementById('hamburger').style.display = "inline";
  document.getElementById('players').style.display = "none";
}
