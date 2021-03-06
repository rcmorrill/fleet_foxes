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



document.getElementById('1').focus();

var scaleY = d3.scale.linear().domain([1,11]).range([25,height]);
//var scaleY = d3.scale.linear().domain([1,600]).range([height,0]);
var scaleD = d3.scale.linear().domain([1,0]).range([100,400]);

var scaleX = d3.scale.linear().domain([10,200]).range([0,width]);
//need to make something better than this at some point

var scaleCX = d3.scale.linear().domain([0,100]).range([0,width]);
var scaleCY= d3.scale.linear().domain([0,100]).range([height,0]);

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



// d3.layout.pack()
//     .sort(null)
//     .size([width, height])
//     .children(function(d) { return d.values; })
//     .value(function(d) { return d.r })
//     .nodes({values: d3.nest()
//       .key(function(d) { return d.primary; })
//       .entries(data)});


    ///this thing above is working... but need to figure out

var force = d3.layout.force()
    .size([width,height])
    .charge(-4)
    .gravity(0)
    .friction(.9);

// var nestedData = d3.nest()
// 	.key(function(d) {return d.Name})
// 	.entries(data);

// console.log(nestedData);

	

var plotting = plot.selectAll('.nodes')
	.data(data, function(d){return d.key})
// plotting.enter()
// 	.insert('g')



// var circles = 
plotting
	.enter()
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


// var textPlotting = plot.selectAll('.labels')
// 	.data(nestedData)
// 	.enter()
// 	.append('text')
// 	.attr('y', 100)
// 	.attr('x', function(d) {return scaleX(d.track)})
// 	.text(function(d){return d.name})



// var text = plotting
// 	.insert('text')
// 	.attr('class','labels')
// 	.attr('y', 100)
// 	.attr('x', function(d) {return scaleX(d.track)})
// 	.text(function(d){return d.instrument})
// 	.style('opacity','0')

force.nodes(data)
    .on('tick', firstForce)
    .start();


plotting.exit().remove();


//text transition

// text.transition()
//  	.duration(2000)
//  	.delay(250)
//  	.styleTween("opacity", function(d) {
//       var i = d3.interpolate(0, 0);
//       return function(t) { return d.r = i(t); };
//     });


 plotting.transition()
 	.duration(900)
 	.delay(15)
 	 .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.r);
      return function(t) { return d.r = i(t); };
    });

console.log(data);

d3.selectAll('.btn').on('click', function(){
    var selection = d3.select(this).attr('id');

		if (selection == '1'){
		    plotting.transition()
		    force
		    	.friction(.85)
		    	.nodes(data)
		    	.on('tick',forceChart)
		    	.start();
		    force.nodes(data)
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

		// else if (selection =='3'){
		//     plotting
		//     .transition().duration(1000)
		//     .attr('cx', function(d){return scaleCX(d.cordX);})
		// 	.attr('cy', function(d){return scaleCY(d.cordY);})
		// 	.attr('r',5)
		// 	force.stop();
		// 			//plotting.transition()
		// 	// force.nodes(data)
		// 	// 	.on('tick',forceChart)
		// 	// 	.start();
		// }
})


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
                    focus.x = 100;
        
                    d.x += (focus.x-d.x)*(e.alpha*.13);
                    d.y += (focus.y-d.y)*(e.alpha*.13);
                })

               .attr('cy',function(d){return d.y})
               .attr('cx',function(d){return d.x})


            // text
            //     .each(function(d){
            //         var focus = {};
            //         focus.y = scaleY(d.track);
            //         focus.x = 100;

            //         d.x += (focus.x-d.x)*(e.alpha*.13);
            //         d.y += (focus.y-d.y)*(e.alpha*.13);
            //     })

            //    .attr('y',function(d){return d.y})
            //    .attr('x',function(d){return d.x})


    
}//END onForceTick Function



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


            // text
            //     .each(function(d){
            //         var focus = {};
            //         focus.y = scaleY(d.track);
            //         focus.x = scaleX(scaleXC(d.artist));

            //         d.x += (focus.x-d.x)*(e.alpha*.15);
            //         d.y += (focus.y-d.y)*(e.alpha*.15);
            //     })

            //    .attr('y',function(d){return d.y})
            //    .attr('x',function(d){return d.x})


    
}//END onForceTick Function


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



    
}//END forceChart Function


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

	var test = scaleY(d.track);


	return{
		track: +d.track,
		x0: 100+Math.random()*5,
		x: 100+Math.random()*5,
		y: test+ Math.random()*5,
		name: d.Name,
		r: +d.radius,
		trackLength:+d.trackLength,
		artist: d.artist,
		primary: d.primary,
		key: +d.key,
		instrument: d.instrument,
		cordX: +d.cordX,
		cordY: +d.cordY,
	}
}



