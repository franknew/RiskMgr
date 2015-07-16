using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class ActivityAuth : SimpleEntity
    {
        public string ActivityAuthDefinitionID { get; set; }
        
        public string Type { get; set; }
        
        public string Value { get; set; }
        
        public string ActivityID { get; set; }
        
        public string WorkflowID { get; set; }
        
    }
}