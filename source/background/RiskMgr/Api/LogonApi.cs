
using RiskMgr.BLL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

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
        public LogonResultForm Logon(LogonServiceForm form)
        {
            var result = bll.Logon(form.UserName, form.Password);
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
