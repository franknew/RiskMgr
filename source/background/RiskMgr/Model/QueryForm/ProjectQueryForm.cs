using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class ProjectQueryForm : SimpleQueryForm
    {
        public List<String> IDs { get; set;}
        public List<String> Creators { get; set;}
        public Int32? Type { get; set; }
        
        public Int32? Type_Start { get; set; }
        
        public Int32? Type_End { get; set; }
        
        public Int32? Source { get; set; }
        
        public Int32? Source_Start { get; set; }
        
        public Int32? Source_End { get; set; }
        
        public string AgentName { get; set; }
        
        public DateTime? CertificateData { get; set; }
        
        public DateTime? CertificateData_Start { get; set; }
        
        public DateTime? CertificateData_End { get; set; }
        
        public string AgentContact { get; set; }
        
        public string Rebater { get; set; }
        
        public string RebateAccount { get; set; }
        
        public string OtherRebateInfo { get; set; }
        
        public string OrignalMortgageBank { get; set; }
        
        public string OrignalMortgageBranch { get; set; }
        
        public string OrignalFundCenter { get; set; }
        
        public string OrignalFundBranch { get; set; }
        
        public Decimal? OrignalCreditCommerceMoney { get; set; }
        
        public Decimal? OrignalCreditCommerceMoney_Start { get; set; }
        
        public Decimal? OrignalCreditCommerceMoney_End { get; set; }
        
        public Decimal? OrignalCreditFundMoney { get; set; }
        
        public Decimal? OrignalCreditFundMoney_Start { get; set; }
        
        public Decimal? OrignalCreditFundMoney_End { get; set; }
        
        public string AssetRansomCustomerManager { get; set; }
        
        public string AssetRansomContactPhone { get; set; }
        
        public string NewCreditBank { get; set; }
        
        public string NewCreditBranch { get; set; }
        
        public Int32? GuaranteeMonth { get; set; }
        
        public Int32? GuaranteeMonth_Start { get; set; }
        
        public Int32? GuaranteeMonth_End { get; set; }
        
        public Decimal? BuyerCreditCommerceMoney { get; set; }
        
        public Decimal? BuyerCreditCommerceMoney_Start { get; set; }
        
        public Decimal? BuyerCreditCommerceMoney_End { get; set; }
        
        public Decimal? BuyerCreditFundMoney { get; set; }
        
        public Decimal? BuyerCreditFundMoney_Start { get; set; }
        
        public Decimal? BuyerCreditFundMoney_End { get; set; }
        
        public Decimal? DealMoney { get; set; }
        
        public Decimal? DealMoney_Start { get; set; }
        
        public Decimal? DealMoney_End { get; set; }
        
        public Decimal? EarnestMoney { get; set; }
        
        public Decimal? EarnestMoney_Start { get; set; }
        
        public Decimal? EarnestMoney_End { get; set; }
        
        public Decimal? SupervisionMoney { get; set; }
        
        public Decimal? SupervisionMoney_Start { get; set; }
        
        public Decimal? SupervisionMoney_End { get; set; }
        
        public string SupervisionBank { get; set; }
        
        public Decimal? AssetRansomMoney { get; set; }
        
        public Decimal? AssetRansomMoney_Start { get; set; }
        
        public Decimal? AssetRansomMoney_End { get; set; }
        
        public Decimal? CustomerPredepositMoney { get; set; }
        
        public Decimal? CustomerPredepositMoney_Start { get; set; }
        
        public Decimal? CustomerPredepositMoney_End { get; set; }
        
        public string CreditReceiverName { get; set; }
        
        public string CreditReceiverBank { get; set; }
        
        public string CreditReceiverAccount { get; set; }
        
        public Int32? AssetRansomType { get; set; }
        
        public Int32? AssetRansomType_Start { get; set; }
        
        public Int32? AssetRansomType_End { get; set; }
        
        public Int32? PredictDays { get; set; }
        
        public Int32? PredictDays_Start { get; set; }
        
        public Int32? PredictDays_End { get; set; }
        
        public Int32? ChargeType { get; set; }
        
        public Int32? ChargeType_Start { get; set; }
        
        public Int32? ChargeType_End { get; set; }
        
        public Int32? Index { get; set; }
        
        public Int32? Index_Start { get; set; }
        
        public Int32? Index_End { get; set; }
        
        public Decimal? InsuranceFee { get; set; }
        
        public Decimal? InsuranceFee_Start { get; set; }
        
        public Decimal? InsuranceFee_End { get; set; }
        
        public DateTime? InsuranceTime { get; set; }
        
        public DateTime? InsuranceTime_Start { get; set; }
        
        public DateTime? InsuranceTime_End { get; set; }
        
        public Decimal? ExportMoney { get; set; }
        
        public Decimal? ExportMoney_Start { get; set; }
        
        public Decimal? ExportMoney_End { get; set; }
        
        public DateTime? ExportTime { get; set; }
        
        public DateTime? ExportTime_Start { get; set; }
        
        public DateTime? ExportTime_End { get; set; }
        
        public Decimal? ReturnBackMoney { get; set; }
        
        public Decimal? ReturnBackMoney_Start { get; set; }
        
        public Decimal? ReturnBackMoney_End { get; set; }
        
        public DateTime? ReturnBackTime { get; set; }
        
        public DateTime? ReturnBackTime_Start { get; set; }
        
        public DateTime? ReturnBackTime_End { get; set; }
        
        public Decimal? DelayFee { get; set; }
        
        public Decimal? DelayFee_Start { get; set; }
        
        public Decimal? DelayFee_End { get; set; }
        
        public DateTime? DelayTime { get; set; }
        
        public DateTime? DelayTime_Start { get; set; }
        
        public DateTime? DelayTime_End { get; set; }
        
        public Decimal? HasExpired { get; set; }
        
        public Decimal? HasExpired_Start { get; set; }
        
        public Decimal? HasExpired_End { get; set; }
        
        public string NewAssetCode { get; set; }
        
        public string ChangeOwnerManualCode { get; set; }
        
        public string MortgagePerson { get; set; }
        
        public string MortgageRemark { get; set; }
        
        public DateTime? InsuranceFreeTime { get; set; }
        
        public DateTime? InsuranceFreeTime_Start { get; set; }
        
        public DateTime? InsuranceFreeTime_End { get; set; }
        
        public UInt64? IsDeleted { get; set; }
        
        public string RefundName { get; set; }
        
        public string RefundAccount { get; set; }
        
        public string RefundBankName { get; set; }
        
        public Decimal? RefundMoney { get; set; }
        
        public Decimal? RefundMoney_Start { get; set; }
        
        public Decimal? RefundMoney_End { get; set; }
        
        public DateTime? RefundDate { get; set; }
        
        public DateTime? RefundDate_Start { get; set; }
        
        public DateTime? RefundDate_End { get; set; }
        
        public string PaymentName { get; set; }
        
        public string PaymentAccount { get; set; }
        
        public string PaymentBankName { get; set; }
        
        public Decimal? PaymentMoney { get; set; }
        
        public Decimal? PaymentMoney_Start { get; set; }
        
        public Decimal? PaymentMoney_End { get; set; }
        
        public DateTime? PaymentDate { get; set; }
        
        public DateTime? PaymentDate_Start { get; set; }
        
        public DateTime? PaymentDate_End { get; set; }
        
        public string ChangeOwnerRemark { get; set; }
        
        public Int32? InsurancePeriod { get; set; }
        
        public Int32? InsurancePeriod_Start { get; set; }
        
        public Int32? InsurancePeriod_End { get; set; }
        
        public UInt64? FinanceConfirm { get; set; }
        
        public string Report { get; set; }
        
        public DateTime? PredictReturnBackMoneyTime { get; set; }
        
        public DateTime? PredictReturnBackMoneyTime_Start { get; set; }
        
        public DateTime? PredictReturnBackMoneyTime_End { get; set; }
        
        public DateTime? PickNumberTime { get; set; }
        
        public DateTime? PickNumberTime_Start { get; set; }
        
        public DateTime? PickNumberTime_End { get; set; }
        
        public DateTime? LogoutAssetTime { get; set; }
        
        public DateTime? LogoutAssetTime_Start { get; set; }
        
        public DateTime? LogoutAssetTime_End { get; set; }
        
        public DateTime? ChangeOwnerReceiptTime { get; set; }
        
        public DateTime? ChangeOwnerReceiptTime_Start { get; set; }
        
        public DateTime? ChangeOwnerReceiptTime_End { get; set; }
        
        public DateTime? ChangeOwnerHandleTime { get; set; }
        
        public DateTime? ChangeOwnerHandleTime_Start { get; set; }
        
        public DateTime? ChangeOwnerHandleTime_End { get; set; }
        
        public DateTime? PickNewAssetCodeTime { get; set; }
        
        public DateTime? PickNewAssetCodeTime_Start { get; set; }
        
        public DateTime? PickNewAssetCodeTime_End { get; set; }
        
        public Decimal? ReturnBackMoney2 { get; set; }
        
        public Decimal? ReturnBackMoney2_Start { get; set; }
        
        public Decimal? ReturnBackMoney2_End { get; set; }
        
        public DateTime? ReturnBackTime2 { get; set; }
        
        public DateTime? ReturnBackTime2_Start { get; set; }
        
        public DateTime? ReturnBackTime2_End { get; set; }
        
        public string ReturnBackRemark { get; set; }
        
        public Decimal? CompanyPredepositMoney { get; set; }
        
        public Decimal? CompanyPredepositMoney_Start { get; set; }
        
        public Decimal? CompanyPredepositMoney_End { get; set; }
        
        public string ChargeFinanceRemark { get; set; }
        
        public Decimal? RollFee { get; set; }
        
        public Decimal? RollFee_Start { get; set; }
        
        public Decimal? RollFee_End { get; set; }
        
        public string RollRemark { get; set; }
        
        public Int32? GuaranteePeriod { get; set; }
        
        public Int32? GuaranteePeriod_Start { get; set; }
        
        public Int32? GuaranteePeriod_End { get; set; }
        
        public DateTime? DelayTimeEnd { get; set; }
        
        public DateTime? DelayTimeEnd_Start { get; set; }
        
        public DateTime? DelayTimeEnd_End { get; set; }
        
        public DateTime? GuaranteePredictTime { get; set; }
        
        public DateTime? GuaranteePredictTime_Start { get; set; }
        
        public DateTime? GuaranteePredictTime_End { get; set; }
        
    }
}
