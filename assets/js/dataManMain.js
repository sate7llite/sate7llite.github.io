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
