//------------------------------------------------------------------
// This function will be executed in bareCurve.html!
//------------------------------------------------------------------
function UpdateMemMsg(curveData,curveMsg2,curveMsg3,curveMsg1)
{
	var val = curveData[0].GetLast();
	
	if( (val>0) && (val<1) )
		curveMsg1.innerHTML = sprintf("%.1f%%",val*100);
	else
		curveMsg1.innerHTML = FormatSize(val);
}
//------------------------------------------------------------------
var memTmpl  = ["largeCurve.html","0","0","0","0",'#ff0000','#008000',UpdateMemMsg,[],-1,-1,null];
//------------------------------------------------------------------
var memMeta = 
[
	{type:ftRatio,        field:"xAvailableHeapSpaceInBytes", name:"空闲容量",max:"xTotalMemInHeap"},
	{type:ftRatio,        field:"xMinimumEverFreeBytesRemaining", name:"最小空闲容量",max:"xTotalMemInHeap"},
	{type:ftRatio,        field:"xSizeOfLargestFreeBlockInBytes", name:"最大空闲块",max:"xTotalMemInHeap"},
	{type:ftRatio,        field:"xSizeOfSmallestFreeBlockInBytes", name:"最小空闲块",max:"xTotalMemInHeap"},
	{type:ftDifferentail, field:"xNumberOfSuccessfulAllocations", name:"分配次数"},
	{type:ftDifferentail, field:"xNumberOfSuccessfulFrees", name:"释放次数"},
	{type:ftRaw,          field:"xNumberOfFreeBlocks", name:"空闲块数"},
];
//------------------------------------------------------------------
class TMemMan extends TFieldDataMan
{
	constructor(maxDataPoint)
	{
		super(maxDataPoint,memMeta,UpdateMemMsg,memTmpl);
	}
}
//------------------------------------------------------------------
