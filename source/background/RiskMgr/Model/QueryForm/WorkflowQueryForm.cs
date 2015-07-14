using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class WorkflowQueryForm : BaseQueryForm
    {
        public string WorkflowDefinitionID { get; set; }
        
        public Int32? Status { get; set; }
        
    }
}
