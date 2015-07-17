
using DreamWorkflow.Engine;
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

        private ICache cache = CacheFactory.Create(CacheType.DefaultMemoryCache, "RiskMgr.Menu");

        public List<Menu> GetAllMenu()
        {
            MenuDao dao = new MenuDao();

            List<Menu> list = TableCacheHelper.GetDataFromCache<Menu>(typeof(MenuDao));

            return list;
        }

        public List<Menu> GetCurrentUserMenu(string token)
        {
            UserBLL userbll = new UserBLL();
            Menu_RoleDao dao = new Menu_RoleDao();
            User u = userbll.GetUserFormCache(token);
            var userroles = dao.QueryByUserID(u.ID);
            var list = GetAllMenu();
            var userMenu = list.FindAll(t => userroles.Exists(p => p.MenuID == t.ID));
            return userMenu;
        }
    }
}
