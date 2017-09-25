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



document.getElementById('0').focus();

var scaleY = d3.scale.linear().domain([1,11]).range([50,height]);
var scaleD = d3.scale.linear().domain([1,0]).range([100,400]);
var scaleX = d3.scale.linear().domain([10,200]).range([0,width]);
var scaleCX = d3.scale.linear().domain([0,100]).range([0,width]);
var scaleCY= d3.scale.linear().domain([0,100]).range([height,35]);
var scaleI= d3.scale.linear().domain([1,53]).range([0,width]);
var scaleStart=d3.scale.ordinal().domain([2,1,0]).range([width*.30,width*.5,width*.7])
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


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function dataLoaded(err,data){

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var cfData = crossfilter(data);

var byInstrument = cfData.dimension(function(d){return d.instrument; });


var groupBy = byInstrument.group();

groupBy.top(Infinity).forEach(function(p,i){
	console.log(p.key + ":" + p.value);
});



var force = d3.layout.force()
    .size([width,height])
    .charge(-4)
    .gravity(0);

// var nestedData = d3.nest()
// 	.key(function(d) {return d.Name})
// 	.entries(data);

// console.log(nestedData);


var grouping = plot.selectAll('.nodes')
	.data(data)
	.enter()
	.insert('g')

var plotting = grouping
	.append('circle')
	.attr('class','nodes')
	.attr('cy', function(d){return d.y})
	.attr('cx', function(d){return d.x})
	.attr('r',0)
	.style('fill',function(d)
		{if (d.artist == "Robin Pecknold")
			{return'rgb(250,0,0)'}
		else if (d.primary == 1)
			{return 'rgba(250,0,0,.5)'}
		else return 'rgb(45,45,45)'})


var text = grouping
	.insert('text')
	.attr('class','labels')
	.attr('y', 100)
	.attr('x', function(d) {return scaleX(d.track)})
	.text(function(d){return d.instrument})
	.style('opacity','0')

text.transition().delay(1000).duration(200).style('opacity','1')

force.nodes(data)
    .on('tick', loadForce)
    .friction(.75)
    .start();


//plotting.exit().remove();

 plotting.transition()
 	.duration(1000)
 	.delay(20)
 	 .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.r);
      return function(t) { return d.r = i(t); };
    });

//console.log(data);

d3.selectAll('.btn').on('click', function(){
    var selection = d3.select(this).attr('id');

		  if (selection == '0'){
		  	d3.selectAll('nodes').remove();
		    plotting.transition()
		    .filter(function(d){return d.primary >1})
		    force
		    	.friction(.85)
		    	.nodes(data)
		        .on('tick', loadForce)
		        .start();

		}
		else if (selection == '1'){
		    plotting.transition()
		    force
		    	.friction(.85)
		    	.nodes(data)
		        .on('tick', firstForce)
		        .start();

		}
		else if (selection =='2'){
		    plotting.transition()
		    force
		    	.friction(.85)
		    	.nodes(data)
		     	.on('tick',onForceTick)
		     	.start();
		}

		else if (selection =='3'){
			plotting.transition()
			force
				.friction(.7)
				.nodes(data)
				.on('tick',forceChart)
				.start();

		}

		else if (selection =='4'){
			plotting.transition()
			force
				.friction(.84)
				.nodes(data)
				.on('tick',barForce)
				.start();

		}
		else if (selection =='5'){
			plotting.transition()
			force
				.friction(.82)
				//.gravity(-.02)
				//.charge(-1.5)
				.nodes(data)
				.on('tick',singleForce)
				.start();

		}
		else if (selection =='6'){
			plotting.transition()
			force
				.friction(.72)
				//.gravity(-.02)
				//.charge(-1.5)
				.nodes(data)
				.on('tick',singleForce2)
				.start();

		}

})


				// big cluster in the middle
				function loadForce(e){
				            var q = d3.geom.quadtree(data),
				                i = 0,
				                n = data.length;
				    
				            while( ++i<n ){
				                q.visit(collide(data[i]));
				            }
				        
				            plotting
				                .each(function(d){
				                    var focus = {};
				                    focus.y = height/2;
				                    focus.x = width/2;
				        
				                    d.x += (focus.x-d.x)*(e.alpha*.12);
				                    d.y += (focus.y-d.y)*(e.alpha*.12);
				                })

				               .attr('cy',function(d){return d.y})
				               .attr('cx',function(d){return d.x})


				            text
				                .each(function(d){
				                    var focus = {};
				                    focus.y = height/2;
				                    focus.x = width/2;
				        
				                    d.x += (focus.x-d.x)*(e.alpha*0);
				                    d.y += (focus.y-d.y)*(e.alpha*0);
				                })

				               .attr('y',function(d){return d.y})
				               .attr('x',function(d){return d.x})				           




				    
				}//END loadForce Function


				//breakout by track
				function firstForce(e){
				            var q = d3.geom.quadtree(data),
				                i = 0,
				                n = data.length;
				    
				            while( ++i<n ){
				                q.visit(collide(data[i]));
				            }
				        
				            plotting
				                .each(function(d){
				                    var focus = {};
				                    focus.y = scaleY(d.track);
				                    focus.x = width/2;
				        
				                    d.x += (focus.x-d.x)*(e.alpha*.13);
				                    d.y += (focus.y-d.y)*(e.alpha*.13);
				                })

				               .attr('cy',function(d){return d.y})
				               .attr('cx',function(d){return d.x})

				             text
				                .each(function(d){
				                    var focus = {};
				                    focus.y = scaleY(d.track);
				                    focus.x = width/2;
				        
				                    d.x += (focus.x-d.x)*(e.alpha*0);
				                    d.y += (focus.y-d.y)*(e.alpha*0);
				                })

				               .attr('y',function(d){return d.y})
				               .attr('x',function(d){return d.x})





				    
				}//END firstForce Function


				//breakout by track and artist
				function onForceTick(e){
				            var q = d3.geom.quadtree(data),
				                i = 0,
				                n = data.length;
				    
				            while( ++i<n ){
				                q.visit(collide(data[i]));
				            }
				        
				            plotting
				                .each(function(d){
				                    var focus = {};
				                    focus.y = scaleY(d.track);
				                    focus.x = scaleX(scaleXC(d.artist));
				        
				                    d.x += (focus.x-d.x)*(e.alpha*.15);
				                    d.y += (focus.y-d.y)*(e.alpha*.15);
				                })

				               .attr('cy',function(d){return d.y})
				               .attr('cx',function(d){return d.x})

				            text
				                .each(function(d){
				                    var focus = {};
				                    focus.y = scaleY(d.track);
				                    focus.x = scaleX(scaleXC(d.artist));
				        
				                    d.x += (focus.x-d.x)*(e.alpha*0);
				                    d.y += (focus.y-d.y)*(e.alpha*0);
				                })

				               .attr('y',function(d){return d.y})
				               .attr('x',function(d){return d.x})

				    
				}//END onForceTick Function

				//breakout by test variables into scatterplot
				function forceChart(e){

				        
				            plotting
				                .each(function(d){
				                    var focus = {};
				                    focus.y = scaleCY(d.cordY);
				                    focus.x = scaleCX(d.cordX);
				        
				                    d.x += (focus.x-d.x)*(e.alpha*.5);
				                    d.y += (focus.y-d.y)*(e.alpha*.5);
				                })

				               .attr('cy',function(d){return d.y})
				               .attr('cx',function(d){return d.x})

							text
				                .each(function(d){
				                    var focus = {};
				                    focus.y = scaleCY(d.cordY);
				                    focus.x = scaleCX(d.cordX);
				        
				                    d.x += (focus.x-d.x)*(e.alpha*0);
				                    d.y += (focus.y-d.y)*(e.alpha*0);
				                })

				               .attr('y',function(d){return d.y})
				               .attr('x',function(d){return d.x})



				    
				}//END forceChart Function



				//breakout by track and instrument
				function barForce(e){

				            var q = d3.geom.quadtree(data),
				                i = 0,
				                n = data.length;
				    
				            while( ++i<n ){
				                q.visit(collide(data[i]));
				            }
				        
				            plotting
				                .each(function(d){
				                    var focus = {};
				                    focus.y = scaleY(d.track);
				                    focus.x = scaleI(d.iNum);
				        
				                    d.x += (focus.x-d.x)*(e.alpha*.15);
				                   d.y += (focus.y-d.y)*(e.alpha*.15);
				                })

				               .attr('cy',function(d){return d.y})
				               .attr('cx',function(d){return d.x})

				            text
				                .each(function(d){
				                    var focus = {};
				                    focus.y = scaleY(d.track);
				                    focus.x = scaleI(d.iNum);
				        
				                    d.x += (focus.x-d.x)*(e.alpha*0);
				                   d.y += (focus.y-d.y)*(e.alpha*0);
				                })

				               .attr('y',function(d){return d.y})
				               .attr('x',function(d){return d.x})

				    
				}//END barForce Function


				function singleForce(e){

				            var q = d3.geom.quadtree(data),
				                i = 0,
				                n = data.length;
				    
				            while( ++i<n ){
				                q.visit(collide2(data[i]));
				            }
				        
				            plotting
				                .each(function(d){
				                    var focus = {};
				                    focus.y = height/2;
				                    focus.x = scaleI(d.iNum);
				        
				                    d.x += (focus.x-d.x)*(e.alpha*.65);
				                   d.y += (focus.y-d.y)*(e.alpha*.13);
				                })

				               .attr('cy',function(d){return d.y})
				               .attr('cx',function(d){return d.x})

				            text
				                .each(function(d){
				                    var focus = {};
				                    focus.y = height/2;
				                    focus.x = scaleI(d.iNum);
				        
				                    d.x += (focus.x-d.x)*(e.alpha*.65);
				                   d.y += (focus.y-d.y)*(e.alpha*.13);
				                })

				               .attr('y',function(d){return d.y})
				               .attr('x',function(d){return d.x})

				    
				}//END barForce Function


				function singleForce2(e){

				            var q = d3.geom.quadtree(data),
				                i = 0,
				                n = data.length;
				    
				            while( ++i<n ){
				                q.visit(collide2(data[i]));
				            }
				        
				            plotting
				                .each(function(d){
				                    var focus = {};
				                    if(d.primary>=1){focus.y=height*.3}
				                   	else{focus.y=height*.6}

				                    focus.x = scaleI(d.iNum);
				        
				                    d.x += (focus.x-d.x)*(e.alpha*.65);
				                   d.y += (focus.y-d.y)*(e.alpha*.13);
				                })

				               .attr('cy',function(d){return d.y})
				               .attr('cx',function(d){return d.x})

				            text
				                .each(function(d){
				                    var focus = {};
				                    if(d.primary>=1){focus.y=height*.3}
				                   	else{focus.y=height*.6}

				                    focus.x = scaleI(d.iNum);
				        
				                    d.x += (focus.x-d.x)*(e.alpha*0);
				                   d.y += (focus.y-d.y)*(e.alpha*0);
				                })

				               .attr('y',function(d){return d.y})
				               .attr('x',function(d){return d.x})
				    
				}//END barForce Function



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
							                dataPoint.x -= x*= (l*1.05);
							                dataPoint.y -= y*= l;
							                quadPoint.point.x += (x*1.05);
							                quadPoint.point.y += y;
				                        }
				                    }
				                    return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
				                }
				            }// END collide


				 function collide2(dataPoint){
				                var nr = dataPoint.r + 3,
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
							                dataPoint.x -= x*= (l*-.6);
							                dataPoint.y -= y*= l;
							                quadPoint.point.x += (x*-.6);
							                quadPoint.point.y += y;
				                        }
				                    }
				                    return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
				                }
				            }// END collide
                



///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

}//END DATA LOADED

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function parse(d){

//Need to clean up a bit

	var test = scaleY(d.track);
	var scaleYStart = d3.scale.linear().domain([1,11]).range([height*.4,height*.6]);
	var test2 = scaleYStart(d.track);
	var divide = scaleStart(d.primary);


	return{
		track: +d.track,
		// x0: 100+Math.random()*5,
		// x: 100+Math.random()*5,
		// y: test+ Math.random()*5,
		x: divide+Math.random()*5,
		y: test2+ Math.random()*5,
		name: d.Name,
		r: +d.radius,
		trackLength:+d.trackLength,
		artist: d.artist,
		primary: d.primary,
		key: +d.key,
		instrument: d.instrument,
		iNum: d.instrumemt_num,
		cordX: +d.cordX,
		cordY: +d.cordY,
	}
}



