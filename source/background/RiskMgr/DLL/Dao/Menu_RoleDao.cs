using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.DAL
{
    public partial class Menu_RoleDao : BaseDao<Menu_Role, Menu_RoleQueryForm, Menu_RoleUpdateForm>
    {
        public Menu_RoleDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public Menu_RoleDao()
            : base(null)
        {
        }
        
    }
}