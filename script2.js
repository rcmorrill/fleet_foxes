//FINAL PROJEC

var margin = {t:50,r:50,b:50,l:70};
var width = document.getElementById('plot').clientWidth-margin.l-margin.r,
	height = document.getElementById('plot').clientHeight-margin.t-margin.b;


var plot = d3.select('.canvas')
	.append('svg')
	.attr('width',width+margin.l+margin.r)
	.attr('height',height+margin.t+margin.b)
	.append('g')
	.attr('class','plot')
	.attr('transform', 'translate ('+margin.l+','+margin.r+')');


var force = d3.layout.force()
    .size([width,height])
    .charge(0)
    .gravity(0);


var scaleX = d3.scale.linear().domain([1,11]).range([25,width]);
var scaleY = d3.scale.linear().domain([1,600]).range([height,0]);
var scaleD = d3.scale.linear().domain([1,0]).range([100,400]);



d3.csv('data/fleet_foxes_V2.csv',parse,dataLoaded);

// var axisX = d3.svg.axis()
// 	.orient('bottom')
// 	.innerTickSize(-height)
// 	.scale(scaleX);

// plot.append('g').attr('class','axis')
// 	.attr("transform", "translate(0," + height + ")")
// 	.call(axisX);

// var axisY = d3.svg.axis()
// 	.orient('left')
// 	.innerTickSize(0)
// 	.scale(scaleY);

// plot.append('g').attr('class','axis')
// 	.call(axisY);


//PRIMARY FUNCTION

function dataLoaded(err,data){

var nestedData = d3.nest()
	.key(function(d) {return d.Name})
	.entries(data);

console.log(nestedData);

	

var plotting = plot.selectAll('.nodes')
	.data(data)
	.enter()
	.insert('g')



var circles = plotting
	.insert('circle')
	.attr('class','nodes')
	.attr('cy', 100)
	.attr('cx', function(d) {return scaleX(d.track)})
	.attr('r',function(d){return d.r})
	.style('fill',function(d)
		{if (d.artist == "Robin Pecknold")
			{return'red'}
		else return 'rgb(45,45,45)'})


// var textPlotting = plot.selectAll('.labels')
// 	.data(nestedData)
// 	.enter()
// 	.append('text')
// 	.attr('y', 100)
// 	.attr('x', function(d) {return scaleX(d.track)})
// 	.text(function(d){return d.name})



var text = plotting
	.insert('text')
	.attr('class','labels')
	.attr('y', 100)
	.attr('x', function(d) {return scaleX(d.track)})
	.text(function(d){return d.instrument})


//plotting.exit().remove();

force.nodes(data)
	.on('tick',onForceTick)
	.start();

function onForceTick(e){
            var q = d3.geom.quadtree(data),
                i = 0,
                n = data.length;
    
            while( ++i<n ){
                q.visit(collide(data[i]));
            }
        
            circles
                .each(function(d){
                    var focus = {};
                    focus.x = scaleX(d.track);
                    focus.y = scaleD(d.primary);
        
                    d.x += (focus.x-d.x)*(e.alpha*.12);
                    d.y += (focus.y-d.y)*(e.alpha*.12);
                })

               .attr('cy',function(d){return d.y})
               .attr('cx',function(d){return d.x})


            text
                .each(function(d){
                    var focus = {};
                    focus.x = scaleX(d.track);
                    focus.y = scaleD(d.primary);
        
                    d.x += (focus.x-d.x)*(e.alpha*.12);
                    d.y += (focus.y-d.y)*(e.alpha*.12);
                })

               .attr('y',function(d){return d.y})
               .attr('x',function(d){return d.x})


    
}//END onForceTick Function


 function collide(dataPoint){
                var nr = dataPoint.r + 0,
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
			                dataPoint.x -= x*= (l*1.05);
			                dataPoint.y -= y*= l;
			                quadPoint.point.x += (x*1.05);
			                quadPoint.point.y += y;
                        }
                    }
                    return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
                }
            }// END collide


}//END DATA LOADED


function parse(d){


	return{
		track: +d.track,
		x0: +d.track,
		name: d.Name,
		r: +d.radius,
		trackLength:+d.trackLength,
		artist: d.artist,
		primary: d.primary,
		instrument: d.instrument,
	}
}



