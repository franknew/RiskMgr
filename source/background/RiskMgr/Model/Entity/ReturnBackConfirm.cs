using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public partial class ReturnBackConfirm : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string ProjectID { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public decimal? ReturnBackMoney { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public DateTime? ReturnBackTime { get; set; }
        
    }
}