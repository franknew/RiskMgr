using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    class GetMenuRequest : IRequest<CommonResponse>
    {
        public string GetApi()
        {
            return "RiskMgr.Api.IndexApi.InitPage";
        }

        public string token { get; set; }
    }
}
