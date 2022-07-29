/*------------------------------------------------------------------
One curve graph item
------------------------------------------------------------------*/
class TCurveItem
{
	constructor(_cfg,height,parentDOM,inx,parent)
	{
		this.cfg    = _cfg;
		this.inx    = inx;
		this.parent = parent;
		this.subUpd = null;

		var frame = document.createElement('iframe');
		
		frame.id           = inx;
		frame.src          = "../html/bareCurve.html";
		frame.width        = "100%";
		frame.height       = height;
		frame.scrolling    = "no";
		frame.frameBorder  = "0";
		frame.marginwidth  = 0;
		frame.marginheight = 0;
		frame.initData     = this;
		
		parentDOM.appendChild(frame);

		this.Frame = frame;
	}
	
	Update()
	{
		//console.log("Update="+this.Frame.contentWindow.Update);
		if(this.subUpd)
			this.subUpd();
		else
			console.log("Missing sub updater for "+this.inx);
		//this.Frame.contentWindow.Update();
	}
}
/*------------------------------------------------------------------
A list of curve graphs
------------------------------------------------------------------*/
class TCurveList
{
	constructor(arrData,height,parentDOM,frameDetail)
	{
		var nFrame   = arrData.length;
		
		this.Frames  = new Array(nFrame);
		this.parent  = parentDOM;
		this.initEnd = 0;
		this.curInx  = -1;
		this.sDetail = frameDetail;
		
		for(var i=0;i<nFrame;i++)
		{
			this.Frames[i] = new TCurveItem(arrData[i],height,parentDOM,i,this);
		}
	}
	
	UpdateList(arrData)
	{
		var last   = this.Frames.length;
		var nFrame = arrData.length;
		
		for(var i=last;i<nFrame;i++)
		{
			this.Frames.push(new TCurveItem(arrData[i],this.height,this.parentDOM,i,this));
		}
	}
	
	Update()
	{
		for(var i=0;i<this.Frames.length;i++)
		{
			this.Frames[i].Update();
		}
	}
	
	OnSubClick(inx)
	{
		this.curInx      = inx;
		this.sDetail.id  = inx;
		this.sDetail.src = this.Frames[inx].cfg[clRefPage];
		//this.sDetail.initData = this.Frames[inx].initData;
	}
	
	OnInitOne(inx)
	{
		var win = this.Frames[inx].Frame.contentWindow;
		
		win.clickObj = this;
		
		win.addEventListener('click', function() {this.clickObj.OnSubClick(inx);} );
		this.initEnd ++;
	}
}
/*------------------------------------------------------------------
One curve data item. Extends this one for real app.
------------------------------------------------------------------*/
class TCurveDataItem
{
	constructor(maxDataPoint)
	{
		this.curveData = [new TCurveData(maxDataPoint,1,0),new TCurveData(maxDataPoint,1,0),new TCurveData(maxDataPoint,1,0)];
		this.Cur       = null;
		this.inList    = -1;
	}
}
/*------------------------------------------------------------------
A curve list data manager. Extends this one for real app.
------------------------------------------------------------------*/
class TCurveDataMan
{
	constructor(maxDataPoint,maxItem,itemClass,updMsg,tmpl)
	{
		this.myData  = new Array(maxItem);
		this.myCurve = new Array(maxItem);
		this.curData = null;

		this.activeCurve = new Array();
		
		for(var i=0;i<maxItem;i++)
		{
			this.myData[i] = new itemClass(maxDataPoint);
		}

		for(var i=0;i<maxItem;i++)
		{
			var cd = [].concat(tmpl); //clone the template
			
			cd[clMainTitle]  = "核"+i;
			cd[clOffInSys]   = i;
			cd[clUpdMsg]     = updMsg;
			cd[clDataSource] = this.myData[i].curveData;
			cd[clRawData]    = this.myData[i];
			
			this.myCurve[i] = cd;
		}
	}
}
/*------------------------------------------------------------------
Gen data table cell array
------------------------------------------------------------------*/
function GenOneCell(trLine)
{
	var tdCore = document.createElement('td');
	
	tdCore.align = "center";
	trLine.appendChild(tdCore);
	return tdCore;
}
//------------------------------------------------------------------
function GenCellList(arrTr)
{
	var arrCore = new Array(arrTr.length);
	for(var i=0;i<arrTr.length;i++)
	{
		arrCore[i] = GenOneCell(arrTr[i]);
	}
	
	return arrCore;
}
//------------------------------------------------------------------
function InitArrCell(numItem,arrTr,arrCells)
{
	var start;
	
	if(arrCells==null)
	{
		start    = 0;
		arrCells = new Array(numItem);
	}
	else
	{
		start = arrCells.length;
	}
	
	for(var i=start;i<numItem;i++)
	{
		arrCells[i] = GenCellList(arrTr,(i==0));
	}
	
	return arrCells;
}
//------------------------------------------------------------------
function InitCurveList(curveListData,height,parentDOM,frameDetail)
{
	return new TCurveList(curveListData,height,parentDOM,frameDetail);
}
//------------------------------------------------------------------
function ColorTableRows(table, colorPlan)
{
	var trList = table.getElementsByTagName("tr");
	
	trList[0].style = "background-color:"+colorPlan.titleColor+";";
	
	for(var i=1;i<trList.length;i++)
	{
		if(i&1)
			trList[i].style = "background-color:"+colorPlan.oddColor+";";
		else
			trList[i].style = "background-color:"+colorPlan.evenColor+";";
	}

	var tdList = table.getElementsByTagName("td");
	
	for(var i=0;i<tdList.length;i++)
	{
		var rs = tdList[i].getAttribute("rowspan");

		if(rs!=null && parseInt(rs)>1)
			tdList[i].style = "background-color:"+colorPlan.leftColor+";";
	}
}
//------------------------------------------------------------------
function FmtEnumValue(templ, value)
{
	var inx = value-templ.start;
	
	if (inx<0)
		inx = 0;
	else if (inx>=templ.names.length)
		inx = templ.names.length-1;
		
	return templ.names[inx]+"/"+value;
}
//------------------------------------------------------------------
var defColorPlan = {titleColor:"#F0FFF0",leftColor:"#FFFFF0",evenColor:"#F0FFFF",oddColor:"#FFF0FF"};
//------------------------------------------------------------------
