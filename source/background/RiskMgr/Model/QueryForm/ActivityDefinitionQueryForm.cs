using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class ActivityDefinitionQueryForm : BaseQueryForm
    {
        public string WorkflowDefinitionID { get; set; }
        
        public string Page { get; set; }
        
        public UInt64? Enabled { get; set; }
        
        public Int32? Type { get; set; }
        
        public string Remark { get; set; }
        
        public DateTime? LastUpdateTime_Start { get; set; }
        
        public DateTime? LastUpdateTime_End { get; set; }
        
        public string LastUpdator { get; set; }
        
    }
}
