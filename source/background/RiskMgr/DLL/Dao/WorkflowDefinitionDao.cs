using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.DAL
{
    public partial class WorkflowDefinitionDao : SimpleDao<WorkflowDefinition, WorkflowDefinitionQueryForm, WorkflowDefinitionUpdateForm>
    {
        public WorkflowDefinitionDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}