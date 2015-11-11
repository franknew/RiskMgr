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
            foreach (var au in auth)
            {
                IWorkflowAuthorityHandler handler = WorkflowAuthorityFactory.CreateHandler(au.Type.ToLower());
                result.AddRange(handler.Handle(au));
            }
            return result;
        }
    }
}
