using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class LogonHistory : BaseEntity
    {
        public string UserID { get; set; }
        
        public string Token { get; set; }
        
        public DateTime? LogonTime { get; set; }
        
        public string IP { get; set; }

        public DateTime? ActiveTime { get; set; }
    }
}