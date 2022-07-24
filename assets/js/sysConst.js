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
