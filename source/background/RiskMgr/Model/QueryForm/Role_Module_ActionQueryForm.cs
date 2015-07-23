using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class Role_Module_ActionQueryForm : BaseQueryForm
    {
        public string RoleID { get; set; }
        
        public string ModuleID { get; set; }
        
        public string ActionID { get; set; }
        
    }
}
