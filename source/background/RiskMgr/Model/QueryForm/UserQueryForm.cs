using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Form
{
    public class UserQueryForm : BaseQueryForm
    {
        public string Password { get; set; }
        
        public Boolean? Enabled { get; set; }
        
    }
}
