using RiskMgr.DAL;
using RiskMgr.Form;
using SOAFramework.Library.Cache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Text;

namespace RiskMgr.BLL
{
    public class LogonBLL
    {
        private ICache cache = CacheFactory.Create(CacheType.DefaultMemoryCache, "RiskMgr.User");

        public string Logon(string username, string password)
        {
            UserDao dao = new UserDao();
            var users = dao.Query(new UserQueryForm { Name = username, Password = password });
            if (users.Count > 0)
            {
                string token = Guid.NewGuid().ToString().Replace("-", "");
                CacheItem item = new CacheItem(token, users[0]);
                cache.AddItem(item, 30 * 60);
                return token;
            }
            else
            {
                return null;
            }
        }

        public bool Logout(string token)
        {
            var item = cache.GetItem(token);
            if (item != null)
            {
                cache.DelItem(item);
            }
            return true;
        }
    }
}
