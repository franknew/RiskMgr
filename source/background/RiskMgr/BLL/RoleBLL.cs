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
            var modules = TableCacheHelper.GetDataFromCache<Module>(typeof(ModuleDao));
            var actions = TableCacheHelper.GetDataFromCache<Model.Action>(typeof(ActionDao));
            var rmas = rmadao.Query(new Role_Module_ActionQueryForm { });
            var assetauth = modules.Find(t => t.Name.Equals("RiskMgr.AssetApi"));
            var projectauth = modules.Find(t => t.Name.Equals("RiskMgr.ProjectApi"));
            var userauth = modules.Find(t => t.Name.Equals("RiskMgr.UserApi"));
            var customerauth = modules.Find(t => t.Name.Equals("RiskMgr.CustomerApi"));
            var manageractions = actions.FindAll(t => t.Name.Equals("edit") || t.Name.Equals("query") || t.Name.Equals("delete"));
            foreach (var role in roles)
            {
                var data = role.ConvertTo<FullRoleInfo>();
                var parentrole = roles.Find(t => t.ID == role.ParentID);
                if (parentrole != null) data.ParentRoleName = parentrole.Name;
                #region 查询权限
                var edit = actions.Find(t => t.Name.Equals("edit"));
                if (projectauth != null)
                {
                    var approval = actions.Find(t => t.Name.Equals("approval"));
                    if (rmas.Exists(t => t.ModuleID == projectauth.ID && t.RoleID == role.ID && t.ActionID == edit.ID)) data.CanApply = true;
                    if (rmas.Exists(t => t.ModuleID == projectauth.ID && t.RoleID == role.ID && t.ActionID == approval.ID)) data.CanApproval = true;
                }
                if (userauth != null)
                {
                    if (rmas.Exists(t => t.ModuleID == userauth.ID && t.RoleID == role.ID && t.ActionID == edit.ID)) data.CanManageEmployeeAndAuth = true;
                }
                if (customerauth != null)
                {
                    if (rmas.Exists(t => t.ModuleID == customerauth.ID && t.RoleID == role.ID && t.ActionID == edit.ID)) data.CanManageCustomer = true;
                }
                if (assetauth != null)
                {
                    if (rmas.Exists(t => t.ModuleID == assetauth.ID && t.RoleID == role.ID && t.ActionID == edit.ID)) data.CanManageAsset = true;
                }
                #endregion
                result.Add(data);
            }
            return result;
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

        private void AddRoleAuth(ISqlMapper mapper, AddRoleServiceForm form, string id)
        {
            #region 权限新增
            //权限操作
            Role_Module_ActionDao rmadao = new Role_Module_ActionDao(mapper);
            List<Module> modules = TableCacheHelper.GetDataFromCache<Module>(typeof(ModuleDao));
            List<Model.Action> actions = TableCacheHelper.GetDataFromCache<Model.Action>(typeof(ActionDao));
            var projectauth = modules.Find(t => t.Name.Equals("RiskMgr.ProjectApi"));
            var manageractions = actions.FindAll(t => t.Name.Equals("edit") || t.Name.Equals("delete"));
            var approval = actions.Find(t => t.Name.Equals("approval"));
            var assetauth = modules.Find(t => t.Name.Equals("RiskMgr.AssetApi"));
            var customerauth = modules.Find(t => t.Name.Equals("RiskMgr.CustomerApi"));
            //删除旧的权限
            rmadao.Delete(new Role_Module_ActionQueryForm { RoleID = id });
            //默认用户资产和客户的查询权限
            var queryaction = actions.Find(t => t.Name.Equals("query"));
            AddAuth(new List<Model.Action> { queryaction }, assetauth, id, rmadao);
            AddAuth(new List<Model.Action> { queryaction }, customerauth, id, rmadao);
            if (form.CanApply.HasValue && form.CanApply.Value)
            {
                var edit = actions.Find(t => t.Name.Equals("edit"));
                AddAuth(new List<Model.Action> { edit }, projectauth, id, rmadao);
            }
            //新增额度审批权限
            if (form.CanApproval.HasValue && form.CanApproval.Value) AddAuth(new List<Model.Action> { approval }, projectauth, id, rmadao);
            //新增资产管理权限
            if (form.CanManageAsset.HasValue && form.CanManageAsset.Value) AddAuth(manageractions, assetauth, id, rmadao);
            //新增客户管理权限
            if (form.CanManageCustomer.HasValue && form.CanManageCustomer.Value) AddAuth(manageractions, customerauth, id, rmadao);
            //新增员工和权限管理权限
            if (form.CanManageEmployeeAndAuth.HasValue && form.CanManageEmployeeAndAuth.Value)
            {
                var userauth = modules.Find(t => t.Name.Equals("RiskMgr.UserApi"));
                var roleauth = modules.Find(t => t.Name.Equals("RiskMgr.RoleApi"));
                AddAuth(manageractions, userauth, id, rmadao);
                AddAuth(manageractions, roleauth, id, rmadao);
            }
            #endregion
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

        private void AddAuth(List<Model.Action> actions, Module module, string roleid, Role_Module_ActionDao dao)
        {
            if (module == null) return;
            foreach (var a in actions)
            {
                dao.Add(new Role_Module_Action { ActionID = a.ID, ModuleID = module.ID, RoleID = roleid });
            }
        }
    }

    public enum DataAccesssEnum
    {
        Self = 1,
        All = 2,
    }
}
