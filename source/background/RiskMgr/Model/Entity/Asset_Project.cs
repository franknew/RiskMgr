using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Asset_Project : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string AssetID { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string ProjectID { get; set; }
        
    }
}