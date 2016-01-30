using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RiskMgr.Model;

namespace RiskMgr.Form
{
    public class FinanceConfirmServiceForm
    {
        public string WorkflowID { get; set; }

        public string ActivityID { get; set; }

        public string ID { get; set; }

        public string TaskID { get; set; }

        /// <summary>
        /// 回款金额
        /// </summary>
        public Decimal? ReturnBackMoney { get; set; }

        /// <summary>
        /// 回款日期
        /// </summary>
        public DateTime? ReturnBackTime { get; set; }

        /// <summary>
        /// 回款金额
        /// </summary>
        public Decimal? ReturnBackMoney2 { get; set; }

        /// <summary>
        /// 回款日期
        /// </summary>
        public DateTime? ReturnBackTime2 { get; set; }

        /// <summary>
        /// 退款账号
        /// </summary>
        public string RefundAccount { get; set; }

        /// <summary>
        /// 退款银行
        /// </summary>
        public string RefundBankName { get; set; }

        /// <summary>
        /// 退款日期
        /// </summary>
        public DateTime? RefundDate { get; set; }

        /// <summary>
        /// 退款金额
        /// </summary>
        public decimal? RefundMoney { get; set; }

        /// <summary>
        /// 退款户名
        /// </summary>
        public string RefundName { get; set; }

        /// <summary>
        /// 展期费用
        /// </summary>
        public decimal? RollFee { get; set; }

        /// <summary>
        /// 展期备注
        /// </summary>
        public string RollRemark { get; set; }

        /// <summary>
        /// 滞纳金
        /// </summary>
        public decimal? DelayFee { get; set; }

        /// <summary>
        /// 滞纳金时间
        /// </summary>
        public DateTime? DelayTime { get; set; }

        /// <summary>
        /// 回款备注
        /// </summary>
        public string ReturnBackRemark { get; set; }
    }
}
