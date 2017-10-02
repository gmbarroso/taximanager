var api =
{
	novoFav : function(fav){
		console.log("novo:");
		console.log(fav);
			//ajax
			fav.id = 21; // id retornado
			favoritos.push(fav);
			mostrarFavoritos();
	},
	deleteFav : function(fav){
		console.log("deletar:");
		console.log(fav);
	},
	atualizaFav : function(fav){
		console.log("atualizar:");
		console.log(fav);
	}
}

// var favoritos = [];   //-- vindo de variaveis.js
function mostrarFavoritos(){

	isAutocomplete = [];
	autocompletes = [];
	var htmlf = "";

	for (var i = 0; i < ((IE) ? favoritos.length-1 : favoritos.length); i++){
		htmlf += '<li class="listaFav"><input class="nomeFav" value="' + favoritos[i].name + '" onkeyup="verifyName(' + i + ')">';
		htmlf += '<input class="localFav" size="50" value="' + favoritos[i].local + '" onkeyup="verifyAutocomplete(' + (i + 1) + ')">';
		htmlf += '<button class="deletar" onclick="deleteFav(' + i + ')">Deletar</button>';
		htmlf += '</li>';

		isAutocomplete[i] = false;
	}
	htmlf += '<button class="salvaFav">Salvar</button>';
	document.getElementById('favoritos').innerHTML = htmlf;
}

function deleteFav(inputN){

	api.deleteFav(favoritos[inputN].id);
	favoritos.splice(inputN, 1);
	mostrarFavoritos();
}

function lerFavoritos(){

	var nomes = document.getElementsByClassName('nomeFav');
	var locais = document.getElementsByClassName('localFav');

	for (var i = 0; i < nomes.length; i++) {
		favoritos[i].nome = nomes[i].value;
		favoritos[i].local = locais[i].value;
	}
}

function adicionarFav(id){

	console.log("addFav:"+id);
	api.novoFav(novoFav);

	novoFav = {};
	closeModalFav();
}
var novoFav = {};

// window.onload = function(){
// 	mostrarFavoritos();
//
// }
var timeouts = [];
function verifyName(inputN){
	clearTimeout(timeouts[inputN]);
	timeouts[inputN] = setTimeout(function() {
		lerFavoritos();
		api.atualizaFav(favoritos[inputN]);
		document.getElementsByClassName('salvo-span')[inputN].style.opacity = 1;
		setTimeout(function(){
			document.getElementsByClassName('salvo-span')[inputN].style.opacity = 0;
		}, 2000);
	}, 2000);
}

var isAutocomplete = [];
function verifyAutocomplete(inputN){
	// console.log(inputN);
	var input = document.querySelectorAll('.localFav')[inputN];

	console.log(input);
	if(input.value.length >= 4 && !isAutocomplete[inputN]){
		isAutocomplete[inputN] = true;
		autocompletes[inputN] = new google.maps.places.Autocomplete((input), {types: ['geocode']});
		autocompletes[inputN].n = inputN-1;
		console.log(autocompletes[inputN].n);
		autocompletes[inputN].addListener('place_changed', fillFav);

	}else if(input.value.length <= 3){
		isAutocomplete[inputN] = false;
		console.log(input.value);

		var contArray = document.getElementsByClassName('pac-container');
		for (var i = 0; i < contArray.length; i++) {
			contArray[i].style.display = "none";
		}
		google.maps.event.clearListeners(input);
	}
}

var autocompletes = [];
function initAutocomplete(){};

function fillFav() {
	console.log(this);
	var place = this.getPlace();
	if(this.n>=0){
		favoritos[this.n].local = place.formatted_address;
		favoritos[this.n].lat = place.geometry.location.lat();
		favoritos[this.n].lng = place.geometry.location.lng();
		favoritos[this.n].place_id = place.place_id;
		api.atualizaFav(favoritos[this.n]);
	}
	else{
		novoFav.local = place.formatted_address;
		novoFav.lat = place.geometry.location.lat();
		novoFav.lng = place.geometry.location.lng();
		novoFav.place_id = place.place_id;
	}
}

// htmlFavMenu = "<div class='cabecalho'><span>Nome</span><span>Endereço</span><span>Excluir</span></div>";
//
// for (var i = 0; i < favoritos.length; i++) {
// 	htmlFavMenu = "<"
// }
