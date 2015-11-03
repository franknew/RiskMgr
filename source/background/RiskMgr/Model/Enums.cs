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
        /// <summary>
        /// 买家
        /// </summary>
        Buyer = 1,
        /// <summary>
        /// 卖家
        /// </summary>
        Seller = 2,
        /// <summary>
        /// 第三方
        /// </summary>
        Joint = 3,

        /// <summary>
        /// 共权人
        /// </summary>
        Guarantor = 4,
    }

    public enum CustomerAssetType
    {
        /// <summary>
        /// 房主
        /// </summary>
        Owner = 1,
        /// <summary>
        /// 共权人
        /// </summary>
        Guarantor = 2,
    }
}
