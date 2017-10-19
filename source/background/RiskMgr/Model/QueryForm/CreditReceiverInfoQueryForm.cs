using SOAFramework.Library.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class CreditReceiverInfoQueryForm : SimpleQueryForm
    {
        public List<String> IDs { get; set; }
        public List<String> ProjectIDs { get; set; }
        public string ProjectID { get; set; }
    }
}
