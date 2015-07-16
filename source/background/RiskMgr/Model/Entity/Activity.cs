using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Activity : SimpleEntity
    {
        public string ActivityDefinitionID { get; set; }
        
        public string Page { get; set; }
        
        public string Type { get; set; }
        
        public string WorkflowID { get; set; }
        
        public Int32? Status { get; set; }
        
        public DateTime? ReadTime { get; set; }
        
        public DateTime? ProcessTime { get; set; }
        
    }
}