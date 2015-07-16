using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class RoleUpdateForm : SimpleUpdateForm<Role>
    {
        public RoleQueryForm RoleQueryForm { get; set; }
    }
}