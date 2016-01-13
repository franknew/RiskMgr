using RiskMgr.BLL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Api
{
    [ServiceLayer(Module = "RiskMgr.UserApi")]
    [AuthFilter]
    public class UserApi
    {
        UserBLL bll = new UserBLL();

        /// <summary>
        /// 新增用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [EditAction]
        public string Add(AddUserServiceForm form)
        {
            var currentUser = bll.GetCurrentUser();
            User u = new User
            {
                ID = form.ID,
                Enabled = form.Enabled,
                Name = form.Name,
                Password = form.Password,
            };
            u.Creator = currentUser.User.ID;
            UserInfo ui = new UserInfo
            {
                CnName = form.CnName,
            };
            User_Role ur = null;
            if (!string.IsNullOrEmpty(form.Role))
            {
                ur = new User_Role
                {
                    RoleID = form.Role,
                };
            };
            return bll.Add(u, ui, ur);
        }

        /// <summary>
        /// 更新用户资料，不能修改密码
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [EditAction]
        public bool Update(UpdateUserServiceForm form)
        {
            var currentUser = bll.GetCurrentUser();
            User u = new User
            {
                ID = form.ID,
                LastUpdator = currentUser.User.ID,
                Enabled = form.Enabled,
            };
            UserInfo ui = new UserInfo
            {
                ID = form.ID,
                Address = form.Address,
                CnName = form.CnName,
                Identity = form.Identity,
                Mobile = form.Mobile,
                QQ = form.QQ,
                Remark = form.Remark
            };
            return bll.Update(u, ui, form.Role);
        }

        /// <summary>
        /// 删除用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [DeleteAction]
        public bool Delete(UserQueryForm form)
        {
            return bll.Delete(form);
        }

        /// <summary>
        /// 管理员修改密码，不需要验证旧密码
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        [EditAction]
        public bool ChangePassword(ChangePasswordUpdateForm form)
        {
            return bll.ChangePassword(form);
        }

        /// <summary>
        /// 用户自己改密码，需要验证旧密码
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        public bool ChangeSelfPassword(ChangePasswordUpdateForm form)
        {
            string token = ServiceSession.Current.Context.Parameters["token"].ToString();
            var user = bll.GetUserFormCache();
            ChangePasswordUpdateForm newForm = new ChangePasswordUpdateForm
            {
                UserID = user.User.ID,
                OldPassword = form.OldPassword,
                NewPassword = form.NewPassword,
            };
            return bll.ChangeSelfPassword(newForm);
        }

        /// <summary>
        /// 查询所有用户
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public PagingEntity<FullUser> QueryUser(FullUserQueryForm form)
        {
            var list = bll.Query(form);
            PagingEntity<FullUser> users = new PagingEntity<FullUser>
            {
                Record = list,
                PageCount = form.PageCount,
                RecordCount = form.RecordCount,
            };
            return users;
        }

        /// <summary>
        /// 用户管理首页需要用到的数据
        /// </summary>
        /// <returns></returns>
        [QueryAction]
        public UserInitResultForm Init(FullUserQueryForm form)
        {
            var list = bll.Query(form);
            PagingEntity<FullUser> users = new PagingEntity<FullUser>
            {
                Record = list,
                PageCount = form.PageCount,
                RecordCount = form.RecordCount,
            };
            RoleBLL rolebll = new RoleBLL();
            var role = rolebll.Query(new RoleQueryForm { });
            UserInitResultForm resultform = new UserInitResultForm
            {
                User = users,
                Role = role,
            };
            return resultform;
        }
    }
}
