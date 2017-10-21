var jiaoDus=[];
function jiSuanFangXiang(dingDian,jieDian)
{
	for(var d=0,j=0;j<(jieDian.length-1);)
	{
		//if(Math.abs((jieDian[j].y-dingDian[d].y)/(jieDian[j].x-dingDian[d].x)-(jieDian[j+1].y-dingDian[d].y)/(jieDian[j+1].x-dingDian[d].x))<0.1)
		
		if(Math.abs(getJiaoDu(jieDian[j].x,jieDian[j].y,dingDian[d].x,dingDian[d].y)-getJiaoDu(dingDian[d].x,dingDian[d].y,jieDian[j+1].x,jieDian[j+1].y))<1)
		{
			jiaoDus[d]=getJiaoDu(jieDian[j].x,jieDian[j].y,jieDian[j+1].x,jieDian[j+1].y);
			j++;
			d++;
			continue;
		}
		else
		{
			j++;
		}
	}
	return jiaoDus;
}
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

