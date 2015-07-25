using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.BLL
{
    public class RoleBLL
    {
        public List<Role> Query(RoleQueryForm form)
        {
            RoleDao dao = new RoleDao();
            return dao.Query(form);
        }
    }
}
