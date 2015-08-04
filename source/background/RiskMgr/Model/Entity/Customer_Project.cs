using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Customer_Project : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string CustomerID { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string ProjectID { get; set; }
        
        /// <summary>
        /// 客户类型 1.买家 2.卖家 3.买家第三方 4.卖家第三方
        /// </summary>
        public int? Type { get; set; }
        
    }
}