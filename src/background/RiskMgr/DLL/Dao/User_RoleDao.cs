using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.DAL
{
    public class User_RoleDao : BaseDao<User_Role, User_RoleQueryForm, User_RoleUpdateForm>
    {
        public User_RoleDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}