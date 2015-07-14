using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Model
{
    public class User : SimpleEntity
    {
        public string Password { get; set; }
        
        public Boolean? Enabled { get; set; }
        
    }
}