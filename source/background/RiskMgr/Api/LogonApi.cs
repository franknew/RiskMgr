
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
using SOAFramework.Library.WeiXin;

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
        [NoneAuthFilter]
        public LogonResultForm Logon(LogonServiceForm form)
        {
            if (form == null) throw new Exception("没有传form");
            if (string.IsNullOrEmpty(form.username) || string.IsNullOrEmpty(form.password)) throw new Exception("用户名或者密码不能为空");
            var result = bll.Logon(form.username, form.password);
            return result;
        }
        
        [NoneAuthFilter]
        public LogonResultForm WeiXinLogon(WeiXinLogonServiceForm form)
        {
            if (form == null) throw new Exception("没有传form");
            if (string.IsNullOrEmpty(form.code)) throw new Exception("code不能为空");
            //ApiHelper.SetTokenIntoCache(form.access_token);
            var result = bll.Logon(form.code);
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
