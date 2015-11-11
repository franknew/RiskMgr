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
    public class LeaderInRoleWorkflowAuthorityHandler : IWorkflowAuthorityHandler
    {
        public List<string> Handle(ActivityAuth auth)
        {
            List<string> result = new List<string>();
            ISqlMapper mapper = Common.GetMapperFromSession();
            UserBLL bll = new UserBLL();
            string userid = bll.GetCurrentUser().User.ID;
            //string userid = "16";
            RoleDao roledao = new RoleDao(mapper);
            User_RoleDao urdao = new User_RoleDao(mapper);
            string[] roleids = auth.Value.Split(',');
            var subroles = roledao.Query(new RoleQueryForm { ParentIDs = roleids.ToList() });
            var urs = urdao.Query(new User_RoleQueryForm { UserID = userid });
            var roles = subroles.FindAll(t => urs.Exists(p => p.RoleID == t.ID));
            if (roles == null || roles.Count == 0)
            {
                result.Add(userid);
            }
            else
            {
                IWorkflowAuthorityHandler handler = new RoleWorkflowAuthorityHandler();
                foreach (var role in roles)
                {
                    if (roleids.Any(t => t == role.ParentID))
                    {
                        result.AddRange(handler.Handle(new ActivityAuth
                        {
                            Value = role.ParentID,
                        }));
                    }
                }
            }
            return result;
        }
    }
}
