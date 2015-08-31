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

        public List<Project> Query(QueryProjectServiceForm form)
        {
            ISqlMapper mapper = null;
            if (ServiceSession.Current.Context.Parameters.ContainsKey("Mapper"))
            {
                mapper = ServiceSession.Current.Context.Parameters["Mapper"] as ISqlMapper;
            }
            else
            {
                mapper = Mapper.Instance();
            }
            ProjectDao dao = new ProjectDao(mapper);
            return dao.QueryProjectByRelationship(form);
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
            form.Buyers = customerdao.QueryByIdList(buyerids);
            form.Sellers = customerdao.QueryByIdList(sellerids);
            //处理房产和公权人
            form.Assets = assetdao.QueryByIdList(assetids);
            if (form.Assets != null)
            {
                foreach (var a in form.Assets)
                {
                    var jointids = (from t in cadao.Query(new Customer_AssetQueryForm { AssetID = a.ID })
                                    select t.CustomerID).ToList();
                    a.Joint = customerdao.QueryByIdList(jointids);
                }
            }
            return form;
        }

        public List<ProjectTask> QueryMyProcessProject()
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            TaskDao taskdao = new TaskDao(mapper);
            WorkflowDao wfdao = new WorkflowDao(mapper);
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            var tasks = taskdao.Query(new TaskQueryForm { UserID = user.User.ID });
            List<string> workflowids = new List<string>();
            foreach (var task in tasks)
            {
                if (!workflowids.Contains(task.WorkflowID))
                {
                    workflowids.Add(task.WorkflowID);
                }
            }
            var workflows = wfdao.QueryByIdList(workflowids);
            return null;
        }
    }
}
