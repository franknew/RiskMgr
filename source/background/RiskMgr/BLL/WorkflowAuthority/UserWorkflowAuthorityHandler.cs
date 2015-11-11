using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DreamWorkflow.Engine.Model;

namespace RiskMgr.BLL
{
    public class UserWorkflowAuthorityHandler : IWorkflowAuthorityHandler
    {
        public List<string> Handle(ActivityAuth auth)
        {
            return new List<string> { auth.Value };
        }
    }
}
