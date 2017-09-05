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





var scaleY = d3.scale.linear().domain([1,11]).range([1,500]);


d3.csv('data/fleet_foxes_V1_alt.csv',parse,dataLoaded);



//PRIMARY FUNCTION

function dataLoaded(err,data){

var nestedData = d3.nest()
	.key(function(d) {return d.artist})
	.entries(data);

console.log(nestedData);


var plotting = plot.selectAll('.circles')
	.data(nestedData[3].values)
	.enter()
	//.append('text').text('fake')
	.append('g')


plotting.append('circle').attr('class','.circles')
	.attr('cx', function(d) {return d.length})//function(d){return d.length})
	.attr('cy', function(d) {return scaleY(d.track)})//function(d){return scaleYLines(d.startDate)})
	.attr('r',function(d){return 30})
	.style('fill','rgba(45,45,45,.3)')

plotting.append('text').attr('class','.labels')
	.attr('x', function(d) {return d.length})
	.attr('y', function(d) {return scaleY(d.track)})
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



