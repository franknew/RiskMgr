using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class FullProject : Project
    {
        /// <summary>
        /// 过户办文编号
        /// </summary>
        public string ChangeOwnerProfileCode { get; set; }

        /// <summary>
        /// 过户收文日期
        /// </summary>
        public DateTime? ChangeOwnerProfileTime { get; set; }

        /// <summary>
        /// 新房产证号
        /// </summary>
        public string NewAssetCode { get; set; }

        /// <summary>
        /// 取房产证日期过户说明
        /// </summary>
        public string ChangeOwnerRemark { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public DateTime? NewAssetDate { get; set; }

        /// <summary>
        /// 抵押回执编号
        /// </summary>
        public string MortgageFeedbackCode { get; set; }

        /// <summary>
        /// 抵押收文日期
        /// </summary>
        public DateTime? MortgagePredictTime { get; set; }

        /// <summary>
        /// 预计完成日解保日期
        /// </summary>
        public DateTime? MortgageOverTime { get; set; }

        /// <summary>
        /// 回款信息
        /// </summary>
        public List<ReturnBackConfirm> ReturnBackMoneyInfo { get; set; }

        public List<CreditReceiverInfo> CreditReceiverInfo { get; set; }
    }
}
