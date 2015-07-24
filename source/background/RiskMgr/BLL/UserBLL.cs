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
using DreamWorkflow.Engine;

namespace RiskMgr.BLL
{
    public class UserBLL
    {
        private ICache cache = CacheFactory.Create();
        private ISqlMapper mapper = Mapper.Instance();

        public UserEntireInfo GetUserFormCache()
        {
            string token = ServiceSession.Current.Context.Parameters["token"].ToString();
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

        public UserEntireInfo GetCurrentUser()
        {
            string token = ServiceSession.Current.Context.Parameters["token"].ToString();
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
            var userinfo = GetCurrentUser();
            mapper.BeginTransaction();
            try
            {
                UserDao dao = new UserDao(mapper);
                UserInfoDao infodao = new UserInfoDao(mapper);
                var exist = dao.Query(new UserQueryForm { Name = user.Name });
                if (exist.Count > 0)
                {
                    throw new Exception("已存在用户名：" + user.Name);
                }
                string id = dao.Add(user);
                UserInfo ui = new UserInfo
                {
                    ID = id,
                };
                infodao.Add(ui);
                mapper.CommitTransaction();
                return id;
            }
            catch (Exception ex)
            {
                mapper.RollBackTransaction();
                throw ex;
            }
        }

        public bool Update(UserEntireInfo user)
        {
            mapper.BeginTransaction();
            try
            {
                if (user.User != null)
                {
                    UserDao dao = new UserDao(mapper);
                    User entity = new User
                    {
                        ID = user.User.ID,
                        Enabled = user.User.Enabled,
                    };
                    dao.Update(new UserUpdateForm { Entity = entity, UserQueryForm = new UserQueryForm { ID = user.User.ID } });
                }
                if (user.UserInfo != null)
                {
                    UserInfoDao dao = new UserInfoDao();
                    dao.Update(new UserInfoUpdateForm { Entity = user.UserInfo, UserInfoQueryForm = new UserInfoQueryForm { ID = user.UserInfo.ID } });
                }
                mapper.CommitTransaction();
            }
            catch (Exception ex)
            {
                mapper.RollBackTransaction();
                throw ex;
            }
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
        public List<FullUser> Query(FullUserQueryForm form)
        {
            FullUserDao dao = new FullUserDao();
            var userlist = dao.Query(form);

            return userlist;
        }

        /// <summary>
        /// 3:验证失效。4：没有权限
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public int CheckUserAuth(string token)
        {
            //验证有没有登录
            UserEntireInfo user = GetUserEntireInfoFromCache(token);
            if (user == null)
            {
                return 3;
            }
            LogonHistoryDao logonhistorydao = new LogonHistoryDao();
            var logonList = logonhistorydao.Query(new LogonHistoryQueryForm { Token = token });
            if (logonList.Count == 0 || DateTime.Now - logonList[0].ActiveTime > new TimeSpan(0, 30, 0))
            {
                return 3;
            }
            logonhistorydao.Update(new LogonHistoryUpdateForm
            {
                Entity = new LogonHistory { ActiveTime = DateTime.Now },
                LogonHistoryQueryForm = new LogonHistoryQueryForm { Token = token },
            });
            //验证有没有权限访问
            var attr = ServiceSession.Current.Method.GetCustomAttribute<BaseActionAttribute>(true);
            if (attr != null)
            {
                string actionName = attr.Action;
                var servicelayer = ServiceSession.Current.Method.DeclaringType.GetCustomAttribute<ServiceLayer>(true);
                if (servicelayer != null)
                {
                    string moduleName = servicelayer.Module;
                    var modules = TableCacheHelper.GetDataFromCache<Module>(typeof(ModuleDao));
                    var actions = TableCacheHelper.GetDataFromCache<RiskMgr.Model.Action>(typeof(ActionDao));
                    Role_Module_ActionDao dao = new Role_Module_ActionDao();
                    var module = modules.Find(t => t.Name == moduleName);
                    var action = actions.Find(t => t.Name == actionName);
                    if (module == null)
                    {
                        return -1;
                    }
                    if (action == null)
                    {
                        return -1;
                    }
                    string actionID = action.ID;
                    string moduleID = module.ID;
                    Role_Module_ActionQueryForm query = new Role_Module_ActionQueryForm
                    {
                        ActionID = actionID,
                        ModuleID = moduleID
                    };
                    var role_module_action = dao.Query(query);
                    bool hasRight = false;
                    foreach (var item in role_module_action)
                    {
                        if (user.Role != null && user.Role.Exists(t=>t.ID == item.RoleID))
                        {
                            hasRight = true;
                            break;
                        }
                    }
                    if (!hasRight)
                    {
                        return 4;
                    }
                }
            }
            return -1;
        }
    }
}
