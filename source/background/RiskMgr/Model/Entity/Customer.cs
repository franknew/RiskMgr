using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public partial class Customer : SimpleEntity
    {
        /// <summary>
        /// 性别
        /// </summary>
        public int? Gender { get; set; }
        
        /// <summary>
        /// 婚姻状况
        /// </summary>
        public int? Marrage { get; set; }
        
        /// <summary>
        /// 证件类型
        /// </summary>
        public int? CardType { get; set; }
        
        /// <summary>
        /// 证件号码
        /// </summary>
        public string IdentityCode { get; set; }
        
        /// <summary>
        /// 电话
        /// </summary>
        public string Phone { get; set; }
        
        /// <summary>
        /// 曾用名
        /// </summary>
        public string OrignalName { get; set; }
        
        /// <summary>
        /// 曾用号码
        /// </summary>
        public string OrignalIdentityCode { get; set; }
        
        /// <summary>
        /// 银行类型
        /// </summary>
        public string BankType { get; set; }
        
        /// <summary>
        /// 银行账号
        /// </summary>
        public string BankCode { get; set; }
        
        /// <summary>
        /// 地址
        /// </summary>
        public string Address { get; set; }
        
        /// <summary>
        /// 单位
        /// </summary>
        public string WorkUnit { get; set; }
        
        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public int? Enabled { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public int? IsDeleted { get; set; }
        
    }
}