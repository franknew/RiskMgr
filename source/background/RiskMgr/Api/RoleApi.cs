﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using RiskMgr.BLL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core;

namespace RiskMgr.Api
{
    [ServiceLayer(Module = "RiskMgr.RoleApi")]
    [AuthFilter]
    public class RoleApi
    {
        private RoleBLL bll = new RoleBLL();

        /// <summary>
        /// 新增角色
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        [EditAction]
        public string AddRole(AddRoleServiceForm form)
        {
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            form.Creator = user.User.ID;
            string weixinid = "20";
            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["WeiXinDepartmentID"])) weixinid = ConfigurationManager.AppSettings["WeiXinDepartmentID"];
            form.WeiXinID = weixinid;
            return bll.AddRole(form);
        }

        /// <summary>
        /// 编辑角色
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [EditAction]
        public bool UpdateRole(AddRoleServiceForm form)
        {
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            form.LastUpdator = user.User.ID;
            return bll.UpdateRole(form);
        }

        /// <summary>
        /// 删除角色
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [DeleteAction]
        public bool DeleteRole(Role form)
        {
            UserBLL userbll = new UserBLL();
            var user = userbll.GetCurrentUser();
            form.LastUpdator = user.User.ID;
            return bll.DeleteRole(form.ID);
        }

        [QueryAction]
        public List<AuthorityNodeForCheck> QueryAuthority()
        {
            return bll.QueryAuthority();
        }

        /// <summary>
        /// 查询角色
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [QueryAction]
        public QueryRoleResultForm QueryRole(RoleQueryForm form)
        {
            QueryRoleResultForm result = new QueryRoleResultForm();
            result.Roles = bll.Query(form);
            return result;
        }
    }
}
