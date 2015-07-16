using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class User : SimpleEntity
    {
        public string Password { get; set; }
        
        public UInt64? Enabled { get; set; }
        
    }
}