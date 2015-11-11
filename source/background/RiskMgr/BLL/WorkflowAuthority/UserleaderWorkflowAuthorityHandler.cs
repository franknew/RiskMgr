using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IBatisNet.DataMapper;
using RiskMgr.DAL;
using RiskMgr.Form;

namespace RiskMgr.BLL
{
    public class UserleaderWorkflowAuthority
    {
        RoleDao roledao = null;
        User_RoleDao urdao = null;

        public UserleaderWorkflowAuthority()
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            roledao = new RoleDao(mapper);
            urdao = new User_RoleDao(mapper);
        }

        public List<string> GetUserIDs(string userid, int level)
        {
            int deepth = 1;
            List<string> result = new List<string>();
            var urs = urdao.Query(new User_RoleQueryForm { UserID = userid });
            foreach (var ur in urs)
            {
                RescGetUserIDs(result, ur.RoleID, level, deepth);
            }
            return result;
        }

        private void RescGetUserIDs(List<string> result, string roleid, int level, int deepth)
        {
            if (deepth > level)
            {
                return;
            }
            var role = roledao.Query(new RoleQueryForm { ID = roleid }).FirstOrDefault();
            if (role == null || string.IsNullOrEmpty(role.ParentID))
            {
                var urs = urdao.Query(new User_RoleQueryForm { RoleID = roleid });
                var userids = (from ur in urs
                               select ur.UserID).ToList();
                result.AddRange(userids);
                return;
            }
            string parentroleid = role.ParentID;
            if (deepth == level)
            {
                var urs = urdao.Query(new User_RoleQueryForm { RoleID = parentroleid });
                var userids = (from ur in urs
                               select ur.UserID).ToList();
                result.AddRange(userids);
            }
            else
            {
                deepth++;
                RescGetUserIDs(result, parentroleid, level, deepth);
            }
        }
    }
}
