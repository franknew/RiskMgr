using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class ReturnBackConfirmQueryForm : BaseQueryForm
    {
        public List<String> IDs { get; set;}
        public string ProjectID { get; set; }
        
        public List<String> ProjectIDs { get; set;}
        public DateTime? ReturnBackMoney_Start { get; set; }
        
        public DateTime? ReturnBackMoney_End { get; set; }
        
        public DateTime? ReturnBackTime_Start { get; set; }
        
        public DateTime? ReturnBackTime_End { get; set; }
        
    }
}
