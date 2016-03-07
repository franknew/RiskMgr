using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RiskMgr.Form;
using SOAFramework.Library.WeiXin;
using SOAFramework.Service.SDK.Core;

namespace RiskMgr.WeiXinSignIn.Models
{
    public class WeiXinSignInRequest : BaseRequest<WeiXinSignInResponse>
    {
        public override string GetApi()
        {
            return "RiskMgr.Api.LogonApi.WeiXinLogon";
        }

        public WeiXinLogonServiceForm form { get; set; }
    }
}