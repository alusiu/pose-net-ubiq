let video;
var gong; 
let button;
let poseNet;
let canvas;

// variables for different points of those poses... 
let noseY = 0;
let noseX = 0;
let wristRX = 0;
let wristRY= 0;
let kneeRX = 0;
let kneeRY= 0;

var dataServer;
var pubKey = 'pub-c-6d662bd2-2eb8-44cc-9713-56d757e82478';
var subKey = 'sub-c-7757ee3e-6220-11e9-ae53-666e2ad6cdf0';
var returnedAnswer = [];
var wRresponse;
var channelName = "pose";
var refresh = 300;
var lastRefresh = 0;

var noses = [];

dataServer = new PubNub(
    {
      publish_key   : pubKey,  //get these from the pubnub account online
      subscribe_key : subKey,  
      ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
    });

dataServer.addListener({ message: readIncoming})
dataServer.subscribe({channels: [channelName]});

function setup() {

    // this set up taken for Shiffman's tutorial
    canvas = createCanvas(640, 480);
    video = createCapture(VIDEO);
	video.hide();
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', gotPoses);

// randomly choose a colour of nose upon set up
    r = random(255);
    g = random(255);
    b = random(255);

    fill(r, g , b);
   
    noses.push(new AllNoses(noseX,noseY,dataServer.getUUID(),r,g,b));

   

}

function loaded() {
    console.log("loaded!");
}
// make the poses 
function gotPoses(poses) {
	if (poses.length > 0) {
        let nx = poses[0].pose.keypoints[0].position.x;
		let ny = poses[0].pose.keypoints[0].position.y;
		noseX = lerp(noseX, nx, 0.5);
        noseY = lerp(noseY, ny, 0.5);
	}
}

function modelReady() {
	console.log("model ready!");
}


function draw() {

    // draw the image and the ellipse each frame 
    image(video, 0, 0);

    // send the coordinates of the nose every 300 ms 

     if (millis() - lastRefresh > refresh )  {
        sendTheMessage();
        lastRefresh = millis();
    }

    // for every nose in the array draw a new nose... ??
    for (var i = 0; i < noses.length; i++) {
        ellipse(noses[i].x, noses[i].y, 50);
        fill(noses[i].r, noses[i].g, noses[i].b);
        // if this isn't the first nose.. 
        if ((noses[i] != 0)) {
                        // see if they overlap and if they do then draw a text maybe?? nose; 
           if ((nose[i].x < nose[i-1].x + 50 > nose[i].x ) && (nose[i].y < nose[i-1].y)) {

           }
          
        }

    }

}

function AllNoses(x,y,who,otherr,otherg,otherb){
    this.x = x;
    this.y = y;
    this.who = who;
    console.log(otherr);
    console.log(otherg);
    console.log(otherb);
    this.r = otherr;
    this.g = otherg;
    this.b = otherb;
    console.log(this);

    
  //  this.prevX = x;
   // this.prevY = y;

/*
    this.drawCursor = function() {
    //draw a + sign for each of the cursors
    stroke(0);
    strokeWeight(1);
    ellipse(this.xpos, this.ypos, 50);

    //line(this.xpos,this.ypos-5,this.xpos,this.ypos+5);
    //line(this.xpos-5,this.ypos,this.xpos+5,this.ypos);
    }*/
}

function sendTheMessage() {

    // Send Data to the server to draw it in all other canvases
    dataServer.publish(
      {
        channel: channelName,
        message: 
        {
          x: noseX,
          y: noseY,
          r: r,
          g: g,
          b: b   //text: is the message parameter the function is expecting   
        }
      });
  
  }
  
function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()

    if(inMessage.channel == channelName)
    {
      var whoAreYou = inMessage.publisher;
      var newNoseX = inMessage.message.x;
      var newNoseY = inMessage.message.y;
      var newR = inMessage.message.r;
      var newG = inMessage.message.g;
      var newB = inMessage.message.b;

      var newinput = true;
      for(var i = 0; i<noses.length;i++)
      {
        if(whoAreYou==noses[i].who)
        {
          noses[i].x = newNoseX;
          noses[i].y = newNoseY;
          newinput = false;   
        }
      }
      if(newinput)
      {
        noses.push( new AllNoses(newNoseX,newNoseY,whoAreYou,newR,newG,newB));
    
      }
    }
}

  function whoisconnected(connectionInfo)
  {
  
  }