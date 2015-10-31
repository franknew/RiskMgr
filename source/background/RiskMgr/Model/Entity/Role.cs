using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Role : SimpleEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string Remark { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string ParentID { get; set; }
        
        /// <summary>
        /// 数据访问权限类型：1.自己和下属部门数据，2.所有数据
        /// </summary>
        public int? DataAccessType { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public int? IsDeleted { get; set; }
        
    }
}