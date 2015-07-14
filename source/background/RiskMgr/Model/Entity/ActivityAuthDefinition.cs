using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Model
{
    public class ActivityAuthDefinition : SimpleEntity
    {
        public string Type { get; set; }
        
        public string Value { get; set; }
        
        public string ActivityDefinitionID { get; set; }
        
        public string WorkflowDefinitionID { get; set; }
        
    }
}