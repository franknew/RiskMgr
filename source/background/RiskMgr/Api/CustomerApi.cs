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
        public string Add(Customer form)
        {
            return bll.Add(form);
        }

        /// <summary>
        /// 更新客户信息
        /// </summary>
        /// <param name="customer"></param>
        /// <returns></returns>
        [EditAction]
        public bool Update(Customer form)
        {
            CustomerUpdateForm updateform = new CustomerUpdateForm
            {
                Entity = form,
                CustomerQueryForm = new CustomerQueryForm { ID = form.ID },
            };
            return bll.Update(updateform);
        }

        /// <summary>
        /// 删除客户
        /// </summary>
        /// <param name="customerid"></param>
        /// <returns></returns>
        [DeleteAction]
        public bool Delete(CustomerQueryForm form)
        {
            return bll.Delete(form);
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
