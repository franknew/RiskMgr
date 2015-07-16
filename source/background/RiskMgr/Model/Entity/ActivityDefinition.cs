using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class ActivityDefinition : SimpleEntity
    {
        public string WorkflowDefinitionID { get; set; }
        
        public string Page { get; set; }
        
        public UInt64? Enabled { get; set; }
        
        public Int32? Type { get; set; }
        
        public string Remark { get; set; }
        
    }
}