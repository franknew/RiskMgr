using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RiskMgr.Model;

namespace RiskMgr.Form
{
    public class LogonResultForm
    {
        public string token { get; set; }

        public List<Menu> Menu { get; set; }

        public UserInfo UserInfo { get; set; }
    }
}
