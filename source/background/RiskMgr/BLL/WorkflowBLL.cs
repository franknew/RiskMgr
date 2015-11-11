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

        
        public bool Approval(string workflowid, string activityid, string taskid, string userid, Approval approval)
        {
            WorkflowModel workflow = WorkflowModel.Load(workflowid);
            workflow.ProcessActivity(activityid, approval, taskid, userid, new WorkflowAuthority());
            return true;
        }

        public bool StopWorkflow(string workflowid, string taskid, string userid)
        {
            WorkflowModel workflow = WorkflowModel.Load(workflowid);
            workflow.Stop(taskid, userid);
            return true;
        }
    }
}
