using DreamWorkflow.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DreamWorkflow.Engine.Model;
using IBatisNet.DataMapper;
using RiskMgr.Form;
using RiskMgr.DAL;

namespace RiskMgr.BLL
{
    public class WorkflowAuthority : IWorkflowAuthority
    {
        public List<string> GetUserIDList(List<ActivityAuth> auth)
        {
            var mapper = Common.GetMapperFromSession();
            List<string> result = new List<string>();
            foreach (var au in auth)
            {
                switch (au.Type.ToLower())
                {
                    case "role":
                        RoleDao roledao = new RoleDao(mapper);
                        User_RoleDao urdao = new User_RoleDao(mapper);
                        var role = roledao.Query(new RoleQueryForm { ID = au.Value }).FirstOrDefault();
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
                        break;
                    case "user":
                        result.Add(au.Value);
                        break;
                }
            }
            return result;
        }
    }
}
