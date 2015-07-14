using RiskMgr.BLL;
using RiskMgr.Model;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Api
{
    public class AuthFilter : BaseFilter
    {
        LogonBLL bll = new LogonBLL();


        /// <summary>
        /// 验证是否登录，Code返回1为没有登录或者token失效，要重新登录
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override bool OnActionExecuted(ActionContext context)
        {
            if (!context.Parameters.ContainsKey("token"))
            {
                this.Message = "没有token！";
                return false;
            }
            string token = context.Parameters["token"].ToString();
            UserEntireInfo user = bll.GetUserEntireInfo(token);
            if (user == null)
            {
                this.Message = "token失效，请重新登录！";
                context.Code = 1;
                return false;
            }
            return true;
        }
    }
}
