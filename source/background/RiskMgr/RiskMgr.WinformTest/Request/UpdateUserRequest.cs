using RiskMgr.Model;
using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    public class UpdateUserRequest : BaseRequest<CommonResponse>
    {
        public override string GetApi()
        {
            return "RiskMgr.Api.UserApi.Update";
        }

        public string token { get; set; }

        public User user { get; set; }

        public UserInfo userinfo { get; set; }

    }
}
