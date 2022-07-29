//------------------------------------------------------------------
class TCpuData extends TCurveDataItem
{
	constructor(maxDataPoint)
	{
		super(maxDataPoint);

		this.Locker = null;
	}
	
	Update(data, locker, sysRT)
	{
		if(this.Cur!=null)
		{
			var rt = (sysRT-this.prevRT-data.idleTime+this.Cur.idleTime)/(sysRT-this.prevRT);
			if(rt<0)
				rt = 0;
			else if(rt>1)
				rt = 1;
				
			this.curveData[0].AddData(rt);
			this.curveData[1].AddData(data.intCount-this.Cur.intCount);
			this.curveData[2].AddData(data.enIntCount-this.Cur.enIntCount);

			//this.busyCurve.CountMax();
			this.curveData[2].CountMax();
			this.curveData[1].maxVal = this.curveData[2].maxVal;
		}
		
		this.Cur    = data;
		this.prevRT = sysRT;
		this.Locker = locker;
	}
}
//------------------------------------------------------------------
// This function will be executed in bareCurve.html!
//------------------------------------------------------------------
function UpdateCPUMsg(curveData,curveMsg2,curveMsg3,curveMsg1)
{
	curveMsg1.innerHTML = (curveData[0].GetLast()*100.0).toFixed(1)+"%";
	curveMsg2.innerHTML = FormatSize(curveData[1].GetLast())+"中断";
	curveMsg3.innerHTML = FormatSize(curveData[2].GetLast())+"开中断";
}
//------------------------------------------------------------------
const cpuTmpl = ["../html/largeCurve.html","核0","0%","0中断","0开中断",'#ff0000','#008000',UpdateCPUMsg,[],-1,-1,null];
//------------------------------------------------------------------
class TCpuMan extends TCurveDataMan
{
	constructor(maxDataPoint,maxCpu)
	{
		super(maxDataPoint,maxCpu,TCpuData,UpdateCPUMsg,cpuTmpl);
		
		this.lockData = null;
		this.sysRT    = 0;
	}

	UpdateCPUs(cpuInfo,lockerInfo,sysRT)
	{
		this.curData  = cpuInfo;
		this.lockData = lockerInfo;
		this.sysRT    = sysRT;
		
		for(var i=0;i<cpuInfo.length;i++)
		{
			this.myData[i].Update(cpuInfo[i],lockerInfo[i],sysRT);
			
			if(this.myData[i].inList<0)
			{
				this.activeCurve.push(this.myCurve[i]);
				this.myData[i].inList = i;
			}
		}
	}
}
//------------------------------------------------------------------
//------------------------------------------------------------------
// [20220729, Whichway] 
// 3 functions 
// datamanmain
//------------------------------------------------------------------
//------------------------------------------------------------------

//------------------------------------------------------------------
var ftDifferentail=1;
var ftRatio=2;
var ftRaw=3;
//------------------------------------------------------------------
class TFieldData extends TCurveDataItem
{
	constructor(maxDataPoint)
	{
		super(maxDataPoint);
		this.curveData.length = 1;
		this.myCfg = null;
	}
	
	Update(data)
	{
		switch(this.myCfg.type)
		{
			case ftDifferentail:
				if(this.Cur!=null)
				{
					this.curveData[0].AddData(data[this.myCfg.field]-this.Cur[this.myCfg.field]);
					this.curveData[0].CountMax();
				}
				break;
			case ftRatio:
				this.curveData[0].AddData(data[this.myCfg.field]/data[this.myCfg.max]);
				break;
			case ftRaw:
				this.curveData[0].AddData(data[this.myCfg.field]);
				this.curveData[0].CountMax();
		}
		
		this.Cur = data;
	}
}
//------------------------------------------------------------------
class TFieldDataMan extends TCurveDataMan
{
	constructor(maxDataPoint,meta,updMsg,tmpl)
	{
		var maxData = meta.length;
		
		super(maxDataPoint,maxData,TFieldData,updMsg,tmpl);
		
		for(var i=0;i<maxData;i++)
		{
			this.myCurve[i][clMainTitle] = meta[i].name;
			this.myData[i].myCfg         = meta[i];

			this.activeCurve.push(this.myCurve[i]);
			this.myData[i].inList = i;
		}
	}

	UpdateData(dataInfo)
	{
		this.curData = dataInfo;
		
		for(var i=0;i<this.myData.length;i++)
		{
			this.myData[i].Update(dataInfo);
		}
	}
}

//------------------------------------------------------------------
//------------------------------------------------------------------
// [20220729, Whichway] 
// 3 functions intmanmain
//------------------------------------------------------------------
//------------------------------------------------------------------


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
const intTmpl  = ["assets/html/largeCurve.html","0","0","0","0",'#ff0000','#008000',UpdateIntMsg,[],-1,-1,null];
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







//------------------------------------------------------------------
//------------------------------------------------------------------
// [20220729, Whichway] 
// 3 functions 
// 
//------------------------------------------------------------------
//------------------------------------------------------------------










//------------------------------------------------------------------
//------------------------------------------------------------------
// [20220729, Whichway] 
// 3 functions 
//------------------------------------------------------------------
//------------------------------------------------------------------











//------------------------------------------------------------------
//------------------------------------------------------------------
// [20220729, Whichway] 
// 3 functions 
//------------------------------------------------------------------
//------------------------------------------------------------------

