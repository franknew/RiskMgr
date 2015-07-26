using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class AddUserServiceForm
    {
        public string ID { get; set; }

        /// <summary>
        /// 账号
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///名字
        /// </summary>
        public string CnName { get; set; }

        /// <summary>
        /// 角色ID
        /// </summary>
        public string Role { get; set; }

        public string Password { get; set; }

        public int? Enabled { get; set; }

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
        /// 证件号码
        /// </summary>
        public string Identity { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }
    }
}
