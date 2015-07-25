using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class AddUserServiceForm
    {
        public string ID { get; set; }

        public string Name { get; set; }

        public string CnName { get; set; }

        public string Role { get; set; }

        public string Password { get; set; }

        public int? Enabled { get; set; }
    }
}
