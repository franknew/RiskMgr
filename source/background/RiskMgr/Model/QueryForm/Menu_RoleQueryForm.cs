using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class Menu_RoleQueryForm : BaseQueryForm
    {
        public List<String> IDs { get; set;}
        public string MenuID { get; set; }
        
        public List<String> MenuIDs { get; set;}
        public string RoleID { get; set; }
        
        public List<String> RoleIDs { get; set;}
    }
}
