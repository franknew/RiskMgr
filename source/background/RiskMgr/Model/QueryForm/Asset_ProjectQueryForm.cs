using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class Asset_ProjectQueryForm : BaseQueryForm
    {
        public string AssetID { get; set; }
        
        public string ProjectID { get; set; }
        
    }
}
