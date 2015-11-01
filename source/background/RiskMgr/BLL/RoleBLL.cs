using DreamWorkflow.Engine;
using IBatisNet.DataMapper;
using RiskMgr.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.BLL
{
    public class RoleBLL
    {
        public List<Role> Query(RoleQueryForm form)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            RoleDao dao = new RoleDao(mapper);
            return dao.Query(form);
        }

        public List<string> GetUserSubUserIDs(string userid)
        {
            UserBLL userbll = new UserBLL();
            ISqlMapper mapper = Common.GetMapperFromSession();
            User_RoleDao urdao = new User_RoleDao(mapper);
            RoleDao roledao = new RoleDao(mapper);
            var urs = urdao.Query(new User_RoleQueryForm { UserID = userid });
            List<string> useridlist = new List<string>();
            //检查用户的角色有没有全数据权限
            var roles = roledao.QueryRoleByUserID(userid);
            foreach (var role in roles)
            {
                if (role.DataAccessType == (int)DataAccesssEnum.All)
                {
                    return null;
                }
            }
            
            useridlist.Add(userid);
            List<Role> list = new List<Role>();
            foreach (var ur in urs)
            {
                list.AddRange(GetAllSubRoles(ur.RoleID));
            }
            var roleids = (from r in list select r.ID).ToList();
            if (roleids.Count == 0)
            {
                return useridlist;
            }
            var users = urdao.Query(new User_RoleQueryForm { RoleIDs = roleids });
            useridlist.AddRange((from u in users select u.UserID).ToList());
            return useridlist;
        }

        public List<Role> GetAllSubRoles(string roleid)
        {
            var allroles = TableCacheHelper.GetDataFromCache<Role>(typeof(RoleDao));
            List<Role> list = new List<Role>();
            var role = allroles.Find(t => t.ID == roleid);
            GetSubRole_Resc(role, allroles, list);
            return list;
        }

        public List<string> GetRoleUserIDs(string roleid)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            User_RoleDao urdao = new User_RoleDao(mapper);
            var roles = GetAllSubRoles(roleid);
            var roleids = (from r in roles select r.ID).ToList();
            var urs = urdao.Query(new User_RoleQueryForm { RoleIDs = roleids });
            return (from u in urs select u.UserID).ToList();
        }

        private void GetSubRole_Resc(Role role, List<Role> allroles, List<Role> list)
        {
            var subroles = allroles.FindAll(t => t.ParentID == role.ID);
            foreach (var r in subroles)
            {
                if (!list.Contains(r))
                {
                    list.Add(r);
                }
                GetSubRole_Resc(r, allroles, list);
            }
        }
    }

    public enum DataAccesssEnum
    {
        Self = 1,
        All = 2,
    }
}
