using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public partial class Project : SimpleEntity
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
        /// 索引
        /// </summary>
        public int? Index { get; set; }
        
        /// <summary>
        /// 收取担保费
        /// </summary>
        public decimal? InsuranceFee { get; set; }
        
        /// <summary>
        /// 担保时间
        /// </summary>
        public DateTime? InsuranceTime { get; set; }
        
        /// <summary>
        /// 放款金额
        /// </summary>
        public decimal? ExportMoney { get; set; }
        
        /// <summary>
        /// 放款时间
        /// </summary>
        public DateTime? ExportTime { get; set; }
        
        /// <summary>
        /// 汇款金额
        /// </summary>
        public decimal? ReturnBackMoney { get; set; }
        
        /// <summary>
        /// 汇款时间
        /// </summary>
        public DateTime? ReturnBackTime { get; set; }
        
        /// <summary>
        /// 滞纳金
        /// </summary>
        public decimal? DelayFee { get; set; }
        
        /// <summary>
        /// 滞纳金时间
        /// </summary>
        public DateTime? DelayTime { get; set; }
        
        /// <summary>
        /// 是否有展期费用
        /// </summary>
        public decimal? HasExpired { get; set; }
        
        /// <summary>
        /// 新房产证号
        /// </summary>
        public string NewAssetCode { get; set; }
        
        /// <summary>
        /// 过户人工编号
        /// </summary>
        public string ChangeOwnerManualCode { get; set; }
        
        /// <summary>
        /// 抵押驻点人员
        /// </summary>
        public string MortgagePerson { get; set; }
        
        /// <summary>
        /// 抵押备注说明
        /// </summary>
        public string MortgageRemark { get; set; }
        
        /// <summary>
        /// 解保日期
        /// </summary>
        public DateTime? InsuranceFreeTime { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public int? IsDeleted { get; set; }
        
        /// <summary>
        /// 退款户名
        /// </summary>
        public string RefundName { get; set; }
        
        /// <summary>
        /// 退款账号
        /// </summary>
        public string RefundAccount { get; set; }
        
        /// <summary>
        /// 退款开户行
        /// </summary>
        public string RefundBankName { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public decimal? RefundMoney { get; set; }
        
        /// <summary>
        /// 退款日期
        /// </summary>
        public DateTime? RefundDate { get; set; }
        
        /// <summary>
        /// 出款户名
        /// </summary>
        public string PaymentName { get; set; }
        
        /// <summary>
        /// 出款账号
        /// </summary>
        public string PaymentAccount { get; set; }
        
        /// <summary>
        /// 出款开户行
        /// </summary>
        public string PaymentBankName { get; set; }
        
        /// <summary>
        /// 出款金额
        /// </summary>
        public decimal? PaymentMoney { get; set; }
        
        /// <summary>
        /// 出款日期
        /// </summary>
        public DateTime? PaymentDate { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string ChangeOwnerRemark { get; set; }
        
        /// <summary>
        /// 担保期限
        /// </summary>
        public int? InsurancePeriod { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public int? FinanceConfirm { get; set; }
        
        /// <summary>
        /// 调查报告
        /// </summary>
        public string Report { get; set; }
        
        /// <summary>
        /// 预计回款日期
        /// </summary>
        public DateTime? PredictReturnBackMoneyTime { get; set; }
        
        /// <summary>
        /// 取证日期
        /// </summary>
        public DateTime? PickNumberTime { get; set; }
        
        /// <summary>
        /// 注销日期
        /// </summary>
        public DateTime? LogoutAssetTime { get; set; }
        
        /// <summary>
        /// 过户收文日期
        /// </summary>
        public DateTime? ChangeOwnerReceiptTime { get; set; }
        
        /// <summary>
        /// 过户办文编号
        /// </summary>
        public DateTime? ChangeOwnerHandleTime { get; set; }
        
        /// <summary>
        /// 取新证日期
        /// </summary>
        public DateTime? PickNewAssetCodeTime { get; set; }
        
        /// <summary>
        /// 回款金额2
        /// </summary>
        public decimal? ReturnBackMoney2 { get; set; }
        
        /// <summary>
        /// 回款时间2
        /// </summary>
        public DateTime? ReturnBackTime2 { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string ReturnBackRemark { get; set; }
        
        /// <summary>
        /// 垫资金额
        /// </summary>
        public decimal? CompanyPredepositMoney { get; set; }
        
        /// <summary>
        /// 收费备注
        /// </summary>
        public string ChargeFinanceRemark { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public decimal? RollFee { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public string RollRemark { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public int? GuaranteePeriod { get; set; }
        
        /// <summary>
        /// 滞纳金结束时间
        /// </summary>
        public DateTime? DelayTimeEnd { get; set; }
        
        /// <summary>
        /// 预计出款时间
        /// </summary>
        public DateTime? GuaranteePredictTime { get; set; }
        
    }
}