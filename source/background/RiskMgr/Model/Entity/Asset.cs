using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Asset : SimpleEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public string Remark { get; set; }
        
        /// <summary>
        /// 资产类型.1:房产 
        /// </summary>
        public int? Type { get; set; }
        
        /// <summary>
        /// 用途。1:自主 2:租赁 
        /// </summary>
        public int? Usage { get; set; }
        
        /// <summary>
        /// 所在区域
        /// </summary>
        public string Position { get; set; }
        
        /// <summary>
        /// 地址
        /// </summary>
        public string Address { get; set; }
        
        /// <summary>
        /// 资产编号
        /// </summary>
        public string Code { get; set; }
        
        /// <summary>
        ///  面积
        /// </summary>
        public decimal? Area { get; set; }
        
        /// <summary>
        /// 登记价格
        /// </summary>
        public decimal? RegPrice { get; set; }
        
        /// <summary>
        /// 办理事项
        /// </summary>
        public int? IssueType { get; set; }
        
        /// <summary>
        /// 是否交易
        /// </summary>
        public int? IsTraded { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public int? Eanbled { get; set; }
        
        /// <summary>
        /// 评估过户总价
        /// </summary>
        public decimal? ChangeOwnerPrice { get; set; }
        
    }
}