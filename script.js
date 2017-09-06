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





var scaleX = d3.scale.linear().domain([1,11]).range([25,width-25]);
var scaleY = d3.scale.linear().domain([1,600]).range([height,0]);



d3.csv('data/fleet_foxes_V1_alt.csv',parse,dataLoaded);

var axisX = d3.svg.axis()
	.orient('bottom')
	.innerTickSize(-height)
	.scale(scaleX);

plot.append('g').attr('class','axis')
	.attr("transform", "translate(0," + height + ")")
	.call(axisX);

var axisY = d3.svg.axis()
	.orient('left')
	.innerTickSize(0)
	.scale(scaleY);

plot.append('g').attr('class','axis')
	.call(axisY);


//PRIMARY FUNCTION

function dataLoaded(err,data){

var nestedData = d3.nest()
	.key(function(d) {return d.artist})
	.entries(data);

console.log(nestedData);

	

var plotting = plot.selectAll('.circles')
	.data(nestedData[7].values)
	.enter()
	//.append('text').text('fake')
	.append('g')


plotting.append('circle').attr('class','.circles')
	.attr('cy', function(d) {return scaleY(d.length)})//function(d){return d.length})
	.attr('cx', function(d) {return scaleX(d.track)})//function(d){return scaleYLines(d.startDate)})
	.attr('r',function(d){return 10})
	.style('fill','rgba(45,45,45,.3)')

plotting.append('text').attr('class','.labels')
	.attr('y', function(d) {return scaleY(d.length)})
	.attr('x', function(d) {return scaleX(d.track)})
	.text(function(d){return d.instrument})


}//END DATA LOADED


function parse(d){


	return{
		track: d.track,
		name: d.Name,
		length: +d.length,
		artist: d.artist,
		primary: d.primary,
		instrument: d.instrument,
	}
}



