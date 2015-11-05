using DreamWorkflow.Engine;
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
    [ServiceLayer(Module = "RiskMgr.ProjectApi")]
    [AuthFilter]
    public class ProjectApi
    {
        private ProjectBLL bll = new ProjectBLL();

        /// <summary>
        /// 新增额度申请
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [EditAction]
        public string Add(AddProjectServiceForm form)
        {
            List<Customer_Project> customers = new List<Customer_Project>();
            List<Customer> updateCustomers = new List<Customer>();

            customers.AddRange(GetRelationship(form.Buyers, (int)CustomerType.Buyer));
            customers.AddRange(GetRelationship(form.Sellers, (int)CustomerType.Seller));
            if (form.Buyers != null)
            {
                updateCustomers.AddRange(form.Buyers);
            }
            if (form.Sellers != null)
            {
                updateCustomers.AddRange(form.Sellers);
            }
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            string userid = user.User.ID;

            var result = bll.Add(form.Project, form.Assets, customers, updateCustomers, form.Guarantor, userid);

            //处理流程
            WorkflowDefinitionModel wfdm = WorkflowDefinitionModel.LoadByName("额度申请");
            var workflow = wfdm.StartNew(user.User.ID, result, new WorkflowAuthority());
            //如果流程当前处理人等于申请人，就直接审批通过，进入下一个流程
            var task = workflow.CurrentActivity.Tasks.Find(t => t.UserID == userid);
            if (task != null)
            {
                workflow.ProcessActivity(workflow.CurrentActivity.Value.ID, new Approval
                {
                    Creator = user.User.ID,
                    LastUpdator = user.User.ID,
                    Remark = form.Report,
                    Status = (int)ApprovalStatus.Agree,
                    ActivityID = workflow.CurrentActivity.Value.ID,
                    WorkflowID = workflow.Value.ID,
                }, task.ID, user.User.ID, new WorkflowAuthority());
            }

            return result;
        }

        /// <summary>
        /// 查询项目
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [QueryAction]
        public List<InitApprovalResultForm> Query(QueryProjectServiceForm form)
        {
            var list = bll.QueryProjectByRelationship(form);
            if (list.Count == 0)
            {
                return new List<InitApprovalResultForm>();
            }
            var projectids = (from p in list select p.ID).ToList();
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            return bll.Query(projectids, userid);
        }

        private List<Customer_Project> GetRelationship(List<Customer> customers, int type)
        {
            List<Customer_Project> result = new List<Customer_Project>();
            if (customers != null)
            {
                foreach (var customer in customers)
                {
                    result.Add(new Customer_Project { CustomerID = customer.ID, Type = type });
                }
            }
            return result;
        }

        /// <summary>
        /// 查询流程的数据和状态
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [QueryAction]
        public InitApprovalResultForm InitApproval(ProjectQueryForm form)
        {
            if (string.IsNullOrEmpty(form.ID))
            {
                throw new Exception("没有项目ID");
            }
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            return bll.QueryDetail(form.ID, userid);
        }

        /// <summary>
        /// 查询我处理过的项目
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public List<Project> QueryMyProcessedProject()
        {
            return bll.QueryMyProject(WorkflowProcessStatus.Processed);
        }

        /// <summary>
        /// 查询我发起的流程
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public List<InitApprovalResultForm> QueryMyApply()
        {
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            return bll.QueryMyApply(userid);
        }

        /// <summary>
        /// 财务审批
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [ApprovalAction]
        public bool UpdateCharge(FinaceApprovalServiceForm form)
        {
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            form.Project.LastUpdator = userid;
            return bll.UpdateFinance(form.WorkflowID, form.ActivityID, form.TaskID, form.Project);
        }

        /// <summary>
        /// 更新财务信息
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        [EditAction]
        public bool UpdateFinance(FinaceApprovalServiceForm form)
        {
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            form.Project.LastUpdator = userid;
            return bll.UpdateFinance(form.Project);
        }

        /// <summary>
        /// 保后跟踪
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [EditAction]
        public bool UpdateTracking(UpdateTrackingServiceForm form)
        {
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            form.Project.LastUpdator = userid;
            return bll.UpdateTracking(form);
        }
    }
}
