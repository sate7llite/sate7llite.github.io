//------------------------------------------------------------------
function onGaugeSVGLoad(event)
{
	this.This.Init();
}
//------------------------------------------------------------------
class TGaugeIntf
{
	constructor(div,width,height)
	{
		this.div   = div;
		this.obj   = document.createElement("object");
		
		this.obj.This   = this;
		this.obj.type   = "image/svg+xml"; 
		this.obj.data   = "../svg/gaugeDesign.svg" 
		this.obj.onload = onGaugeSVGLoad;
		this.obj.width  = width;
		this.obj.height = height;
		
		div.appendChild(this.obj);
	}
	
	Init()
	{
		this.valObj = this.obj.contentDocument.getElementsByClassName("gaugeValue")[0];
		//this.svgObj = this.obj.contentDocument.getElementsByClassName("gaugeSVG")[0];
		this.valSVG = SVG(this.valObj);
		//this.svgSVG = SVG(this.svgObj);
	}
	
	SetValue(value)
	{
		if(this.valSVG)
			this.valSVG.animate().attr("height",100-value);//this.valSVG.height(100-value);
	}
	
	SetOverColor(color)
	{
		if(this.valSVG)
			this.valSVG.attr("fill",color);
	}
}
//------------------------------------------------------------------
