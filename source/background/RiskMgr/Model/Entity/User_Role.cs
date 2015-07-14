using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Model
{
    public class User_Role : SimpleEntity
    {
        public string UserID { get; set; }
        
        public string RoleID { get; set; }
        
    }
}