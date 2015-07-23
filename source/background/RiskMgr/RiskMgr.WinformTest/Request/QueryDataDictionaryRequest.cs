using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    class QueryDataDictionaryRequest : BaseRequest<CommonResponse>
    {
        public override string GetApi()
        {
            return "RiskMgr.Api.DataDictionaryApi.QueryByGroupNameList";
        }

        public List<string> nameList { get; set; }
    }
}
