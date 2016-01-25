using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class QueryMyProcessingServiceForm : BaseQueryForm
    {
        public string SearchType { get; set; }

        public int? ApprovalStatus { get; set; }
    }
}
