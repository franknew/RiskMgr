using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.Model
{
    public class UserInfo : SimpleEntity
    {
        public string QQ { get; set; }
        
        public string Mobile { get; set; }
        
        public string WX { get; set; }
        
        public string Address { get; set; }
        
    }
}