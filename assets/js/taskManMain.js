//------------------------------------------------------------------
class TTaskData extends TCurveDataItem
{
	constructor(maxDataPoint)
	{
		super(maxDataPoint);
	}
	
	Update(data)
	{
		if(this.Cur!=null)
		{
			var rt = (data.ulRunTimeCounter-this.Cur.ulRunTimeCounter)/1000000;
			if(rt<0)
				rt = 0;
			else if(rt>1)
				rt = 1;
				
			this.curveData[0].AddData(rt);
			
			this.curveData[1].AddData(data.uxContextSwitch-this.Cur.uxContextSwitch);
			this.curveData[2].AddData(data.uxCurMemAlloc);

			this.curveData[1].CountMax();
			this.curveData[2].CountMax();
		}
		
		this.Cur = data;
	}
}
//------------------------------------------------------------------
// This function will be executed in bareCurve.html!
//------------------------------------------------------------------
function UpdateTaskMsg(curveData,curveMsg2,curveMsg3,curveMsg1)
{
	curveMsg1.innerHTML = (curveData[0].GetLast()*100.0).toFixed(1)+"%";
	curveMsg2.innerHTML = FormatSize(curveData[1].GetLast());
	curveMsg3.innerHTML = FormatSize(curveData[2].GetLast())+"B";
}
//------------------------------------------------------------------
const taskTmpl = ["assets/html/largeCurve.html","0","0%","0B","0B",'#ff0000','#008000',UpdateTaskMsg,[],-1,-1,null];
//------------------------------------------------------------------
class TTaskMan extends TCurveDataMan
{
	constructor(maxDataPoint,maxTask)
	{
		super(maxDataPoint,maxTask,TTaskData,UpdateTaskMsg,taskTmpl);
	}

	UpdateTasks(taskInfo)
	{
		this.curData = taskInfo;
		
		for(var i=0;i<taskInfo.length;i++)
		{
			var inx = taskInfo[i].xTCBInx;
			
			this.myData[inx].Update(taskInfo[i]);
			
			if(this.myData[inx].inList<0)
			{
				var tName = taskInfo[i].pcTaskName;
				
				if(tName.length>6)
					tName = tName.substr(0,6);
				
				this.myCurve[inx][clMainTitle] = tName;

				this.activeCurve.push(this.myCurve[inx]);
				this.myData[inx].inList = inx;
			}
		}
	}
}
//------------------------------------------------------------------
