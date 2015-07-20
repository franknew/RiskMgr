using RiskMgr.BLL;
using RiskMgr.Model;
using SOAFramework.Service.Core;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace RiskMgr.Api
{
    [ServiceLayer(IsHiddenDiscovery = true)]
    public class AuthFilter : BaseFilter
    {
        LogonBLL logonbll = new LogonBLL();
        UserBLL userbll = new UserBLL();

        /// <summary>
        /// 验证是否登录，Code返回1为没有登录或者token失效，要重新登录
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override bool OnActionExecuting(ActionContext context)
        {
            //验证没有token
            if (!context.Parameters.ContainsKey("token") || context.Parameters["token"] == null)
            {
                this.Message = "没有token！";
                context.Code = 2;
                return false;
            }
            //验证有没有登录
            string token = context.Parameters["token"].ToString();

            int result = userbll.CheckUserAuth(token);
            switch (result)
            {
                case 3:
                    this.Message = "token失效，请重新登录！";
                    context.Code = result;
                    break;
            }


            return true;
        }
    }
}
