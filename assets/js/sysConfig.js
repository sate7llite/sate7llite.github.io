//------------------------------------------------------------------
var maxNumTask     = 128;
var maxNumName     = 128;
var maxDataPoint   = 100;
var numCpu         = 8;
var numTask        = 64;
var numInt         = 32;
var numTimer       = 13;
var numNetPort     = 8;
var numSchdTask    = 128;
var updateInterval = 1000;
var jsSvrPort      = 1375;
var jsDataDlPort   = 1471;
var jsResultPort   = 1472;
var jsSvrIP        = window.location.hostname;
var jsURL          = window.location.protocol+"//"+jsSvrIP+":"+jsSvrPort+"/assets/js/current.json";
var jsSchdStatURL  = window.location.protocol+"//"+jsSvrIP+":"+jsSvrPort+"/assets/js/currentSchd.json";
var jsSchdDataURL  = window.location.protocol+"//"+jsSvrIP+":"+jsSvrPort+"/assets/js/currentTasks.json";
var jsDataListURL  = "/assets/js/dataList.json";     
//------------------------------------------------------------------
