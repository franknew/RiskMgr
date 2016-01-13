using RiskMgr.BLL;
using SOAFramework.Service.Core;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library;

namespace RiskMgr.Api
{
    [ServiceLayer(IsHiddenDiscovery = true)]
    [Filter(GlobalUse = false, Index = 2)]
    public class DataAuthorityFilter : BaseFilter
    {
        public override bool OnActionExecuting(ActionContext context)
        {
            RoleBLL rolebll = new RoleBLL();
            UserBLL userbll = new UserBLL();
            string userid = userbll.GetCurrentUser().User.ID;
            var list = rolebll.GetUserSubUserIDs(userid);
            //MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = "id:"+ userid + " count:" + list.Count.ToString() }, SOAFramework.Library.CacheEnum.FormMonitor);
            context.Parameters[Common.DataAuthorityKey] = list;
            return true;
        }
    }
}
