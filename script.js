var canvas, ctx, container;
canvas = document.querySelector( 'canvas' );
ctx = canvas.getContext("2d");
var fluid;
var ball;
var bWeight, bSize, fDensity;
var vy;
var buoy;

var drop = false;

//Accelaration as ball drops is affected by this variable
var gravity = 0.5;

//Bounce of the ball if the ball hits the floor
var bounce = 0.1;

function init(){
    setupCanvas();
    getValues();

    buoy = 0
    vy = 0;
    fluid = {x:0, y:canvas.height/1.5, height:canvas.height-(canvas.height/1.5), width:canvas.width, density:fDensity, color:"blue"}
    ball = {x:canvas.width / 2, y:50, radius:bSize*10, weight:bWeight, color:"red"};

}//end init method



//Get values from range inputs
function getValues(){
  bWeight = $(".ballWeight input").val();
  $(".ballWeight p").text("Ball Weight: " + bWeight + " g");

  bSize = $(".ballSize input").val();
  $(".ballSize p").text("Ball Size: " + bSize + " cm^3");

  fDensity = $(".fluidInfo input").val();
  $(".fluidInfo p").text("Fluid Density: " + fDensity + " g/cm^3");
}



//Button functions
function buttons(){
  //Drop Ball
  $(".drop").click(function(event) {
    drop = true;
  });

  //Reset everything
  $(".reset").click(function(event) {
    $(".ballWeight input").val(50);
    $(".ballSize input").val(2);
    $(".fluidInfo input").val(50);
    drop = false;
    vy = 0;
    ball.y = 50;
  });
};

//Function that draws all objects on canvas
function draw() {
   ctx.clearRect(0,0,canvas.width, canvas.height); 

   //draw fluid
   ctx.fillStyle = fluid.color;
   ctx.fillRect(fluid.x, fluid.y, fluid.width, fluid.height)
   
    //draw cirlce
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
    
    ballMovement();

}

setInterval(draw, 1000/35); 


//Function that updates all movement of ball
function ballMovement(){
    getValues();
    buttons();

    if (drop){//if drop is True, ball movement activates
      if ((ball.y+ball.radius) < fluid.y){
      ball.y += vy;
      vy += gravity;
      }
      else{//Ball reaches fluid

        //Ball more dense than fluid
        if(bWeight/bSize >= fDensity){
          ball.y += vy;
          vy += gravity/fDensity
        }
        else{//Ball less dense than fluid
          ball.y += vy;
          vy /= ((fDensity)/(bWeight/bSize));

          //used to slow down fluid accelaration
          buoy = fDensity/bWeight
          vy -= ((fDensity)/(bWeight+buoy));

          //stop movement of ball (removed this part because the bounce of the ball shows a bit more realism)
          // if(parseInt((ball.y-ball.radius)+((ball.radius*2)-(ball.radius*2)*(bWeight/bSize/fDensity))) == parseInt(fluid.y)){
          //   vy = 0;
          // }

        }

        
      }
      
      // Ball hits the floor
      if (ball.y + ball.radius > canvas.height){
        
          // Re-positioning on the base
         ball.y = canvas.height - ball.radius;
          //bounce the ball
            vy *= -bounce;
          //do this otherwise, ball never stops bouncing
            if(vy<0 && vy>-2.1){
                vy=0;
            }

      }

    }
    else{//if drop is False, the ball resets
      ball.radius = bSize*10;
      ball.weight = bWeight;
      fluid.density = fDensity;
    }


    

        
}

//Setup Canvas
function setupCanvas() {

  container = document.createElement( 'div' );
  container.className = "container";
 
  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight - $('.controls').height(); 
  document.body.appendChild( container );
  container.appendChild(canvas);  
 
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth =2; 
}