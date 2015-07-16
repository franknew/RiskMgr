using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class ActionUpdateForm : SimpleUpdateForm<RiskMgr.Model.Action>
    {
        public ActionQueryForm ActionQueryForm { get; set; }
    }
}