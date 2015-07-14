using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Model
{
    public class Workflow : SimpleEntity
    {
        public string WorkflowDefinitionID { get; set; }
        
        public Int32? Status { get; set; }
        
    }
}