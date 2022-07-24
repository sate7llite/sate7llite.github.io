//------------------------------------------------------------------
class TIntData extends TCurveDataItem
{
	constructor(maxDataPoint)
	{
		super(maxDataPoint);
	}
	
	Update(data)
	{
		if(this.Cur!=null)
		{
			this.curveData[0].AddData(data.intAdded-this.Cur.intAdded);
			
			this.curveData[1].AddData(data.intLoss-this.Cur.intLoss);
			this.curveData[2].AddData(data.intHandled-this.Cur.intHandled);

			this.curveData[0].CountMax();
			this.curveData[1].CountMax();
			this.curveData[2].CountMax();
		}
		
		this.Cur = data;
	}
}
//------------------------------------------------------------------
// This function will be executed in bareCurve.html!
//------------------------------------------------------------------
function UpdateIntMsg(curveData,curveMsg2,curveMsg3,curveMsg1)
{
	curveMsg1.innerHTML = FormatSize(curveData[1].GetLast());
	curveMsg2.innerHTML = FormatSize(curveData[1].GetLast());
	curveMsg3.innerHTML = FormatSize(curveData[2].GetLast());
}
//------------------------------------------------------------------
const intTmpl  = ["largeCurve.html","0","0","0","0",'#ff0000','#008000',UpdateIntMsg,[],-1,-1,null];
const intNames = 
[
	"调度0", "调度1", "调度2", "调度3",	"调度4", "调度5", "调度6", "调度7",
	"时钟",
	"定时器0", "定时器1", "定时器2", "定时器3", 
	"网络0", "网络1", "网络2", "网络3", "网络4", "网络5", "网络6", "网络7", 
	"用户0", "用户1", "用户2", "用户3", "用户4", "用户5", "用户6", "用户7", 
	"用户8", "用户9", "用户10"
];
//------------------------------------------------------------------
class TIntMan extends TCurveDataMan
{
	constructor(maxDataPoint,maxInt)
	{
		super(maxDataPoint,maxInt,TIntData,UpdateIntMsg,intTmpl);
		this.prevData = null;
		
		for(var i=0;i<maxInt;i++)
		{
			this.myCurve[i][clMainTitle] = intNames[i];
		}
	}

	UpdateInt(intInfo)
	{
		this.prevData = this.curData;
		this.curData  = intInfo;
		
		for(var i=0;i<intInfo.stubs.length;i++)
		{
			var inx = intInfo.stubs[i].id;
			
			this.myData[inx].Update(intInfo.stubs[i]);
			
			if(this.myData[inx].inList<0)
			{
				this.activeCurve.push(this.myCurve[inx]);
				this.myData[inx].inList = inx;
			}
		}
	}
}
//------------------------------------------------------------------
