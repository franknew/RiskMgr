﻿using DreamWorkflow.Engine;
using DreamWorkflow.Engine.DAL;
using DreamWorkflow.Engine.Form;
using DreamWorkflow.Engine.Model;
using IBatisNet.DataMapper;
using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library;

namespace RiskMgr.BLL
{
    public class ProjectBLL
    {
        #region action
        public string Save(Project project, List<Asset> assets, List<Customer> buyers, List<Customer> sellers, List<Customer> thirdpart,
            List<Guarantor> Guarantor, List<CreditReceiverInfo> creditInfo, string userid)
        {
            #region 初始化变量
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao projectdao = new ProjectDao(mapper);
            AssetDao assetdao = new AssetDao(mapper);
            Asset_ProjectDao apdao = new Asset_ProjectDao(mapper);
            Customer_ProjectDao cpdao = new Customer_ProjectDao(mapper);
            CustomerDao customerdao = new CustomerDao(mapper);
            Customer_AssetDao cadao = new Customer_AssetDao(mapper);
            CreditReceiverInfoDao cridao = new CreditReceiverInfoDao(mapper);
            AssetBLL assetbll = new AssetBLL();
            CustomerBLL customerbll = new CustomerBLL();
            #endregion

            #region 处理项目信息
            DateTime createstart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
            DateTime createend = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59);
            if (string.IsNullOrEmpty(project.Name))
            {
                int index = projectdao.QueryMaxProjectIndex(new ProjectQueryForm { CreateTime_Start = createstart, CreateTime_End = createend });
                string code = DateTime.Now.ToString("yyMMdd") + (index + 1).ToString();
                project.Name = code;
                project.Index = index + 1;
            }
            project.Creator = project.LastUpdator = userid;
            project.IsDeleted = 0;
            var projecttemp = projectdao.Query(new ProjectQueryForm { ID = project.ID }).FirstOrDefault();
            if (projecttemp == null) projectdao.Add(project); 
            else
            {
                projectdao.Update(new ProjectUpdateForm
                {
                    Entity = project,
                    ProjectQueryForm = new ProjectQueryForm { ID = project.ID },
                });
            }
            cpdao.Delete(new Customer_ProjectQueryForm { ProjectID = project.ID });
            cadao.Delete(new Customer_AssetQueryForm { ProjectID = project.ID });
            apdao.Delete(new Asset_ProjectQueryForm { ProjectID = project.ID });
            #endregion

            #region 处理房产信息
            if (assets != null)
            {
                foreach (var asset in assets)
                {
                    asset.Creator = userid;
                    var a = assetbll.Save(asset);
                    //处理房产和公权人
                    foreach (var j in asset.Joint)
                    {
                        var c = customerbll.Save(new Customer {
                            Creator = userid,
                            Name = j.Name,
                            IdentityCode = j.IdentityCode,
                            Phone = j.Phone,
                        });
                        cadao.Add(new Customer_Asset
                        {
                            AssetID = a.ID,
                            CustomerID = c.ID,
                            ProjectID = project.ID,
                            Type = j.JointType,
                        });
                    }
                    //处理房产和项目关系
                    Asset_Project ap = new Asset_Project
                    {
                        AssetID = a.ID,
                        ProjectID = project.ID,
                    };
                    apdao.Add(ap);
                }
            }
            #endregion

            #region 处理客户信息
            ProcessCustomer(buyers, customerdao, cpdao, project.ID, userid, CustomerType.Buyer);
            ProcessCustomer(sellers, customerdao, cpdao, project.ID, userid, CustomerType.Seller);
            ProcessCustomer(thirdpart, customerdao, cpdao, project.ID, userid, CustomerType.ThirdParty);
            #endregion

            #region 处理共权人信息
            if (Guarantor != null)
            {
                foreach (Guarantor g in Guarantor)
                {
                    g.Creator = userid;
                    var c = customerbll.Save(g);
                    Customer_Project cp = new Customer_Project
                    {
                        CustomerID = c.ID,
                        ProjectID = project.ID,
                        Type = (int)CustomerType.Guarantor,
                    };
                    cpdao.Add(cp);
                    foreach (var asset in g.Assets)
                    {
                        asset.Creator = userid;
                        var a = assetbll.Save(asset);
                        Customer_Asset ca = new Customer_Asset
                        {
                            AssetID = a.ID,
                            CustomerID = c.ID,
                            ProjectID = project.ID,
                            Type = (int)CustomerAssetType.Guarantor,
                        };
                        cadao.Add(ca);
                    }
                }
            }
            #endregion

            #region 处理贷款接收账号信息
            cridao.Delete(new CreditReceiverInfoQueryForm { ProjectID = project.ID });
            if (creditInfo != null)
            {
                foreach (var c in creditInfo)
                {
                    c.ProjectID = project.ID;
                    cridao.Add(c);
                }
            }
            #endregion

            return project.ID;
        }

        private InitApprovalResultForm QueryDetail(Project project, List<Customer> customers,
            List<Asset> assets, List<Customer_Project> cps, List<Customer_Asset> cas, List<Asset_Project> aps,
            List<Workflow> workflows, List<Activity> activities, List<Approval> approvals, List<Task> tasks,
            List<UserInfo> users, List<User_Role> userroles, List<TrackingChangeOwner> tcolist,
            List<TrackingMortgage> tmlist, List<ReturnBackConfirm> returnBackMoneyInfo, List<CreditReceiverInfo> creditInfo,
            string currentuserid)
        {
            InitApprovalResultForm result = new InitApprovalResultForm();
            var customerids = (from c in cps
                               where c.ProjectID == project.ID
                               select c.CustomerID).ToList();
            var assetids = (from a in aps
                            where a.ProjectID == project.ID
                            select a.AssetID).ToList();
            //买家
            var buyerids = (from c in cps
                            where c.ProjectID == project.ID && c.Type == (int)CustomerType.Buyer
                            select c.CustomerID).ToList();
            //卖家
            var sellerids = (from c in cps
                             where c.ProjectID == project.ID && c.Type == (int)CustomerType.Seller
                             select c.CustomerID).ToList();
            //第三方借款人
            var thirdpartyids = (from c in cps
                                 where c.ProjectID == project.ID && c.Type == (int)CustomerType.ThirdParty
                                 select c.CustomerID).ToList();
            //共权人
            var guarantorids = (from g in cps
                                where g.ProjectID == project.ID && g.Type == (int)CustomerType.Guarantor
                                select g.CustomerID).ToList();

            result.Assets = (from a in assets
                             where assetids.Exists(t => t == a.ID)
                             select a).ToList();
            result.Buyers = (from c in customers
                             where buyerids.Exists(t => t == c.ID)
                             select c).ToList();
            result.Sellers = (from c in customers
                              where sellerids.Exists(t => t == c.ID)
                              select c).ToList();
            result.ThirdParty = (from c in customers
                                 where thirdpartyids.Exists(t => t == c.ID)
                                 select c).ToList();
            var guarantors = (from c in customers
                              where guarantorids.Exists(t => t == c.ID)
                              select c).ToList();
            List<Guarantor> guarantorlist = new List<Guarantor>();
            foreach (var c in guarantors)
            {
                Guarantor guarantor = c.ConvertTo<Guarantor>();
                var casids = (from a in cas
                              where a.ProjectID == project.ID && a.CustomerID == c.ID && a.Type == (int)CustomerAssetType.Guarantor
                              select a.AssetID).ToList();
                var assetlist = (from a in assets
                                 where casids.Exists(t => t == a.ID)
                                 select a).ToList();
                guarantor.Assets = assetlist;
                guarantorlist.Add(guarantor);
            }

            result.Guarantor = guarantorlist;

            foreach (var asset in result.Assets)
            {
                var jointids = (from a in cas
                                where a.AssetID == asset.ID && a.ProjectID == project.ID && a.Type == (int)CustomerType.Joint
                                select a.CustomerID).ToList();
                asset.Joint = (from c in customers
                               join j in cas on c.ID equals j.CustomerID
                               where j.Type == (int)CustomerAssetType.AnotherHalf || j.Type == (int)CustomerAssetType.Asssitant ||
                               j.Type == (int)CustomerAssetType.ShareRight || j.Type == (int)CustomerAssetType.ThirdParty
                               select new Joint { ID = c.ID, IdentityCode = c.IdentityCode, Name = c.Name, Phone = c.Phone, JointType = j.Type  }).ToList();
            }

            var creator = users.Find(t => t.ID == project.Creator);
            result.Project = project.ConvertTo<FullProject>();
            result.Report = project.Report;
            result.Creator = creator?.CnName;

            //处理回款信息
            var returnBackMoneyProject = returnBackMoneyInfo.FindAll(t => t.ProjectID.Equals(project.ID));
            if (returnBackMoneyProject.Count > 0) result.Project.ReturnBackMoneyInfo = returnBackMoneyProject;
            else
            {
                result.Project.ReturnBackMoneyInfo = new List<ReturnBackConfirm>();
                if (project.ReturnBackMoney.HasValue)
                {
                    result.Project.ReturnBackMoneyInfo.Add(new ReturnBackConfirm
                    {
                        ProjectID = project.ID,
                        ReturnBackMoney = project.ReturnBackMoney,
                        ReturnBackTime = project.ReturnBackTime,
                    });
                }
                if (project.ReturnBackMoney2.HasValue)
                {
                    result.Project.ReturnBackMoneyInfo.Add(new ReturnBackConfirm
                    {
                        ProjectID = project.ID,
                        ReturnBackMoney = project.ReturnBackMoney2,
                        ReturnBackTime = project.ReturnBackTime2,
                    });
                }
            }

            //读取保后跟踪的信息
            var TransferInfo = tcolist.FindAll(t => t.ProjectID == project.ID).FirstOrDefault();
            var Mortgage = tmlist.FindAll(t => t.ProjectID == project.ID).FirstOrDefault();
            if (TransferInfo != null)
            {
                result.Project.ChangeOwnerProfileCode = TransferInfo.ChangeOwnerProfileCode;
                result.Project.ChangeOwnerProfileTime = TransferInfo.ChangeOwnerProfileTime;
                result.Project.NewAssetCode = TransferInfo.NewAssetCode;
                result.Project.NewAssetDate = TransferInfo.NewAssetDate;
                result.Project.ChangeOwnerRemark = TransferInfo.ChangeOwnerRemark;
            }
            if (Mortgage != null)
            {
                result.Project.MortgageFeedbackCode = Mortgage.MortgageFeedbackCode;
                result.Project.MortgageOverTime = Mortgage.MortgageOverTime;
                result.Project.MortgagePredictTime = Mortgage.MortgagePredictTime;
            }
            //处理贷款账户信息
            var criProject = creditInfo.FindAll(t => t.ProjectID.Equals(project.ID));
            result.Project.CreditReceiverInfo = new List<CreditReceiverInfo>();
            if (criProject.Count == 0)
            {
                result.Project.CreditReceiverInfo.Add(new CreditReceiverInfo
                {
                    ProjectID = project.ID,
                    CreditReceiverAccount = project.CreditReceiverAccount,
                    CreditReceiverBank = project.CreditReceiverBank,
                    CreditReceiverName = project.CreditReceiverName,
                });
            }
            else result.Project.CreditReceiverInfo = criProject;

           //处理流程
            var workflow = workflows.Find(t => t.ProcessID == project.ID);
            if (workflow == null) return result; 
            if (workflow.Status == (int)WorkflowProcessStatus.Processed) result.WorkflowComplete = true; 
            result.WorkflowID = workflow.ID;
            var currentactivities = activities.FindAll(t => t.WorkflowID == workflow.ID);
            var currentapprovals = approvals.FindAll(t => t.WorkflowID == workflow.ID).ToDataTable().ToList<ApprovalInfo>().ToList();

            //给审批信息添加节点名称和审批人
            foreach (var a in currentapprovals)
            {
                var activity = currentactivities.Find(t => t.ID == a.ActivityID);
                if (activity != null) a.ActivityName = activity.Name; 
                var approvaluser = users.Find(t => t.ID == a.Creator);
                if (approvaluser != null) a.Processor = approvaluser.CnName; 
            }
            result.Approvals = currentapprovals;

            //查询当前流程的当前正在处理节点
            var processingActivity = currentactivities.Find(t => t.Status == (int)ActivityProcessStatus.Processing);
            result.CurrentActivity = processingActivity;
            result.Action = ActionStatus.Queryable;
            //处理财务和保后跟踪
            Activity financeActivity = currentactivities.Find(t => t.Name.Contains("财务"));
            if (financeActivity != null && financeActivity.Status == (int)ActivityProcessStatus.Processed)
            {
                result.DisplayCharge = true;
                result.DisplayTracking = true;
            }
            //如果已经回款确认就不往下面处理了。直接把所有显示，也不能修改
            if (project.FinanceConfirm == 1)
            {
                result.DisplayCharge = true;
                result.DisplayConfirm = true;
                result.DisplayTracking = true;
                return result;
            }
            //如果没有正在处理的节点，说明下面财务和保后不需要处理，直接退出
            if (processingActivity == null) return result;

            var currenttasks = tasks.FindAll(t => t.WorkflowID == workflow.ID && t.ActivityID == processingActivity.ID);
            //处理中流程的操作人

            var useridlist = (from a in currenttasks select a.UserID).ToList();
            var usernamelist = (from u in users
                                join id in useridlist on u.ID equals id
                                select u.CnName).ToList();

            result.Operator = string.Join(",", usernamelist);

            string userid = currentuserid;

            var task = tasks.Find(t => t.WorkflowID == workflow.ID && t.ActivityID == processingActivity.ID && t.UserID == userid);

            if (task != null)
            {
                result.TaskID = task.ID;
                //如果是自己申请的单，写死了。如果以后加了流程就要改。
                if (task.Status != (int)TaskProcessStatus.Processed && task.UserID == userid && workflow.Creator == task.UserID
                    && processingActivity.ActivityDefinitionID == "1") result.Action = ActionStatus.Editable; 
                else if (task.Status != (int)TaskProcessStatus.Processed && task.UserID == userid) result.Action = ActionStatus.Approvalable; 
            }
            //如果审批前，申请人可以修改单
            if (userid == project.Creator && !approvals.Exists(t => t.WorkflowID == workflow.ID)) result.Action = ActionStatus.Editable; 
            #region 为财务和保后跟踪特别处理

            //为财务和保后跟踪特别处理
            var roles = userroles.FindAll(t => t.UserID == userid);
            
            Activity trackingActivity = currentactivities.Find(t => t.Name.Contains("保后跟踪"));
            if (trackingActivity != null && trackingActivity.Status == (int)ActivityProcessStatus.Processed)
            {
                result.DisplayConfirm = true;
                if (roles.Exists(t => t.RoleID == "5")) result.ConfirmCanEdit = true; //处理财务
            }
            if (roles.Exists(t => t.RoleID == "5"))//处理财务
            {
                if (financeActivity != null && (financeActivity.Status == (int)ActivityProcessStatus.Processing ||
                    trackingActivity.Status == (int)ActivityProcessStatus.Processing))
                {
                    result.DisplayCharge = true;
                    result.ChargeCanEdit = true;
                    result.Action = ActionStatus.Queryable;
                }
            }
            else if (roles.Exists(t => t.RoleID == "6"))//处理跟踪
            {
                if (financeActivity != null && financeActivity.Status == (int)ActivityProcessStatus.Processed)
                {
                    result.ChargeCanEdit = true;
                    result.FollowupCanEdit = true;
                    result.Action = ActionStatus.Queryable;
                }
            }
            #endregion

            return result;
        }

        public List<ProjectTask> QueryProjectByRelationship(QueryProjectServiceForm form)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao dao = new ProjectDao(mapper);
            var list = dao.QueryProjectByRelationship(form);
            return list;
        }

        public List<InitApprovalResultForm> Query(List<string> projectids, List<string> taskids, string currentuserid)
        {
            #region init dao
            List<InitApprovalResultForm> result = new List<InitApprovalResultForm>();
            if (projectids == null || projectids.Count == 0) return new List<InitApprovalResultForm>();

            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao dao = new ProjectDao(mapper);
            Customer_ProjectDao cpdao = new Customer_ProjectDao(mapper);
            Customer_AssetDao cadao = new Customer_AssetDao(mapper);
            Asset_ProjectDao apdao = new Asset_ProjectDao(mapper);
            WorkflowDao workflowdao = new WorkflowDao(mapper);
            ActivityDao activitydao = new ActivityDao(mapper);
            ApprovalDao appvoraldao = new ApprovalDao(mapper);
            TaskDao taskdao = new TaskDao(mapper);
            UserInfoDao uidao = new UserInfoDao(mapper);
            User_RoleDao urdao = new User_RoleDao(mapper);
            TrackingChangeOwnerDao tcodao = new TrackingChangeOwnerDao(mapper);
            TrackingMortgageDao tmdao = new TrackingMortgageDao(mapper);
            LinkDao linkdao = new LinkDao(mapper);
            Role_Module_ActionDao rmadao = new Role_Module_ActionDao(mapper);
            ReturnBackConfirmDao rbcdao = new ReturnBackConfirmDao(mapper);
            CreditReceiverInfoDao cridao = new CreditReceiverInfoDao(mapper);
            #endregion

            #region 查询数据
            List<Customer_Project> cps = new List<Customer_Project>();
            List<Customer_Asset> cas = new List<Customer_Asset>();
            List<Asset_Project> aps = new List<Asset_Project>();
            List<Activity> activities = new List<Activity>();
            List<Approval> approvals = new List<Approval>();
            List<Task> tasks = new List<Task>();
            List<TrackingChangeOwner> tco = new List<TrackingChangeOwner>();
            List<TrackingMortgage> tm = new List<TrackingMortgage>();
            List<string> projectidlist = new List<string>();
            List<string> workflowids = new List<string>();
            List<CreditReceiverInfo> criList = new List<CreditReceiverInfo>();
            List<Link> links = new List<Link>();
            List<ReturnBackConfirm> returnBackMoneyInfo = new List<ReturnBackConfirm>();
            List<Workflow> workflows = null;
            List<Project> list = null;
            var rma = rmadao.Query(new Role_Module_ActionQueryForm { });
            if (taskids != null && taskids.Count > 0)
            {
                tasks = taskdao.Query(new TaskQueryForm { IDs = taskids });
                workflowids = (from t in tasks
                               select t.WorkflowID).Distinct().ToList();
                workflows = workflowdao.Query(new WorkflowQueryForm { IDs = workflowids });
                activities = activitydao.Query(new ActivityQueryForm { WorkflowIDs = workflowids });
                approvals = appvoraldao.Query(new ApprovalQueryForm { WorkflowIDs = workflowids });
                projectidlist = (from w in workflows
                                 select w.ProcessID).ToList();
                list = dao.Query(new ProjectQueryForm { IDs = projectidlist });
                
            }
            else if (projectids != null && projectids.Count > 0)
            {
                list = dao.Query(new ProjectQueryForm { IDs = projectids });
                projectidlist = (from p in list
                                 select p.ID).ToList();
                workflows = workflowdao.Query(new WorkflowQueryForm { ProcessIDs = projectidlist });
                workflowids = (from w in workflows
                               select w.ID).ToList();
                if (workflowids.Count > 0)
                {
                    activities = activitydao.Query(new ActivityQueryForm { WorkflowIDs = workflowids });
                    approvals = appvoraldao.Query(new ApprovalQueryForm { WorkflowIDs = workflowids });
                    tasks = taskdao.Query(new TaskQueryForm { WorkflowIDs = workflowids });
                }
            }
            else
            {
                return result;
            }

            if (projectidlist.Count > 0)
            {
                cps = cpdao.Query(new Customer_ProjectQueryForm { ProjectIDs = projectidlist });
                cas = cadao.Query(new Customer_AssetQueryForm { ProjectIDs = projectidlist });
                aps = apdao.Query(new Asset_ProjectQueryForm { ProjectIDs = projectidlist });
            }

            var users = uidao.Query(new UserInfoQueryForm { });
            var userroles = urdao.Query(new User_RoleQueryForm { });
            criList = cridao.Query(new CreditReceiverInfoQueryForm { ProjectIDs = projectids });
            tco = tcodao.Query(new TrackingChangeOwnerQueryForm { ProjectIDs = projectidlist });
            tm = tmdao.Query(new TrackingMortgageQueryForm { ProjectIDs = projectidlist });
            returnBackMoneyInfo = rbcdao.Query(new ReturnBackConfirmQueryForm { ProjectIDs = projectidlist });

            //从缓存中取得
            var customers = TableCacheHelper.GetDataFromCache<Customer>(typeof(CustomerDao));
            var assets = TableCacheHelper.GetDataFromCache<Asset>(typeof(AssetDao));
            #endregion

            #region 处理废单权限

            //处理废单权限
            var hasDisplayDiscard = (from ur in userroles
                                     join r in rma on ur.RoleID equals r.RoleID
                                     where r.ModuleID == "4" && r.ActionID == "4" && ur.UserID == currentuserid
                                     select r).FirstOrDefault();
            #endregion

            foreach (Project project in list)
            {
                var data = QueryDetail(project, customers, assets, cps, cas, aps, workflows, activities, approvals, tasks, users, userroles,
                    tco, tm, returnBackMoneyInfo, criList, currentuserid);
                if (hasDisplayDiscard != null) data.DisplayDiscard = true;
                result.Add(data);
            }
            return result;
        }

        public InitApprovalResultForm QueryDetail(string projectid, string taskid, string currentuserid)
        {
            List<string> projectids = new List<string>();
            List<string> taskids = new List<string>();
            if (!string.IsNullOrEmpty(projectid))
            {
                projectids.Add(projectid);
            }
            if (!string.IsNullOrEmpty(taskid))
            {
                taskids.Add(taskid);
            }
            return Query(projectids, taskids, currentuserid).FirstOrDefault();
        }

        public List<Project> QueryMyProject(WorkflowProcessStatus processStatus)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            TaskDao taskdao = new TaskDao(mapper);
            WorkflowDao wfdao = new WorkflowDao(mapper);
            ProjectDao projectdao = new ProjectDao(mapper);
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            string userid = user.User.ID;
            //string userid = "13";
            var tasks = taskdao.Query(new TaskQueryForm { UserID = userid });
            List<string> workflowids = (from t in tasks
                                        select t.WorkflowID).Distinct().ToList();
            var workflows = wfdao.Query(new WorkflowQueryForm { IDs = workflowids, Status = (int)processStatus });
            List<string> projectids = (from wf in workflows
                                       select wf.ProcessID).ToList();
            return projectdao.Query(new ProjectQueryForm { IDs = projectids });
        }

        public List<InitApprovalResultForm> QueryMyApply(QueryMyApplyServiceForm form)
        {
            List<InitApprovalResultForm> list = new List<InitApprovalResultForm>();
            ISqlMapper mapper = Common.GetMapperFromSession();
            UserBLL userbll = new UserBLL();
            WorkflowDao wfdao = new WorkflowDao(mapper);
            ProjectDao projectdao = new ProjectDao(mapper);
            switch (form.Status)
            {
                case 4://已终审（经理审批）
                    form.ManagerAppvoal = true;
                    break;
                case 5://审批不通过
                    form.Disagree = true;
                    break;
                case 1:
                case 2:
                case 3:
                    form.WorkflowStatus = form.Status;
                    break;
                case 6:
                    form.Tracking = true;
                    break;
            }
            var users = TableCacheHelper.GetDataFromCache<User>(typeof(UserDao));
            var projects = projectdao.QueryMyApply(form);
            var projectids = (from w in projects select w.ID).Distinct().ToList();
            return Query(projectids, null, form.UserID);
        }

        public bool UpdateFinance(string workflowid, Project project, string userid)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            this.UpdateFinance(project);
            UserBLL userbll = new UserBLL();

            if (string.IsNullOrEmpty(workflowid)) return true;
            WorkflowModel model = WorkflowModel.Load(workflowid);
            if (!model.CanUserProcess(userid)) return true;
            model.ProcessActivity(new Approval { Status = (int)ApprovalStatus.None }, userid, new WorkflowAuthority());
            return true;
        }

        public bool UpdateFinance(Project project)
        {
            if (project == null)
            {
                throw new Exception("project不能为null");
            }
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao dao = new ProjectDao(mapper);
            dao.Update(new ProjectUpdateForm
            {
                Entity = new Project
                {
                    RefundAccount = project.RefundAccount,
                    RefundBankName = project.RefundBankName,
                    RefundDate = project.RefundDate,
                    RefundMoney = project.RefundMoney,
                    RefundName = project.RefundName,
                    PaymentName = project.PaymentName,
                    PaymentAccount = project.PaymentAccount,
                    PaymentBankName = project.PaymentBankName,
                    PaymentDate = project.PaymentDate,
                    PaymentMoney = project.PaymentMoney,
                    InsuranceFee = project.InsuranceFee,
                    InsuranceTime = project.InsuranceTime,
                    ExportMoney = project.ExportMoney,
                    ExportTime = project.ExportTime,
                    HasExpired = project.HasExpired,
                    GuaranteePeriod = project.GuaranteePeriod,
                    ChargeFinanceRemark = project.ChargeFinanceRemark,
                },
                ProjectQueryForm = new ProjectQueryForm { ID = project.ID },
            });
            return true;
        }

        public bool UpdateTracking(UpdateTrackingServiceForm project, string workflowid, string userid)
        {
            if (project == null || string.IsNullOrEmpty(project.ID))
            {
                throw new Exception("上传数据有误，缺少ID或者Form");
            }
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao dao = new ProjectDao(mapper);
            TrackingMortgageDao tmdao = new TrackingMortgageDao(mapper);
            TrackingChangeOwnerDao tcodao = new TrackingChangeOwnerDao(mapper);
            dao.Update(new ProjectUpdateForm
            {
                Entity = new Project
                {
                    LogoutAssetTime = project.LogoutAssetTime,
                    PickNewAssetCodeTime = project.PickNewAssetCodeTime,
                    MortgageRemark = project.MortgageRemark,

                },
                ProjectQueryForm = new ProjectQueryForm { ID = project.ID },
            });

            //过户信息处理
            TrackingChangeOwner tco = new TrackingChangeOwner
            {
                ProjectID = project.ID,
                ChangeOwnerProfileCode = project.ChangeOwnerProfileCode,
                ChangeOwnerRemark = project.ChangeOwnerRemark,
                ChangeOwnerProfileTime = project.ChangeOwnerProfileTime,
                NewAssetCode = project.NewAssetCode,
                NewAssetDate = project.NewAssetDate,
            };
            TrackingChangeOwner tcoowner = tcodao.Query(new TrackingChangeOwnerQueryForm { ProjectID = project.ID }).FirstOrDefault();
            if (tcoowner == null)
            {
                tco.Creator = project.LastUpdator;
                tcodao.Add(tco);
            }
            else
            {
                tco.LastUpdator = project.LastUpdator;
                tcodao.Update(new TrackingChangeOwnerUpdateForm
                {
                    Entity = tco,
                    TrackingChangeOwnerQueryForm = new TrackingChangeOwnerQueryForm { ID = tcoowner.ID },
                });
            }
            TrackingMortgage tm = new TrackingMortgage
            {
                MortgageFeedbackCode = project.MortgageFeedbackCode,
                ProjectID = project.ID,
                MortgageOverTime = project.MortgageOverTime,
                MortgagePredictTime = project.MortgagePredictTime,
            };
            //借贷信息处理
            var tmmodel = tmdao.Query(new TrackingMortgageQueryForm { ProjectID = project.ID }).FirstOrDefault();
            if (tmmodel == null)
            {
                tm.Creator = project.LastUpdator;
                tmdao.Add(tm);
            }
            else
            {
                tm.LastUpdator = project.LastUpdator;
                tmdao.Update(new TrackingMortgageUpdateForm
                {
                    Entity = tm,
                    TrackingMortgageQueryForm = new TrackingMortgageQueryForm { ID = tmmodel.ID },
                });
            }
            WorkflowModel model = WorkflowModel.Load(workflowid);
            if (!model.CanUserProcess(userid)) return true;
            model.ProcessActivity(new Approval { Status = (int)ApprovalStatus.None }, userid, new WorkflowAuthority());
            return true;
        }

        public bool FinanceConfirm(string projectid, string userid, string refundName, string refundAccount, 
            string refundBank, decimal? refundAmount, DateTime? refundTime, decimal? delayFee, DateTime? delayTime, DateTime? delayTimeEnd, string returnBackRemark, 
            decimal? rollFee, string rollRemark, List<ReturnBackConfirm> returnBackMoneyInfo)
        {

            FinanceConfirmSave(projectid, 1, userid, refundName, refundAccount, refundBank,
                refundAmount, refundTime, delayFee, delayTime, delayTimeEnd, returnBackRemark, rollFee, rollRemark, returnBackMoneyInfo);
            FinanceConfirmAction(projectid, userid);
            return true;
        }

        public bool FinanceConfirmSave(string projectid, int confirm, string userid, string refundName, string refundAccount, string refundBank, decimal? refundAmount, DateTime? refundTime, decimal? delayFee, DateTime? delayTime, DateTime? delayTimeEnd, string returnBackRemark, decimal? rollFee, string rollRemark, 
            List<ReturnBackConfirm> returnBackMoneyInfo)
        {
            //处理项目
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao projectdao = new ProjectDao(mapper);
            ReturnBackConfirmDao rbcdao = new ReturnBackConfirmDao(mapper);
            Project project = projectdao.Query(new ProjectQueryForm { ID = projectid, IsDeleted = 0 }).FirstOrDefault();
            if (project == null)
            {
                throw new Exception("项目ID：" + projectid + "不存在");
            }
            projectdao.Update(new ProjectUpdateForm
            {
                Entity = new Project
                {
                    ReturnBackRemark = returnBackRemark,
                    DelayFee = delayFee,
                    DelayTime = delayTime,
                    DelayTimeEnd = delayTimeEnd,
                    RollFee = rollFee,
                    RollRemark = rollRemark,
                    LastUpdator = userid,
                    FinanceConfirm = confirm,
                    RefundAccount = refundAccount,
                    RefundBankName = refundBank,
                    RefundDate = refundTime,
                    RefundMoney = refundAmount,
                    RefundName = refundName,
                },
                ProjectQueryForm = new ProjectQueryForm
                {
                    ID = projectid,
                }
            });
            if (returnBackMoneyInfo != null)
            {
                rbcdao.Delete(new ReturnBackConfirmQueryForm { ProjectID = projectid });
                foreach (var returnback in returnBackMoneyInfo)
                {
                    returnback.ProjectID = projectid;
                    rbcdao.Add(returnback);
                }
            }
            return true;
        }

        public bool FinanceConfirmAction(string projectid, string userid)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            //处理流程
            WorkflowModel model = WorkflowModel.LoadByProcessID(projectid);
            model.ProcessActivity(new Approval { Status = (int)ApprovalStatus.None }, userid, new WorkflowAuthority());
            TaskDao taskdao = new TaskDao(mapper);
            taskdao.Update(new TaskUpdateForm
            {
                Entity = new Task
                {
                    Status = (int)TaskProcessStatus.Processed,
                    LastUpdator = userid,
                },
                TaskQueryForm = new TaskQueryForm
                {
                    WorkflowID = model.Value.ID,
                    Status = (int)TaskProcessStatus.Started,
                }
            });
            return true;
        }

        public bool StopWorkflow(string workflowid, string userid)
        {
            WorkflowModel workflow = WorkflowModel.Load(workflowid);
            workflow.Stop(userid);
            return true;
        }
        #endregion

        #region helper
        private void ProcessCustomer(List<Customer> customers, CustomerDao customerdao, Customer_ProjectDao cpdao, string projectid, string userid,
            CustomerType type)
        {
            if (customers == null || customers.Count == 0) return;
            CustomerBLL customerbll = new CustomerBLL();
            foreach (var customer in customers)
            {
                Customer c = null;
                if (string.IsNullOrEmpty(customer.ID))
                {
                    customer.IsDeleted = 0;
                    customer.Enabled = 1;
                    customer.Creator = userid;
                    customerdao.Add(customer);
                    c = customer;
                }
                else
                {
                    c = customerdao.Query(new CustomerQueryForm { ID = customer.ID }).FirstOrDefault();
                    if (c == null)
                    {
                        customer.IsDeleted = 0;
                        customer.Enabled = 1;
                        customer.Creator = userid;
                        customerdao.Add(customer);
                        c = customer;
                    }
                    else
                    {
                        customerdao.Update(new CustomerUpdateForm
                        {
                            Entity = new Customer
                            {
                                Name = customer.Name,
                                IdentityCode = customer.IdentityCode,
                                CardType = customer.CardType,
                                Phone = customer.Phone,
                                Gender = customer.Gender,
                                Marrage = customer.Marrage,
                                Address = customer.Address,
                                OrignalName = customer.OrignalName,
                                OrignalIdentityCode = customer.OrignalIdentityCode,
                                BankCode = customer.BankCode,
                                BankType = customer.BankType,
                                WorkUnit = customer.WorkUnit,
                                Remark = customer.Remark,
                            },
                            CustomerQueryForm = new CustomerQueryForm { ID = customer.ID }
                        });
                    }
                }
                cpdao.Add(new Customer_Project { CustomerID = c.ID, ProjectID = projectid, Type = (int)type });
            }
        }
        #endregion
    }
}
