var screenWidth = screen.width; //Largura de tela detectada
var whTabuleiro; //Largura e altura do tabuleiro
if(screenWidth<300){
  whTabuleiro=260;
}else{
  if(screenWidth<400){
  whTabuleiro=300;
  }else{
  whTabuleiro=400; 
  }
}
const canvas=document.getElementById('canva')
canvas.width=whTabuleiro; //Largura do canvas
canvas.height=whTabuleiro;  //Altura do canvas
const ctx=canvas.getContext('2d')

var pontos=0 //Pontuação inicial
var corpo=1; //Tamanho do corpo
var Rastro=[] //Coordenadas do rastro
var refreshIntervalId //Variável que armazena a chamada do jogo

//Cobra
var headX=headY=0; //Posição da cabeça
var wh=20; //Altura e largura das partes da cobra
var vx=5; //Velocidade no eixo X
var vy=0; //Velocidade no eixo Y

//Maçã
var appleX,appleY; //Coordenadas da maça

function VerificationApplePosition(){
  let validation=1;
  for(i=0;i<Rastro.length;i++){
    if(Rastro[i].x==appleX  && Rastro[i].y==appleY){
      validation=0;
      break
    }
  }
  return validation
}

function updateApplePosition(){
  appleX=Math.floor(Math.random()*whTabuleiro)
  appleY=Math.floor(Math.random()*whTabuleiro)
  let validation=VerificationApplePosition()
  if(appleX>whTabuleiro-wh || appleX<0 || appleY>whTabuleiro-wh || appleY<0 || appleX%wh!=0 || appleY%wh!=0 || validation==0){
    updateApplePosition();
  }
}

function drawApple(){
  ctx.fillStyle='red'
  ctx.fillRect(appleX,appleY,wh,wh)
}

function drawBoard(){
  ctx.fillStyle='#696969'
  ctx.fillRect(0,0,whTabuleiro,whTabuleiro)
}

function drawSnake(){
  for(var i=0;i<Rastro.length;i++){
    if(i==Rastro.length-1){
      ctx.fillStyle='#66CDAA'
      ctx.fillRect(Rastro[i].x,Rastro[i].y,wh-1,wh-1)         
    }else{
      ctx.fillStyle='#ADFF2F'
      ctx.fillRect(Rastro[i].x,Rastro[i].y,wh-1,wh-1)
    }
  }
}

function drawGameOverScreen(){
  clearInterval(refreshIntervalId) 

  drawBoard();
  drawApple();
  for(var j=0;j<Rastro.length;j++){
    if(j==Rastro.length-1){
      ctx.fillStyle='#952612'
      ctx.fillRect(Rastro[j].x,Rastro[j].y,wh-1,wh-1)         
    }else{
      ctx.fillStyle='#D62805'
      ctx.fillRect(Rastro[j].x,Rastro[j].y,wh-1,wh-1)
    }

    ctx.fillStyle='white'
    ctx.font = '40px serif';
    ctx.textAlign='center'
    ctx.fillText(`GAME OVER`, whTabuleiro/2, whTabuleiro/2);

    ctx.font = '15px serif';
    ctx.fillText(`Digite "Enter" para reiniciar`, whTabuleiro/2, (whTabuleiro/2)+25);
  }
  document.addEventListener('keydown',Restart,true)
  if(screenWidth<=500){
    let restart=document.getElementById('restart')
    restart.style.display="block"
    restart.onclick=()=>{
      Restart(restart)
      restart.style.display="none"
    }
  }
}

function checkGameOver(){
  for(i=0;i<Rastro.length;i++){
    if(Rastro[i].x==headX  && Rastro[i].y==headY){
      drawGameOverScreen()
    }
  }
}

function updatePosition(){
  headX=headX+vx;
  headY=headY+vy;
}

function updatePoints(){
  ctx.font = '20px serif';
  ctx.fillText(`${pontos}`, whTabuleiro-40, 30);
}

function updateHeadPositionCordinate(){
  if(vy==0){
    headX= vx>0 ? headX+(wh-vx) : headX=headX-(wh-(-vx));
  }else{
    headY= vy>0 ? headY=headY+(wh-vy) : headY=headY-(wh-(-vy));
  } 
}

function updateTrail(){
  Rastro.push({x:headX,y:headY});
  while(Rastro.length>corpo){
    Rastro.shift()
  }
}

function score(){
  pontos=pontos+5;
  corpo=corpo+1;
  updateApplePosition()
}

function border(){
  if(headX==whTabuleiro && vx>0){ 
    headX=0
  }
  if(headX==-wh && vx<0){
    headX=whTabuleiro
  }
  if(headY==whTabuleiro && vy>0){
    headY=0
  }
  if(headY==-wh && vy<0){
    headY=whTabuleiro
  }
}

function direct(x,y){
  if( (vy>0 && y<0) || (vx>0 && x<0) || (vy<0 && y>0) || (vx<0 && x>0)){
  }else{
    if( (vy>0 && headY>5) || (vy<0 && headY<whTabuleiro-5) || (vx>0 && headX>5) || (vx<0 && headX<whTabuleiro-5) ){
      vx=x;
      vy=y
    }
  }
}

function checkFood(){
  if(headY==appleY && headX==appleX) score();
}

function Game(){
  updatePosition();
  drawBoard();
  drawApple();
  drawSnake();
  updateHeadPositionCordinate();
  border();
  checkGameOver();
  updateTrail();
  checkFood();
  updatePoints();      
}

function SnakeControl(event){
  switch(event.key){
    case "ArrowLeft": direct(-5,0)
    break;
    case "ArrowUp": direct(0,-5)
    break;
    case "ArrowRight": direct(5,0)
    break;
    case "ArrowDown": direct(0,5)
    break;
  }
  
}

function Start(){
  document.removeEventListener('keydown', Restart, true);
  updateApplePosition()
  document.addEventListener('keydown',SnakeControl,true);
  refreshIntervalId=setInterval(Game, 120)  
}

function Restart(event){
  corpo=1;
  pontos=headX=headY=vy=0;
  vx=5
  Rastro=[]
  if(event.key=="Enter" || event.name=="restart") Start();  

}
    
window.onload=()=>{
  Start();
}


var botoes=document.querySelectorAll('.botao');
botoes.forEach(botao=>{
  botao.onclick=()=>{
  
    switch(botao.name){
      case "left": direct(-5,0)
      break;
      case "top": direct(0,-5)
      break;
      case "right": direct(5,0)
      break;
      case "bottom": direct(0,5)
      break;
    }
  }
})