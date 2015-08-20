using IBatisNet.DataMapper;
using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core.Model;
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
            ISqlMapper mapper = null;
            if (ServiceSession.Current.Context.Parameters.ContainsKey("Mapper"))
            {
                mapper = ServiceSession.Current.Context.Parameters["Mapper"] as ISqlMapper;
            }
            else
            {
                mapper = Mapper.Instance();
            }
            RoleDao dao = new RoleDao(mapper);
            return dao.Query(form);
        }
    }
}
