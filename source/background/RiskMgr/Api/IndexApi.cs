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
using DreamWorkflow.Engine;
using SOAFramework.Library;

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
            var task = taskbll.Query(new QueryMyTaskServiceForm { UserID = form.User.User.ID, Status = (int)TaskProcessStatus.Started });
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
            form.ProcessingTask = task;
            return form;
        }


        [EditAction]
        public bool UpdateUser(UpdateUserServiceForm form)
        {
            UserBLL bll = new UserBLL();
            var currentUser = bll.GetCurrentUser();
            User u = new User
            {
                ID = currentUser.User.ID,
                LastUpdator = currentUser.User.ID,
                Enabled = form.Enabled,
            };
            UserInfo ui = new UserInfo
            {
                ID = currentUser.User.ID,
                Address = form.Address,
                CnName = form.CnName,
                Identity = form.Identity,
                Mobile = form.Mobile,
                QQ = form.QQ,
                Remark = form.Remark,
                WX = form.WX,
            };
            return bll.Update(u, ui, null);
        }
    }
}
