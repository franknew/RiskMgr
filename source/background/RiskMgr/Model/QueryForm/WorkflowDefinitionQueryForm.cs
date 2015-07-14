using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class WorkflowDefinitionQueryForm : BaseQueryForm
    {
        public Boolean? Enabled { get; set; }
        
        public string Remark { get; set; }
        
    }
}
