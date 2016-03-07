using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RiskMgr.Form;
using SOAFramework.Library.WeiXin;
using SOAFramework.Service.SDK.Core;

namespace RiskMgr.WeiXinSignIn.Models
{
    public class WeiXinSignInResponse : BaseResponse
    {
        public LogonResultForm result { get; set; }
    }
}