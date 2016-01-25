using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class AddUserServiceForm : FullUser
    {
        /// <summary>
        /// 角色ID
        /// </summary>
        public List<string> RoleIDList { get; set; }
    }
}
