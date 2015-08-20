using RiskMgr.BLL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DreamWorkflow.Engine.DAL;
using DreamWorkflow.Engine.Form;

namespace RiskMgr.Api
{
    [ServiceLayer(Module="RiskMgr.IndexApi")]
    [AuthFilter]
    public class IndexApi
    {
        /// <summary>
        /// 首页初始化时查询的数据
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public IndexInitResultForm InitPage()
        {
            IndexInitResultForm form = new IndexInitResultForm();
            MenuBLL menubll = new MenuBLL();
            UserBLL userbll = new UserBLL();
            TaskBLL taskbll = new TaskBLL();
            form.Menu = menubll.GetCurrentUserMenu();
            form.User = userbll.GetCurrentUser();
            var task = taskbll.Query(new TaskQueryForm { UserID = form.User.UserInfo.ID });
            task.Sort((l, r) =>
            {
                if (l.CreateTime > r.CreateTime)
                {
                    return 0;
                }
                else
                {
                    return 1;
                }
            });
            return form;
        }
    }
}
