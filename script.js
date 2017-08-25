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

//creating force variable 



var force = d3.layout.force()
    .size([width,height])
    .charge(0)
    .gravity(0);



var scaleR = d3.scale.sqrt().domain([0,7500000]).range([0,100]);

var scaleY = d3.scale.linear().domain([1800,2010]).range([0,1400])
d3.csv('data/war_data.csv',parse,dataLoaded);
var scaleYLines = d3.time.scale().domain([new Date(1823,0,1),new Date(2005,0,1)]).range([0,8000])
var scaleC = d3.scale.ordinal().domain([])
var scaleX = d3.scale.linear().domain([2,920]).range([0,2000])



var axisY = d3.svg.axis()
    .orient('left')
    //.tickValues([2,4,6,8,10])
    .scale(scaleYLines);
    //.tickFormat(d3.time.format("%Y-%m-%d"));


 plot.append('g').attr('class','axis axis-y')
    .transition().delay(100).call(axisY);

function dataLoaded(err,data){

	console.log(data);

// plot.selectAll('.nodes')
// 	.data(data)
// 	.enter()
// 	.append('circle').attr('class','nodes')
// 	.attr('cx',function(d){return d.initiator*100})
// 	.attr('cy',function(d){return scaleY(d.start)})
// 	.attr('r',function(d){return scaleR(d.casualties)})
// 	.attr('fill','red')
// 	.attr('opacity','.3')


plot.selectAll('.lines')
	.data(data)
	.enter()
	.append('rect').attr('class','lines')
	.attr('x',function(d){return d.ccode})
	.attr('y', function(d){return scaleYLines(d.startDate)})
	//.attr('r',10)
	.attr('height',function(d){ 
		var length = scaleYLines(d.endDate) - scaleYLines(d.startDate);
		return length;
	})
	.attr('width', 3)
	//.attr('fill',function(d){return scaleC(d.location)})
	.attr('fill','rgba(12,12,12,.1)')



}


function parse(d){

	// console.log(d.StartYear1);
	// console.log(d.StartMonth1);
	// console.log(d.StartDay1);


	return{
		country: d.StateName,
		ccode: +d.ccode,
		initiator: d.Initiator,
		length: d.Length,
		war: d.WarName,
		start: +d.StartYear1,
		casualties: +d.BatDeath,
		outcome: d.Outcome,
		location: d.WhereFought,
		startDate: new Date(+d.StartYear1, + d.StartMonth1-1, + d.StartDay1),
		endDate: new Date(+d.EndYear1, + d.EndMonth1-1, + d.EndDay1),
	}
}



