//FINAL PROJEC

var margin = {t:50,r:50,b:50,l:70};
var width = document.getElementById('plot').clientWidth-margin.l-margin.r,
	height = document.getElementById('plot').clientHeight-margin.t-margin.b;


var svg = d3.select('.canvas')
	.append('svg')
	.attr('width',width+margin.l+margin.r)
	.attr('height',height+margin.t+margin.b)
	.append('g')
	.attr('class','plot')
	.attr('transform', 'translate ('+margin.l+','+margin.r+')');

var scaleY = d3.scale.linear().domain([1,11]).range([25,height]);
//var scaleY = d3.scale.linear().domain([1,600]).range([height,0]);
var scaleD = d3.scale.linear().domain([1,0]).range([100,400]);

var scaleX = d3.scale.linear().domain([10,200]).range([1,width]);
//need to make something better than this at some point

scaleXC = d3. scale.ordinal()
.domain([

			"Robin Pecknold",
			"Skyler Skjelset",
			"Casey Wescott",
			"Morgan Henderson",
			"Christian Wargo",
			"Andy Clausen",
			"Riley Mulherkar",
			"Willem De Koch",
			"Zubin Hensler",
			"Matthew Barrick",
			"Christopher Icasiano",
			"Hannah Epperson",
			"Dave Eggar",
			"Jeremy Kittel",
			"Nicholas Cords",
			"Russell Durham",
			"Neal Morgan",
			"Brian Mcpherson",
			"Mulatu Astatke",
			"Pheonix Forte Choir"
		])
.range([
		10,
		20,
		30,
		40,
		50,
		60,
		70,
		80,
		90,
		100,
		110,
		120,
		130,
		140,
		150,
		160,
		170,
		180,
		190,
		200
		]);




d3.csv('data/fleet_foxes_V2.csv',parse,dataLoaded);



// //Make up some data points
// var data = [];
// for(var i=0; i<300; i++){
//     var xPos = Math.random()*width;

//     data.push({
//         x:xPos,
//         x0:xPos,
//         y:height/2+Math.random()*5,
//         r:Math.sin(xPos/width*Math.PI)*15+3+Math.random()*3
//     });
// }

//console.log(data);

function dataLoaded(err,data){

//Draw
var node = svg.selectAll('.node')
    .data(data)
    .enter()
    .append('circle').attr('class','node')
    .attr('cx',function(d){return d.x})
    .attr('cy',function(d){return d.y})
    .attr('r',0)

//Collision detection
var force = d3.layout.force()
    .size([width,height])
    .charge(0)
    .gravity(0)
	.nodes(data)
    .on('tick',onForceTick)
    .start();

//really hacky solution to the erratic circles. need better solution
 node.transition()
 	.duration(2000)
 	.delay(80)
 	 .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.r);
      return function(t) { return d.r = i(t); };
    });

function onForceTick(e){
    var q = d3.geom.quadtree(data),
        i = 0,
        n = data.length;

    while( ++i<n ){
        q.visit(collide(data[i]));
    }

    node
        .each(gravity(e.alpha*.1))
        .attr('cx',function(d){return d.x})
        .attr('cy',function(d){return d.y})

    function gravity(k){
        //custom gravity: data points gravitate towards a straight line
        return function(d){
            d.y += (d.track- d.y)*k;
            d.x += (d.artist - d.x)*k;
        }
    }

    function collide(dataPoint){
        var nr = dataPoint.r,
            nx1 = dataPoint.x - nr,
            ny1 = dataPoint.y - nr,
            nx2 = dataPoint.x + nr,
            ny2 = dataPoint.y + nr;

        return function(quadPoint,x1,y1,x2,y2){
            if(quadPoint.point && (quadPoint.point !== dataPoint)){
                var x = dataPoint.x - quadPoint.point.x,
                    y = dataPoint.y - quadPoint.point.y,
                    l = Math.sqrt(x*x+y*y),
                    r = nr + quadPoint.point.r;
                if(l<r){
                    l = (l-r)/l*.1;
                    dataPoint.x -= x*= (l);
                    dataPoint.y -= y*= l;
                    quadPoint.point.x += (x);
                    quadPoint.point.y += y;
                }
            }
            return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
        }
    }
}




}//END DATA LOADED


function parse(d){

	var tester = scaleX(scaleXC(d.artist));
	var tester2 = scaleY(d.track);

	//console.log(tester);
	//console.log(tester2);


	return{
		track: +scaleY(d.track),
		name: d.Name,
		r: +d.radius,
		trackLength:+d.trackLength,
		artist: +scaleX(scaleXC(d.artist)),
		artistName: d.artist,
		primary: d.primary,
		key: d.key,
		instrument: d.instrument,
	}
}



