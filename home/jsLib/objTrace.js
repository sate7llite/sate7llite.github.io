//------------------------------------------------------------------
// Object trace consts
//------------------------------------------------------------------
const moAreaBkg      = 0;   //black background, for area ID=0
const moAreaUnknown  = 1;	//init value
const moAreaBoundary = 2;   //areas within boundary area
const moAreaMotion   = 3;   //bright area of motion objects
const moAreaSun      = 4;   //bright area of small suns
const moAreaTooSmall = 5;   //areas too small to be a motion object or sun
const moAreaIOU      = 6;   //areas with IOU < minIOU (%) threshold
const moAreaTooLarge = 7;   //areas too large to be a motion object or sun
const moAreaNum      = 8;
//------------------------------------------------------------------
const oTypeSuspect = 0;
const oTypeMotion  = 1;
const oTypeOut     = 2;
const oTypeFalse   = 3;
//------------------------------------------------------------------
const otImgW       = 3072;
const otImgH       = 2560;
const otDiffAreaTH = 32;
//------------------------------------------------------------------
var oTypeStr=
[
	"嫌疑目标","运动目标","已远离目标","虚警目标"
];
/*------------------------------------------------------------------
Check wether two areas may match by area.
------------------------------------------------------------------*/
function IsAreaMatch(area1, area2)
{
	var dA = area1-area2;
	if(dA<0)
		da = -dA;
		
	var mA = area1;
	if(area2<mA)
		mA = area2;
		
	if(mA>otDiffAreaTH)
	{
		if( (dA*3)>mA )
			return -1;
			
		return dA;
	}
	
	if( (dA*2)>mA )
		return -1;
		
	return dA;
}
//------------------------------------------------------------------
// Object info class
//------------------------------------------------------------------
function TObjectInfo(initArea,frameID)
{
	//The constructor
	
	//Copy the initArea!!
	this.areaHistory   = [Object.assign({},initArea)]; //store areas on every frame for this object
	//this.globalHistory = new Array(); //store frame global shift 
	this.firstFrame    = frameID;
	this.lastFrame     = frameID;
	
	this.xSum          = 0;
	this.ySum          = 0;
	
	this.xShift        = -1000;
	this.yShift        = -1000;
	
	this.xySpeed       = 0;
	this.zDist         = 0;
	
	this.objType       = oTypeSuspect;
	
	this.IamOut(dID)
	{
		switch(this.objType)
		{
		case oTypeSuspect:
			this.objType = oTypeFalse;
			break;
		case oTypeMotion:
			if(dID>2)
				this.objType = oTypeOut;
			break;
		}
	}
	
	this.AddFrame = function (areas, frameID, globalDX, globalDY)
	{
		if( (this.objType==oTypeFalse) || (this.objType==oTypeOut)
			return -1;
			
		var searchRange = 10;
		var lastA = this.areaHistory[this.areaHistory.length-1];
		var predX = lastA.x;
		var predY = lastA.y;
		var dID   = frameID-lastFrame;
		
		if(this.xShift==-1000) //The second
		{
			searchRange = 100;
		}
		else
		{
			predX += this.xShift*dID;
			predY += this.yShift*dID;
		}
		
		var startY = predY-searchRange;
		var stopY  = predY+searchRange;
		
		//The object is out frame for sure
		if( ((predX+searchRange)<0) || ((predX-searchRange)>=otImgW) || (stopY<0) || (startY>=otImgH) )
		{
			this.IamOut(dID);
			return -1;
		}
		
		var minMatch = searchRange*4;
		var mI       = null;
		var retI     = -1;
		
		for(var oI=0;oI<areas.length;oI++)
		{
			var aI = areas[oI];

			if(aI.y>=stopY)
				break;
				
			if(aI.y<startY)
				continue;
				
			//When an obj is in suspect state, only motion area can match
			//An definite motion object can match star
			if( (aI.type!=moAreaMotion) && (this.objType!=oTypeMotion) )
				continue;
				
			var xDiff = aI.x-predX;
			if(xDiff<0)
				xDiff = -xDiff;
				
			if(xDiff>searchRange)
				continue;
				
			var aDiff = IsAreaMatch(aI.area,lastA.area);
			
			if(aDiff<0)
				continue;
				
			var yDiff = predY-aI.y;
			if(yDiff<0)
				yDiff = -yDiff;
				
			var tDiff = xDiff+yDiff+aDiff;
			
			if(tDiff<minMatch)
			{
				mI       = aI;
				minMatch = tDiff;
				retI     = oI;
			}
		}
		
		if(mI==null)
		{
			this.IamOut(dID);
			return -1;
		}

		//Copy the area out!!
		var aI=Object.assign({},mI);
		this.areaHistory.push(aI);
		
		this.lastFrame = frameID;
		
		this.xSum += aI.x-lastA.x;
		this.ySum += aI.y-lastA.y;
		
		var tdID    = frameID-firstFrame;
		this.xShift = this.xSum/tdID;
		this.yShift = this.ySum/tdID;
		
		var wO = aI.xMax-aI.x;
		var hO = aI.yMax-aI.y;
		
		if(wO<hO)
			wO = hO;
		
		this.zDist = 5000/wO;
		
		var dxT    = this.xShift-globalDX;
		var dyT    = this.yShift-globalDY;
		var xyMove = Math.sqrt(dxT*dxT+dyT*dyT);
		
		this.xySpeed = xyMove*10/wO;
		
		return retI;
	}
}
//------------------------------------------------------------------
// Object trace class
//------------------------------------------------------------------
function TObjectTrace()
{
	this.objTbl = new Array().fill(0);
	
	this.AddFrame = function(areas, frameID, globalDX, globalDY)
	{
		var flag = new Array(areas.length);
		
		for(var i=0;i<this.objTbl.length;i++)
		{
			var inx = this.objTbl.AddFrame(areas, frameID, globalDX, globalDY);
			
			if(inx>=0)
				flag[inx] = 1;
		}
		
		for(var i=0;i<areas.length;i++)
		{
			if(flags[i]!=0)
				continue;
				
			var aI = areas[i];
			
			if(aI.type!=moAreaMotion)
				continue;
				
			var ot = new TObjectInfo(aI,frameID);
			this.objTbl.push(ot);
		}
	}
}
//------------------------------------------------------------------
