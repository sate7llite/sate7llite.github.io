//------------------------------------------------------------------
// This function will be executed in bareCurve.html!
//------------------------------------------------------------------
function UpdateSchdMsg(curveData,curveMsg2,curveMsg3,curveMsg1)
{
	curveMsg1.innerHTML = FormatSize(curveData[0].GetLast());
}
//------------------------------------------------------------------
var schdTmpl = ["assets/html/largeCurve.html","0","0","0","0",'#ff0000','#008000',UpdateSchdMsg,[],-1,-1,null];
//------------------------------------------------------------------
var schdMeta = 
[
	{type:ftDifferentail, field:"taskAdded",   name:"提交"},
	{type:ftDifferentail, field:"taskSuccess", name:"成功"},
	{type:ftDifferentail, field:"taskFail",    name:"失败"},
	{type:ftRaw,          field:"taskReady",   name:"就绪"},
	{type:ftRaw,          field:"taskBlock",   name:"阻塞"},
	{type:ftRaw,          field:"taskRun",     name:"运行"},

];
//------------------------------------------------------------------
class TSchdMan extends TFieldDataMan
{
	constructor(maxDataPoint)
	{
		super(maxDataPoint,schdMeta,UpdateSchdMsg,schdTmpl);
	}
}
//------------------------------------------------------------------
