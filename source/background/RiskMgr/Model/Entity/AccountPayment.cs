using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class AccountPayment : Payment
    {
        /// <summary>
        /// 银行类型
        /// </summary>
        public int? BankType { get; set; }

        /// <summary>
        /// 银行名称
        /// </summary>
        public string BankName { get; set; }

        /// <summary>
        /// 银行账号
        /// </summary>
        public string BankAccountCode { get; set; }

        /// <summary>
        /// 付款姓名
        /// </summary>
        public string PayName { get; set; }
    }
}
