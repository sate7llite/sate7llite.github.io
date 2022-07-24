//------------------------------------------------------------------
//    detail page ,main color,title1,title2, defMsg,   data source                , minor color, offset in sysData 
var clRefPage    = 0;
var clMainTitle  = 1;
var clSubTitle   = 2;
var clDefValue1  = 3;
var clDefValue2  = 4;
var clMainColor  = 5;
var clMinorColor = 6;
var clUpdMsg     = 7;
var clDataSource = 8;
var clOffInSys   = 9;
var clFontAdd    = 10;
var clRawData    = 11;
//------------------------------------------------------------------
function CalcFillOpacity(inx)
{
	if(inx==0)
		return 0.2;
		
	if(inx==1)
		return 0;
		
	return 0;
}
//------------------------------------------------------------------
function GetCurveColor(initData,inx)
{
	if(inx==0)
		return initData[clMainColor];

	if(inx==1)
		return initData[clMinorColor];
		
	return "purple";
}
//------------------------------------------------------------------
