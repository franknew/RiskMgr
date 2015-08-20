using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.BLL
{
    public class CustomerBLL
    {
        public string Add(Customer customer)
        {
            CustomerDao dao = new CustomerDao();
            return dao.Add(customer);
        }

        public bool Update(CustomerUpdateForm form)
        {
            CustomerDao dao = new CustomerDao();
            dao.Update(form);
            return true;
        }

        public bool Delete(CustomerQueryForm form)
        {
            CustomerDao dao = new CustomerDao();
            dao.Delete(form);
            return true;
        }

        public List<Customer> Query(CustomerQueryForm form)
        {
            CustomerDao dao = new CustomerDao();
            return dao.Query(form);
        }

        public bool CheckIdentityCodeExists(CustomerQueryForm form)
        {
            CustomerDao dao = new CustomerDao();
            return dao.CheckIdentityCode(form);
        }
    }
}
