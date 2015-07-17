using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class LogonHistoryUpdateForm : BaseUpdateForm<LogonHistory>
    {
        public LogonHistoryQueryForm LogonHistoryQueryForm { get; set; }
    }
}