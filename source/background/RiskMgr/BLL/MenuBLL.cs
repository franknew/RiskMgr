﻿
using DreamWorkflow.Engine;
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

namespace RiskMgr.BLL
{
    public class MenuBLL
    {

        private ICache cache = CacheFactory.Create();

        public List<Menu> GetAllMenu()
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            MenuDao dao = new MenuDao(mapper);

            List<Menu> list = TableCacheHelper.GetDataFromCache<Menu>(typeof(MenuDao));

            return list;
        }

        public List<Menu> GetCurrentUserMenu(string token = null)
        {
            if (string.IsNullOrEmpty(token))
            {
                token = ServiceSession.Current.Context.Parameters["token"].ToString();
            }
            ISqlMapper mapper = Common.GetMapperFromSession();
            UserBLL userbll = new UserBLL();
            Menu_RoleDao dao = new Menu_RoleDao(mapper);
            UserEntireInfo u = userbll.GetUserFormCache(token);
            if (u == null)
            {
                u = userbll.GetCurrentUser(token);
            }
            if (u == null)
            {
                throw new Exception("该用户信息不存在！");
            }
            var menurole = dao.QueryByUserID(u.User.ID);
            var list = GetAllMenu();
            var userMenu = list.FindAll(t => menurole.Exists(p => p.MenuID == t.ID) && t.Enabled == 1);
            return userMenu;
        }
    }
}
