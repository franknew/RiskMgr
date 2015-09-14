using DreamWorkflow.Engine;
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
        public string Add(Project project, List<Asset_Project> assets, List<Customer_Project> customers, List<Customer> updatecustomers)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao projectdao = new ProjectDao(mapper);
            Asset_ProjectDao apdao = new Asset_ProjectDao(mapper);
            Customer_ProjectDao cpdao = new Customer_ProjectDao(mapper);
            CustomerDao customerdao = new CustomerDao(mapper);
            Customer_AssetDao cadao = new Customer_AssetDao(mapper);
            string projectid = null;
            projectdao.Add(project);
            if (assets != null)
            {
                foreach (var asset in assets)
                {
                    asset.ProjectID = project.ID;
                    apdao.Add(asset);
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
                                CustomerQueryForm = new CustomerQueryForm { IdentityCode = customer.IdentityCode },
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
            InitApprovalResultForm form = new InitApprovalResultForm();
            var mapper = Common.GetMapperFromSession();
            ProjectDao projectdao = new ProjectDao(mapper);
            CustomerDao customerdao = new CustomerDao(mapper);
            AssetDao assetdao = new AssetDao(mapper);
            Customer_ProjectDao cpdao = new Customer_ProjectDao(mapper);
            Customer_AssetDao cadao = new Customer_AssetDao(mapper);
            Asset_ProjectDao apdao = new Asset_ProjectDao(mapper);
            form.Project = projectdao.Query(new ProjectQueryForm { ID = projectid }).FirstOrDefault();
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
                    var jointids = (from t in cadao.Query(new Customer_AssetQueryForm { AssetID = a.ID })
                                    select t.CustomerID).ToList();
                    a.Joint = customerdao.Query(new CustomerQueryForm { Ids = jointids });
                }
            }
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

        public List<ProjectTask> QueryMyApply()
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            WorkflowDao wfdao = new WorkflowDao(mapper);
            ProjectDao projectdao = new ProjectDao(mapper);
            var workflows = wfdao.Query(new WorkflowQueryForm { Creator = user.User.ID });
            var projectids = (from wf in workflows
                              select wf.ProcessID).ToList();
            var projcts = projectdao.Query(new ProjectQueryForm { Ids = projectids });
            List<ProjectTask> projecttasks = projcts.ToDataTable().ToList<ProjectTask>().ToList();
            projecttasks.ForEach(t =>
            {
                var workflow = workflows.Find(p => p.ProcessID == t.ID);
                if (workflow != null)
                {
                    WorkflowProcessStatus status = WorkflowProcessStatus.Started;
                    Enum.TryParse<WorkflowProcessStatus>(workflow.Status.Value.ToString(), out status);
                    t.ProcessStatus = status;
                }
            });
            return projecttasks;
        }
    }
}
