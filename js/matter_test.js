// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine;
var world;
var render;
var ground;
var boxes = [];

function setup() {
    //createCanvas(40, 40);
    engine = Engine.create();
    world = engine.world;
    render = Render.create({
        element: document.body,
        engine: engine
    });
    var options = {
        isStatic: true
    }
    ground = Bodies.rectangle(400, 610, 810, 60, options);
    World.add(world, ground);  
    Engine.run(engine);
    Render.run(render);
}

function mouseDragged() {
    boxes.push(new Box(mouseX, mouseY, random(10, 40), random(10, 40)));
}


function draw() {
    background(51);
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].show;
    }
    noStroke(255)
    fill(170);
    rectMode(CENTER);
    rect(ground.position.x, ground.position.y, width, 10);
}
