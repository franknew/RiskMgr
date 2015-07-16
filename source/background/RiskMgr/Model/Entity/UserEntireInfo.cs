using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class UserEntireInfo
    {
        public User User { get; set; }

        public UserInfo UserInfo { get; set; }

        public List<Role> Role { get; set; }
    }
}
