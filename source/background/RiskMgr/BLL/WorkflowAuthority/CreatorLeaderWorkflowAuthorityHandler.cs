using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DreamWorkflow.Engine.DAL;
using DreamWorkflow.Engine.Form;
using DreamWorkflow.Engine.Model;
using IBatisNet.DataMapper;
using RiskMgr.DAL;
using RiskMgr.Form;

namespace RiskMgr.BLL
{
    public class CreatorLeaderWorkflowAuthorityHandler : IWorkflowAuthorityHandler
    {
        public List<string> Handle(ActivityAuth auth)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            WorkflowDao dao = new WorkflowDao(mapper);
            Workflow wf = dao.Query(new WorkflowQueryForm { ID = auth.WorkflowID }).FirstOrDefault();
            string userid = wf.Creator;
            UserleaderWorkflowAuthority authority = new UserleaderWorkflowAuthority();
            return authority.GetUserIDs(userid, Convert.ToInt32(auth.Value));
        }
    }
}
