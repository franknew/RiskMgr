using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class Asset_ProjectUpdateForm : BaseUpdateForm<Asset_Project>
    {
        public Asset_ProjectQueryForm Asset_ProjectQueryForm { get; set; }
    }
}