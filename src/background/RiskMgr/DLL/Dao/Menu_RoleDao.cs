using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.DAL
{
    public class Menu_RoleDao : BaseDao<Menu_Role, Menu_RoleQueryForm, Menu_RoleUpdateForm>
    {
        public Menu_RoleDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}