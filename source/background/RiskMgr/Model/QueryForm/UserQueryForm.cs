using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class UserQueryForm : SimpleQueryForm
    {
        public List<String> IDs { get; set;}
        public List<String> Creators { get; set;}
        public string Password { get; set; }
        
        public UInt64? Enabled { get; set; }
        
    }
}
