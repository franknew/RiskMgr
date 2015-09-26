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
        public string Add(Project project, List<Asset> assets, List<Customer_Project> customers, List<Customer> updatecustomers)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            ProjectDao projectdao = new ProjectDao(mapper);
            AssetDao assetdao = new AssetDao(mapper);
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
                    //处理房产，房产证相同就更新
                    Asset tmp = assetdao.Query(new AssetQueryForm
                    {
                        Code = asset.Code,
                    }).FirstOrDefault();
                    if (tmp != null)
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
                            AssetQueryForm = new AssetQueryForm { ID = tmp.ID },
                        });
                    }
                    else
                    {
                        assetdao.Add(asset);
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
                                    CustomerQueryForm = new CustomerQueryForm { ID = c.ID},
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
                            AssetID = asset.ID,
                            CustomerID = c.ID,
                        };
                        cadao.Add(ca);
                    }
                    //处理房产和项目关系
                    Asset_Project ap = new Asset_Project
                    {
                        AssetID = asset.ID,
                        ProjectID = project.ID,
                    };
                    apdao.Add(ap);
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
            if (string.IsNullOrEmpty(projectid))
            {
                throw new Exception("没有项目ID");
            }
            InitApprovalResultForm form = new InitApprovalResultForm();
            var mapper = Common.GetMapperFromSession();
            ProjectDao projectdao = new ProjectDao(mapper);
            CustomerDao customerdao = new CustomerDao(mapper);
            AssetDao assetdao = new AssetDao(mapper);
            Customer_ProjectDao cpdao = new Customer_ProjectDao(mapper);
            Customer_AssetDao cadao = new Customer_AssetDao(mapper);
            Asset_ProjectDao apdao = new Asset_ProjectDao(mapper);
            form.Project = projectdao.Query(new ProjectQueryForm { ID = projectid }).FirstOrDefault();
            if (form.Project == null)
            {
                throw new Exception("项目ID：" + projectid + "不存在！");
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
                    var jointids = (from t in cadao.Query(new Customer_AssetQueryForm { AssetID = a.ID })
                                    select t.CustomerID).ToList();
                    a.Joint = customerdao.Query(new CustomerQueryForm { Ids = jointids });
                }
            }
            return form;
        }

        [QueryAction]
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

        [QueryAction]
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
    }
}
