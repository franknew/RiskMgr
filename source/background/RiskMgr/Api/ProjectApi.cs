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
using DreamWorkflow.Engine.DAL;
using IBatisNet.DataMapper;
using DreamWorkflow.Engine.Form;
using SOAFramework.Library;

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
            ISqlMapper mapper = Common.GetMapperFromSession();
            List<Customer_Project> customers = new List<Customer_Project>();
            List<Customer> updateCustomers = new List<Customer>();
            WorkflowDao workflowdao = new WorkflowDao(mapper);
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            string userid = user.User.ID;
            form.Project.Report = form.Report;
            var result = bll.Add(form.Project, form.Assets, form.Buyers, form.Sellers, form.ThirdPart, form.Guarantor, userid);

            //处理流程
            WorkflowDefinitionModel wfdm = WorkflowDefinitionModel.LoadByName("额度申请");
            Workflow wf = workflowdao.Query(new WorkflowQueryForm { ProcessID = result }).FirstOrDefault();
            WorkflowModel workflow = null;
            if (wf == null)
            {
                workflow = wfdm.StartNew(user.User.ID, result, new WorkflowAuthority());
            }
            else
            {
                workflow = WorkflowModel.Load(wf.ID);
            }
            //如果流程当前处理人等于申请人，就直接审批通过，进入下一个流程
            var task = workflow.CurrentActivity.Tasks.Find(t => t.UserID == userid);
            if (task != null)
            {
                workflow.ProcessActivity(new Approval
                {
                    Creator = user.User.ID,
                    LastUpdator = user.User.ID,
                    Remark = form.Report,
                    Status = (int)ApprovalStatus.Agree,
                    ActivityID = workflow.CurrentActivity.Value.ID,
                    WorkflowID = workflow.Value.ID,
                }, user.User.ID, new WorkflowAuthority());
            }

            return result;
        }

        /// <summary>
        /// 查询项目
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [QueryAction]
        [DataAuthorityFilter]
        public PagingEntity<InitApprovalResultForm> Query(QueryProjectServiceForm form)
        {
            var list = bll.QueryProjectByRelationship(form);
            if (list.Count == 0)
            {
                return new PagingEntity<InitApprovalResultForm> { };
            }
            var projectids = (from p in list select p.ID).Distinct().ToList();
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            var record = bll.Query(projectids, null, userid);
            PagingEntity<InitApprovalResultForm> result = new PagingEntity<InitApprovalResultForm>
            {
                Record = record,
                PageCount = form.PageCount,
                RecordCount = form.RecordCount,
            };
            return result;
        }

        private List<Customer_Project> GetRelationship(List<Customer> customers, int type)
        {
            List<Customer_Project> result = new List<Customer_Project>();
            if (customers != null)
            {
                foreach (var customer in customers)
                {
                    if (string.IsNullOrEmpty(customer.ID))
                    {
                        customer.ID = Guid.NewGuid().ToString().Replace("-", "");
                    }
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
        public InitApprovalResultForm InitApproval(InitApprovalServiceForm form)
        {
            if (string.IsNullOrEmpty(form.ID) && string.IsNullOrEmpty(form.TaskID))
            {
                throw new Exception("没有项目ID和任务ID");
            }
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            return bll.QueryDetail(form.ID, form.TaskID, userid);
        }

        /// <summary>
        /// 查询我处理过的项目
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        [DataAuthorityFilter]
        public List<Project> QueryMyProcessedProject()
        {
            return bll.QueryMyProject(WorkflowProcessStatus.Processed);
        }

        /// <summary>
        /// 查询我发起的流程
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        [DataAuthorityFilter]
        public PagingEntity<InitApprovalResultForm> QueryMyApply(QueryMyApplyServiceForm form)
        {
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            form.UserID = userid;
            form.Creators = Common.GetDataAuthorityUserIDList();
            PagingEntity<InitApprovalResultForm> result = new PagingEntity<InitApprovalResultForm>();
            result.Record = bll.QueryMyApply(form);
            result.PageCount = form.PageCount;
            result.RecordCount = form.RecordCount;
            return result;
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
            return bll.UpdateFinance(form.WorkflowID, form.Project, userid);
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

            //MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = "entry activity id:" + form.ActivityID }, SOAFramework.Library.CacheEnum.FormMonitor);
            return bll.UpdateFinance(form.WorkflowID, form.Project, userid);
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
            form.LastUpdator = userid;
            return bll.UpdateTracking(form, form.WorkflowID,userid);
        }

        /// <summary>
        /// 回款确认
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [ApprovalAction]
        public bool FinanceConfirm(FinanceConfirmServiceForm form)
        {
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            return bll.FinanceConfirm(form.ID, userid, form.ReturnBackTime, form.ReturnBackMoney,
                form.RefundName, form.RefundAccount, form.RefundBankName, form.RefundMoney, form.RefundDate);
        }

        /// <summary>
        /// 回款确认保存
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [EditAction]
        public bool FinanceConfirmSave(FinanceConfirmServiceForm form)
        {
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            return bll.FinanceConfirmSave(form.WorkflowID, 0, userid, form.ReturnBackTime, form.ReturnBackMoney,
                form.RefundName, form.RefundAccount, form.RefundBankName, form.RefundMoney, form.RefundDate);
        }

        /// <summary>
        /// 审批
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [ApprovalAction]
        public bool Approval(ApprovalServiceForm form)
        {
            WorkflowBLL wfbll = new WorkflowBLL();
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
            return wfbll.Approval(form.WorkflowID, userid, form.Approval);
        }

        /// <summary>
        /// 流程作废
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [DeleteAction]
        public bool StopWorkflow(Task form)
        {
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            string userid = user.User.ID;
            return bll.StopWorkflow(form.WorkflowID, userid);
        }
    }
}
