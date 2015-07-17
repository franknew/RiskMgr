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
        LogonBLL bll = new LogonBLL();

        /// <summary>
        /// 验证是否登录，Code返回1为没有登录或者token失效，要重新登录
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override bool OnActionExecuted(ActionContext context)
        {
            //验证没有token
            if (!context.Parameters.ContainsKey("token"))
            {
                this.Message = "没有token！";
                context.Code = 2;
                return false;
            }
            //验证有没有登录
            string token = context.Parameters["token"].ToString();
            UserEntireInfo user = bll.GetUserEntireInfo(token);
            if (user == null)
            {
                this.Message = "token失效，请重新登录！";
                context.Code = 3;
                return false;
            }
            //验证有没有权限访问
            var attr = context.MethodInfo.GetCustomAttribute<BaseActionAttribute>(true);
            if (attr != null)
            {
                string actionName = attr.Action;
                var servicelayer = context.MethodInfo.DeclaringType.GetCustomAttribute<ServiceLayer>(true);
                if (servicelayer != null)
                {
                    string moduleName = servicelayer.Module;
                }
            }

            return true;
        }
    }
}
