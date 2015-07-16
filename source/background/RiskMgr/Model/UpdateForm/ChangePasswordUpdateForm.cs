using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model.Form
{
    public class ChangePasswordUpdateForm
    {
        public string UserID { get; set; }

        public string OldPassword { get; set; }

        public string NewPassword { get; set; }
    }
}
