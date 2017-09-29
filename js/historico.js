var historico;

function getHistorico(){
	var url = "http://api.taximanager.com.br/v1/taximanager/companies/1/travels?limit=50&employeeId=147";
	// var url = "http://api.taximanager.com.br/v1/taximanager/companies/1/travels?limit=50&";

	var http = new XMLHttpRequest();

	http.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//console.log(JSON.parse(this.responseText).records);
			historico = JSON.parse(this.responseText).records;
			console.log(historico);
			showHist()
		}
	};

	http.open("GET", url, true);
	http.setRequestHeader("Accept", "application/json");
	http.setRequestHeader("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTAwMzM4MjU0fQ.B2Nch63Zu0IzJDepVTDXqq8ydbIVDiUmU6vV_7eQocw");
	http.send();
}


function showHist(){
	var htmlHist = "<tbody><tr><th>Data e Hora</th><th>Partida</th><th>Destino</th><th>Valor</th></tr>";
	var htmlDet = "";

	for (var i = 0; i < historico.length; i++){

		//formatando dia e hora de maneira legível
		var parse1 = new Date(Date.parse(historico[i].endDate));
		var parse2 = new Date(Date.parse(historico[i].startDate));
		var mes1 = new Date(Date.parse(historico[i].endDate)).getUTCMonth();
		var mes2 = new Date(Date.parse(historico[i].startDate)).getUTCMonth();
		var horaEnd = parse1.getHours() + ":" + parse1.getMinutes() + ":" + parse1.getSeconds();
		var horaStart = parse2.getHours() + ":" + parse2.getMinutes() + ":" + parse2.getSeconds();
		var dataEnd = parse1.getUTCDate() + "/" + (parse1.getUTCMonth()+1) + "/" + parse1.getFullYear();
		var dataStart = parse2.getUTCDate() + "/" + (parse2.getUTCMonth()+1) + "/" + parse2.getFullYear();

		// variáveis para subtrair hora
		var timeStart = new Date(historico[i].startDate).getTime();
		var timeEnd = new Date(historico[i].endDate).getTime();
		var hourDiff = timeEnd - timeStart; //in ms
		var secDiff = hourDiff / 1000; //in s
		var minDiff = hourDiff / 60 / 1000; //in minutes
		var hDiff = hourDiff / 3600 / 1000; //in hours
		var humanReadable = {};
		humanReadable.hours = Math.floor(hDiff);
		humanReadable.minutes = minDiff - 60 * humanReadable.hours;
		// console.log(humanReadable); //{hours: 0, minutes: 30}


		htmlHist += '<tr><td class="horaOrig">' + horaStart + " do dia " + dataStart +  '</td>';
		htmlHist += '<td class="orig">' + historico[i].startAddress + '</td>';
		htmlHist += '<td class="dest">' + historico[i].endAddress + '</td>';
		htmlHist += '<td class="valor">R$ ' + historico[i].cost + '</td>';
		htmlHist += '<td class="mais" onclick="showDetails(' + i + ')">Ver detalhes</td>';
		htmlHist += '</tr></tbody>';

		// htmlDet += '<div id="modalHistbox" class="modalHistbox">';
		htmlDet += '<div class="detalhes"><span class="fecharModalHist" onclick="closeModalHist(i)">&times;</span><p class="detalhamentos"><b>Detalhamentos</b></p>';
		htmlDet += '<div class="trajeto"><p>Trajeto</p>';
		htmlDet += '<p>' + historico[i].startAddress + '</p>';
		htmlDet += '<p>' + historico[i].endAddress + '</p>';
		htmlDet += '<div class="dddspan"><span>Distância</span></div><div class="dddspan"><span>Duração</span></div><div class="dddspan"><span class="dddspan">Valor</span></div>';
		htmlDet += '<div class="ddd"><span>' + historico[i].distance + ' km</span></div><div class="ddd"><span>' + humanReadable.minutes + ' min</span></div><div class="ddd"><span>R$ ' + historico[i].cost + '</span></div>';
		htmlDet += '<div class="fcspan"><span>Fornecedor</span></div><div class="fcspan"><span>Categoria</span></div><br>';
		htmlDet += '<div class="fc"><span>' + historico[i].playerService.player.name + '</span></div><div class="fc"><span>' + historico[i].playerService.description + '</span></div></div>';
		htmlDet += '<div class="cdc"><p>Centro de Custo</p><input class="" value="' + historico[i].companyCostCentre.name + '" placeholder="" readonly>';
		htmlDet += '<p>Projeto</p><span><input class="" value="" placeholder=""></span>';
		htmlDet += '<p>Justificativa</p><span><input class="" value="" placeholder=""></span></div>';
		htmlDet += '<div class="obs"><p>Observações</p><textarea rows="9" cols="35" name="comment" form="usrform" placeholder="Escreva aqui suas anotações..."></textarea></div>';
		htmlDet += '</div>';
		// htmlDet += '</div>';




		// html += '<div class="detalhes"><span class="histplay"><b>' + historico[i].playerService.player.name + '</b> - ' + historico[i].playerService.description + '</span>';
		// html += '<span class="valor"><b>Valor da corrida: </b>R$ ' + historico[i].cost + '</span><br><br>';
		// html += '<img class="ponto" src="img/yellow.png"><span class="orig"><b>Origem: </b>' + historico[i].startAddress + '</span>';
		// html += '<span class="horaOrig"><b>Horário de saída: </b>' + horaStart + " de " + dataStart +  '</span><br><br>';
		// html += '<img class="ponto" src="img/yellow.png"><span class="dest"><b>Destino: </b>' + historico[i].endAddress + '</span>';
		// html += '<span class="horaDest"><b>Horário de chegada: </b>' + horaEnd + " de " + dataEnd +  '</span><br><br>';
		// html += '<span class="dist"><b>Distância percorrida: </b>' + historico[i].distance / 100 + ' km</span>';
		// html += '<span class="cdc"><b>Centro de custo: </b>' + historico[i].companyCostCentre.name + '</span>';
		// html += '<span class="project"><br><br><b>Projeto: </b>' + historico[i].project + '</span>';
		// html += '<span class="demora"><b>Duração da viagem: </b>' + (horaEnd - horaStart) + '</span>';
		// html += '<div class="texto"><br><br><p><b>Observação:</b></p><textarea rows="4" cols="50" name="comment" form="usrform" placeholder="Escreva aqui suas anotações..."></textarea></div>';
		// // html += '<span class="salvoTxt">Salvo</span>';
		//
		// html += '<img class="detalhar" src="./img/dropdown.png" title="Mostrar Detalhes" onclick="showDetails(' + i + ')">';
		// html += '<img class="esconder" src="./img/dropup.png" title="Esconder Detalhes" onclick="hideDetails(' + i + ')"></div>';
		// html += '<span class="valor"><b>Valor da corrida: </b>R$ ' + historico[i].cost + '</span></div>';
	}
	// htmlHist+="</table>"
	document.getElementById('historico').innerHTML = htmlHist;
	document.getElementById('modalHistbox').innerHTML = htmlDet;
	// console.log(Math.abs(horaEnd - horaStart));
}

// Modal
var modalHist = document.getElementById('modalHistorico');
var btnHist = document.getElementsByClassName("mais")[i];
var spanHist = document.getElementsByClassName("fecharModalHist")[i];

function showDetails(i) {
	document.getElementById("modalHistorico").style.display = "block";
	document.getElementsByClassName('detalhes')[i].style.display = "inline";
	document.getElementsByClassName('trajeto')[i].style.display = "inline-block";
	document.getElementsByClassName('cdc')[i].style.display = "inline-block";
	document.getElementsByClassName('obs')[i].style.display = "inline-block";
}

function closeModalHist(i) {
	document.getElementById("modalHistorico").style.display = "none";
	// document.getElementsByClassName('detalhes')[i].style.display = "block";
	document.getElementsByClassName('trajeto')[i].style.display = "none";
	document.getElementsByClassName('cdc')[i].style.display = "none";
	document.getElementsByClassName('obs')[i].style.display = "none";
}
//
// function hideDetails(i){
// 	document.getElementsByClassName('detalhar')[i].style.display = "block";
// 	document.getElementsByClassName('esconder')[i].style.display = "none";
// 	document.getElementsByClassName('dist')[i].style.display = "none";
// 	document.getElementsByClassName('cdc')[i].style.display = "none";
// 	document.getElementsByClassName('project')[i].style.display = "none";
// 	document.getElementsByClassName('demora')[i].style.display = "none";
// 	document.getElementsByClassName('texto')[i].style.display = "none";
//
// }
//
// function openNavHist() {
// 	document.getElementById("sidemenu").style.width = "250px";
// 	document.getElementById("taxi").style.marginLeft = "250px";
// 	document.getElementById("perfil").style.marginLeft = "150px";
// 	document.getElementById("boxHist").style.marginRight = "270px";
// }
// function closeNavHist() {
// 	document.getElementById("sidemenu").style.width = "0";
// 	document.getElementById("taxi").style.marginLeft = "50px";
// 	document.getElementById("perfil").style.marginLeft = "0px";
// 	document.getElementById("boxHist").style.marginLeft = "100px";
// }
