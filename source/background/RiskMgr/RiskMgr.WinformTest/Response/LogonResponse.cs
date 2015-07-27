using RiskMgr.Form;
using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    public class LogonResponse : BaseResponse
    {
        public LogonResultForm form { get; set; }
    }
}
