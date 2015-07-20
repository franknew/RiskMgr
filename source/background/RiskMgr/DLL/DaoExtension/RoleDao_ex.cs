using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Library.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.DAL
{
    public partial class RoleDao : SimpleDao<Role, RoleQueryForm, RoleUpdateForm>
    {
        public List<Role> QueryRoleByUserID(string UserID)
        {
            return Mapper.QueryForList<Role>("QueryRoleByUserID", UserID).ToList();
        }
    }
}
