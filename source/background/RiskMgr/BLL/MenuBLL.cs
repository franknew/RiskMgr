
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
            
            List<Menu> list = null;
            DateTime lastUpdateTime = dao.QueryLastUpdateTime();
            var item = cache.GetItem("RiskMgr.Menu");
            
            if (item == null)
            {
                list = dao.Query(new MenuQueryForm());
                MenuCache menuCache = new MenuCache
                {
                    LastUpdateTime = lastUpdateTime,
                    Menus = list,
                };
                item = new CacheItem("RiskMgr.Menu", menuCache);
                cache.AddItem(item, 60 * 60);
            }
            else
            {
                MenuCache menuCache = item.Value as MenuCache;
                if (lastUpdateTime > menuCache.LastUpdateTime)
                {
                    list = dao.Query(new MenuQueryForm());
                    menuCache.LastUpdateTime = lastUpdateTime;
                    cache.UpdateItem(item);
                }
                else
                {
                    list = menuCache.Menus;
                }
            }
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
