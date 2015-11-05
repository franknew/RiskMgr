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
            form.IsDeleted = 0;
            return dao.Query(form);
        }

        public bool CheckIdentityCodeExists(CustomerQueryForm form)
        {
            CustomerDao dao = new CustomerDao();
            return dao.CheckIdentityCode(form);
        }

        public Customer Save(Customer customer)
        {
            CustomerDao customerdao = new CustomerDao();
            var c = customerdao.Query(new CustomerQueryForm { ID = customer.ID, IsDeleted = 0, Enabled = 1 }).FirstOrDefault();
            if (c == null)
            {
                c = customerdao.Query(new CustomerQueryForm { IdentityCode = customer.IdentityCode, Enabled = 1 }).FirstOrDefault();
                if (c != null)
                {
                    customerdao.Update(new CustomerUpdateForm
                    {
                        Entity = new Customer
                        {
                            Name = customer.Name,
                            Phone = customer.Phone,
                            IdentityCode = customer.IdentityCode,
                            LastUpdator = customer.LastUpdator,
                        },
                        CustomerQueryForm = new CustomerQueryForm { ID = c.ID },
                    });
                }
                else
                {
                    customer.IsDeleted = 0;
                    customer.Enabled = 1;
                    customerdao.Add(customer);
                    c = customer;
                }
            }
            else
            {
                customerdao.Update(new CustomerUpdateForm
                {
                    Entity = new Customer
                    {
                        Name = customer.Name,
                        Phone = customer.Phone,
                        IdentityCode = customer.IdentityCode,
                    },
                    CustomerQueryForm = new CustomerQueryForm { ID = c.ID },
                });
            }
            return c;
        }
    }
}
