// FCT NOVA | FCT-UNL (Faculty of Sciences and Technology of New University of Lisbon)
// Integrated Master (BSc./MSc.) of Computer Engineering

// Computer Graphics and Interfaces (2017-2018)

// Lab Work 3 - 3D Object Modelling - Flying Helicopter

// Rúben André Barreiro - no. 42648 - r.barreiro@campus.fct.unl.pt

var gl;

var canvas;

// GLSL programs
var program;

// Render Mode
var WIREFRAME=1;
var FILLED=2;
var renderMode = WIREFRAME;

var projection;
var modelView;
var view;

// Global Instance Variables:
var verticalY = 0;
var rotationY = 0;

var inclinationFlight = 0;

// Projection Variables:
var axonometricAngleThetaElem, axonometricAngleGammaElem;
var currentAxonometricAngleTheta = 68.16;
var currentAxonometricAngleGamma = 19.42;

matrixStack = [];

function pushMatrix() {
    matrixStack.push(mat4(modelView[0], modelView[1], modelView[2], modelView[3]));
}

function popMatrix() {
    modelView = matrixStack.pop();
}

function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}

function multRotX(angle) {
    modelView = mult(modelView, rotateX(angle));
}

function multRotY(angle) {
    modelView = mult(modelView, rotateY(angle));
}

function multRotZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
}

function multMatrix(m) {
    modelView = mult(modelView, m);
}

function multScale(s) {
    modelView = mult(modelView, scalem(s));
}

function initialize() {
    gl.clearColor(0.0, 0.6, 1.0, 1.0);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    
    axonometricAngleThetaElem = document.getElementById("axonometricAngleTheta");
    axonometricAngleGammaElem = document.getElementById("axonometricAngleGamma");
    
    program = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
    
    cubeInit(gl);
    sphereInit(gl);
    cylinderInit(gl);

    axonometricAngleThetaElem.addEventListener("input", axonometricAngleThetaChangeHandler);
    axonometricAngleGammaElem.addEventListener("input", axonometricAngleGammaChangeHandler);
    
    setupProjection();
    setupView(currentAxonometricAngleGamma, currentAxonometricAngleTheta);
}

function setupProjection() {
    projection = perspective(60, 1, 0.1, 100);
    //projection = ortho(-1,1,-1,1,0.1,100);
}

function setupView(currentAxonometricAngleGamma, currentAxonometricAngleTheta) {
    // 1) Where the camera are; 2) Where the camera are pointing; 3) Up (y Axis)
    view = lookAt([30,0,50], [5,10,5], [-0.1,1,0.1]);
    
    // Default ModelView
    modelView = mat4(view[0], view[1], view[2], view[3]);

    // Axonometric Projection ModelView
    var mAux = mult(rotateX(currentAxonometricAngleGamma), 
           rotateY(currentAxonometricAngleTheta));
    modelView = mult(modelView, mAux);
}

function setMaterialColor(color) {
    var uColor = gl.getUniformLocation(program, "color");
    gl.uniform3fv(uColor, color);
}

function sendMatrices() {
    // Send the current model view matrix
    var mView = gl.getUniformLocation(program, "mView");
    gl.uniformMatrix4fv(mView, false, flatten(view));
    
    // Send the normals transformation matrix
    var mViewVectors = gl.getUniformLocation(program, "mViewVectors");
    gl.uniformMatrix4fv(mViewVectors, false, flatten(normalMatrix(view, false)));  

    // Send the current model view matrix
    var mModelView = gl.getUniformLocation(program, "mModelView");
    gl.uniformMatrix4fv(mModelView, false, flatten(modelView));
    
    // Send the normals transformation matrix
    var mNormals = gl.getUniformLocation(program, "mNormals");
    gl.uniformMatrix4fv(mNormals, false, flatten(normalMatrix(modelView, false)));  
}

function draw_sphere(color) {
    setMaterialColor(color);
    sendMatrices();
    sphereDrawFilled(gl, program);
}

function draw_cube(color) {
    setMaterialColor(color);
    sendMatrices();
    cubeDrawFilled(gl, program);
}

function draw_cylinder(color) {
    setMaterialColor(color);
    sendMatrices();
    cylinderDrawFilled(gl, program);
}

function draw_scene() {
    
    var d = (new Date()).getTime();
    
    // If the Helicopter it's in the air, the helices of the rotors increases its speed
    if(verticalY > 0) {
        d *= 2;
    }
    
    // SUN:
    pushMatrix();
        multTranslation([20, 50, -20]);
        multScale([20.0, 20.0, 20.0]);
        draw_sphere([4.0, 3.0, 0.0]);
    popMatrix();
    
    // BUILDING #1:
    pushMatrix();
        multTranslation([4, 10, 10]);
        multRotY(45);
    
        pushMatrix();
            multTranslation([2, 10, 2]);
            multScale([2.5, 6, 2.5]);
            draw_cube([0.4, 0.1, 0.1]);
        popMatrix();
    
        multScale([10, 20, 10]);
        draw_cube([0.5, 0.5, 0.5]);
    popMatrix();
    
    // BUILDING #2:
    pushMatrix();
        multTranslation([20, 6, -5]);
    
        pushMatrix();
            multTranslation([1, 7, 1]);
            multScale([1.25, 2.0, 1.25]);
            draw_cube([0.4, 0.1, 0.1]);
        popMatrix();
       
        multScale([6, 12, 6]);
        draw_cylinder([1.0, 0.5, 0.5]);
    popMatrix();
    
    // BUILDING #3:
    pushMatrix();
        multTranslation([16, 7.5, 16]);
        multRotY(30);
    
        pushMatrix();
            multTranslation([0.75, 9, 0.75]);
            multScale([1, 2, 1]);
            draw_cube([0.4, 0.1, 0.1]);
        popMatrix();
     
        multScale([4, 16, 4]);
        draw_cylinder([0.5, 2.0, 0.5]);
    popMatrix();
    
    // BUILDING #4:
    pushMatrix();
        multTranslation([-2, 4.8, -6]);
    
        pushMatrix();
            multTranslation([0.6, 8.8, 0.6]);
            multScale([1, 1.6, 1]);
            draw_cube([0.4, 0.1, 0.1]);
        popMatrix();
    
        pushMatrix();
            multTranslation([0, 6, 0]);
            multScale([4, 4, 4]);
            draw_cylinder([3.0, 0.5, 1.5]);
        popMatrix();
    
        multScale([8, 8, 8]);
        draw_cylinder([1.0, 0.5, 1.5]);
    popMatrix();
    
    // BUILDING #5:
    pushMatrix();
        multTranslation([-6.0, 5.4, 20.0]);
        multRotY(70);
    
        pushMatrix();
            multTranslation([0.6, 8.8, 0.6]);
            multScale([1.0, 1.6, 1.0]);
            draw_cube([0.4, 0.1, 0.1]);
        popMatrix();
    
        pushMatrix();
            multTranslation([0.0, 6.0, 0.0]);
            multScale([5.0, 5.0, 5.0]);
            draw_sphere([3.0, 2.5, 0.0]);
        popMatrix();
    
        multScale([8.0, 12.0, 8.0]);
        draw_cylinder([1.0, 1.5, 1.0]);
    popMatrix();
    
    // CONSTRUCTING BUILDING:
    pushMatrix();
        multTranslation([10, 14, -20]);
        multRotY(135);
    
        pushMatrix();
            multTranslation([0, 9, -10]);
            multRotX(90);
            multScale([4, 30, 4]);
            draw_cube([6.0, 1.0, 0.1]);
        popMatrix();
     
        multScale([4, 28, 4]);
        draw_cube([6.0, 1.0, 0.0]);
    popMatrix();
    
    // RIVER:
    pushMatrix();
        multTranslation([-20, 0.6, 0]);
        multRotY(90);
        multScale([65, 0.5, 10]);
        draw_cube([0.0, 2.0, 2.0]);
    popMatrix();
    
    // GRASS FLOOR:
    pushMatrix();
        multScale([65, 1.5, 65]);
        draw_cube([0.0, 0.8, 0.0]);
    popMatrix();
    
    
    // HELICOPTER:
    multRotY(rotationY);
    multTranslation([-2, 1 + verticalY, -30]);
    
    if(verticalY > 0) {
        multRotZ(inclinationFlight);
    }
    
    // SECONDARY ROTOR:
    // Rotation and Translation in Y axis applied to all the helices
    pushMatrix();
        multTranslation([5.7, 3.2, 0.3]);
        multRotX(90);

        // The Secondary Rotor's Axis
        pushMatrix();
            multScale([0.4, 1, 0.4]);
            draw_cylinder([1.5, 1.5, 0.0]);
        popMatrix();

        multTranslation([0.0, 0.3, 0.0]);
        multRotY(d);

        // Green Helices (Helices mostly scaled in the X axis):
        pushMatrix();
            // Scale applied to the two helices mostly scaled in the X axis
            multScale([1.2, 0.1, 0.4]);
        
            // First Helice (Green #1)
            pushMatrix();
                multTranslation([-0.5, 0, 0]);
                draw_sphere([0, 1, 0]);
            popMatrix();

            // Second Helice (Green #2)
            multTranslation([0.5, 0, 0]);
            draw_sphere([0, 1, 0]);
        popMatrix();

        // Blue Helices (Helices mostly scaled in the Z axis):
        // Scale applied to the two helices mostly scaled in the Z axis
        multScale([0.4, 0.1, 1.2]);

        // Third Helice (Blue #1)
        pushMatrix();
            multTranslation([0, 0, -0.5]);
            draw_sphere([0, 0, 1]);
        popMatrix();

        // Fourth Helice (Blue #2)
        multTranslation([0, 0, 0.5]);
        draw_sphere([0, 0, 1]);
    popMatrix();
    
    
    // MAIN ROTOR:
    // Rotation and Translation in Y axis applied to all the helices
    pushMatrix();
        multTranslation([0.75, 3.2, 0]);

        // The Main Rotor Axis
        pushMatrix();
            multScale([0.4, 1, 0.4]);
            draw_cylinder([1.5, 1.5, 0.0]);
        popMatrix();

        multTranslation([0, 0.25, 0]);
        multRotY(d);

        // Green Helices (Helices mostly scaled in the X axis)
        pushMatrix();
            // Scale applied to the two helices mostly scaled in the X axis
            multScale([4, 0.1, 0.5]);

            // First Helice (Green no. 1)
            pushMatrix();
                multTranslation([-0.5, 0, 0]);
                draw_sphere([0, 1, 0]);
            popMatrix();

            // Second Helice (Green no. 2)
            multTranslation([0.5, 0, 0]);
            draw_sphere([0, 1, 0]);
        popMatrix();

        // Blue Helices (Helices mostly scaled in the Z axis)
        // Scale applied to the two helices mostly scaled in the Z axis
        multScale([0.5, 0.1, 4]);

        // Third Helice (Blue no. 1)
        pushMatrix();
            multTranslation([0, 0, -0.5]);
            draw_sphere([0, 0, 1]);
        popMatrix();

        // Fourth Helice (Blue no. 2)
        multTranslation([0, 0, 0.5]);
        draw_sphere([0, 0, 1]);
    popMatrix();
    
    
    // HELICOPTER'S BODY:
    // CABIN'S WINDOW:
    pushMatrix();
        multTranslation([-1.44, 2.4, 0]);
        multRotZ(-46);
        multRotX(90);
        multScale([0.4, 1.2, 0.8]);
        draw_cylinder([2, 2, 2]);
    popMatrix();

    // CABIN'S DOOR #1:
    pushMatrix();
        multTranslation([0.5, 1.8, 0.75]);
        multRotZ(90);
        multScale([1.6, 0.75, 1.2]);
        draw_cylinder([0.6, 0, 0]);
    popMatrix();

    // CABIN'S DOOR #2:
    pushMatrix();
        multTranslation([0.5, 1.8, -0.75]);
        multRotZ(90);
        multScale([1.6, 0.75, 1.2]);
        draw_cylinder([0.6, 0, 0]);
    popMatrix();

    // CABIN:
    pushMatrix();
        multTranslation([0.45, 1.85, 0]);
        multScale([4.8, 2.4, 2.4]);
        draw_sphere([1.0, 0.0, 0.0]);
    popMatrix();

    // TAIL #1:
    pushMatrix();
        multRotZ(15);    
        multTranslation([4.4, 1, 0]);
        multScale([3.2, 0.8, 0.8]);    
        draw_sphere([1.0, 0.0, 0.0]);
    popMatrix();

    // TAIL #2:
    pushMatrix();
        multTranslation([5.6, 3, 0]);
        multRotZ(60); 
        multScale([1.6, 0.64, 0.64]);
        draw_sphere([1.0, 0.0, 0.0]);
    popMatrix();

    // BASE'S AXIS:
    pushMatrix();
        multTranslation([0.4, 0.5, 0]);
        multRotY(45);
        multScale([1.2, 1.2, 1.2]);
        pushMatrix();
            pushMatrix();
                multTranslation([0.44, 0, 0]);
                multRotZ(52);
                multScale([0.2, 1.25, 0.2]);
                draw_cube([0.5, 0.5, 0.5]);
            popMatrix();

            multTranslation([-0.44, 0, 0]);
            multRotZ(-52);
            multScale([0.2, 1.25, 0.2]);
            draw_cube([0.5, 0.5, 0.5]);
        popMatrix();

        multRotY(90);
    
        pushMatrix();
            multTranslation([0.44, 0, 0]);
            multRotZ(52);
            multScale([0.2, 1.25, 0.2]);
            draw_cube([0.5, 0.5, 0.5]);
        popMatrix();

        multTranslation([-0.44, 0, 0]);
        multRotZ(-52);
        multScale([0.2, 1.25, 0.2]);
        draw_cube([0.5, 0.5, 0.5]);
    popMatrix();

    // BASE'S LEGS:
    multRotX(90);
    multRotZ(90);
     
    pushMatrix();
        multTranslation([0, -0.4, 0]);
        multRotZ(45);
        multScale([0.3, 3, 0.3]);
        draw_cylinder([1.5, 1.5, 0.0]);
    popMatrix();

    pushMatrix();
        multTranslation([0, -0.4, 0]);
        multRotZ(-45);
        multScale([0.3, 3, 0.3]);
        draw_cylinder([1.5, 1.5, 0.0]);
    popMatrix();
    
    multScale([0.3, 4.5, 0.3]);

    pushMatrix();
        multTranslation([3.6, -0.1, 0]);
        draw_cylinder([1.5, 1.5, 0.0]);    
    popMatrix();

    multTranslation([-3.6, -0.1, 0]);
    draw_cylinder([1.5, 1.5, 0.0]);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    
    setupView(currentAxonometricAngleGamma, currentAxonometricAngleTheta);
    
    // Send the current projection matrix
    var mProjection = gl.getUniformLocation(program, "mProjection");
    gl.uniformMatrix4fv(mProjection, false, flatten(projection));
    
    draw_scene();
    
    requestAnimFrame(render);
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    
    if(!gl) {
        alert("WebGL isn't available");
    }
    
    document.onkeydown = keyHandler;
    
    initialize();
            
    render();
}

function keyHandler(e) {
    var e = (e || window.event);
    
    if(e.keyCode == '38') {
        // up arrow
        if(verticalY < 20) {
            verticalY += 0.1;
        }
        
        if(verticalY > 0.1 && verticalY < 10) {
            inclinationFlight += 0.2;        
        }
    }
    else if(e.keyCode == '40') {
        // down arrow
        if(verticalY > 0) { 
            verticalY -= 0.1;
            
            if(verticalY < 10) {
                inclinationFlight -= 0.2;        
            }
        }
    }
    else if(e.keyCode == '37') {
        // left arrow
        if(verticalY > 0) {
            rotationY += 1;
        }
    }
}

function axonometricAngleThetaChangeHandler(e) { 
    currentAxonometricAngleTheta = this.value;
}

function axonometricAngleGammaChangeHandler(e) {
    currentAxonometricAngleGamma = this.value;
}