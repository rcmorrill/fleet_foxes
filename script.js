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



//PRIMARY FUNCTION




d3.csv('data/ff.csv',parse,dataLoaded);





function dataLoaded(err,data){



// plot.selectAll('.lines')
// 	.data(data)
// 	.enter()
// 	.append('rect').attr('class','lines')
// 	.attr('x',function(d){return d.ccode})
// 	.attr('y', function(d){return scaleYLines(d.startDate)})
// 	//.attr('r',10)
// 	.attr('height',function(d){ 
// 		var length = scaleYLines(d.endDate) - scaleYLines(d.startDate);
// 		return length;
// 	})
// 	.attr('width', 3)
// 	//.attr('fill',function(d){return scaleC(d.location)})
// 	.attr('fill','rgba(12,12,12,.1)')



}


function parse(d){


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



