using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public partial class CreditReceiverInfo : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string ProjectID { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string CreditReceiverBank { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string CreditReceiverAccount { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string CreditReceiverName { get; set; }
        
    }
}