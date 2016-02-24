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
        /// <summary>
        /// 第三方借款人
        /// </summary>
        ThirdParty = 5,
    }

    public enum CustomerAssetType
    {
        /// <summary>
        /// 房产公权人
        /// </summary>
        ShareRight = 1,
        /// <summary>
        /// 配偶
        /// </summary>
        AnotherHalf = 2,
        /// <summary>
        /// 第三方借款人
        /// </summary>
        ThirdParty = 3,

        /// <summary>
        /// 辅助联系人
        /// </summary>
        Asssitant = 4,
        /// <summary>
        /// 房主
        /// </summary>
        Owner = 5,
        /// <summary>
        /// 担保人
        /// </summary>
        Guarantor = 6,
    }
}
