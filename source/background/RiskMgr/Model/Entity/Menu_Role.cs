using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Menu_Role : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string MenuID { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string RoleID { get; set; }
        
    }
}