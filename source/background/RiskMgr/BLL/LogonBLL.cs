using IBatisNet.DataMapper;
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
using System.ServiceModel;
using System.ServiceModel.Channels;
using SOAFramework.Library;
using SOAFramework.Library.WeiXin;

namespace RiskMgr.BLL
{
    public class LogonBLL
    {
        private ICache cache = CacheFactory.Create();

        public LogonResultForm Logon(string username, string password)
        {
            var mapper = Common.GetMapperFromSession();
            UserDao userdao = new UserDao(mapper);
            Model.User user = userdao.Query(new UserQueryForm { Name = username, Password = password }).FirstOrDefault();
            return GetUserInfo(user);
        }

        public LogonResultForm Logon(string code)
        {
            var response = WeiXinApi.User.GetUserInfo(new User_GetUserInfoQueryString { code = code });
            if (string.IsNullOrEmpty(response.UserId)) throw new Exception("您在微信系统中没有注册，请联系管理员进行注册");
            var mapper = Common.GetMapperFromSession();
            UserDao userdao = new UserDao(mapper);
            var user = userdao.Query(new UserQueryForm { Name = response.UserId }).FirstOrDefault();
            return GetUserInfo(user);
        }

        public LogonResultForm GetUserInfo(Model.User user)
        {
            if (user == null) throw new Exception("用户名或者密码错误！请输入正确的用户名和密码！");
            if (user.Enabled == 0) throw new Exception("该用户已被禁用，请联系管理员！");
            LogonResultForm result = new LogonResultForm();
            var mapper = Common.GetMapperFromSession();
            UserInfoDao userInfoDao = new UserInfoDao(mapper);
            RoleDao roleDao = new RoleDao(mapper);
            LogonHistoryDao historyDao = new LogonHistoryDao(mapper);
            string token = Guid.NewGuid().ToString().Replace("-", "");
            var userinfo = userInfoDao.Query(new UserInfoQueryForm { ID = user.ID }).FirstOrDefault();
            UserEntireInfo u = new UserEntireInfo { User = user };
            if (userinfo != null) u.UserInfo = userinfo;
            u.Role = roleDao.QueryRoleByUserID(u.User.ID);
            CacheItem item = new CacheItem(token, u);
            LogonHistory history = new LogonHistory
            {
                LogonTime = DateTime.Now,
                Token = token,
                UserID = user.ID,
                ActiveTime = DateTime.Now,
            };
            historyDao.Add(history);
            result.token = token;
            cache.AddItem(item, 30 * 60);
            return result;
        }

        public bool Logout()
        {
            string token = ServiceSession.Current.Context.Parameters["token"].ToString();
            var item = cache.GetItem(token);
            if (item != null) cache.DelItem(item);
            return true;
        }
    }
}
