using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DreamWorkflow.Engine.Model;

namespace RiskMgr.BLL
{
    public class CurrentLeaderWorkflowAuthorityHandler : IWorkflowAuthorityHandler
    {
        public List<string> Handle(ActivityAuth auth)
        {
            //var user = userbll.GetCurrentUser();
            //string userid = user.User.ID;
            string userid = "13";
            UserleaderWorkflowAuthority authority = new UserleaderWorkflowAuthority();
            return authority.GetUserIDs(userid, Convert.ToInt32(auth.Value));
        }
    }
}
