using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class ActivityAuthDefinitionQueryForm : BaseQueryForm
    {
        public string Type { get; set; }
        
        public string Value { get; set; }
        
        public string ActivityDefinitionID { get; set; }
        
        public string WorkflowDefinitionID { get; set; }
        
        public DateTime? LastUpdateTime_Start { get; set; }
        
        public DateTime? LastUpdateTime_End { get; set; }
        
        public string LastUpdator { get; set; }
        
    }
}
