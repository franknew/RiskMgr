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
        public string Add(Project project, List<Asset> assets, List<Customer_Project> customers, List<Customer> updatecustomers)
        {
            #region 初始化变量 
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao projectdao = new ProjectDao(mapper);
            AssetDao assetdao = new AssetDao(mapper);
            Asset_ProjectDao apdao = new Asset_ProjectDao(mapper);
            Customer_ProjectDao cpdao = new Customer_ProjectDao(mapper);
            CustomerDao customerdao = new CustomerDao(mapper);
            Customer_AssetDao cadao = new Customer_AssetDao(mapper);
            #endregion

            #region 处理项目信息
            string projectid = null;
            DateTime createstart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
            DateTime createend = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59);
            int index = projectdao.QueryMaxProjectIndex(new ProjectQueryForm { CreateTime_Start = createstart, CreateTime_End = createend });
            string code = DateTime.Now.ToString("yyMMdd") + (index + 1).ToString();
            project.Name = code;
            project.Index = index + 1;
            projectdao.Add(project);
            #endregion

            #region 处理房产信息
            if (assets != null)
            {
                foreach (var asset in assets)
                {
                    //处理房产，房产证相同就更新
                    Asset a = assetdao.Query(new AssetQueryForm
                    {
                        Code = asset.Code,
                    }).FirstOrDefault();
                    if (a != null)
                    {
                        assetdao.Update(new AssetUpdateForm
                        {
                            Entity = new Asset
                            {
                                Usage = asset.Usage,
                                Address = asset.Address,
                                Area = asset.Area,
                                RegPrice = asset.RegPrice,
                            },
                            AssetQueryForm = new AssetQueryForm { ID = a.ID, Eanbled = 1 },
                        });
                    }
                    else
                    {
                        asset.Eanbled = 1;
                        assetdao.Add(asset);
                        a = asset;
                    }
                    //处理房产和公权人
                    foreach (var j in asset.Joint)
                    {
                        var c = customerdao.Query(new CustomerQueryForm { ID = j.ID }).FirstOrDefault();
                        if (c == null)
                        {
                            c = customerdao.Query(new CustomerQueryForm { IdentityCode = j.IdentityCode, Enabled = 1 }).FirstOrDefault();
                            if (c != null)
                            {
                                customerdao.Update(new CustomerUpdateForm
                                {
                                    Entity = new Customer
                                    {
                                        Name = j.Name,
                                        Phone = j.Phone,
                                        IdentityCode = j.IdentityCode,
                                    },
                                    CustomerQueryForm = new CustomerQueryForm { ID = c.ID },
                                });
                            }
                            else
                            {
                                customerdao.Add(j);
                                c = j;
                            }
                        }
                        else
                        {
                            customerdao.Update(new CustomerUpdateForm
                            {
                                Entity = new Customer
                                {
                                    Name = j.Name,
                                    Phone = j.Phone,
                                    IdentityCode = j.IdentityCode,
                                },
                                CustomerQueryForm = new CustomerQueryForm { ID = c.ID },
                            });
                        }
                        Customer_Asset ca = new Customer_Asset
                        {
                            AssetID = a.ID,
                            CustomerID = c.ID,
                            ProjectID = project.ID,
                        };
                        cadao.Add(ca);
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
            if (updatecustomers != null)
            {
                foreach (var customer in updatecustomers)
                {
                    var c = customerdao.Query(new CustomerQueryForm { ID = customer.ID }).FirstOrDefault();
                    if (c == null)
                    {
                        if (customerdao.CheckIdentityCode(new CustomerQueryForm { IdentityCode = customer.IdentityCode }))
                        {
                            customerdao.Update(new CustomerUpdateForm
                            {
                                Entity = new Customer
                                {
                                    Phone = customer.Phone,
                                    Gender = customer.Gender,
                                    Marrage = customer.Marrage,
                                    Address = customer.Address,
                                    OrignalName = customer.OrignalName,
                                    OrignalIdentityCode = customer.OrignalIdentityCode,
                                    BankType = customer.BankType,
                                    BankCode = customer.BankCode,
                                    WorkUnit = customer.WorkUnit,
                                },
                                CustomerQueryForm = new CustomerQueryForm { IdentityCode = customer.IdentityCode, Enabled = 1 },
                            });
                        }
                        else
                        {
                            customerdao.Add(customer);
                        }
                    }
                    else
                    {
                        customerdao.Update(new CustomerUpdateForm
                        {
                            Entity = new Customer
                            {
                                Phone = customer.Phone,
                                Gender = customer.Gender,
                                Marrage = customer.Marrage,
                                Address = customer.Address,
                                OrignalName = customer.OrignalName,
                                OrignalIdentityCode = customer.OrignalIdentityCode,
                                BankType = customer.BankType,
                                BankCode = customer.BankCode,
                                WorkUnit = customer.WorkUnit,
                            },
                            CustomerQueryForm = new CustomerQueryForm { ID = customer.ID },
                        });
                    }
                }
            }
            if (customers != null)
            {
                foreach (var customer in customers)
                {
                    customer.ProjectID = project.ID;
                    cpdao.Add(customer);
                }
            }
            #endregion

            projectid = project.ID;
            return projectid;
        }

        public List<InitApprovalResultForm> Query(QueryProjectServiceForm form)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao dao = new ProjectDao(mapper);
            var list = dao.QueryProjectByRelationship(form);
            List<InitApprovalResultForm> result = new List<InitApprovalResultForm>();
            foreach (var project in list)
            {
                var p = QueryDetail(project.ID);
                result.Add(p);
            }
            return result;
        }

        public InitApprovalResultForm QueryDetail(string projectid)
        {
            #region 初始化变量
            InitApprovalResultForm form = new InitApprovalResultForm();
            var mapper = Common.GetMapperFromSession();
            ProjectDao projectdao = new ProjectDao(mapper);
            CustomerDao customerdao = new CustomerDao(mapper);
            AssetDao assetdao = new AssetDao(mapper);
            Customer_ProjectDao cpdao = new Customer_ProjectDao(mapper);
            Customer_AssetDao cadao = new Customer_AssetDao(mapper);
            Asset_ProjectDao apdao = new Asset_ProjectDao(mapper);
            WorkflowDao wfdao = new WorkflowDao(mapper);
            ActivityDao acdao = new ActivityDao(mapper);
            TaskDao taskdao = new TaskDao(mapper);
            ApprovalDao appdao = new ApprovalDao(mapper);
            User_RoleDao urdao = new User_RoleDao(mapper);
            RoleDao roledao = new RoleDao(mapper);
            UserInfoDao userdao = new UserInfoDao(mapper);
            #endregion

            form.Project = projectdao.Query(new ProjectQueryForm { ID = projectid }).FirstOrDefault();
            if (form.Project == null)
            {
                return form;
            }
            var cps = cpdao.Query(new Customer_ProjectQueryForm { ProjectID = projectid });
            var aps = apdao.Query(new Asset_ProjectQueryForm { ProjectID = projectid });
            List<string> customerids = new List<string>();
            List<string> assetids = new List<string>();
            foreach (var cp in cps)
            {
                customerids.Add(cp.CustomerID);
            }
            foreach (var ap in aps)
            {
                assetids.Add(ap.AssetID);
            }
            //处理客户
            var buyerids = (from a in cps.FindAll(t => t.Type == (int)CustomerType.Buyer)
                            select a.CustomerID).ToList();
            var sellerids = (from a in cps.FindAll(t => t.Type == (int)CustomerType.Seller)
                             select a.CustomerID).ToList();
            form.Buyers = customerdao.Query(new CustomerQueryForm { Ids = buyerids });
            form.Sellers = customerdao.Query(new CustomerQueryForm { Ids = sellerids });
            //处理房产和公权人
            form.Assets = assetdao.Query(new AssetQueryForm { Ids = assetids });
            if (form.Assets != null)
            {
                foreach (var a in form.Assets)
                {
                    var jointids = (from t in cadao.Query(new Customer_AssetQueryForm { AssetID = a.ID, ProjectID = projectid })
                                    select t.CustomerID).ToList();
                    a.Joint = customerdao.Query(new CustomerQueryForm { Ids = jointids });
                }
            }

            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            string userid = user.User.ID;
            //string userid = "3";

            #region 处理流程
            //处理流程相关信息
            var workflow = wfdao.Query(new WorkflowQueryForm { ProcessID = projectid }).FirstOrDefault();
            if (workflow != null)
            {
                //查询所有审批人的信息
                form.WorkflowID = workflow.ID;
                var approvals = appdao.Query(new ApprovalQueryForm { WorkflowID = form.WorkflowID });
                List<string> useridlist = (from a in approvals select a.Creator).ToList();
                List<UserInfo> userlist = userdao.Query(new UserInfoQueryForm { Ids = useridlist });

                var activities = acdao.Query(new ActivityQueryForm { WorkflowID = form.WorkflowID });
                //查询历史审批意见
                List<ApprovalInfo> approvalinfo = approvals.ToDataTable().ToList<ApprovalInfo>().ToList();
                foreach (var a in approvalinfo)
                {
                    var ac = activities.Find(t => t.ID == a.ActivityID);
                    if (ac != null)
                    {
                        a.ActivityName = ac.Name;
                    }
                    var userinfo = userlist.Find(t => t.ID == a.Creator);
                    if (userinfo != null)
                    {
                        a.Processor = userinfo.CnName;
                    }
                }
                form.Approvals = approvalinfo;
                form.Action = ActionStatus.Queryable;
                var activity = activities.Find(t => t.Status == (int)ActivityProcessStatus.Processing);
                //处理财务和跟踪的显示问题
                Activity financeActivity = activities.Find(t => t.Name.Contains("财务"));
                if (financeActivity != null && financeActivity.Status == (int)ActivityProcessStatus.Processed)
                {
                    form.DisplayCharge = true;
                    form.DisplayTracking = true;
                }
                //获得流程相关的信息
                if (activity != null)
                {
                    //处理中流程的操作人
                    var activeTasks = taskdao.Query(new TaskQueryForm { ActivityID = activity.ID });
                    useridlist = (from a in activeTasks select a.UserID).ToList();
                    userlist = userdao.Query(new UserInfoQueryForm { Ids = useridlist });

                    form.Operator = string.Join(",", (from u in userlist select u.CnName).ToArray());

                    form.CurrentActivity = activity;

                    var task = taskdao.Query(new TaskQueryForm { ActivityID = activity.ID, UserID = userid }).FirstOrDefault();
                    if (task != null)
                    {
                        form.TaskID = task.ID;
                        if (task.Status != (int)TaskProcessStatus.Processed && task.UserID == userid && workflow.Creator == task.UserID)
                        {
                            form.Action = ActionStatus.Editable;
                        }
                        else if (task.Status != (int)TaskProcessStatus.Processed && task.UserID == userid)
                        {
                            form.Action = ActionStatus.Approvalable;
                        }
                    }
                    #region 为财务和保后跟踪特别处理
                    //为财务和保后跟踪特别处理
                    var roles = urdao.Query(new User_RoleQueryForm { UserID = userid });
                    if (roles.Exists(t=>t.RoleID == "5"))//处理财务
                    {
                        if (financeActivity != null && financeActivity.Status == (int)ActivityProcessStatus.Processing)
                        {
                            form.DisplayCharge = true;
                            form.Action = ActionStatus.Editable;
                        }
                        else if (financeActivity != null && financeActivity.Status == (int)ActivityProcessStatus.Processed)
                        {
                            form.DisplayCharge = true;
                            form.ChargeCanEdit = true;
                        }
                    }
                    else if (roles.Exists(t=>t.RoleID == "6"))//处理跟踪
                    {
                        if (financeActivity != null && financeActivity.Status == (int)ActivityProcessStatus.Processed)
                        {
                            form.FollowupCanEdit = true;
                            form.Action = ActionStatus.Queryable;
                        }
                    }
                    #endregion
                }
            }
            #endregion

            return form;
        }

        public List<Project> QueryMyProject(WorkflowProcessStatus processStatus)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            TaskDao taskdao = new TaskDao(mapper);
            WorkflowDao wfdao = new WorkflowDao(mapper);
            ProjectDao projectdao = new ProjectDao(mapper);
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            var tasks = taskdao.Query(new TaskQueryForm { UserID = user.User.ID });
            List<string> workflowids = (from t in tasks
                                        select t.WorkflowID).ToList();
            var workflows = wfdao.Query(new WorkflowQueryForm { Ids = workflowids, Status = (int)processStatus });
            List<string> projectids = (from wf in workflows
                                       select wf.ProcessID).ToList();
            return projectdao.Query(new ProjectQueryForm { Ids = projectids });
        }

        public List<InitApprovalResultForm> QueryMyApply()
        {
            List<InitApprovalResultForm> list = new List<InitApprovalResultForm>();
            ISqlMapper mapper = Common.GetMapperFromSession();
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            WorkflowDao wfdao = new WorkflowDao(mapper);
            ProjectDao projectdao = new ProjectDao(mapper);
            var users = TableCacheHelper.GetDataFromCache<User>(typeof(UserDao));
            var workflows = wfdao.Query(new WorkflowQueryForm { Creator = user.User.ID });
            foreach (Workflow wf in workflows)
            {
                if (!string.IsNullOrEmpty(wf.ProcessID))
                {
                    var form = QueryDetail(wf.ProcessID);
                    list.Add(form);
                }
            }
            return list;
        }

        public bool UpdateFinance(string workflowid, string activityid, string taskid, Project project)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            this.UpdateFinance(project);
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            WorkflowModel model = WorkflowModel.Load(workflowid);
            model.ProcessActivity(activityid, new Approval { Status = (int)ApprovalStatus.None }, taskid, user.User.ID, new WorkflowAuthority());
            return true;
        }

        public bool UpdateFinance(Project project)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao dao = new ProjectDao(mapper);
            dao.Update(new ProjectUpdateForm
            {
                Entity = new Project
                {
                    InsuranceFee = project.InsuranceFee,
                    InsuranceTime = project.InsuranceTime,
                    ExportMoney = project.ExportMoney,
                    ExportTime = project.ExportTime,
                    ReturnBackMoney = project.ReturnBackMoney,
                    ReturnBackTime = project.ReturnBackTime,
                    DelayFee = project.DelayFee,
                    DelayTime = project.DelayTime,
                    HasExpired = project.HasExpired,
                },
                ProjectQueryForm = new ProjectQueryForm { ID = project.ID },
            });
            return true;
        }

        public bool UpdateTracking(UpdateTrackingServiceForm project)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao dao = new ProjectDao(mapper);
            TrackingMortgageDao tmdao = new TrackingMortgageDao(mapper);
            TrackingChangeOwnerDao tcodao = new TrackingChangeOwnerDao(mapper);
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            dao.Update(new ProjectUpdateForm
            {
                Entity = new Project
                {
                    NewAssetCode = project.NewAssetCode,
                    ChangeOwnerManualCode = project.ChangeOwnerManualCode,
                    MortgagePerson = project.MortgagePerson,
                    MortgageRemark = project.MortgageRemark,
                    InsuranceFreeTime = project.InsuranceFreeTime,
                },
                ProjectQueryForm = new ProjectQueryForm { ID = project.ID },
            });
            tcodao.Delete(new TrackingChangeOwnerQueryForm { ProjectID = project.ID });
            foreach (TrackingChangeOwner co in project.ChangeOwner)
            {
                co.ProjectID = project.ID;
                co.Creator = co.LastUpdater = user.User.ID;
                tcodao.Add(co);
            }
            tmdao.Delete(new TrackingMortgageQueryForm { ProjectID = project.ID });
            foreach (TrackingMortgage m in project.Mortgage)
            {
                m.ProjectID = project.ID;
                m.Creator = m.LastUpdater = user.User.ID;
                tmdao.Add(m);
            }
            return true;
        }
    }
}
