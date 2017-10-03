var historico;

function getHistorico(){
	var url = "http://api.taximanager.com.br/v1/taximanager/companies/1/travels?limit=50&employeeId=147";
	// var url = "http://api.taximanager.com.br/v1/taximanager/companies/1/travels?limit=50&";

	var http = new XMLHttpRequest();

	http.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//console.log(JSON.parse(this.responseText).records);
			historico = JSON.parse(this.responseText).records;
			// console.log(historico);
			showHist()
		}
	};

	http.open("GET", url, true);
	http.setRequestHeader("Accept", "application/json");
	http.setRequestHeader("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTAwMzM4MjU0fQ.B2Nch63Zu0IzJDepVTDXqq8ydbIVDiUmU6vV_7eQocw");
	http.send();
}


function showHist(){
	var htmlHist = "<table><tbody><tr><th>Data e Hora</th><th>Partida</th><th>Destino</th><th>Valor</th></tr>";
	var htmlDet = "";

	for (var i = 0; i < ((IE) ? historico.length : historico.length); i++){

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

		htmlHist += '<tr><td class="horaOrig">' + horaStart + " do dia " + dataStart +  '</td>';
		htmlHist += '<td class="orig">' + historico[i].startAddress + '</td>';
		htmlHist += '<td class="dest">' + historico[i].endAddress + '</td>';
		htmlHist += '<td class="valor">R$ ' + historico[i].cost + '</td>';
		htmlHist += '<td class="mais" onclick="showDetails(' + i + ')">Ver detalhes</td>';
		htmlHist += '</tr></tbody>';

		htmlDet += '<div class="detalhes"><span class="fecharModalHist" onclick="closeModalHist(' + i + ')">&times;</span><p class="detalhamentos"><b>Detalhamentos</b><small>' + dataStart + ' às ' + horaStart + ' - R$' + historico[i].cost + '</small></p>';
		// htmlDet += '<span class="spanteste">' + dataStart + ' às ' + horaStart + ' - R$' + historico[i].cost + '</span>';


		htmlDet += '<div class="trajeto"><p>Trajeto</p>';
		// htmlDet += '<img src="./img/doc-gray-circle.png"> <p>' + historico[i].startAddress + '</p>';
		htmlDet += '<p>' + historico[i].startAddress + '</p>';
		// htmlDet += '<img src="./img/circle-outline.png"><p>' + historico[i].endAddress + '</p>';
		htmlDet += '<p>' + historico[i].endAddress + '</p>';
		htmlDet += '<div class="dddspan"><span>Distância</span></div><div class="dddspan"><span>Duração</span></div><div class="dddspan"><span class="dddspan">Valor</span></div>';
		htmlDet += '<div class="ddd"><span>' + historico[i].distance + ' km</span></div><div class="ddd"><span>' + Math.round(humanReadable.minutes).toFixed(0) + ' min</span></div><div class="ddd"><span>R$ ' + historico[i].cost + '</span></div>';
		htmlDet += '<div class="fcspan"><span>Fornecedor</span></div><div class="fcspan"><span>Categoria</span></div><br>';
		htmlDet += '<div class="fc"><span>' + historico[i].playerService.player.name + '</span></div><div class="fc"><span>' + historico[i].playerService.description + '</span></div></div>';
		htmlDet += '<div class="cdc"><p>Centro de Custo</p><input class="" value="' + historico[i].companyCostCentre.name + '" placeholder="" readonly>';
		htmlDet += '<p>Projeto</p><span><input class="" value="" placeholder=""></span>';
		htmlDet += '<p>Justificativa</p><span><input class="" value="" placeholder=""></span></div>';
		htmlDet += '<div class="obs"><p>Observações</p><textarea rows="9" cols="35" name="comment" form="usrform" placeholder="Escreva aqui suas anotações..."></textarea></div>';
		htmlDet += '</div>';
	}
	htmlHist+="</table>";
	document.getElementById('historico').innerHTML = htmlHist;
	document.getElementById('modalHistbox').innerHTML = htmlDet;
}

// Modal
// var modalHist = document.getElementById('modalHistorico');
// var btnHist = document.getElementsByClassName("mais")[i];
// var spanHist = document.getElementsByClassName("fecharModalHist")[i];

function showDetails(i) {
	document.getElementById("modalHistorico").style.display = "block";
	document.getElementById("modalHistbox").style.display = "block";
	document.querySelectorAll('.detalhes')[i].style.display = "inline";
	document.querySelectorAll('.trajeto')[i].style.display = "inline-block";
	document.querySelectorAll('.cdc')[i].style.display = "inline-block";
	document.querySelectorAll('.obs')[i].style.display = "inline-block";
}

function closeModalHist(i) {
	document.getElementById("modalHistorico").style.display = "none";
	document.getElementById("modalHistbox").style.display = "none";
	document.querySelectorAll('.detalhes')[i].style.display = "none";
	document.querySelectorAll('.trajeto')[i].style.display = "none";
	document.querySelectorAll('.cdc')[i].style.display = "none";
	document.querySelectorAll('.obs')[i].style.display = "none";
}
