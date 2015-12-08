using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RiskMgr.Model;

namespace RiskMgr.Form
{
    public class FinanceConfirmServiceForm
    {
        public string WorkflowID { get; set; }

        public string ActivityID { get; set; }

        public string ID { get; set; }

        public string TaskID { get; set; }

        public Decimal? ReturnBackMoney { get; set; }

        public DateTime? ReturnBackTime { get; set; }
    }
}
