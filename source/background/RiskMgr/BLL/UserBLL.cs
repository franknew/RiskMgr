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
using SOAFramework.Library;

namespace RiskMgr.BLL
{
    public class UserBLL
    {
        private ICache cache = CacheFactory.Create();

        public UserEntireInfo GetUserFormCache(string token = null)
        {
            if (string.IsNullOrEmpty(token))
            {
                token = ServiceSession.Current.Context.Parameters["token"].ToString();
            }
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

        public UserEntireInfo GetCurrentUser(string token = null)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            if (string.IsNullOrEmpty(token))
            {
                token = ServiceSession.Current.Context.Parameters["token"].ToString();
            }
            var u = GetUserEntireInfoFromCache(token);
            if (u == null)
            {
                MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = "user is null" }, SOAFramework.Library.CacheEnum.FormMonitor);
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

        public string Add(Model.User user, UserInfo ui, List<string> roleidlist)
        {
            #region risk user
            ISqlMapper mapper = Common.GetMapperFromSession();
            if (user == null)
            {
                throw new Exception("user不能为null！");
            }
            UserDao dao = new UserDao(mapper);
            var exist = dao.Query(new UserQueryForm { Name = user.Name });
            if (exist.Count > 0) throw new Exception("已存在用户名：" + user.Name);
            if (string.IsNullOrEmpty(ui.WX) && string.IsNullOrEmpty(ui.Mobile)) throw new Exception("微信号或者手机不能为空");
            string id = dao.Add(user);
            if (ui == null)
            {
                ui = new UserInfo();
            }
            UserInfoDao infodao = new UserInfoDao(mapper);
            ui.ID = id;
            infodao.Add(ui);
            if (roleidlist == null) return id;
            User_RoleDao urdao = new User_RoleDao(mapper);
            foreach (var role in roleidlist)
            {
                User_Role ur = new User_Role { RoleID = role, UserID = user.ID };
                urdao.Add(ur);
            }
            #endregion

            #region weixin user
            RoleDao roledao = new RoleDao(mapper);
            var roles = roledao.Query(new RoleQueryForm { IDs = roleidlist });
            var weixinids = (from r in roles
                             where !string.IsNullOrEmpty(r.WeiXinID)
                             select Convert.ToInt32(r.WeiXinID)).ToArray();
            try
            {
                SOAFramework.Library.WeiXin.WeiXinApi.User.Create(new SOAFramework.Library.WeiXin.User
                {
                    department = weixinids,
                    enable = 1,
                    mobile = ui.Mobile,
                    name = ui.CnName,
                    weixinid = ui.WX,
                    userid = user.Name,
                });
            }
            catch (SOAFramework.Library.WeiXin.WeiXinException ex)
            {
                switch (ex.Code)
                {
                    case "60004":
                    case "60003":
                        foreach (var role in roles)
                        {
                            //部门不存在就新建部门
                            Role parentrole = null;
                            if (!string.IsNullOrEmpty(role.ParentID)) roledao.Query(new RoleQueryForm { ID = role.ParentID }).FirstOrDefault();
                            var department = new SOAFramework.Library.WeiXin.Department
                            {
                                name = role.Name,
                            };
                            if (parentrole != null) department.parentid = parentrole.WeiXinID;
                            var response = SOAFramework.Library.WeiXin.WeiXinApi.Department.Create(department);
                            roledao.Update(new RoleUpdateForm
                            {
                                Entity = new Role { WeiXinID = response.id },
                                RoleQueryForm = new RoleQueryForm { ID = role.ID },
                            });
                        }
                        SOAFramework.Library.WeiXin.WeiXinApi.User.Create(new SOAFramework.Library.WeiXin.User
                        {
                            department = weixinids,
                            enable = 1,
                            mobile = ui.Mobile,
                            name = ui.CnName,
                            weixinid = ui.WX,
                            userid = user.Name,
                        });
                        break;
                    case "60102"://用户已存在
                        SOAFramework.Library.WeiXin.WeiXinApi.User.Update(new SOAFramework.Library.WeiXin.User
                        {
                            department = weixinids,
                            mobile = ui.Mobile,
                            name = ui.CnName,
                            weixinid = ui.WX,
                            userid = user.Name,
                        });
                        break;
                    default:
                        throw ex;
                }
            }
            #endregion
            return id;
        }

        public bool Update(Model.User user, UserInfo ui, List<string> roleidlist)
        {
            #region risk update
            ISqlMapper mapper = Common.GetMapperFromSession();
            UserDao udao = new UserDao(mapper);
            UserInfoDao uidao = new UserInfoDao(mapper);
            if (user != null)
            {
                Model.User entity = new User
                {
                    ID = user.ID,
                    Enabled = user.Enabled,
                };
                udao.Update(new UserUpdateForm { Entity = entity, UserQueryForm = new UserQueryForm { ID = user.ID } });
            }
            if (ui != null)
            {
                uidao.Update(new UserInfoUpdateForm { Entity = ui, UserInfoQueryForm = new UserInfoQueryForm { ID = ui.ID } });
            }
            if (roleidlist != null)
            {
                User_RoleDao urdao = new User_RoleDao(mapper);
                urdao.Delete(new User_RoleQueryForm { UserID = user.ID });
                foreach (var role in roleidlist)
                {
                    User_Role ur = new User_Role { RoleID = role, UserID = user.ID };
                    urdao.Add(ur);
                }
            }
            #endregion

            #region weixin api
            RoleDao roledao = new RoleDao(mapper);
            var roles = roledao.Query(new RoleQueryForm { IDs = roleidlist });
            var weixinids = (from r in roles
                             where !string.IsNullOrEmpty(r.WeiXinID)
                             select Convert.ToInt32(r.WeiXinID)).ToArray();
            var user_temp = udao.Query(new UserQueryForm { ID = user.ID }).FirstOrDefault();
            var ui_temp = uidao.Query(new UserInfoQueryForm { ID = user.ID }).FirstOrDefault();
            try
            {
                SOAFramework.Library.WeiXin.WeiXinApi.User.Update(new SOAFramework.Library.WeiXin.User
                {
                    department = weixinids,
                    mobile = ui_temp.Mobile,
                    name = ui_temp.CnName,
                    weixinid = ui_temp.WX,
                    userid = user_temp.Name,
                    enable = 1,
                });
            }
            catch (SOAFramework.Library.WeiXin.WeiXinException ex)
            {
                switch (ex.Code)
                {
                    case "60111"://如果微信上不存在用户，就新建
                        SOAFramework.Library.WeiXin.WeiXinApi.User.Create(new SOAFramework.Library.WeiXin.User
                        {
                            enable = 1,
                            userid = user_temp.Name,
                            name = ui_temp.CnName,
                            mobile = ui_temp.Mobile,
                            weixinid = ui_temp.WX,
                            department = weixinids,
                        });
                        break;
                    default:
                        throw ex;
                }
            }
            #endregion
            return true;
        }

        public bool Delete(UserQueryForm user)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            UserDao userdao = new UserDao(mapper);
            User_RoleDao urdao = new User_RoleDao(mapper);
            UserInfoDao uidao = new UserInfoDao(mapper);

            UserQueryForm uform = new UserQueryForm
            {
                ID = user.ID
            };
            userdao.Delete(uform);

            UserInfoQueryForm uiform = new UserInfoQueryForm
            {
                ID = user.ID,
            };
            uidao.Delete(uiform);

            User_RoleQueryForm urform = new User_RoleQueryForm
            {
                UserID = user.ID,
            };
            urdao.Delete(urform);
            SOAFramework.Library.WeiXin.WeiXinApi.User.Delete(user.Name);
            return true;
        }

        public bool ChangePassword(ChangePasswordUpdateForm form)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            UserDao dao = new UserDao(mapper);
            Model.User user = new User
            {
                ID = form.UserID,
                Password = form.NewPassword,
            };
            dao.Update(new UserUpdateForm { Entity = user });
            return true;
        }

        public bool ChangeSelfPassword(ChangePasswordUpdateForm form)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            UserDao dao = new UserDao(mapper);
            var useraccount = dao.Query(new UserQueryForm { ID = form.UserID, Password = form.OldPassword }).FirstOrDefault();
            if (useraccount == null)
            {
                throw new Exception("用户名或者旧密码错误！");
            }
            Model.User user = new Model.User
            {
                ID = form.UserID,
                Password = form.NewPassword,
            };
            dao.Update(new UserUpdateForm { Entity = user, UserQueryForm = new UserQueryForm { ID = user.ID } });
            return true;
        }

        /// <summary>
        /// 查询所有用户
        /// </summary>
        /// <returns></returns>
        public List<FullUser> Query(FullUserQueryForm form)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            FullUserDao dao = new FullUserDao(mapper);
            User_RoleDao urdao = new User_RoleDao(mapper);
            RoleDao roledao = new RoleDao(mapper);
            var userlist = dao.Query(form);
            var userids = (from u in userlist select u.ID).ToList();
            var urs = urdao.Query(new User_RoleQueryForm { UserIDs = userids });
            var roleids = (from ur in urs select ur.RoleID).Distinct().ToList();
            var roles = roledao.Query(new RoleQueryForm { IDs = roleids });
            foreach (var u in userlist)
            {
                var ur_temp = urs.FindAll(t => t.UserID == u.ID);
                var rolelist = (from ur in ur_temp join r in roles on ur.RoleID equals r.ID select r).ToList();
                u.RoleList = rolelist;
            }
            return userlist;
        }

        /// <summary>
        /// 3:验证失效。4：没有权限
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public int CheckUserAuth(string token)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            //验证有没有登录
            UserEntireInfo user = GetUserEntireInfoFromCache(token);
            if (user == null) return 3;
            LogonHistoryDao logonhistorydao = new LogonHistoryDao(mapper);
            var logonList = logonhistorydao.Query(new LogonHistoryQueryForm { Token = token });
            //登录超时
            if (logonList.Count == 0 || DateTime.Now - logonList[0].ActiveTime > new TimeSpan(0, 30, 0)) return 3;
            logonhistorydao.Update(new LogonHistoryUpdateForm
            {
                Entity = new LogonHistory { ActiveTime = DateTime.Now },
                LogonHistoryQueryForm = new LogonHistoryQueryForm { Token = token },
            });
            if (ServiceSession.Current != null) return CheckAuth(user.Role);
            return -1;
        }

        public int CheckAuth(List<Role> roles)
        {
            //验证有没有权限访问
            var attr = ServiceSession.Current.Method.GetCustomAttribute<BaseActionAttribute>(true);
            if (attr != null)
            {
                ISqlMapper mapper = Common.GetMapperFromSession();
                string actionName = attr.Action;
                var servicelayer = ServiceSession.Current.Method.DeclaringType.GetCustomAttribute<ServiceLayer>(true);
                if (servicelayer != null)
                {
                    string moduleName = servicelayer.Module;
                    var modules = TableCacheHelper.GetDataFromCache<Module>(typeof(ModuleDao));
                    var actions = TableCacheHelper.GetDataFromCache<RiskMgr.Model.Action>(typeof(ActionDao));
                    Role_Module_ActionDao dao = new Role_Module_ActionDao(mapper);
                    var module = modules.Find(t => t.Name == moduleName);
                    var action = actions.Find(t => t.Name == actionName);
                    if (module == null || action == null) return -1;
                    string actionID = action.ID;
                    string moduleID = module.ID;
                    Role_Module_ActionQueryForm query = new Role_Module_ActionQueryForm
                    {
                        ActionID = actionID,
                        ModuleID = moduleID
                    };
                    //MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = "action id:" + actionID + ";module id:" + moduleID }, SOAFramework.Library.CacheEnum.FormMonitor);
                    var role_module_action = dao.Query(query);
                    bool hasRight = false;
                    foreach (var item in role_module_action)
                    {
                        if (roles != null && roles.Exists(t => t.ID == item.RoleID))
                        {
                            hasRight = true;
                            break;
                        }
                    }
                    if (!hasRight) return 4;
                }
            }
            return -1;
        }
    }
}
