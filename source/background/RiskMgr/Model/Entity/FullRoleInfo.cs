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
        /// 录单权限
        /// </summary>
        public bool CanApply { get; set; }

        /// <summary>
        /// 审批权限
        /// </summary>
        public bool CanApproval { get; set; }

        /// <summary>
        /// 管理员工权限
        /// </summary>
        public bool CanManageEmployeeAndAuth { get; set; }

        /// <summary>
        /// 管理客户权限
        /// </summary>
        public bool CanManageCustomer { get; set; }

        /// <summary>
        /// 管理房产权限
        /// </summary>
        public bool CanManageAsset { get; set; }
    }
}
