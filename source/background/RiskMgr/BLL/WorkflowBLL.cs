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

        
        public bool Approval(string workflowid, string activityid, string taskid, Approval approval)
        {
            WorkflowModel workflow = WorkflowModel.Load(workflowid);
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            string userid = user.User.ID;
            workflow.ProcessActivity(activityid, approval, taskid, userid, new WorkflowAuthority());
            return true;
        }

        public bool StopWorkflow(string workflowid, string taskid)
        {
            WorkflowModel workflow = WorkflowModel.Load(workflowid);
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            workflow.Stop(taskid, user.User.ID);
            return true;
        }
    }
}
