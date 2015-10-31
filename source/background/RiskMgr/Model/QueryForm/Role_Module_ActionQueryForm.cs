using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class Role_Module_ActionQueryForm : BaseQueryForm
    {
        public List<String> IDs { get; set;}
        public string RoleID { get; set; }
        
        public List<String> RoleIDs { get; set;}
        public string ModuleID { get; set; }
        
        public List<String> ModuleIDs { get; set;}
        public string ActionID { get; set; }
        
        public List<String> ActionIDs { get; set;}
    }
}
