using RiskMgr.BLL;
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
        public string Logon(string username, string password)
        {
            return bll.Logon(username, password);
        }

        /// <summary>
        /// 注销
        /// </summary>
        /// <returns></returns>
        public bool Logout()
        {
            string token = ServiceSession.Current.Context.Parameters["token"].ToString();
            return bll.Logout(token);
        }

        /// <summary>
        /// 获得菜单
        /// </summary>
        /// <returns></returns>
        [AuthFilter]

        public List<Menu> GetMenu()
        {
            string token = ServiceSession.Current.Context.Parameters["token"].ToString();
            MenuBLL menubll = new MenuBLL();
            var menulist = menubll.GetAllMenu();
            return null;
        }
    }
}
