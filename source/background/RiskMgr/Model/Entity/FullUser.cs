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

        /// <summary>
        /// qq
        /// </summary>
        public string QQ { get; set; }

        /// <summary>
        /// 手机
        /// </summary>
        public string Mobile { get; set; }

        /// <summary>
        /// 微信
        /// </summary>
        public string WX { get; set; }

        /// <summary>
        /// 地址
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// 中文名
        /// </summary>
        public string CnName { get; set; }

        /// <summary>
        /// 证件号码
        /// </summary>
        public string Identity { get; set; }

        public string Remark { get; set; }

        public string Role
        {
            get
            {
                string role = "";
                if (RoleList != null)
                {
                    var rolenamelist = (from r in RoleList select r.Name).ToList();
                    role = String.Join(",", rolenamelist);
                }
                return role;
            }
        }

        public List<Role> RoleList { get; set; }
    }
}
