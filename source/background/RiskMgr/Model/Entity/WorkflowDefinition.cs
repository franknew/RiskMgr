using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Model
{
    public class WorkflowDefinition : SimpleEntity
    {
        public Boolean? Enabled { get; set; }
        
        public string Remark { get; set; }
        
    }
}