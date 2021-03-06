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
    public partial class RoleDao : SimpleDao<Role, RoleQueryForm, RoleUpdateForm>
    {
        public RoleDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public RoleDao()
            : base(null)
        {
        }
        
        public DateTime? QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime?>("QueryRoleLastUpdateTime", null);
        }
    }
}