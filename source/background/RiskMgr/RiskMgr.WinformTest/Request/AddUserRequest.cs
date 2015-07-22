using RiskMgr.Model;
using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    public class AddUserRequest : BaseRequest<CommonResponse>
    {
        public override string GetApi()
        {
            return "RiskMgr.Api.UserApi.Add";
        }

        public User user { get; set; }

        public string token { get; set; }
    }
}
