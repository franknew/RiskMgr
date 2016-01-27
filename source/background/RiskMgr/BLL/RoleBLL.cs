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
using SOAFramework.Library;

namespace RiskMgr.BLL
{
    public class RoleBLL
    {
        #region action
        /// <summary>
        /// 查询角色
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        public List<FullRoleInfo> Query(RoleQueryForm form)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            RoleDao dao = new RoleDao(mapper);
            Role_Module_ActionDao rmadao = new Role_Module_ActionDao(mapper);
            List<FullRoleInfo> result = new List<FullRoleInfo>();
            form.IsDeleted = 0;
            var roles = dao.Query(form);
            var roleids = (from r in roles select r.ID).ToList();
            var rmas = rmadao.Query(new Role_Module_ActionQueryForm { RoleIDs = roleids });
            AuthorityMapping mapping = XMLHelper.DeserializeFromFile<AuthorityMapping>(Common.AuthorityMappingFile);
            foreach (var role in roles)
            {
                var data = role.ConvertTo<FullRoleInfo>();
                var parentrole = roles.Find(t => t.ID == role.ParentID);
                if (parentrole != null) data.ParentRoleName = parentrole.Name;
                #region 查询权限
                var role_rmas = rmas.FindAll(t => t.RoleID.Equals(role.ID));
                data.Authority = new List<AuthorityNodeForCheck>();
                foreach (var auth in mapping.AuthNode)
                {
                    auth.Checked = (from au in auth.Item
                                    from r in role_rmas
                                    where au.ModuleID == r.ModuleID && au.ActionID == r.ActionID
                                    select au).Count() == auth.Item.Count;
                    data.Authority.Add(auth as AuthorityNodeForCheck);
                }
                #endregion
                result.Add(data);
            }
            return result;
        }

        /// <summary>
        /// 获得用户角色子级下的所有用户
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
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

        /// <summary>
        /// 获得角色子级下的所有角色
        /// </summary>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public List<Role> GetAllSubRoles(string roleid)
        {
            var allroles = TableCacheHelper.GetDataFromCache<Role>(typeof(RoleDao));
            List<Role> list = new List<Role>();
            var role = allroles.Find(t => t.ID == roleid);
            GetSubRole_Resc(role, allroles, list);
            return list;
        }

        /// <summary>
        /// 获得角色下的所有用户以及角色子级下的所有角色
        /// </summary>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public List<string> GetRoleUserIDs(string roleid)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            User_RoleDao urdao = new User_RoleDao(mapper);
            var roles = GetAllSubRoles(roleid);
            var roleids = (from r in roles select r.ID).ToList();
            var urs = urdao.Query(new User_RoleQueryForm { RoleIDs = roleids });
            return (from u in urs select u.UserID).ToList();
        }

        public string AddRole(AddRoleServiceForm form)
        {
            Role role = new Role
            {
                DataAccessType = form.DataAccessType,
                Creator = form.Creator,
                IsDeleted = 0,
                Name = form.Name,
                ParentID = form.ParentID,
                Remark = form.Remark,
            };
            //新增角色
            ISqlMapper mapper = Common.GetMapperFromSession();
            RoleDao dao = new RoleDao(mapper);
            string id = dao.Add(role);
            AddRoleAuth(mapper, form, id);
            return id;
        }

        public bool UpdateRole(AddRoleServiceForm form)
        {
            if (string.IsNullOrEmpty(form.ID))
            {
                throw new Exception("更新角色时没有ID");
            }
            ISqlMapper mapper = Common.GetMapperFromSession();
            RoleDao dao = new RoleDao(mapper);
            Role_Module_ActionDao rmadao = new Role_Module_ActionDao(mapper);
            rmadao.Delete(new Role_Module_ActionQueryForm { RoleID = form.ID });
            AddRoleAuth(mapper, form, form.ID);
            return dao.Update(new RoleUpdateForm
            {
                Entity = new Role
                {
                    LastUpdator = form.LastUpdator,
                    Name = form.Name,
                    ParentID = form.ParentID,
                    Remark = form.Remark,
                    DataAccessType = form.DataAccessType,
                },
                RoleQueryForm = new RoleQueryForm { ID = form.ID },
            });
        }

        public bool DeleteRole(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new Exception("删除角色时没有ID");
            }
            ISqlMapper mapper = Common.GetMapperFromSession();
            RoleDao dao = new RoleDao(mapper);
            Role_Module_ActionDao rmadao = new Role_Module_ActionDao(mapper);
            rmadao.Delete(new Role_Module_ActionQueryForm { RoleID = id });
            return dao.Delete(new RoleQueryForm { ID = id });
        }
        #endregion

        #region private 
        private void AddRoleAuth(ISqlMapper mapper, AddRoleServiceForm form, string id)
        {
            #region 权限新增
            //权限操作
            Role_Module_ActionDao rmadao = new Role_Module_ActionDao(mapper);
            List<Module> modules = TableCacheHelper.GetDataFromCache<Module>(typeof(ModuleDao));
            List<Model.Action> actions = TableCacheHelper.GetDataFromCache<Model.Action>(typeof(ActionDao));
            AuthorityMapping mapping = XMLHelper.DeserializeFromFile<AuthorityMapping>(Common.AuthorityMappingFile);
            foreach (var auth in form.Authority)
            {
                if (!auth.Checked) continue;
                var authonode = mapping.AuthNode.Find(t => t.ID.Equals(auth.ID));
                if (authonode == null) continue;
                AddAuth(authonode.Item, form.ID, rmadao);
            }
            #endregion
        }

        /// <summary>
        /// 递归获得角色子级的角色
        /// </summary>
        /// <param name="role"></param>
        /// <param name="allroles"></param>
        /// <param name="list"></param>
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

        /// <summary>
        /// 新增角色权限
        /// </summary>
        /// <param name="items"></param>
        /// <param name="roleid"></param>
        /// <param name="dao"></param>
        private void AddAuth(List<AuthorityItem> items, string roleid, Role_Module_ActionDao dao)
        {
            foreach (var a in items)
            {
                dao.Add(new Role_Module_Action { ActionID = a.ActionID, ModuleID = a.ModuleID, RoleID = roleid });
            }
        }
        #endregion
    }

    public enum DataAccesssEnum
    {
        Self = 1,
        All = 2,
    }
}
