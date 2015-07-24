using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class LogonHistory : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string UserID { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string Token { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public DateTime? LogonTime { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string IP { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public DateTime? ActiveTime { get; set; }
        
    }
}