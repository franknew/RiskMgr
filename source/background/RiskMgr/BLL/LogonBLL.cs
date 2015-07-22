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

namespace RiskMgr.BLL
{
    public class LogonBLL
    {
        private ICache cache = CacheFactory.Create();

        public string Logon(string username, string password)
        {
            var mapper = Mapper.Instance();
            mapper.BeginTransaction();
            UserDao userdao = new UserDao(mapper);
            UserInfoDao userInfoDao = new UserInfoDao(mapper);
            RoleDao roleDao = new RoleDao(mapper);
            LogonHistoryDao historyDao = new LogonHistoryDao(mapper);
            var users = userdao.Query(new UserQueryForm { Name = username, Password = password });
            if (users.Count > 0)
            {
                try
                {
                    if (users[0].Enabled == 0)
                    {
                        throw new Exception("该用户已被禁用，请联系管理员！");
                    }
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
                    LogonHistory history = new LogonHistory
                    {
                        LogonTime = DateTime.Now,
                        Token = token,
                        UserID = users[0].ID,
                        ActiveTime = DateTime.Now,
                    };
                    //var endpoint = ServiceSession.Current.Context.Context.IncomingMessageProperties[RemoteEndpointMessageProperty.Name] as RemoteEndpointMessageProperty;
                    //history.IP = endpoint.Address;
                    historyDao.Add(history);
                    mapper.CommitTransaction();
                    cache.AddItem(item, 30 * 60);
                    return token;
                }
                catch (Exception ex)
                {
                    mapper.RollBackTransaction();
                    throw ex;
                }
            }
            else
            {
                throw new Exception("用户名或者密码错误！请输入正确的用户名和密码！");
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

        public bool CheckAuth(string token, string module, string action)
        {
            Role_Module_ActionDao rmadao = new Role_Module_ActionDao();
            return true;
        }
    }
}
