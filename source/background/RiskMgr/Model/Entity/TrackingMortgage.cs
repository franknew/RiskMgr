using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public partial class TrackingMortgage : SimpleEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string ProjectID { get; set; }
        
        /// <summary>
        /// 抵押回执编号
        /// </summary>
        public string MortgageFeedbackCode { get; set; }
        
        /// <summary>
        /// 抵押收文日期
        /// </summary>
        public DateTime? MortgageFeedbackTime { get; set; }
        
        /// <summary>
        /// 预计完成日解保日期
        /// </summary>
        public DateTime? MortgagePredictCompleteTime { get; set; }
        
    }
}