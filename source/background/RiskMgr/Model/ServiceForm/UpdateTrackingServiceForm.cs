using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class UpdateTrackingServiceForm : Project
    {

        public string ChangeOwnerProfileCode { get; set; }

        public DateTime? ChangeOwnerProfileTime { get; set; }

        public string ChangeOwnerRemark { get; set; }

        public DateTime? LogoutAssetTime { get; set; }

        public string MortgageFeedbackCode { get; set; }

        public DateTime? MortgageOverTime { get; set; }

        public DateTime? MortgagePredictTime { get; set; }

        public string MortgageRemark { get; set; }

        public string NewAssetCode { get; set; }

        public DateTime? NewAssetDate { get; set; }

        public DateTime? PickNewAssetCodeTime { get; set; }

        public string WorkflowID { get; set; }

        public string ActivityID { get; set; }

        public string TaskID { get; set; }
    }
}
