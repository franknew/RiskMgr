using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class ReturnBackConfirmUpdateForm : BaseUpdateForm<ReturnBackConfirm>
    {
        public ReturnBackConfirmQueryForm ReturnBackConfirmQueryForm { get; set; }
    }
}