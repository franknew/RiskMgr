using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class UserInfo : BaseEntity
    {
        /// <summary>
        /// 
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
        /// 名字
        /// </summary>
        public string CnName { get; set; }
        
        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }
        
    }
}