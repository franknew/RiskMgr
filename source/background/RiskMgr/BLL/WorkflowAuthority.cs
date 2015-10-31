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
            RoleDao roledao = new RoleDao(mapper);
            User_RoleDao urdao = new User_RoleDao(mapper);
            UserBLL userbll = new UserBLL();
            //var user = userbll.GetCurrentUser();
            //string userid = user.User.ID;
            string userid = "13";
            foreach (var au in auth)
            {
                switch (au.Type.ToLower())
                {
                    case "role":
                        var role = roledao.Query(new RoleQueryForm { ID = au.Value, IsDeleted = 0 }).FirstOrDefault();
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
                    case "leader":
                        var userroles = urdao.Query(new User_RoleQueryForm { UserID = userid });
                        List<string> rolesid = (from u in userroles select u.RoleID).ToList();
                        var roles = roledao.Query(new RoleQueryForm { IDs = rolesid });
                        foreach (var r in roles)
                        {
                            if (string.IsNullOrEmpty(r.ParentID))
                            {
                                continue;
                            }
                            var parentrole = roledao.Query(new RoleQueryForm { ID = r.ParentID, IsDeleted = 0 }).FirstOrDefault();
                            if (parentrole != null)
                            {
                                var subroles = urdao.Query(new User_RoleQueryForm { RoleID = parentrole.ID });
                                List<string> users = (from ur in subroles
                                                      select ur.UserID).ToList();
                                result.AddRange(users);
                            }
                        }
                        break;
                }
            }
            return result;
        }
    }
}
