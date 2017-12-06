//Greg Ryan
//October 20, 2017
//Homework 4
//Cylinder.js

var canvas;
var gl;

var NumVertices  = 24;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

var color = 0; //color of the side

var vertices = [ // original vericies
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
    ];

var div = 2; //amount of times to divide the sides in half

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
	
	window.onkeydown = function(event) {
	var key = String.fromCharCode(event.keyCode);
    switch(key) {
		case 'F':
            theta[xAxis] += 2.0;
        break;
		
        case 'J':
            theta[yAxis] += 2.0;
        break;
		
		case 'K':
		    theta[zAxis] += 2.0;
		break;
        }
	};
    render();
}

function colorCube(){
	for(var i = 0; i < vertices.length; i ++){ //normalize original verticies
		vertices[i] = normalize(vertices[i]);
	}
    divide_quad(vertices[2],vertices[3],vertices[7],vertices[6],div); 
	divide_quad(vertices[1],vertices[0],vertices[3],vertices[2],div); 
	divide_quad(vertices[4],vertices[5],vertices[6],vertices[7],div);
	divide_quad(vertices[5],vertices[4],vertices[0],vertices[1],div);
}

function quad(a, b, c, d,color) {
    var vertexColors = [
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
    ];
	
    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
		for( var i = 0; i < 6; i++){
			colors.push(vertexColors[color]);
		}
			points.push(a);
			points.push(b);
			points.push(c);
			points.push(a);
			points.push(c);
			points.push(d);
}

function divide_quad(a,b,c,d,div){ //recursive function to divide the sides in half
	if(div > 0){
		NumVertices += 6;
		var new1 = vec4((b[0]+c[0])/2,(b[1]+c[1])/2,(b[2]+c[2])/2);
		var new2 = vec4((a[0]+d[0])/2,(a[1]+d[1])/2,(a[2]+d[2])/2);
		new1 = normalize(new1);
		new2 = normalize(new2);
		divide_quad(a,b,new1,new2,div-1);
		divide_quad(new1,new2,d,c,div-1);
	}
	else{
		color++;
		color = color%2;
		quad(a,b,c,d,color);
	}
}

function normalize(temp){ //normalize function
	var x = (Math.sqrt(.5)); 
	var d = (x/Math.sqrt((temp[0]*temp[0]+temp[2]*temp[2])));
	temp[0] *= d;
	temp[2] *= d;
	return temp;
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}