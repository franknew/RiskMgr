using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RiskMgr.Model;

namespace RiskMgr.Form
{
    public class AddRoleServiceForm : Role
    {
        /// <summary>
        /// 录单权限
        /// </summary>
        public bool? CanApply { get; set; }

        /// <summary>
        /// 审批权限
        /// </summary>
        public bool? CanApproval { get; set; }

        /// <summary>
        /// 管理员工权限
        /// </summary>
        public bool? CanManageEmployeeAndAuth { get; set; }

        /// <summary>
        /// 管理客户权限
        /// </summary>
        public bool? CanManageCustomer { get; set; }

        /// <summary>
        /// 管理房产权限
        /// </summary>
        public bool? CanManageAsset { get; set; }
    }
}
