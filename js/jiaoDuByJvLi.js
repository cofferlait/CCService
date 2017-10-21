var jiaoDuS=[];
var pointStyleS=[];

function getJiaoDu(x1,y1,x2,y2)
			{
				var dx=x2-x1;
				var dy=y2-y1;
				var xieLv=Math.abs(dy/dx);
				if(dy==0)
				{
					if(dx>=0)
					{
						return 0;
					}					
					else
					{
						return 180;
					}
				}
				else
				{
					if(dx==0)
					{
						if(dy>=0)
						{
							return 270;
						}
						else
						{
							return 90;
						}
					}
				}
				
				if(dx>0)
				{
					if(dy<0)
					{
						//console.log(Math.atan(xieLv)*180/3.14);
						return (Math.atan(xieLv)*180/3.14);
					}
					else
					{
						return (360-Math.atan(xieLv)*180/3.14);
					}
				}
				else
				{
					if(dy>0)
					{
						return (180+Math.atan(xieLv)*180/3.14);
					}
					else
					{
						return (180-Math.atan(xieLv)*180/3.14);
					}
				}
			}
function getJiaoDuS(dingDian,jieDian)
{
	for(var d=0;d<dingDian.length;d++)
	{
		for(var j=0;j<jieDian.length;j++)
		{
			if(Math.ceil(jieDian[j].measure/400)==(d+1))
			{
				var jiaoDu=getJiaoDu(jieDian[j-1].x,jieDian[j-1].y,jieDian[j].x,jieDian[j].y);
				console.log(d,jiaoDu);
				jiaoDuS.push(jiaoDu);
				
				var pointStyle={
                fillColor:'red',
                fillOpacity:0.8,
                pointRadius:5,
                strokeColor:'#aaee77',
                strokeWidth:3,
                startMeasure:0,
                endMeasure:1000,
                externalGraphic:"ljfx.png",
                graphicWidth:40,
                graphicHeight:40,
                //旋转角度
                rotation:jiaoDu
				}
				pointStyleS.push(pointStyle);
				break;
			}
		}
	}
	return jiaoDuS;
}
