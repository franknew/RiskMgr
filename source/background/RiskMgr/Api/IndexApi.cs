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
        public IndexQueryForm InitPage()
        {
            string token = ServiceSession.Current.Context.Parameters["token"].ToString();
            IndexQueryForm form = new IndexQueryForm();
            MenuBLL menubll = new MenuBLL();
            UserBLL userbll = new UserBLL();
            TaskDao taskdao = new TaskDao();
            form.Menu = menubll.GetCurrentUserMenu(token);
            form.User = userbll.GetCurrentUser(token);
            return form;
        }
    }
}
