using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Menu : SimpleEntity
    {
        /// <summary>
        /// 页面
        /// </summary>
        public string Page { get; set; }
        
        /// <summary>
        /// 父节点ID
        /// </summary>
        public string ParentID { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public int? Enabled { get; set; }
        
        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }
        
        /// <summary>
        /// 图片路径
        /// </summary>
        public string ImagePath { get; set; }
        
    }
}