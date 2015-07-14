using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class ActivityAuthQueryForm : BaseQueryForm
    {
        public string ActivityAuthDefinitionID { get; set; }
        
        public string Type { get; set; }
        
        public string Value { get; set; }
        
        public string ActivityID { get; set; }
        
        public string WorkflowID { get; set; }
        
    }
}
