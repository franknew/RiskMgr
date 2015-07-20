using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    public class LogonRequest : IRequest<LogonResponse>
    {
        public string GetApi()
        {
            return "RiskMgr.Api.LogonApi.Logon";
        }

        public string username { get; set; }

        public string password { get; set; }
    }
}
