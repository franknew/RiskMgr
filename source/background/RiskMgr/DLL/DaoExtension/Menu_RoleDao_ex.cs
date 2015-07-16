using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Library.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.DAL
{
    public partial class Menu_RoleDao : BaseDao<Menu_Role, Menu_RoleQueryForm, Menu_RoleUpdateForm>
    {
        public List<Menu_Role> QueryByUserID(string UserID)
        {
            return Mapper.QueryForList<Menu_Role>("QueryMenu_RoleByUserName", UserID).ToList();
        }
    }
}
