//------------------------------------------------------------------
class TTimerData extends TCurveDataItem
{
	constructor(maxDataPoint)
	{
		super(maxDataPoint);
		this.curveData.length = 1;
	}
	
	Update(data)
	{
		if(this.Cur!=null)
		{
			this.curveData[0].AddData(data.nTrigger-this.Cur.nTrigger);
			this.curveData[0].CountMax();
		}
		
		this.Cur = data;
	}
}
//------------------------------------------------------------------
// This function will be executed in bareCurve.html!
//------------------------------------------------------------------
function UpdateTimerMsg(curveData,curveMsg2,curveMsg3,curveMsg1)
{
	curveMsg1.innerHTML = FormatSize(curveData[0].GetLast());
}
//------------------------------------------------------------------
const timerTmpl = ["assets/html/largeCurve.html","0","0","0","0",'#ff0000','#008000',UpdateTimerMsg,[],-1,-1,null];
const timerNames = 
[
	"用户0", "用户1", "用户2", "用户3",	"时钟4",
	"唤醒0", "唤醒1", "唤醒2", "唤醒3", "唤醒4", "唤醒5", "唤醒6", "唤醒7" 
];
//------------------------------------------------------------------
class TTimerMan extends TCurveDataMan
{
	constructor(maxDataPoint,maxTimer)
	{
		super(maxDataPoint,maxTimer,TTimerData,UpdateTimerMsg,timerTmpl);
		
		for(var i=0;i<maxTimer;i++)
		{
			this.myCurve[i][clMainTitle] = timerNames[i];
		}
	}

	UpdateTimers(timerInfo)
	{
		this.curData = timerInfo;
		
		for(var i=0;i<timerInfo.length;i++)
		{
			var inx = timerInfo[i].id;
			
			this.myData[inx].Update(timerInfo[i]);
			
			if(this.myData[inx].inList<0)
			{
				this.activeCurve.push(this.myCurve[inx]);
				this.myData[inx].inList = inx;
			}
		}
	}
}
//------------------------------------------------------------------
