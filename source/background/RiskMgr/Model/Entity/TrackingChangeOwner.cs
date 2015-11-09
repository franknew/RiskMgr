using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public partial class TrackingChangeOwner : SimpleEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string ProjectID { get; set; }
        
        /// <summary>
        /// 过户办文编号
        /// </summary>
        public string ChangeOwnerProfileCode { get; set; }
        
        /// <summary>
        /// 过户收文日期
        /// </summary>
        public DateTime? ChangeOwnerProfileTime { get; set; }
        
        /// <summary>
        /// 新房产证号
        /// </summary>
        public string NewAssetCode { get; set; }
        
        /// <summary>
        /// 取房产证日期过户说明
        /// </summary>
        public string ChangeOwnerRemark { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public DateTime? NewAssetDate { get; set; }
        
    }
}