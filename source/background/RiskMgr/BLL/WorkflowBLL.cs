using DreamWorkflow.Engine;
using DreamWorkflow.Engine.Model;
using IBatisNet.DataMapper;
using SOAFramework.Library.Cache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.BLL
{
    public class WorkflowBLL
    {
        private ICache cache = CacheFactory.Create();

        
        public bool Approval(string workflowid, string userid, Approval approval)
        {
            WorkflowModel workflow = WorkflowModel.Load(workflowid);
            //var userids = Common.GetDataAuthorityUserIDList();
            //if (userids != null && userids.Exists(t => t.Equals(workflow.Value.Creator))) throw new Exception("该单据不是你用户组的人员创建，你没有权限审批！");
            if (!workflow.CanUserProcess(userid)) return true;
            workflow.ProcessActivity(approval, userid, new WorkflowAuthority());
            return true;
        }

        public bool StopWorkflow(string workflowid, string taskid, string userid)
        {
            WorkflowModel workflow = WorkflowModel.Load(workflowid);
            workflow.Stop(userid);
            return true;
        }
    }
}
