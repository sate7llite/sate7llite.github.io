//------------------------------------------------------------------
// [20220729, Whichway] 
// It seems there are 3 classes
// At the begining, there are no even one line comments there,
// 		a little akaward even though it may code in human-made
//------------------------------------------------------------------
// [20220729, Whichway]
// set color and some menu block size, weight and height, etc.

class TSVGMenuData
{
	constructor()
	{
		this.bkgColor  = "#191919";
		this.lineColor = "blue";
		this.forColor  = "yellow";
		this.txtColor  = "#163f80";
		this.fontSize  = 38;
		this.overSize  = 40;
		this.yShift    = 9;
		this.btnWidth  = 200;
		this.btnHeight = 90;
		this.onClick   = null;
		this.menuSVG   = null;
		this.btnFace   = null;
		this.btnRef    = null;
	}
}

//------------------------------------------------------------------
// [20220729, Whichway] 
//
//------------------------------------------------------------------
class TSVGButton
{
	constructor(_parent, _inx)
	{
		var _cfg = _parent.data;
		
		this.cfg     = _cfg;
		this.inx     = _inx;
		
		this.rect    = _cfg.menuSVG.rect(_cfg.btnWidth,_cfg.btnHeight);
		this.text    = _cfg.menuSVG.text(_cfg.btnFace[_inx]);
		
		this.rect.attr({x:_cfg.btnWidth*_inx, y:0, fill:_cfg.bkgColor, stroke:"none"});
		this.text.attr({x:_cfg.btnWidth*(_inx+0.5), y:0, fill:_cfg.txtColor,
			stroke:"none", "text-anchor":"middle", "font-size":_cfg.fontSize,
			"alignment-baseline":"middle"});
			
		this.text.BtnObj = this;
			
		this.text.on("click",function(){_parent.DoClick(_inx);});
		this.text.on("mouseover",function(){this.BtnObj.OnMouseOver();});
		this.text.on("mouseout",function(){this.BtnObj.OnMouseOut();});
	}
	
	ActiveInx(btnInx)
	{
		if(btnInx==this.inx) this.rect.fill(this.cfg.forColor);
		else this.rect.fill(this.cfg.bkgColor);
	}
	
	OnMouseOver() { this.text.animate().attr({"y":-this.cfg.yShift,"font-size":this.cfg.overSize}); }
	OnMouseOut() { this.text.animate().attr({"y":0,"font-size":this.cfg.fontSize}); }
}
//------------------------------------------------------------------
class TSVGMenu
{
	constructor(data, domElem, arrBtnFace, arrBtnRef)
	{
		var l1 = arrBtnFace.length;
		var l2 = arrBtnRef.length;
		
		if(l1>l2) {l1 = l2;}
			
		this.data = data;
	
		this.data.menuSVG = SVG().addTo(domElem);
		this.data.btnFace = arrBtnFace;
		this.data.btnRef  = arrBtnRef;
		
		this.data.menuSVG.size(l1*data.btnWidth,data.btnHeight);

		this.menuDOM = domElem;
		this.numBtn  = l1;
		this.buttons = new Array();
		
		for(var i=0;i<l1;i++)
		{
			this.buttons.push(new TSVGButton(this,i));
		}

		var lines = data.menuSVG.group();
		
		lines.attr({x:0,y:0,"stroke-width":0.5, fill:"none",stroke:this.data.lineColor});
		
		var polyData = "0,"+data.btnHeight+" 0,0 "+(data.btnWidth*l1)+",0 ";//+(data.btnWidth*l1)+","+data.btnHeight;
			
		lines.polyline(polyData);
		
		for(var i=0;i<l1;i++)
		{
			var lineData=(data.btnWidth*(i+1))+" 0 ";
			lineData += (data.btnWidth*(i+1))+" "+data.btnHeight;
			lines.line(lineData);
		}
	}
	
	DoClick(btnInx)
	{
		for(var i=0;i<this.numBtn;i++)
		{
			this.buttons[i].ActiveInx(btnInx);
		}
		
		if(this.data.onClick)
			this.data.onClick(this.data.btnRef[btnInx]);
	}
}
//------------------------------------------------------------------
