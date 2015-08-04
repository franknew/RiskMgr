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

        public string Add(AddProjectServiceForm form)
        {
            List<Asset_Project> assets = new List<Asset_Project>();
            List<Customer_Project> customers = new List<Customer_Project>();

            if (form.Assets != null)
            {
                foreach (var id in form.Assets)
                {
                    assets.Add(new Asset_Project { AssetID = id });
                }
            }

            if (form.Buyers != null)
            {
                foreach (var id in form.Buyers)
                {
                    customers.Add(new Customer_Project { CustomerID = id, Type = 1 });
                }
            }

            if (form.Sellers != null)
            {
                foreach (var id in form.Sellers)
                {
                    customers.Add(new Customer_Project { CustomerID = id, Type = 2 });
                }
            }

            if (form.Buyers_ThirdPart != null)
            {
                foreach (var id in form.Buyers_ThirdPart)
                {
                    customers.Add(new Customer_Project { CustomerID = id, Type = 3 });
                }
            }

            if (form.Sellers_ThirdPart != null)
            {
                foreach (var id in form.Sellers_ThirdPart)
                {
                    customers.Add(new Customer_Project { CustomerID = id, Type = 4 });
                }
            }

            return bll.Add(form.Project, assets, customers);
        }
    }
}
