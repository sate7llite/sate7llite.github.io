//------------------------------------------------------------------
// Read a file from server
//------------------------------------------------------------------
function getFile(url)
{
	var xmlhttp = null;
	
	if (window.XMLHttpRequest)// code for all new browsers
		xmlhttp=new XMLHttpRequest();
	else if (window.ActiveXObject)// code for IE5 and IE6
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	else
		return null;
		
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	
	if(xmlhttp.status!==200)
		return null;
		
	return xmlhttp.responseText;
}
//------------------------------------------------------------------
// Read a file from server and parse it as JSON
//------------------------------------------------------------------
function getJSON(url)
{
	var rJSON = getFile(url);
	
	if(rJSON==null)
		return null;
		
	return eval("("+rJSON+")");
}
//------------------------------------------------------------------
// Format an integer to K/M/G
//------------------------------------------------------------------
function FormatSize(size_b)
{
	if(size_b<=1024)
		return size_b;
	var unit = "";
	if(size_b>1024)
	{
		size_b = size_b/1024;
		unit = "K";
	}
	
	if(size_b>1024)
	{
		size_b = size_b/1024;
		unit = "M";
	}

	if(size_b>1024)
	{
		size_b = size_b/1024;
		unit = "G";
	}
	
	return size_b.toFixed(2)+unit;
}
//------------------------------------------------------------------
// An array class with max lenghth limit
//------------------------------------------------------------------
function TLimitArr(limit)
{
	Array.call(this);
	this.limit = limit;
	
	this.AddData = function(v)
	{
		if(this.length>=this.limit)
			this.shift();
		this.push(v);
	}
	
	this.Init = function(v)
	{
		for(var i=0;i<this.limit;i++)
		{
			this[i] = v;
		}
	}
}
//------------------------------------------------------------------
TLimitArr.prototype = new Array();
TLimitArr.prototype.constructor = TLimitArr;
//------------------------------------------------------------------
// Compute N(mu, sigma) and N'(mu, sigma) at x
//------------------------------------------------------------------
function TGuass(mu,sigma)
{
	this.avg = mu;
	this.dev = sigma;
	
	const at = 2*sigma*sigma;
	
	this.a1  = Math.sqrt(1.0/(Math.PI*at));
	this.a2  = -1.0/at;
	
	this.EvalRaw = function(x0)
	{
		return this.a1*Math.exp(this.a2*x0*x0);
	}
	
	//Compute value at x
	this.Eval = function(x)
	{
		return this.EvalRaw(x-this.avg);
	}
	
	this.DRaw = function(x0)
	{
		return this.EvalRaw(x0)*2*this.a2*x0;
	}
	
	//Compute derivative at x
	this.D = function(x)
	{
		return this.DRaw(x-this.avg);
	}
	
	//Result is a 2d line crossing point [0] with slope [1]
	this.Dual = function(x)
	{
		const x0 = x-this.avg;
		return [ [x,this.EvalRaw(x0)], this.DRaw(x0)];
	}
	
	this.GetPointsE = function(startX,wSigma,step)
	{
		var w  = wSigma*this.dev;
		var lX = startX;
		var rX = this.avg+w;
		
		var ret = {arr:new Array,d:"",mulX:1};
		
		for(var x=lX;x<rX;x+=step*this.dev)
		{
			ret.arr.push(this.Dual(x));
		}
		
		// one more points
		ret.arr.push(this.Dual(x));
		ret.mulX = 100/(x-lX);
		
		return ret;
	}
}
//------------------------------------------------------------------
function TPareto(xMin,kExp)
{
	this.xMin = xMin;
	this.kExp = kExp;
	
	this.a1   = kExp*Math.pow(xMin,kExp);
	this.a2   = this.a1*(-kExp-1);
	
	//Compute value at x
	this.Eval = function(x)
	{
		return this.a1*Math.pow(x,-this.kExp-1);
	}
	
	//Compute derivative at x
	this.D = function(x)
	{
		return this.a2*Math.pow(x,-this.kExp-2);
	}
	
	//Result is a 2d line crossing point [0] with slope [1]
	this.Dual = function(x)
	{
		return [ [x,this.Eval(x)], this.D(x)];
	}
	
	this.GetE = function()
	{
		return this.xMin*this.kExp/(this.kExp-1);
	}
	
	this.GetDev = function()
	{
		return this.GetE()*Math.sqrt(this.kExp/(this.kExp-2));
	}
	
	this.GetPointsE = function(nPoint)
	{
		var x    = this.xMin;
		var xMax = 2048;
		
		var ret  = {"arr":new Array,"minVal":this.xMin,"minPos":0,"muVal":"∞","muPos":50,"sigmaVal":"∞","sigmaPos":90,"d":"","mulX":1};
		
		if(this.kExp>2)
		{
			ret.muVal    = this.GetE();
			ret.sigmaVal = ret.muVal+this.GetDev();
			xMax         = ret.sigmaVal*1.1;
			ret.muPos    = ret.muVal*100/xMax;
			ret.sigmaPos = ret.sigmaVal*100/xMax;
			
			ret.muVal    = ret.muVal.toFixed(1);
			ret.sigmaVal = ret.sigmaVal.toFixed(1);
		}
		else if(this.kExp>1)
		{
			ret.muVal = this.GetE();
			xMax      = ret.muVal*2;
			ret.muVal = ret.muVal.toFixed(1);
		}
		
		ret.mulX   = 100/xMax;
		ret.minPos = this.xMin*ret.mulX;
		const step = xMax/nPoint;

		for(var n=0;n<nPoint;n++)
		{
			const p = this.Dual(x);
			
			ret.arr.push(p);
			x += step;
		}
		
		return ret;
	}
}
//------------------------------------------------------------------
// compute the cross point of two lines
//------------------------------------------------------------------
function GetCross(l1,l2)
{
	const dk = l1[1]-l2[1]; //k1-k2
	
	if( (dk<1e-7) && (dk>-1e-7) ) //parallel lines
	{
		return [ (l1[0][0]+l1[0][0])/2, (l1[0][1]+l1[0][1])/2 ];
	}
	
	const b1 = l1[0][1]-l1[1]*l1[0][0]; //b=y-kx
	const b2 = l2[0][1]-l2[1]*l2[0][0]; //b=y-kx
	const xc = (b2-b1)/dk;              //xc=(b2-b1)/(k1-k2)
	const yc = l1[1]*xc+b1;             //yc=k1*xc+b1
/*	
	if(xc<0)
	{
		alert("l1="+l1+"\r\nl2="+l2+"\r\ndk="+dk+"\r\nb1="+b1+"\r\nb2="+b2+"\r\nx/y="+xc+"/"+yc);
	}
*/	
	return [xc,yc];
}
//------------------------------------------------------------------
function SVGConvXY(p,mulX,mulY)
{
	return [p[0]*mulX,100-p[1]*mulY];
}
//------------------------------------------------------------------
function GenQuadBCurve(points,mulX)
{
	const nP = points.length;
	if(nP<2)
		return [];
	
	var maxY = points[0][0][1];
	
	for(var i=1;i<nP;i++)
	{
		if(maxY<points[i][0][1])
			maxY = points[i][0][1];
	}
	
	const mulY = 90/maxY;
	
	var bc = new Array;
	bc.push([ SVGConvXY(points[0][0],mulX,mulY), [0,0] ]);
	
	for(var i=1;i<nP;i++)
	{
		bc.push( [ SVGConvXY(points[i][0],mulX,mulY), SVGConvXY(GetCross(points[i-1],points[i]),mulX,mulY) ] );
	}
	
	return bc;
}
//------------------------------------------------------------------
function GenSVGqbData(curve)
{
	const nP = curve.length;
	if(nP<2)
		return "";
	
	var msg = "M"+curve[0][0][0]+" "+curve[0][0][1];
	
	for(var i=1;i<nP;i++)
	{
		msg += "\r\nQ"+curve[i][1][0]+","+curve[i][1][1];
		msg += " "+curve[i][0][0]+","+curve[i][0][1];
	}
	
	return msg;
}
//------------------------------------------------------------------
function GenSVGqbCurve(points,mulX)
{
	return GenSVGqbData( GenQuadBCurve(points,mulX) );
}
//------------------------------------------------------------------
// step in unit of sigma
//------------------------------------------------------------------
function GenSVGGaussExt(mu, sigma, startX, wSigma, step)
{
	var gauss = new TGuass(mu,sigma);
	var ret   = gauss.GetPointsE(startX,wSigma,step);
	
	ret.d = GenSVGqbCurve(ret.arr,ret.mulX);
	return ret;
}
//------------------------------------------------------------------
function GenSVGParetoExt(xMin, kExp, nPoint)
{
	var pareto = new TPareto(xMin,kExp);
	var ret    = pareto.GetPointsE(nPoint);
	
	ret.d = GenSVGqbCurve(ret.arr,ret.mulX);

	return ret;
}
//------------------------------------------------------------------
// Reference array with index
//------------------------------------------------------------------
function ArrIndex(arr, inx, def=0)
{
	if( (inx<0) || (inx>=arr.length) )
		inx = def;
		
	return arr[inx];
}
//------------------------------------------------------------------
