using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class UserInitResultForm
    {
        /// <summary>
        /// 带分页信息的用户列表
        /// </summary>
        public PagingEntity<FullUser> User { get; set; }

        public List<Role> Role { get; set; }
    }
}
