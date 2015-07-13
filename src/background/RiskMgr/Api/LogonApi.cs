using RiskMgr.BLL;
using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Api
{
    public class LogonApi
    {
        LogonBLL bll = new LogonBLL();
        public string Logon(string username, string password)
        {
            return bll.Logon(username, password);
        }

        public bool Logout(string token)
        {
            return bll.Logout(token);
        }

        public List<Menu> GetMenu(string username)
        {
            return null;
        }
    }
}
