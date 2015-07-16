using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class WorkflowDefinitionUpdateForm : SimpleUpdateForm<WorkflowDefinition>
    {
        public WorkflowDefinitionQueryForm WorkflowDefinitionQueryForm { get; set; }
    }
}