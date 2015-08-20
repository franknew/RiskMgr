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
                }
            }

            customers.AddRange(GetRelationship(form.Buyers, 1));
            customers.AddRange(GetRelationship(form.Sellers, 2));
            customers.AddRange(GetRelationship(form.ThirdPart, 3));
            if (form.Buyers != null)
            {
                updateCustomers.AddRange(form.Buyers);
            }
            if (form.ThirdPart != null)
            {
                updateCustomers.AddRange(form.ThirdPart);
            }
            if (form.Sellers != null)
            {
                updateCustomers.AddRange(form.Sellers);
            }

            return bll.Add(form.Project, assets, customers, updateCustomers, form.Customer_Assset);
        }

        /// <summary>
        /// 查询项目
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [QueryAction]
        public List<Project> Query(QueryProjectServiceForm form)
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
    }
}
