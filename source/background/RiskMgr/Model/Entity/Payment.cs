using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Payment : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string BankAccountID { get; set; }
        
        /// <summary>
        /// 支付金额
        /// </summary>
        public decimal? Paid { get; set; }
        
        /// <summary>
        /// 支付时间
        /// </summary>
        public DateTime? PayTime { get; set; }
        
        /// <summary>
        /// 类型：1.支付  0.收款
        /// </summary>
        public int? Type { get; set; }
        
    }
}