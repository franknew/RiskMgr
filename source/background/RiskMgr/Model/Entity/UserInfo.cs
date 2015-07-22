using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class UserInfo : BaseEntity
    {
        public string QQ { get; set; }
        
        public string Mobile { get; set; }
        
        public string WX { get; set; }
        
        public string Address { get; set; }

        public string Identity { get; set; }
        
    }
}