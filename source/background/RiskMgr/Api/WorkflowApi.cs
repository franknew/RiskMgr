using DreamWorkflow.Engine;
using DreamWorkflow.Engine.Form;
using DreamWorkflow.Engine.Model;
using RiskMgr.BLL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Api
{
    [ServiceLayer(Module = "RiskMgr.WorkflowApi")]
    [AuthFilter]
    public class WorkflowApi
    {
        WorkflowBLL bll = new WorkflowBLL();

        /// <summary>
        /// 审批
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [ApprovalAction]
        public bool Approval(ApprovalServiceForm form)
        {
            if (string.IsNullOrEmpty(form.WorkflowID))
            {
                throw new Exception("没有WorkflowID");
            }
            if (string.IsNullOrEmpty(form.ActivityID))
            {
                throw new Exception("没有ActivityID");
            }
            if (string.IsNullOrEmpty(form.TaskID))
            {
                throw new Exception("没有TaskID");
            }
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            string userid = user.User.ID;
            return bll.Approval(form.WorkflowID, form.ActivityID, form.TaskID, userid, form.Approval);
        }

        /// <summary>
        /// 查询我发起的流程
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public List<FullTask> QueryMyApply()
        {
            UserBLL userbll = new UserBLL();
            TaskBLL taskbll = new TaskBLL();
            var user = userbll.GetCurrentUser();
            return taskbll.Query(new QueryMyTaskServiceForm { Creator = user.User.ID });
        }

        /// <summary>
        /// 查询我需要处理的流程
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public List<FullTask> QueryMyProcessing()
        {
            UserBLL userbll = new UserBLL();
            TaskBLL taskbll = new TaskBLL();
            var user = userbll.GetCurrentUser();
            return taskbll.Query(new QueryMyTaskServiceForm { UserID = user.User.ID, Status = (int)TaskProcessStatus.Started });
        }

        /// <summary>
        /// 查询我处理过的流程
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public List<FullTask> QueryMyProcessed()
        {
            UserBLL userbll = new UserBLL();
            TaskBLL taskbll = new TaskBLL();
            var user = userbll.GetCurrentUser();
            return taskbll.Query(new QueryMyTaskServiceForm { UserID = user.User.ID, Status = (int)TaskProcessStatus.Processed });
        }

        /// <summary>
        /// 查询我的任务
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [QueryAction]
        public List<FullTask> QueryMyTask(QueryMyTaskServiceForm form)
        {
            UserBLL userbll = new UserBLL();
            TaskBLL taskbll = new TaskBLL();
            var user = userbll.GetCurrentUser();
            return taskbll.Query(new QueryMyTaskServiceForm { UserID = user.User.ID, Status = form.Status });
        }

        /// <summary>
        /// 流程作废
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [ApprovalAction]
        public bool StopWorkflow(Task form)
        {
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            string userid = user.User.ID;
            return bll.StopWorkflow(form.WorkflowID, form.ID, userid);
        }
    }
}
