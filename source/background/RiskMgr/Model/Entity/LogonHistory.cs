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
        /// 登录时间
        /// </summary>
        public DateTime? LogonTime { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string IP { get; set; }
        
        /// <summary>
        /// 活动时间
        /// </summary>
        public DateTime? ActiveTime { get; set; }
        
    }
}