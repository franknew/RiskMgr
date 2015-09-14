using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{ 
    public class InitApprovalResultForm : AddProjectServiceForm
    {
        public ActionStatus BusinessStatus { get; set; }

        public ActionStatus FinaceStatus { get; set; }
    }
}
