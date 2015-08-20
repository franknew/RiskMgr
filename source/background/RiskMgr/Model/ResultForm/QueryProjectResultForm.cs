using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class QueryProjectServiceForm : ProjectQueryForm
    {
        public string BuyerName { get; set; }

        public string SellerName { get; set; }

        public string BuyerIdentityCode { get; set; }

        public string SellerIdentityCode { get; set; }

        public string AssetCode { get; set; }

        public string AssetAddress { get; set; }
    }
}
