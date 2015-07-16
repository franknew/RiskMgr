using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class ApprovalQueryForm : BaseQueryForm
    {
        public string ActivityID { get; set; }
        
        public Int32? Status { get; set; }
        
        public string Remark { get; set; }
        
        public string WorkflowID { get; set; }
        
        public Int32? Type { get; set; }
        
        public DateTime? LastUpdateTime_Start { get; set; }
        
        public DateTime? LastUpdateTime_End { get; set; }
        
        public string LastUpdator { get; set; }
        
    }
}
