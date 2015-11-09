using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class TrackingMortgageQueryForm : SimpleQueryForm
    {
        public List<String> IDs { get; set;}
        public string ProjectID { get; set; }
        
        public List<String> ProjectIDs { get; set;}
        public List<String> Creators { get; set;}
        public string MortgageFeedbackCode { get; set; }
        
        public DateTime? MortgagePredictTime_Start { get; set; }
        
        public DateTime? MortgagePredictTime_End { get; set; }
        
        public DateTime? MortgageOverTime_Start { get; set; }
        
        public DateTime? MortgageOverTime_End { get; set; }
        
    }
}
