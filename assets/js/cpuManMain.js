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
