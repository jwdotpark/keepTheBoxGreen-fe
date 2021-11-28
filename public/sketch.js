function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function preload() {
  covid = loadImage('/assets/covid.png');
  dust = loadImage('/assets/dust.png');
  focus_image = loadImage('/assets/focus.png');
  font = loadFont("/assets/neodgm_pro.woff");
}

// particle class
let particles = []; // array to hold particle objects
class particle {
  constructor() {
    // initialize coordinates
    this.posX = random(width);
    this.posY = random(height);
    this.initialangle = random(0, 4 * PI);
    this.size = random(0, 5); // speed of particle somehow?
    this.radius = sqrt(random(pow(width * 20 / 1, 2)));
    this.update = function (time) {
      // x position follows a circle
      let w = 0.5; // angular speed
      let angle = w * time + this.initialangle;
      this.posX = width / 2 + this.radius * sin(angle) + random(-1, 1);
      // different size particles fall at slightly different y speeds
      this.posY += sin(this.size, 16) + random(-2, 2);
      // delete particle if past end of screen
      if (this.posY > height) {
        let index = particles.indexOf(this);
        particles.splice(index, random(50)); // remove particle from array
      }
    };

    this.covidDisplay = function () {
      image(covid, this.posX, this.posY);
    };

    this.dustDisplay = function () {
      image(dust, this.posY, this.posX);
    };
  }
}

//wave constant
let yoff = -1.0;

// font init
let font;
let pts;

let xz = 0;
let yz = 500;

// text noise helper
function ns(x, y, z, scale_, min_, max_) {
  return map(
    noise(x * scale_, y * scale_, z * scale_),
    0, 1, min_, max_);
}

// cursor follow eased constant
let tx = 1;
let ty = 1;
let easing = 0.05;

const breakPopUp = () => {
  textAlign(CENTER, TOP);
  fill(255, 0, 0, 255);
  textSize(128);
  text("Take a Break!!",
    constrain(width / 2 + random(0, 10), 0, width - textWidth("Break!!")),
    constrain(height / 2 + random(0, 10), 0, height - 48 + textDescent()));
}


function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);

  // font point arr
  pts = font.textToPoints('#KeepTheBoxGreen', 24, 48, 50,
    {
      sampleFactor: 0.2,
      simplifyThreshold: 0
    });
}

function draw() {
  let temp = localStorage.getItem("temperature") // 25
  let hum = localStorage.getItem("humidityHeight");
  // red   (255, 0,   0, 255)
  // green (0,   255, 0, 255)
  // blue  (255, 255, 0, 255)
  //          255           255        255       
  // background((temp * 10 - 200), (temp * 7.5), (temp * 5 - 100), 150);
  background((temp * 12 - 300), (255 + 100 - temp * 7), (250 - temp * 10), 150);


  // wave
  fill(0, 0, hum * 200, hum * 200);
  beginShape();
  let xoff = 0;
  // Iterate over horizontal pixels
  for (let x = 0; x <= width; x += 5) {
    // Calculate a y value according to noise, map to
    let y = map(noise(xoff, yoff), 0, 1, 200, 250);
    // height value from the form
    vertex(x, y / localStorage.getItem("humidityHeight") * 2);
    // Increment x dimension for noise
    xoff += 0.01;
  }
  // increment y dimension for noise
  yoff += 0.02;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // particle
  // fill(0, 0, 0, random(255));
  const particleNum = localStorage.getItem("particle");

  let t = frameCount / 6000; // update time
  // create a random number of particle each frame
  for (let i = 0; i < particleNum / 50; i++) {
    particles.push(new particle())  // append particle object
  }
  // loop through particles with a for..of loop
  for (let particle of particles) {
    particle.update(t * particleNum / 200); // update particle position
    particle.covidDisplay();
    particle.dustDisplay();
  }


  // cursor easing
  let targetX = mouseX;
  let dx = targetX - tx;
  tx += dx * easing;

  let targetY = mouseY;
  let dy = targetY - ty;
  ty += dy * easing;

  // sittingtime object
  const sittingTime = localStorage.getItem("sittingTime");
  imageMode(CENTER);
  image(focus_image,
    tx + random((sittingTime / 10)),
    ty + random((sittingTime / 10)),
    sittingTime * 7, // max 60 * 7 px
    sittingTime * 7,
  );



  // text morp
  // noStroke();
  stroke(0, 0, 0, 120 - sittingTime * 2)
  fill(20, 120 + sittingTime * 3, 20, 120 - sittingTime * 2);
  push();
  // translate(24, height / 5);
  for (let i = 0; i < pts.length; i++) {
    let xoff = ns(pts[i].x, pts[i].y, xz, 0.005, -50, abs(sin(millis() * .0005)) * 100);
    let yoff = ns(pts[i].y, pts[i].x, yz, 0.005, -50, 50);
    rect(pts[i].x + xoff / 2, pts[i].y + yoff / 2, 4, 4);
  }
  pop();
  xz += 1;
  yz += 1;

  // warning popup
  if (sittingTime > 45) {
    breakPopUp();
  } else {
    return null;
  }

}
