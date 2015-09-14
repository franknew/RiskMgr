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
            List<Asset_Project> assets = new List<Asset_Project>();
            List<Customer_Project> customers = new List<Customer_Project>();
            List<Customer> updateCustomers = new List<Customer>();


            if (form.Assets != null)
            {
                foreach (var a in form.Assets)
                {
                    assets.Add(new Asset_Project { AssetID = a.ID });
                    //处理公权人
                    if (a.Joint != null)
                    {
                        foreach (var third in a.Joint)
                        {
                            if (!updateCustomers.Exists(t => t.IdentityCode.Equals(third.IdentityCode)))
                            {
                                updateCustomers.Add(third);
                            }
                        }
                    }
                }
            }

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

            var result = bll.Add(form.Project, assets, customers, updateCustomers);
            
            //处理流程
            WorkflowDefinitionModel wfdm = WorkflowDefinitionModel.LoadByName("额度申请");
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            wfdm.StartNew(user.User.ID, result, new WorkflowAuthority());

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
            return bll.Query(form);
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
        public InitApprovalResultForm InitApproval(InitApprovalServiceForm form)
        {
            return bll.QueryDetail(form.WorkflowID);
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
        public List<ProjectTask> QueryMyApply()
        {
            return bll.QueryMyApply();
        }
    }
}
