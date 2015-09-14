using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    public class QueryMyProcessingRequest : BaseRequest<CommonResponse>
    {
        public override string GetApi()
        {
            return "RiskMgr.Api.WorkflowApi.QueryMyProcessing";
        }

        public string token { get; set; }
    }
}
