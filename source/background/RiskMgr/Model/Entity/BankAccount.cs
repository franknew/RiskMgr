using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class BankAccount : SimpleEntity
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
        /// 
        /// </summary>
        public string LastUpdater { get; set; }
        
    }
}