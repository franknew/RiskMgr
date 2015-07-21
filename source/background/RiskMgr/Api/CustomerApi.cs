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
    [ServiceLayer(Module = "RiskMgr.CustomerApi")]
    [AuthFilter]
    public class CustomerApi
    {
        private CustomerBLL bll = new CustomerBLL();

        public string Add(Customer customer)
        {
            return bll.Add(customer);
        }

        public bool Update(Customer customer)
        {
            CustomerUpdateForm form = new CustomerUpdateForm
            {
                Entity = customer,
                CustomerQueryForm = new CustomerQueryForm { ID = customer.ID },
            };
            return bll.Update(form);
        }

        public bool Delete(int id)
        {
            return false;
        }

    }
}
