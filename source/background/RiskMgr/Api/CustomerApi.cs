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

        /// <summary>
        /// 新增客户
        /// </summary>
        /// <param name="customer"></param>
        /// <returns></returns>
        [EditAction]
        public string Add(Customer customer)
        {
            return bll.Add(customer);
        }

        /// <summary>
        /// 更新客户信息
        /// </summary>
        /// <param name="customer"></param>
        /// <returns></returns>
        [EditAction]
        public bool Update(Customer customer)
        {
            CustomerUpdateForm form = new CustomerUpdateForm
            {
                Entity = customer,
                CustomerQueryForm = new CustomerQueryForm { ID = customer.ID },
            };
            return bll.Update(form);
        }

        /// <summary>
        /// 删除客户
        /// </summary>
        /// <param name="customerid"></param>
        /// <returns></returns>
        [DeleteAction]
        public bool Delete(string customerid)
        {
            var customer = new CustomerQueryForm
            {
                ID = customerid
            };
            return bll.Delete(customer);
        }

        /// <summary>
        /// 查询有效客户
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [QueryAction]
        public PagingEntity<Customer> Query(CustomerQueryForm form)
        {
            var list = bll.Query(form);
            PagingEntity<Customer> paggingList = new PagingEntity<Customer>();
            paggingList.Record = list;
            paggingList.PageCount = form.PageCount;
            paggingList.RecordCount = form.RecordCount;
            return paggingList;
        }
    }
}
