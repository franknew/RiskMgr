using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class LinkQueryForm : BaseQueryForm
    {
        public string LinkDefinitionID { get; set; }
        
        public string FromActivityID { get; set; }
        
        public string ToAcivityID { get; set; }
        
        public UInt64? Passed { get; set; }
        
        public DateTime? PassedTime_Start { get; set; }
        
        public DateTime? PassedTime_End { get; set; }
        
        public string WorkflowID { get; set; }
        
        public DateTime? LastUpdateTime_Start { get; set; }
        
        public DateTime? LastUpdateTime_End { get; set; }
        
        public string LastUpdator { get; set; }
        
    }
}
