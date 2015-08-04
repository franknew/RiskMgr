using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class Project : SimpleEntity
    {
        /// <summary>
        /// 额度申请类型1.二手楼买卖 2.首期垫付 3.现金赎楼 4.红本抵押
        /// </summary>
        public int? Type { get; set; }
        
        /// <summary>
        /// 来源
        /// </summary>
        public int? Source { get; set; }
        
        /// <summary>
        /// 中介名称
        /// </summary>
        public string AgentName { get; set; }
        
        /// <summary>
        /// 公证书日期
        /// </summary>
        public DateTime? CertificateData { get; set; }
        
        /// <summary>
        /// 中介联系人
        /// </summary>
        public string AgentContact { get; set; }
        
        /// <summary>
        /// 返佣人
        /// </summary>
        public string Rebater { get; set; }
        
        /// <summary>
        /// 返佣账号
        /// </summary>
        public string RebateAccount { get; set; }
        
        /// <summary>
        /// 其他返佣信息
        /// </summary>
        public string OtherRebateInfo { get; set; }
        
        /// <summary>
        /// 原按揭银行
        /// </summary>
        public string OrignalMortgageBank { get; set; }
        
        /// <summary>
        /// 原按揭银行支行
        /// </summary>
        public string OrignalMortgageBranch { get; set; }
        
        /// <summary>
        /// 原贷款公积金中心
        /// </summary>
        public string OrignalFundCenter { get; set; }
        
        /// <summary>
        /// 公积金银行支行
        /// </summary>
        public string OrignalFundBranch { get; set; }
        
        /// <summary>
        /// 是否提供供楼卡复印件
        /// </summary>
        public int? SupplyCardCopy { get; set; }
        
        /// <summary>
        /// 原贷款本息
        /// </summary>
        public decimal? OrignalCreditPI { get; set; }
        
        /// <summary>
        /// 原贷款商业金额
        /// </summary>
        public decimal? OrignalCreditCommerceMoney { get; set; }
        
        /// <summary>
        /// 原贷款公积金金额
        /// </summary>
        public decimal? OrignalCreditFundMoney { get; set; }
        
        /// <summary>
        /// 赎楼客户经理
        /// </summary>
        public string AssetRansomCustomerManager { get; set; }
        
        /// <summary>
        /// 赎楼联系电话
        /// </summary>
        public string AssetRansomContactPhone { get; set; }
        
        /// <summary>
        /// 新贷款银行
        /// </summary>
        public string NewCreditBank { get; set; }
        
        /// <summary>
        /// 新贷款银行支行
        /// </summary>
        public string NewCreditBranch { get; set; }
        
        /// <summary>
        /// 短期赎楼贷款银行
        /// </summary>
        public string ShortTermAssetRansomBank { get; set; }
        
        /// <summary>
        /// 短期赎楼贷款银行支行
        /// </summary>
        public string ShortTermAssetRansomBranch { get; set; }
        
        /// <summary>
        /// 担保金额
        /// </summary>
        public decimal? GuaranteeMoney { get; set; }
        
        /// <summary>
        /// 担保期限
        /// </summary>
        public int? GuaranteeMonth { get; set; }
        
        /// <summary>
        /// 买方贷款商业金额
        /// </summary>
        public decimal? BuyerCreditCommerceMoney { get; set; }
        
        /// <summary>
        /// 买方贷款公积金金额
        /// </summary>
        public decimal? BuyerCreditFundMoney { get; set; }
        
        /// <summary>
        /// 贷款放款金额
        /// </summary>
        public decimal? LoanMoney { get; set; }
        
        /// <summary>
        /// 成交金额
        /// </summary>
        public decimal? DealMoney { get; set; }
        
        /// <summary>
        /// 交易定金
        /// </summary>
        public decimal? EarnestMoney { get; set; }
        
        /// <summary>
        /// 监管资金
        /// </summary>
        public decimal? SupervisionMoney { get; set; }
        
        /// <summary>
        /// 资金监管银行
        /// </summary>
        public string SupervisionBank { get; set; }
        
        /// <summary>
        /// 赎楼金额
        /// </summary>
        public decimal? AssetRansomMoney { get; set; }
        
        /// <summary>
        /// 客户预存款
        /// </summary>
        public decimal? CustomerPredepositMoney { get; set; }
        
        /// <summary>
        /// 贷款接收姓名
        /// </summary>
        public string CreditReceiverName { get; set; }
        
        /// <summary>
        /// 贷款接收银行-支行
        /// </summary>
        public string CreditReceiverBank { get; set; }
        
        /// <summary>
        /// 贷款接收账号
        /// </summary>
        public string CreditReceiverAccount { get; set; }
        
        /// <summary>
        /// 工行托管账号
        /// </summary>
        public string TrusteeshipAccount { get; set; }
        
        /// <summary>
        /// 预计赎楼金额
        /// </summary>
        public decimal? AssetRansomPredictMoney { get; set; }
        
        /// <summary>
        /// 赎楼员
        /// </summary>
        public string AssetRansomer { get; set; }
        
        /// <summary>
        /// 赎楼方式
        /// </summary>
        public int? AssetRansomType { get; set; }
        
        /// <summary>
        /// 预存时间
        /// </summary>
        public int? PredictDays { get; set; }
        
        /// <summary>
        /// 收费方式
        /// </summary>
        public int? ChargeType { get; set; }
        
        /// <summary>
        /// 申请支票数量及限额
        /// </summary>
        public string CheckNumbersAndLimit { get; set; }
        
        /// <summary>
        /// 驻点人员
        /// </summary>
        public string Stagnationer { get; set; }
        
    }
}