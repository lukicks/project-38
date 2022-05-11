var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem, ave, grupodeaves, imagemdaave;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;
var imgFimDeJogo,imgReiniciar, imgIniciar, iniciar;
var somSalto , somCheckPoint, somMorte

function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdaave = loadImage("passaro.png");

  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
    
  imgIniciar = loadImage("start.png");

  imgReiniciar = loadImage("restart.png")
  imgFimDeJogo = loadImage("gameOver.png")
  
  somSalto = loadSound("jump.mp3")
  somMorte = loadSound("die.mp3")
  somCheckPoint = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  trex.scale = 0.5;

  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
    
  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage(imgFimDeJogo);
  
  iniciar = createSprite(300,140);
  iniciar.addImage(imgIniciar);

  reiniciar = createSprite(300,140);
  reiniciar.addImage(imgReiniciar);

  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;
  iniciar.scale = 0.5;
    
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  grupodeaves = new Group();
  
      
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false
  
  pontuacao = 0;
  
} 

function draw() {
  
  background("white");
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, 500,50);
    
  
  if(estadoJogo === JOGAR){
   
    imgIniciar.visible = true
    fimDeJogo.visible = false
    reiniciar.visible = false
    //mudar a animação do Trex
    
    trex.changeAnimation("running", trex_correndo);
    solo.velocityX = -(4 + 3* pontuacao/100)
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);
    
    if(pontuacao>0 && pontuacao%100 === 0){
      somCheckPoint.play() 
    }
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //saltar quando a tecla de espaço é pressionada
    if(keyDown("space")&& trex.y >= 100) {
       trex.velocityY = -12;
       imgIniciar,visible = false
       somSalto.play();
  }
  
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
   
    //gerar as nuvens
    gerarNuvens();
  
    gerarAves();

    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
       //trex.velocityY = -12;
        somSalto.play();
        estadoJogo = ENCERRAR;
        somMorte.play()
      
    }
  }
     else if (estadoJogo === ENCERRAR) {
      fimDeJogo.visible = true;
      reiniciar.visible = true;
       
       if (mousePressedOver(reiniciar)) {
    console.log("reiniciar jogo");
    reset();
  }
       
      //altera a animação do Trex
      trex.changeAnimation("collided", trex_colidiu);
     
       
       
      solo.velocityX = 0;
      trex.velocityY = 0;
       
     
      //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
    grupodeaves.setLifetimeEach(-1);
     
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0);
     grupodeaves.setVelocityXEach(0);   
     }
  
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);

  
  
  drawSprites();
}




function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(600,165,10,40);
  obstaculo.velocityX = -(6 + pontuacao/100);
      
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(80,120));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo 
   grupodenuvens.add(nuvem);
  }
}


function gerarAves() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    ave = createSprite(600,130,40,10);
    ave.y = Math.round(random(80,120));
    ave.addImage(imagemdaave);
    ave.scale = 0.1;
    ave.velocityX = -3;
    
     //atribuir tempo de duração à variável
     ave.lifetime = 200; 
    
    //ajustando a profundidade
    ave.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo 
   grupodeaves.add(ave);
  }
}

function reset() {
  
  estadoJogo = JOGAR;
  reiniciar.visible = false;
  fimDeJogo.visible = false;
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  grupodeaves.destroyEach();
  pontuacao = 0;
  trex.changeAnimation(trex_correndo);
  
}

