using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class FullRoleInfo : Role
    {
        /// <summary>
        /// 父角色名称
        /// </summary>
        public string ParentRoleName { get; set; }

        /// <summary>
        /// 权限列表
        /// </summary>
        public List<AuthorityNodeForCheck> Authority { get; set; }
    }
}
