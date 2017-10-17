<?php
header('Access-Control-Allow-Origin: *'); 

ini_set('display_errors',"0");


$url["api"] = "http://estimate.taximanager.com.br/v1/estimates";
//$url["api"] = "http://myfirstelasticbeanstalkapplication.g2xtaf7nbz.us-east-1.elasticbeanstalk.com/v1/estimates";
$auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTAwMzM4MjU0fQ.B2Nch63Zu0IzJDepVTDXqq8ydbIVDiUmU6vV_7eQocw';
//$auth = '65edc9b5-d134-4c8b-9be5-ee2c722f4a54';

$displayPlayers = "none";
if(isset($_POST["start"]) && isset($_POST["end"]) && $_POST["start"]!= "" && $_POST["end"]!= ""){

  $displayPlayers = "inline";

  $url["start"] = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=".urlencode($_POST["start"])."&key=AIzaSyBt2Qh55dqMxFRIVV3ylCwyWuEW09P-y2c";
  $url["end"] = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=".urlencode($_POST["end"])."&key=AIzaSyBt2Qh55dqMxFRIVV3ylCwyWuEW09P-y2c";
  $url["details"] = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBt2Qh55dqMxFRIVV3ylCwyWuEW09P-y2c&placeid=";


  $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url["start"]);
    $result = curl_exec($ch);
    curl_close($ch);


  $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url["details"].json_decode($result)->predictions[0]->place_id);
    $result = curl_exec($ch);
    curl_close($ch);


  $start['place_id'] = json_decode($result)->result->place_id;
  $start['lat'] = json_decode($result)->result->geometry->location->lat;
  $start['lng'] = json_decode($result)->result->geometry->location->lng;
  $start['adress'] = json_decode($result)->result->formatted_address;
  $start['city'] = json_decode($result)->result->address_components[2]->short_name;
  $start['state'] = json_decode($result)->result->address_components[3]->short_name;




  $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url["end"]);
    $result = curl_exec($ch);
    curl_close($ch);


  $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url["details"].json_decode($result)->predictions[0]->place_id);
    $result = curl_exec($ch);
    curl_close($ch);


  $end['place_id'] = json_decode($result)->result->place_id;
  $end['lat'] = json_decode($result)->result->geometry->location->lat;
  $end['lng'] = json_decode($result)->result->geometry->location->lng;
  $end['adress'] = json_decode($result)->result->formatted_address;
  $end['city'] = json_decode($result)->result->address_components[2]->short_name;
  $end['state'] = json_decode($result)->result->address_components[3]->short_name;



  $url["distance"] = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=".$start["lat"].",".$start["lng"]."&destinations=".$end["lat"].",".$end["lng"]."&key=AIzaSyDaMueYa5V3V-KwlbAfqd5EfTh52fpybeE";

  $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url["distance"]);
    $result = curl_exec($ch);
    curl_close($ch);

  $result = json_decode($result);
  $result;
  $duration = $result->rows[0]->elements[0]->duration->value/60;
  $distance = $result->rows[0]->elements[0]->distance->value;


  $data = array('start' => $start,
                'end' => $end,
                'duration' => $duration,
                'distance' => $distance
  );

  $json = json_encode($data);

  $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_URL, $url["api"]);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      "Content-Type: application/json",
      "Authorization: $auth"
      ));

    curl_setopt($ch, CURLOPT_POSTFIELDS, $json);

    $result = curl_exec($ch);
    curl_close($ch);

  $opcoes = json_decode($result)->records;
}

?>










<!DOCTYPE html>
<html>
<head>
  <title>Taxi Manager</title>
  <!-- <meta name="viewport" content="initial-scale=1.0, user-scalable=no"> -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta charset="utf-8">
  <link href="./css/sidemenu.css" rel="stylesheet">
  <link href="./css/players.css" rel="stylesheet">
  <!--<link rel="stylesheet" href="./node_modules/bootstrap/dist/css/bootstrap.min.css">-->
  <link href="./css/style.css" rel="stylesheet">
  <script src="./js/index.js"></script>
  <script src="./js/variaveis.js"></script>
  <script src="./js/historico.js"></script>
  <script src="./js/favoritos.js"></script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBoViFoLS2catNnjAB4SyWSh4_niA69D34&libraries=places&callback=initMap" async defer></script>
  <link href="./css/historico.css" rel="stylesheet">
  <link href="./css/favoritos.css" rel="stylesheet">
  <link href="./css/modal.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Share" rel="stylesheet">
</head>

<body>

  <!-- Header -->
  <div id="header">

    <!-- Modal para Favoritos -->
    <div id="modalFavorito" class="modalFav">
      <div class="modalFavbox">
        <span class="closeModalFav" onclick="closeModalFav()">&times;</span>
        <p><b>Novo Favorito</b></p>
        <input class="nomeFav" value="" placeholder="Nome" onkeyup="novoFav.name=this.value">
        <input class="localFav" value="" placeholder="Endereço" onkeyup="verifyAutocompleteFav(0)">
        <button class="saveFav" type="button" name="button" onclick="adicionarFav(1)">Salvar</button>
        <button class="cancelFav" type="button" name="button" onclick="closeModalFav()">Cancelar</button>
      </div>
    </div>

    <!-- Modal de historico -->
    <div id="modalHistorico" class="modalHist">
      <div id="modalHistbox">
      </div>
    </div>

    <!-- Menu Hamburger -->
    <div id="menu">
      <div id="hamburger" onclick="openNav(this)">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
      <img id="exi" src="./img/x.png" alt="" onclick="closeNav()">
      <div id="texto">
        <a href="#" class="duvidas">Dúvidas Frequentes</a>
        <a href="index.html" class="logout">Logout</a>
      </div>
      <img id="taxi" src="./img/Logo_TaxiManager.png" alt="">
    </div>

    <div id="subheader">
      <div id="sobre">
        <h4><b>Sobre o TM</b></h4>
        <p href="#">Como Funciona?</p>
        <p href="#">Segurança</p>
      </div>
      <div id="config">
        <h4><b>Configurações</b></h4>
        <p>Meu Perfil</p>
        <p onclick="menuHist()">Meu Histórico</p>
        <p onclick="menuFav()">Favoritos</p>
      </div>
      <footer id="politica">
        <img id="userLocal" src="./img/location.png" onclick="centralizar()">
        <div id="localizacaoUser">
          <!-- <span>São Paulo - Brasil</span> -->

        </div>
        <a href="#">Política de Uso</a>
      </footer>
    </div>

    <!-- Menu Historico -->
    <div id="menuHistorico">
      <h1>Meu Histórico</h1>
      <img id="exiHist" src="./img/x.png" alt="" onclick="closeMenuHist()">
      <div id="historico2">
          <table><tr><th>Data e Hora</th><th>Partida</th><th>Destino</th><th>Valor</th></tr><tr><td class="horaOrig">21:53:51 do dia 30/7/2017</td><td class="orig">Rua Pamplona - Jardim Paulista, São Paulo - SP, Brasil</td><td class="dest">Rua das Grumixamas - Jardim Oriental, São Paulo - SP, Brasil</td><td class="valor">R$ 56</td><td class="mais" onclick="showDetails(0)">Ver detalhes</td></tr><tr><td class="horaOrig">21:53:51 do dia 1/8/2017</td><td class="orig">Avenida Paulista - Bela Vista, São Paulo - SP, Brasil</td><td class="dest">Rua Mourato Coelho - Pinheiros, São Paulo - SP, Brasil</td><td class="valor">R$ 40</td><td class="mais" onclick="showDetails(1)">Ver detalhes</td></tr><tr><td class="horaOrig">21:53:51 do dia 5/9/2017</td><td class="orig">Rua Pamplona - Jardim Paulista, São Paulo - SP, Brasil</td><td class="dest">Rua das Grumixamas - Jardim Oriental, São Paulo - SP, Brasil</td><td class="valor">R$ 30</td><td class="mais" onclick="showDetails(2)">Ver detalhes</td></tr><tr><td class="horaOrig">21:53:51 do dia 5/9/2017</td><td class="orig">Rua São Carlos do Pinhal - Bela Vista, São Paulo - SP, Brasil</td><td class="dest">Rua Pamplona - Jardim Paulista, São Paulo - SP, Brasil</td><td class="valor">R$ 20</td><td class="mais" onclick="showDetails(3)">Ver detalhes</td></tr><tr><td class="horaOrig">12:29:52 do dia 1/6/2017</td><td class="orig">Unnamed Road, Brasília, Distrito Federal, Brasil - STJ</td><td class="dest">Via S2  Asa Sul Distrito Federal Brasília</td><td class="valor">R$ 17.92</td><td class="mais" onclick="showDetails(4)">Ver detalhes</td></tr><tr><td class="horaOrig">11:44:32 do dia 1/6/2017</td><td class="orig">Brasília - DF, 70346-090, Brasil, 06, 06, Asa Sul, Brasília, BRA - Brasil 21 bloco E</td><td class="dest">Unnamed Road  Brasília Distrito Federal Brasília</td><td class="valor">R$ 21.23</td><td class="mais" onclick="showDetails(5)">Ver detalhes</td></tr></table>
      </div>
    </div>

    <!-- Menu Favoritos -->
    <div id="menuFavorito">
      <h1>Meus Favoritos</h1>
      <img id="exiFav" src="./img/x.png" alt="" onclick="closeMenuFav()">
      <div id='cabecalho'>
        <span class="n">Nome</span>
        <span class="e">Endereço</span>
        <span>Excluir</span>
        <button id='novoFav' type='button' onclick='showModalFav()'>Adicionar Local</button>
      </div>
      <ul id="favoritos">
        <li>
        </li>
      </ul>
    </div>
  </div>

  <!-- Box do usuário -->
  <div id="box">
    <div id="user">
      <img id="imgPerfil" src="./img/itau-logo.png" alt="">
      <span>Olá, Fulano. Seja bem-vindo</span>
      <img id="setabaixo" src="./img/dropdown.png" onclick="showBox()">
      <img id="setacima" src="./img/dropup.png" onclick="hideBox()">
    </div>
    <div id="box-content">
      <p id="datntim"></p>

      <form action="/IE8/mapa.php" method="POST">
        <div id="go">
          <img id="invert" src="./img/connection.png" alt="" onclick="inverter()">
          <input id="btn_submit" type="submit" value=">">
        </div>
        <div id="inputs">
          <input id="origin-input" class="controls" type="text" name="start" placeholder="Local de origem" onfocus="foco=1" style="border-bottom: 1px solid #BBB" onkeyup="verifyAutocomplete('origin-input')" value="<?php if(isset($start)) echo $start['adress'] ?>">
          <div id="autocomplete-o"></div>
          <input id="destination-input" class="controls" type="text" name="end" placeholder="Local de chegada" onfocus="foco=2" onkeyup="verifyAutocomplete('destination-input')" value="<?php if(isset($end)) echo $end['adress'] ?>">
          <div id="autocomplete-d"></div>
        </div>
      </form>
      <br>

      <!-- Div de retorno das corridas por Players -->
      <div id="players" class="players" style="display:<?php echo $displayPlayers?>;">
        <div id="corrida">
        </div>
        <div id="infoOp">
          <p>Fornecedor</p>
          <img class="moneyicon" src="./img/money.png" alt="">
          <img class="clockicon" src="./img/clock.png" alt="">
        </div>
        <div id="opcoes">
          <?php
          if(isset($opcoes)){

            if(count($opcoes)==0) echo 'Nenhuma opção disponível';

            echo '<ul class="listaPrecos">';
            for ($i=0; $i < count($opcoes); $i++) {
              echo '<li><img src="img/'. substr($opcoes[$i]->modality->name, 0, 2). '.png"/>';
              echo "<div class='spacetipo'><span>". $opcoes[$i]->modality->name. "</span></div><span class='spaceprice'>". $opcoes[$i]->price. "</span><span>". ($opcoes[$i]->waiting_time / 60). " min</span>";
              echo "<div class='a'><a href=''>IR</a></div></li>";

              if(isset($opcoes[$i+1]) && $opcoes[$i]->modality->name != $opcoes[$i+1]->modality->name){
                //echo '<li><img src="img/'. substr($opcoes[$i+1]->modality->name, 0, 2). '.png"/>';
              }
              
            }
            echo '</ul>';

          }
          ?>
        </div>
      </div>

      <!-- Box de endereços armazenados em Cache -->
      <div id="cacheBox">
        <!-- <div id="cache">
        </div> -->

      </div>

      <!-- Box de endereços de cada Centro Tecnológico -->
      <div id="cTec">
      </div>

      <!-- Box de endereços salvos em Favoritos -->
      <div id="favMapa">
      </div>
    </div>
  </div>

  <!-- Div do Mapa -->
  <div id="map" class="col-sm-12">
  </div>
</body>

</html>

