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
using SOAFramework.Service.Core;

namespace RiskMgr.BLL
{
    public class UserBLL
    {
        private ICache cache = CacheFactory.Create(CacheType.DefaultMemoryCache);
        private ISqlMapper mapper = Mapper.Instance();

        public UserEntireInfo GetUserFormCache(string token)
        {
            CacheItem item = cache.GetItem(token);
            if (item == null)
            {
                return null;
            }
            UserEntireInfo u = item.Value as UserEntireInfo;
            return u;
        }

        public UserEntireInfo GetUserEntireInfoFromCache(string token)
        {
            var item = cache.GetItem(token);
            UserEntireInfo u = null;
            if (item != null)
            {
                u = item.Value as UserEntireInfo;
            }
            return u;
        }

        public UserEntireInfo GetCurrentUser(string token)
        {
            var u = GetUserEntireInfoFromCache(token);
            if (u == null)
            {
                mapper.BeginTransaction();
                UserDao userdao = new UserDao(mapper);
                RoleDao roledao = new RoleDao(mapper);
                UserInfoDao uidao = new UserInfoDao(mapper);
                LogonHistoryDao lhdao = new LogonHistoryDao(mapper);
                var logonhistory = lhdao.Query(new LogonHistoryQueryForm { Token = token }).FirstOrDefault();
                string userid = logonhistory.UserID;
                var user = userdao.Query(new UserQueryForm { ID = userid }).FirstOrDefault();
                var userinfo = uidao.Query(new UserInfoQueryForm { ID = userid }).FirstOrDefault();
                var roles = roledao.QueryRoleByUserID(userid);
                u = new UserEntireInfo
                {
                    User = user,
                    Role = roles,
                    UserInfo = userinfo,
                };
            }
            return u;
        }

        public string Add(User user)
        {
            mapper.BeginTransaction();
            UserDao dao = new UserDao(mapper);
            UserInfoDao infodao = new UserInfoDao(mapper);
            string id = dao.Add(user);
            UserInfo userinfo = new UserInfo
            {
                ID = id,
            };
            infodao.Add(userinfo);
            mapper.CommitTransaction();
            return id;
        }

        public bool Update(UserEntireInfo user)
        {
            mapper.BeginTransaction();
            if (user.User != null)
            {
                UserDao dao = new UserDao(mapper);
                User entity = new User
                {
                    ID = user.User.ID,
                    Enabled = user.User.Enabled,
                };
                dao.Update(new UserUpdateForm { Entity = entity });
            }
            if (user.UserInfo != null)
            {
                UserInfoDao dao = new UserInfoDao();
                dao.Update(new UserInfoUpdateForm { Entity = user.UserInfo });
            }
            mapper.CommitTransaction();
            return true;
        }

        public bool Delete(UserQueryForm user)
        {
            return true;
        }

        public bool ChangePassword(ChangePasswordUpdateForm form)
        {
            UserDao dao = new UserDao();
            User user = new User
            {
                ID = form.UserID,
                Password = form.NewPassword,
            };
            dao.Update(new UserUpdateForm { Entity = user });
            return true;
        }

        public bool ChangeSelfPassword(ChangePasswordUpdateForm form)
        {
            UserDao dao = new UserDao();
            var userList = dao.Query(new UserQueryForm { ID = form.UserID, Password = form.OldPassword });
            if (userList == null || userList.Count == 0)
            {
                throw new Exception("用户名或者旧密码错误！");
            }
            User user = new User
            {
                ID = form.UserID,
                Password = form.NewPassword,
            };
            dao.Update(new UserUpdateForm { Entity = user });
            return true;
        }

        /// <summary>
        /// 查询所有用户
        /// </summary>
        /// <returns></returns>
        public List<FullUser> QueryAllUser()
        {
            FullUserDao dao = new FullUserDao();
            var userlist = dao.Query(new FullUserQueryForm());

            return userlist;
        }

        public int CheckUserAuth(string token)
        {
            //验证有没有登录
            UserEntireInfo user = GetUserEntireInfoFromCache(token);
            if (user == null)
            {
                LogonHistoryDao dao = new LogonHistoryDao();
                var logonList = dao.Query(new LogonHistoryQueryForm { Token = token });
                if (logonList.Count == 0 || DateTime.Now - logonList[0].ActiveTime > new TimeSpan(0, 30, 0))
                {
                    return 3;
                }
                dao.Update(new LogonHistoryUpdateForm
                {
                    Entity = new LogonHistory { ActiveTime = DateTime.Now },
                    LogonHistoryQueryForm = new LogonHistoryQueryForm { Token = token },
                });
            }
            //验证有没有权限访问
            var attr = ServiceSession.Current.Method.GetCustomAttribute<BaseActionAttribute>(true);
            if (attr != null)
            {
                string actionName = attr.Action;
                var servicelayer = ServiceSession.Current.Method.DeclaringType.GetCustomAttribute<ServiceLayer>(true);
                if (servicelayer != null)
                {
                    string moduleName = servicelayer.Module;
                }
            }
            return -1;
        }
    }
}
