//------------------------------------------------------------------
const threadStatus=["初始化", "就绪", "运行", "备用", "终止", "等待", "传输", "未知"];
//------------------------------------------------------------------
const tscInit      = 0;
const tscReady     = 1;
const tscRun       = 2;
const tscBackup    = 3;
const tscTerminate = 4;
const tscWait      = 5;
const tscTransfer  = 6;
const tscUnknown   = 7;
//------------------------------------------------------------------
const threadWaitReason=[
"等待“可执行”", "空闲页","Page In", "Pool Allocation","Execution Delay","暂停","用户请求",
"等待“可执行”", "空闲页","Page In", "Pool Allocation","Execution Delay","暂停","用户请求",
"Event Pair High", "Event Pair Low", "LPC Receive", "LPC 回应", "虚拟内存", "Page Out","未知"];
//------------------------------------------------------------------
const taskCurState={start:0, names:[
	"运行/eRunning", "就绪/eReady", "阻塞/eBlocked", "挂起/eSuspended", "删除/eDeleted", "非法/eInvalid"]};
//------------------------------------------------------------------
const taskRunState={start:-2, names:[
	//"调出/taskTASK_YIELDING", "未运行/taskTASK_NOT_RUNNING", "运行"]};
	"调出", "未运行", "运行"]};
//------------------------------------------------------------------
const taskStatus={start:0, names:[
    "空/tesNULL", "未知/tesUnknown", "初始化/tesInit", "挂起/tesSuspend",
    "运行/tesRun","同步/tesSync","退出tesExit","错误tesError"]};
//------------------------------------------------------------------
function FmtEnumValue(templ, value)
{
	var inx = value-templ.start;
	
	if (inx<0)
		inx = 0;
	else if (inx>=templ.names.length)
		inx = templ.names.length-1;
		
	return templ.names[inx]+" ("+value+")";
}
//------------------------------------------------------------------
