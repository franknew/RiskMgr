using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DreamWorkflow.Engine.Model;

namespace RiskMgr.BLL
{
    public interface IWorkflowAuthorityHandler
    {
        List<string> Handle(ActivityAuth auth);
    }

    public class WorkflowAuthorityFactory
    {
        public static IWorkflowAuthorityHandler CreateHandler(string type)
        {
            IWorkflowAuthorityHandler handler = null;
            switch (type)
            {
                case "role":
                    handler = new RoleWorkflowAuthorityHandler();
                    break;
                case "user":
                    handler = new UserWorkflowAuthorityHandler();
                    break;
                case "creatorleader":
                    handler = new CreatorLeaderWorkflowAuthorityHandler();
                    break;
                case "currentleader":
                    handler = new CurrentLeaderWorkflowAuthorityHandler();
                    break;
                case "leaderinrole":
                    handler = new LeaderInRoleWorkflowAuthorityHandler();
                    break;
                default:
                    throw new Exception("流程权限类型设置错误，未能找到权限类型：" + type);
            }
            return handler;
        }
    }
}
