using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DreamWorkflow.Engine.Model;
using IBatisNet.DataMapper;
using RiskMgr.DAL;
using RiskMgr.Form;

namespace RiskMgr.BLL
{
    public class RoleWorkflowAuthorityHandler : IWorkflowAuthorityHandler
    {
        public List<string> Handle(ActivityAuth auth)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            RoleDao roledao = new RoleDao(mapper);
            User_RoleDao urdao = new User_RoleDao(mapper);
            List<string> result = new List<string>();
            var role = roledao.Query(new RoleQueryForm { ID = auth.Value, IsDeleted = 0 }).FirstOrDefault();
            if (role != null)
            {
                var userrole = urdao.Query(new User_RoleQueryForm { RoleID = role.ID });
                if (userrole != null)
                {
                    foreach (var ur in userrole)
                    {
                        if (!result.Contains(ur.UserID))
                        {
                            result.Add(ur.UserID);
                        }
                    }
                }
            }
            return result;
        }
    }
}
