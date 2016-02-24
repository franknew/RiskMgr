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
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            form.Creator = form.LastUpdator = userid;
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
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            form.LastUpdator = userid;
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
            if (string.IsNullOrEmpty(form.ID)) throw new Exception("删除失败，没有客户ID");
            return bll.Delete(new CustomerQueryForm { ID = form.ID });
        }

        /// <summary>
        /// 查询有效客户
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [QueryAction]
        [DataAuthorityFilter]
        public PagingEntity<Customer> Query(CustomerQueryForm form)
        {
            List<string> useridList = Common.GetDataAuthorityUserIDList();
            form.Creators = useridList;
            var list = bll.Query(form);
            PagingEntity<Customer> paggingList = new PagingEntity<Customer>();
            paggingList.Record = list;
            paggingList.PageCount = form.PageCount;
            paggingList.RecordCount = form.RecordCount;
            return paggingList;
        }

        /// <summary>
        /// 检查证件号码是否有存在,如果不存在用户id,则只检查证件号码，如果存在用户id，则检查不是该用户的证件号码
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [QueryAction]
        public bool CheckIdentityCodeExists(CustomerQueryForm form)
        {
            return bll.CheckIdentityCodeExists(form);
        }
    }
}
