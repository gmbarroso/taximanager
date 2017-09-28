Synopsis

Desafio proposto pela Mobint: fazer um mapa que calcule a melnhor rota entre dois pontos distintos colocados pelo usuário. Em seguinda, implantar o cálculo de rota com a API do Uber de cálculo de tempo e preço por corrida escolhida.

.node.js
.packgae.json libs:

    	"@google/maps": "^0.4.3",
    
	"body-parser": "^1.17.2",
    
	"express": "^4.15.4",
    
	"mongoose": "^4.11.7",
    
	"node-uber": "^1.0.0",
    
	"nodemon": "^1.11.0",
    
	"oauth": "^0.9.15",
    
	"request": "^2.81.0"

Enfrentei um pouco de dificuldade para implantar a API do Uber com a API do Google Maps (API utilizada para esse projeto). Express, request, nodemon foram bibliotecas instaladas para me auxiliar na API que criei para fazer a implantação.

Para instalhar as bibliotecas utilizei npmjs no terminal do ubunto para o windows. Se utilizar o git clone é possível instalar as bibliotecas apenas com um npm install após npm init

Projeto feito por: 

Guilherme Barroso:
https://github.com/gmbarroso/