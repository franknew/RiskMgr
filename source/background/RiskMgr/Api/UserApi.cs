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
    [ServiceLayer(Module="RiskMgr.UserApi")]
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
        public string Add(User user)
        {
            var currentUser = bll.GetCurrentUser();
            user.Creator = currentUser.User.ID;
            return bll.Add(user);
        }

        /// <summary>
        /// 更新用户资料，不能修改密码
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [EditAction]
        public bool Update(User user, UserInfo userinfo)
        {
            var currentUser = bll.GetCurrentUser();
            user.LastUpdator = currentUser.User.ID;
            UserEntireInfo form = new UserEntireInfo
            {
                User = user,
                UserInfo = userinfo,
            };
            return bll.Update(form);
        }

        /// <summary>
        /// 删除用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [DeleteAction]
        public bool Delete(string userid)
        {
            var user = new UserQueryForm
            {
                ID = userid,
            };
            return bll.Delete(user);
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
        [EditAction]
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
    }
}
