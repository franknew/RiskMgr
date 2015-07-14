using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Library.Cache;
using SOAFramework.Service.Core.Model;
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
            UserDao userdao = new UserDao();
            UserInfoDao userInfoDao = new UserInfoDao();
            var users = userdao.Query(new UserQueryForm { Name = username, Password = password });
            if (users.Count > 0)
            {
                string token = Guid.NewGuid().ToString().Replace("-", "");
                var userinfo = userInfoDao.Query(new UserInfoQueryForm { ID = users[0].ID });
                UserEntireInfo u = new UserEntireInfo
                {
                    User = users[0],
                };
                if (userinfo.Count > 0)
                {
                    u.UserInfo = userinfo[0];
                }
                CacheItem item = new CacheItem(token, u);
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

        public UserEntireInfo GetUserEntireInfo(string token)
        {
            var item = cache.GetItem(token);
            UserEntireInfo u =null;
            if (item != null)
            {
                u = item.Value as UserEntireInfo;
            }
            return u;
        }
    }
}
