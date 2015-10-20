using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class TrackingMortgageQueryForm : SimpleQueryForm
    {
        public string ProjectID { get; set; }
        
        public string LastUpdater { get; set; }
        
        public string MortgageFeedbackCode { get; set; }
        
        public DateTime? MortgageFeedbackTime_Start { get; set; }
        
        public DateTime? MortgageFeedbackTime_End { get; set; }
        
        public DateTime? MortgagePredictCompleteTime_Start { get; set; }
        
        public DateTime? MortgagePredictCompleteTime_End { get; set; }
        
    }
}
