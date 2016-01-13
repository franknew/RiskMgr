
using RiskMgr.BLL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Service.Filter;
using SOAFramework.Library;

namespace RiskMgr.Api
{
    [ServiceLayer(Module = "RiskMgr.LogonApi")]
    public class LogonApi
    {
        LogonBLL bll = new LogonBLL();

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="username">用户名</param>
        /// <param name="password">密码</param>
        /// <returns></returns>
        [AuthFilter]
        [NoneAuthFilter]
        public LogonResultForm Logon(LogonServiceForm form)
        {
            if (string.IsNullOrEmpty(form.username) || string.IsNullOrEmpty(form.password))
            {
                throw new Exception("用户名或者密码不能为空");
            }
            var result = bll.Logon(form.username, form.password);
            MenuBLL menubll = new MenuBLL();
            result.Menu = menubll.GetCurrentUserMenu(result.token);
            return result;
        }

        /// <summary>
        /// 注销
        /// </summary>
        /// <returns></returns>
        public bool Logout()
        {
            return bll.Logout();
        }
    }
}
