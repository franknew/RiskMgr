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
        
        public Int32? Source { get; set; }
        
        public string AgentName { get; set; }
        
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
        
        public UInt64? SupplyCardCopy { get; set; }
        
        public DateTime? OrignalCreditPI_Start { get; set; }
        
        public DateTime? OrignalCreditPI_End { get; set; }
        
        public DateTime? OrignalCreditCommerceMoney_Start { get; set; }
        
        public DateTime? OrignalCreditCommerceMoney_End { get; set; }
        
        public DateTime? OrignalCreditFundMoney_Start { get; set; }
        
        public DateTime? OrignalCreditFundMoney_End { get; set; }
        
        public string AssetRansomCustomerManager { get; set; }
        
        public string AssetRansomContactPhone { get; set; }
        
        public string NewCreditBank { get; set; }
        
        public string NewCreditBranch { get; set; }
        
        public string ShortTermAssetRansomBank { get; set; }
        
        public string ShortTermAssetRansomBranch { get; set; }
        
        public DateTime? GuaranteeMoney_Start { get; set; }
        
        public DateTime? GuaranteeMoney_End { get; set; }
        
        public Int32? GuaranteeMonth { get; set; }
        
        public DateTime? BuyerCreditCommerceMoney_Start { get; set; }
        
        public DateTime? BuyerCreditCommerceMoney_End { get; set; }
        
        public DateTime? BuyerCreditFundMoney_Start { get; set; }
        
        public DateTime? BuyerCreditFundMoney_End { get; set; }
        
        public DateTime? LoanMoney_Start { get; set; }
        
        public DateTime? LoanMoney_End { get; set; }
        
        public DateTime? DealMoney_Start { get; set; }
        
        public DateTime? DealMoney_End { get; set; }
        
        public DateTime? EarnestMoney_Start { get; set; }
        
        public DateTime? EarnestMoney_End { get; set; }
        
        public DateTime? SupervisionMoney_Start { get; set; }
        
        public DateTime? SupervisionMoney_End { get; set; }
        
        public string SupervisionBank { get; set; }
        
        public DateTime? AssetRansomMoney_Start { get; set; }
        
        public DateTime? AssetRansomMoney_End { get; set; }
        
        public DateTime? CustomerPredepositMoney_Start { get; set; }
        
        public DateTime? CustomerPredepositMoney_End { get; set; }
        
        public string CreditReceiverName { get; set; }
        
        public string CreditReceiverBank { get; set; }
        
        public string CreditReceiverAccount { get; set; }
        
        public string TrusteeshipAccount { get; set; }
        
        public DateTime? AssetRansomPredictMoney_Start { get; set; }
        
        public DateTime? AssetRansomPredictMoney_End { get; set; }
        
        public string AssetRansomer { get; set; }
        
        public Int32? AssetRansomType { get; set; }
        
        public Int32? PredictDays { get; set; }
        
        public Int32? ChargeType { get; set; }
        
        public string CheckNumbersAndLimit { get; set; }
        
        public string Stagnationer { get; set; }
        
        public Int32? Index { get; set; }
        
        public DateTime? InsuranceFee_Start { get; set; }
        
        public DateTime? InsuranceFee_End { get; set; }
        
        public DateTime? InsuranceTime_Start { get; set; }
        
        public DateTime? InsuranceTime_End { get; set; }
        
        public DateTime? ExportMoney_Start { get; set; }
        
        public DateTime? ExportMoney_End { get; set; }
        
        public DateTime? ExportTime_Start { get; set; }
        
        public DateTime? ExportTime_End { get; set; }
        
        public DateTime? ReturnBackMoney_Start { get; set; }
        
        public DateTime? ReturnBackMoney_End { get; set; }
        
        public DateTime? ReturnBackTime_Start { get; set; }
        
        public DateTime? ReturnBackTime_End { get; set; }
        
        public DateTime? DelayFee_Start { get; set; }
        
        public DateTime? DelayFee_End { get; set; }
        
        public DateTime? DelayTime_Start { get; set; }
        
        public DateTime? DelayTime_End { get; set; }
        
        public DateTime? HasExpired_Start { get; set; }
        
        public DateTime? HasExpired_End { get; set; }
        
        public string NewAssetCode { get; set; }
        
        public string ChangeOwnerManualCode { get; set; }
        
        public string MortgagePerson { get; set; }
        
        public string MortgageRemark { get; set; }
        
        public DateTime? InsuranceFreeTime_Start { get; set; }
        
        public DateTime? InsuranceFreeTime_End { get; set; }
        
        public UInt64? IsDeleted { get; set; }
        
        public string RefundName { get; set; }
        
        public string RefundAccount { get; set; }
        
        public string RefundBankName { get; set; }
        
        public DateTime? RefundMoney_Start { get; set; }
        
        public DateTime? RefundMoney_End { get; set; }
        
        public DateTime? RefundDate_Start { get; set; }
        
        public DateTime? RefundDate_End { get; set; }
        
        public string PaymentName { get; set; }
        
        public string PaymentAccount { get; set; }
        
        public string PaymentBankName { get; set; }
        
        public DateTime? PaymentMoney_Start { get; set; }
        
        public DateTime? PaymentMoney_End { get; set; }
        
        public DateTime? PaymentDate_Start { get; set; }
        
        public DateTime? PaymentDate_End { get; set; }
        
        public string DeductMoneyName { get; set; }
        
        public string DeductMoneyAccount { get; set; }
        
        public string DeductMoneyBankName { get; set; }
        
        public DateTime? DeductMoneyMoney_Start { get; set; }
        
        public DateTime? DeductMoneyMoney_End { get; set; }
        
        public DateTime? DeductMoneyDate_Start { get; set; }
        
        public DateTime? DeductMoneyDate_End { get; set; }
        
    }
}
