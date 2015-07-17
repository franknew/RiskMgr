using IBatisNet.DataMapper;
using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Library.Cache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Text;

namespace RiskMgr.BLL
{
    public class UserBLL
    {
        private ICache cache = CacheFactory.Create(CacheType.DefaultMemoryCache, CacheEnum.User);
        private ISqlMapper mapper = Mapper.Instance();

        public User GetUserFormCache(string token)
        {
            CacheItem item = cache.GetItem(token);
            if (item == null)
            {
                return null;
            }
            User u = item.Value as User;
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
    }
}
