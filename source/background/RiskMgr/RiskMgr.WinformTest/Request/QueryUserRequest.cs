using RiskMgr.Form;
using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    public class QueryUserRequest : BaseRequest<CommonResponse>
    {
        public override string GetApi()
        {
            return "RiskMgr.Api.UserApi.QueryUser";
        }

        public FullUserQueryForm form { get; set; }

        public string token { get; set; }
    }
}
