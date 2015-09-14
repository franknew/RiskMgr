using DreamWorkflow.Engine;
using DreamWorkflow.Engine.Form;
using DreamWorkflow.Engine.Model;
using RiskMgr.BLL;
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
            return bll.Approval(form.WorkflowID, form.ActivityID, form.Approval);
        }

        /// <summary>
        /// 查询我发起的流程
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public List<Task> QueryMyApply()
        {
            UserBLL userbll = new UserBLL();
            TaskBLL taskbll = new TaskBLL();
            var user = userbll.GetCurrentUser();
            return taskbll.Query(new TaskQueryForm { Creator = user.User.ID });
        }

        /// <summary>
        /// 查询我需要处理的流程
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public List<Task> QueryMyProcessing()
        {
            UserBLL userbll = new UserBLL();
            TaskBLL taskbll = new TaskBLL();
            var user = userbll.GetCurrentUser();
            return taskbll.Query(new TaskQueryForm { UserID = user.User.ID, Status = (int)TaskProcessStatus.Started });
        }

        /// <summary>
        /// 查询我处理过的流程
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public List<Task> QueryMyProcessed()
        {
            UserBLL userbll = new UserBLL();
            TaskBLL taskbll = new TaskBLL();
            var user = userbll.GetCurrentUser();
            return taskbll.Query(new TaskQueryForm { UserID = user.User.ID, Status = (int)TaskProcessStatus.Processed });
        }
    }
}
