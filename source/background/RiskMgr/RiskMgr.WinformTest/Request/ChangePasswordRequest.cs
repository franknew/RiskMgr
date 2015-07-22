using RiskMgr.Form;
using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    public class ChangePasswordRequest : BaseRequest<CommonResponse>
    {
        public override string GetApi()
        {
            return "RiskMgr.Api.UserApi.ChangePassword";
        }

        public string token { get; set; }

        public ChangePasswordUpdateForm form { get; set; }
    }
}
