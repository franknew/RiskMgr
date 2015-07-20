using SOAFramework.Library.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class FullUser : SimpleEntity
    {
        public int? Enabled { get; set; }

        public string Password { get; set; }

        public string QQ { get; set; }

        public string Mobile { get; set; }

        public string WX { get; set; }

        public string Address { get; set; }
    }
}
