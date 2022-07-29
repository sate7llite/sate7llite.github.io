//------------------------------------------------------------------
// [20220729, Whichway] 
//
//------------------------------------------------------------------
function TCurveData(_maxPoint,_maxVal,_minVal)
{
	this.maxPoint = _maxPoint-1;
	this.maxVal   = _maxVal;
	this.minVal   = _minVal;
	this.Data     = new Array(_maxPoint);
	
	for(var i=0;i<_maxPoint;i++) { this.Data[i] = _minVal; }
	
	this.GetLast = function()
	{
		return this.Data[this.Data.length-1];
	}
	
	this.CountMin = function()
	{
		var n = this.Data.length;
		if(n<=0)
		{
			this.minVal = 0;
			return;
		}
		
		this.minVal = this.Data[0];
		for(var i=1;i<n;i++)
		{
			if(this.minVal>this.Data[i])
				this.minVal=this.Data[i];
		}
	}
	
	this.CountMax = function()
	{
		var n = this.Data.length;
		if(n<=0)
		{
			this.minVal = 0;
			return;
		}
		
		this.maxVal = this.Data[0];
		for(var i=1;i<n;i++)
		{
			if(this.maxVal<this.Data[i])
				this.maxVal=this.Data[i];
		}
	}
	
	this.Count = function()
	{
		this.CountMin();
		this.CountMax();
		if(this.maxVal<=this.minVal)
			this.maxVal = this.minVal+1;
	}
	
	this.GetY = function(inx)
	{
		const val = this.Data[inx];
		return 1-0.992*(val-this.minVal)/(this.maxVal-this.minVal);
	}
	
	this.AddData = function(value)
	{
		var n = this.Data.length;
		
		if(n>=this.maxPoint)
			this.Data.shift();
		
		this.Data.push(value);
	}
	this.FullAdd = function(value)
	{
		this.AddData(value);
		this.Count();
	}
}
//------------------------------------------------------------------
// [20220729, Whichway] 
//
//------------------------------------------------------------------
function TCurveDraw(svg,_cw,_ch,_color,_fillOp)
{
	this.draw   = svg;//svg.svg("<svg x='0.5%' y='0.5%' width='99%' height='99%'></svg>");
	this.cw     = _cw;
	this.ch     = _ch;
	this.fillOp = _fillOp;
	this.curve  = null;
	
	if(_fillOp>0)
	{
		this.curve = this.draw.polygon();
		this.curve.attr({fill:_color, stroke:_color, 'stroke-width':0.7, 'fill-opacity':_fillOp});
	}
	else
	{
		this.curve = this.draw.polyline();
		this.curve.attr({fill:'none', stroke:_color, 'stroke-width':0.7});
	}
	
	this.GetAxis = function(curveData,inx,nP1)
	{
		const y = curveData.GetY(inx)*this.ch;
		const x = (inx*this.cw/nP1);
		return [x, y];
	}
	
	this.Draw = function(curveData,_fillOp)
	{
		const nPoint = curveData.Data.length;
		const nP1    = nPoint-1;
		var   points = new Array;
		
		if(this.fillOp>0)
		{
			points.push([this.cw,this.ch]);
			points.push([0,      this.ch]);
		}
		
		var lastV   = curveData.minVal-1;
		var passCnt = 0;

		for(var i=0;i<nP1;i++)
		{
			const cur = curveData.Data[i];
			
			if(cur!=lastV)
			{
				if(passCnt>0)
					points.push(this.GetAxis(curveData,i-1,nP1));
				
				points.push(this.GetAxis(curveData,i,nP1));
				lastV   = cur;
				passCnt = 0;
			}
			else
			{
				passCnt ++;
			}
		}
		
		if(passCnt>0)
			points.push(this.GetAxis(curveData,nP1-1,nP1));
		points.push(this.GetAxis(curveData,nP1,nP1));
		this.curve.plot(points);
	}
}
//------------------------------------------------------------------
// [20220729, Whichway] 
//
//------------------------------------------------------------------
function TResCurve(_svgObj)
{
	this.draw   = SVG(_svgObj);
	this.bkg    = this.draw.svg(strCurveBkg);
	this.Curves = new Array();
	
	const style = getComputedStyle(_svgObj);
	
	this.cw = parseInt(style.width);
	this.ch = parseInt(style.height);
	
	this.SetFrameColor = function(color)
	{
		this.draw.findOne('rect.curveFrame').attr('stroke',color);
	}
	
	this.AddCurve = function(_color,_fillOp)
	{
		var curve = new TCurveDraw(this.draw,this.cw,this.ch,_color,_fillOp);
		this.Curves.push(curve);
		return curve;
	}
	
	this.Update = function(dataArr)
	{
		for(var i=0;i<this.Curves.length;i++)
		{
			this.Curves[i].Draw(dataArr[i]);
		}
	}
}
//------------------------------------------------------------------
