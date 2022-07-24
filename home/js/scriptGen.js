//------------------------------------------------------------------
var bkgHdrCmd = 
`if ~bkg_#videoID# RunTask cmd=Recv #svr# #portRecv# #videoID# -1 bkg_#videoID#\r\n`;
var bkgFrameCmd = 
`if ~Frame_#videoID#_#frameID# RunTask cmd=Recv #svr# #portRecv# #videoID# #frameID# Frame_#videoID#_#frameID#
RunTask in=bkg_#videoID#,Frame_#videoID#_#frameID# cmd=GrndGenDiff bkg_#videoID# Frame_#videoID#_#frameID# DiffBkg_#videoID#_#frameID#
RunTask in=cfg_Ground,DiffBkg_#videoID#_#frameID# cmd=GrndAddAndTh DiffBkg_#videoID#_#frameID# Mask_#videoID#_#frameID# cfg_Ground
RunTask in=cfg_Ground,Mask_#videoID#_#frameID# id=Smooth_#videoID#_#frameID# cmd=GrndSmoothMask Mask_#videoID#_#frameID# cfg_Ground
RunTask in=Smooth_#videoID#_#frameID# cmd=CleanData Frame_#videoID#_#frameID# DiffBkg_#videoID#_#frameID#
RunTask in=cfg_Ground,Smooth_#videoID#_#frameID# cmd=GrndMask2Obj Mask_#videoID#_#frameID# Obj_#videoID#_#frameID# cfg_Ground
RunTask in=Obj_#videoID#_#frameID# cmd=CleanData Mask_#videoID#_#frameID# Smooth_#videoID#_#frameID#
RunTask in=Obj_#videoID#_#frameID# id=Send_#videoID#_#frameID# cmd=Send #svr# #portSend# #videoID# #frameID# Obj_#videoID#_#frameID#
RunTask in=Send_#videoID#_#frameID# cmd=CleanData Obj_#videoID#_#frameID# Send_#videoID#_#frameID#
`;
//------------------------------------------------------------------
var bkgTmpl={hdrCmd:bkgHdrCmd,frameCmd:bkgFrameCmd,tailCmd:"",incFirst:false};
//------------------------------------------------------------------
var fDiffHdrCmd = 
`if ~Frame_#videoID#_#frameID# RunTask cmd=Recv #svr# #portRecv# #videoID# #frameID# Frame_#videoID#_#frameID#
`;
var fDiffFrameCmd = 
`if ~Frame_#videoID#_#frameID# RunTask cmd=Recv #svr# #portRecv# #videoID# #frameID# Frame_#videoID#_#frameID# 2
RunTask in=Frame_#videoID#_#frameID#,Frame_#videoID#_#frameIDn1# cmd=GrndGenDiff Frame_#videoID#_#frameIDn1# Frame_#videoID#_#frameID# DiffFrame_#videoID#_#frameID#
RunTask in=DiffFrame_#videoID#_#frameID# cmd=CleanData Frame_#videoID#_#frameIDn1# Frame_#videoID#_#frameID#
RunTask in=cfg_Ground,DiffFrame_#videoID#_#frameID# cmd=GrndAddAndTh DiffFrame_#videoID#_#frameID# Mask_#videoID#_#frameID# cfg_Ground
RunTask in=Mask_#videoID#_#frameID# cmd=CleanData DiffFrame_#videoID#_#frameID#
RunTask in=cfg_Ground,Mask_#videoID#_#frameID# id=Smooth_#videoID#_#frameID# cmd=GrndSmoothMask Mask_#videoID#_#frameID# cfg_Ground
RunTask in=cfg_Ground,Smooth_#videoID#_#frameID# cmd=GrndMask2Obj Mask_#videoID#_#frameID# Obj_#videoID#_#frameID# cfg_Ground
RunTask in=Obj_#videoID#_#frameID# cmd=CleanData Mask_#videoID#_#frameID# Smooth_#videoID#_#frameID#
RunTask in=Obj_#videoID#_#frameID# id=Send_#videoID#_#frameID# cmd=Send #svr# #portSend# #videoID# #frameID# Obj_#videoID#_#frameID#
RunTask in=Send_#videoID#_#frameID# cmd=CleanData Obj_#videoID#_#frameID# Send_#videoID#_#frameID#
`;
var fDiffTailCmd = 
`RunTask in=Send_#videoID#_#frameID# cmd=CleanData Frame_#videoID#_#frameID#
`;
//------------------------------------------------------------------
var fDiffTmpl={hdrCmd:fDiffHdrCmd,frameCmd:fDiffFrameCmd,tailCmd:fDiffTailCmd,incFirst:true};
//------------------------------------------------------------------
var extHdrCmd = fDiffHdrCmd+
`if ~bkg_#videoID# RunTask cmd=Recv #svr# #portRecv# #videoID# -1 bkg_#videoID#\r\n`;
var extFrameCmd = 
`if ~Frame_#videoID#_#frameID# RunTask cmd=Recv #svr# #portRecv# #videoID# #frameID# Frame_#videoID#_#frameID# 2
RunTask in=bkg_#videoID#,Frame_#videoID#_#frameID# cmd=GrndGenDiff bkg_#videoID# Frame_#videoID#_#frameID# DiffBkg_#videoID#_#frameID#
RunTask in=Frame_#videoID#_#frameID#,Frame_#videoID#_#frameIDn1# cmd=GrndGenDiff Frame_#videoID#_#frameIDn1# Frame_#videoID#_#frameID# DiffDual_#videoID#_#frameID#
RunTask in=DiffDual_#videoID#_#frameID#,DiffBkg_#videoID#_#frameID# cmd=CleanData Frame_#videoID#_#frameID# Frame_#videoID#_#frameIDn1#
RunTask in=cfg_Ground,DiffDual_#videoID#_#frameID#,DiffBkg_#videoID#_#frameID# cmd=GrndAddAndTh DiffDual_#videoID#_#frameID# Mask_#videoID#_#frameID# cfg_Ground DiffBkg_#videoID#_#frameID#
RunTask in=cfg_Ground,Mask_#videoID#_#frameID# id=Smooth_#videoID#_#frameID# cmd=GrndSmoothMask Mask_#videoID#_#frameID# cfg_Ground
RunTask in=Mask_#videoID#_#frameID# cmd=CleanData DiffDual_#videoID#_#frameID# DiffBkg_#videoID#_#frameID#
RunTask in=cfg_Ground,Smooth_#videoID#_#frameID# cmd=GrndMask2Obj Mask_#videoID#_#frameID# Obj_#videoID#_#frameID# cfg_Ground
RunTask in=Obj_#videoID#_#frameID# cmd=CleanData Mask_#videoID#_#frameID# Smooth_#videoID#_#frameID#
RunTask in=Obj_#videoID#_#frameID# id=Send_#videoID#_#frameID# cmd=Send #svr# #portSend# #videoID# #frameID# Obj_#videoID#_#frameID#
RunTask in=Send_#videoID#_#frameID# cmd=CleanData Obj_#videoID#_#frameID# Send_#videoID#_#frameID#
`;
//------------------------------------------------------------------
var extTmpl={hdrCmd:extHdrCmd,frameCmd:extFrameCmd,tailCmd:fDiffTailCmd,incFirst:true};
//------------------------------------------------------------------
var starHdrCmd = 
`if ~Frame_#videoID#_#frameID# RunTask cmd=Recv #svr# #portRecv# #videoID# #frameID# Frame_#videoID#_#frameID#
RunTask in=cfg_Space,Frame_#videoID#_#frameID# cmd=GrndMask2Obj Frame_#videoID#_#frameID# Obj_#videoID#_#frameID# cfg_Ground
RunTask in=Obj_#videoID#_#frameID# cmd=CleanData Frame_#videoID#_#frameID#
`;
var starFrameCmd = 
`if ~Frame_#videoID#_#frameID# RunTask cmd=Recv #svr# #portRecv# #videoID# #frameID# Frame_#videoID#_#frameID#
RunTask in=cfg_Space,Frame_#videoID#_#frameID# cmd=GrndMask2Obj Frame_#videoID#_#frameID# Obj_#videoID#_#frameID# cfg_Space
RunTask in=Obj_#videoID#_#frameID# cmd=AddDataRef Obj_#videoID#_#frameID#
RunTask in=Obj_#videoID#_#frameID# cmd=CleanData Frame_#videoID#_#frameID#
RunTask in=cfg_Space,Obj_#videoID#_#frameID#,Obj_#videoID#_#frameIDn1# id=MarkArea_#videoID#_#frameID# cmd=StarMarkArea Obj_#videoID#_#frameIDn1# Obj_#videoID#_#frameID# cfg_Space
RunTask in=MarkArea_#videoID#_#frameID# cmd=CleanData Obj_#videoID#_#frameIDn1#
RunTask in=MarkArea_#videoID#_#frameID# id=Send_#videoID#_#frameID# cmd=Send #svr# #portSend# #videoID# #frameID# Obj_#videoID#_#frameID#
RunTask in=Send_#videoID#_#frameID# cmd=CleanData Obj_#videoID#_#frameID# Send_#videoID#_#frameID# MarkArea_#videoID#_#frameID#
`;
var starTailCmd = 
`RunTask in=Send_#videoID#_#frameID# cmd=CleanData Obj_#videoID#_#frameID#
`;
//------------------------------------------------------------------
var starTmpl={hdrCmd:starHdrCmd,frameCmd:starFrameCmd,tailCmd:starTailCmd,incFirst:true};
//------------------------------------------------------------------
var scriptTmpls=[bkgTmpl,fDiffTmpl,extTmpl,starTmpl];
//------------------------------------------------------------------
function FmtCmdStr(strTmpl,videoID, frameID, svr, portRecv, portSend)
{
	return strTmpl.replace(/#videoID#/g,videoID)
				  .replace(/#frameID#/g,frameID)
				  .replace(/#frameIDn1#/g,frameID-1)
				  .replace(/#svr#/g,svr)
				  .replace(/#portRecv#/g,portRecv)
				  .replace(/#portSend#/g,portSend);
}
//------------------------------------------------------------------
function GenScirpt(videoID, frameID, frameNum, svr, portRecv, portSend, tmpl, isFirst, isLast)
{
    var out = "";
	
	if(isFirst)
	{
		out += FmtCmdStr(tmpl.hdrCmd,videoID, frameID, svr, portRecv, portSend);
	
		if(tmpl.incFirst)
		{
			frameNum --;
			frameID  ++;
		}
	}
	
	for(var i=0;i<frameNum;i++)
	{
		out += FmtCmdStr(tmpl.frameCmd,videoID, frameID, svr, portRecv, portSend);
		frameID ++;
	}
	
	if(isLast)
		out += FmtCmdStr(tmpl.tailCmd,videoID, frameID-1, svr, portRecv, portSend);
	
	return out;
}
//------------------------------------------------------------------
