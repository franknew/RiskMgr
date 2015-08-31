using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public enum ActionStatus
    {
        /// <summary>
        /// 可查询
        /// </summary>
        Queryable = 1,
        /// <summary>
        /// 可编辑
        /// </summary>
        Editable = 2,
        /// <summary>
        /// 可审批
        /// </summary>
        Approvalable = 3,
    }

    public enum CustomerType
    {
        Buyer = 1,
        Seller = 2,
    }
}
