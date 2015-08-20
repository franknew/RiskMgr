using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Customer_Asset : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string CustomerID { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string AssetID { get; set; }
        
        /// <summary>
        /// 1.房主 2.公权人
        /// </summary>
        public int? Type { get; set; }
        
    }
}