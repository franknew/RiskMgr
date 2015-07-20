using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    class GetMenuRequest : IRequest<GetMenuResponse>
    {
        public string GetApi()
        {
            return "RiskMgr.Api.MenuApi.GetMenu";
        }

        public string token { get; set; }
    }
}
