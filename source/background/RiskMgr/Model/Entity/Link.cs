using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Model
{
    public class Link : SimpleEntity
    {
        public string LinkDefinitionID { get; set; }
        
        public string FromActivityID { get; set; }
        
        public string ToAcivityID { get; set; }
        
        public Boolean? Passed { get; set; }
        
        public DateTime? PassedTime { get; set; }
        
        public string WorkflowID { get; set; }
        
    }
}