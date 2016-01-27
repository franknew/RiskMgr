using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RiskMgr.Model;

namespace RiskMgr.Form
{
    public class AddRoleServiceForm : Role
    {
        public List<AuthorityNodeForCheck> Authority { get; set; }
    }
}
