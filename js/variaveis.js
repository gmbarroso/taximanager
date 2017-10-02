var favoritos = [];

favoritos = [
	{
		id: 2,
		local: "Rua Clodomiro Amazonas, Vila Nova conceição",
		name: "Casa",
		lat: -23.591233,
		lng: -46.6801182,
		place_id : "ChIJcSjUiFpXzpQRtWJDZwrVgbw"
	},
	{
		id: 4,
		local: "Av. Paulista, 1734, Bela vista",
		name: "Trabalho",
		lat: -23.5625759,
		lng: -46.6565538,
		place_id: "ChIJ__-_5MhZzpQRZhVSHqXd_Ac"
	},
	{
		id: 5,
		local: "Rua da Consolação, 420, Bela Vista",
		name: "Cliente 1",
		lat: -23.5472894,
		lng: -46.647623,
		place_id: "Ej9SLiBkYSBDb25zb2xhw6fDo28sIDQyMCAtIENvbnNvbGHDp8OjbywgU8OjbyBQYXVsbyAtIFNQLCBCcmFzaWw"
	},
	{
		id: 6,
		local: "Rua Pedroso Alvarenga, 340, Itaim Bibi",
		name: "Cliente 2",
		lat: -23.5807949,
		lng: -46.6768488,
		place_id: "Ej9SLiBQZWRyb3NvIEFsdmFyZW5nYSwgNDIwIC0gSXRhaW0gQmliaSwgU8OjbyBQYXVsbyAtIFNQLCBCcmFzaWw"
	},
];

//array de pontos de interesse
var itensCts = [
	{
		name: "CEIC",
		local: "Centro Empresarial Itaú Unibanco",
		bairro: "Conceição",
		place_id: "ChIJVVVVle9azpQRuOoCdTEZLlE",
		lat: -23.6360548,
		lng: -46.64173349
	},
	{
		name: "CAT",
		local: "Centro Administrativo de Tatuapé",
		bairro: "Tatuapé",
		place_id: "ChIJk6tAvFRYzpQRDxh7A1mWJq0",
		lat: -23.5477062,
		lng: -46.6359178
	},
	{
		name: "CTO",
		local: "Centro Tecnológico Operacional",
		bairro: "Mooca",
		place_id: "ChIJw_vUi1lZzpQRUtijEiSV-Lw",
		lat: -23.5575816,
		lng: -46.6154502
	},
	{
		name: "CAP",
		local: "Centro Administrativo de Pinheiros",
		bairro: "Pinheiros",
		place_id: "ChIJJSmNbwhXzpQR-oAhYbKuuTU",
		lat: -23.5721982,
		lng: -46.69883219
	},
	{
		name: "CAITM",
		local: "Centro Administrativo ITM",
		bairro: "Vila Leopoldina",
		place_id: "ChIJ0aJor8v4zpQRhCjw6BSgqqM",
		lat: -23.5265167,
		lng: -46.7446620
	},
	{
		name: "CAB",
		local: "Centro Administrativo Brigadeiro",
		bairro: "Bela Vista",
		place_id: "ChIJRRkbf7lZzpQRY7APqjHRcco",
		lat: -23.5644588,
		lng: -46.64659019
	},
	{
		name: "CT",
		local: "Centro Tecnológico",
		bairro: "Cambuci",
		place_id: "ChIJw_vUi1lZzpQRUtijEiSV-Lw",
		lat: -23.5575816,
		lng: -46.6154502
	},
];

var htmlCt = "<p>Centros Tecnológicos</p><img id='arrowCtec' src='./img/grey-arrow.png' onclick='openCtec()'><img id='xCtec' src='./img/x.png' onclick='closeCtec()'><ul id='listaCtec'>";
for (var i = 0; i < ((IE) ? itensCts.length-1 : itensCts.length); i++) {
	// console.log(i);
	htmlCt += "<li onclick='selectPoint(" + i + ", \"cts\")'>" + "<b>" + itensCts[i].name + "</b>" + " - " + itensCts[i].local + " - " + itensCts[i].bairro + "</li>";
	// console.log(itensCts[i]);
}
htmlCt += "</ul>";

var mapaHtml = "<p>Favoritos</p><img id='newFav' src='./img/plus.png' onclick='showModalFav()'><img id='arrowFav' src='./img/grey-arrow.png' onclick='openFav()'><img id='xFav' src='./img/x.png' onclick='closeFav()'><ul id='listaFav'>";
for (var i = 0; i < ((IE) ? favoritos.length-1 : favoritos.length); i++) {
	mapaHtml += "<li onclick='selectPoint(" + i + ", \"fav\")'>" + "<b>" + favoritos[i].name + "</b>" + " - " + favoritos[i].local + "</li>";
}
mapaHtml += "</ul>";

// Modal
// var modal = document.getElementById('modalFavorito');
// var btn = document.getElementById("newFav");
// var span = document.getElementsByClassName("closeModalFav")[0];

function showModalFav() {
	modalFavorito.style.display = "block";
}

function closeModalFav() {
	modalFavorito.style.display = "none";
}
