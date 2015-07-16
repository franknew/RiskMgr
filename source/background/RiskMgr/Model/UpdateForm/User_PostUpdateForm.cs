using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Form
{
    public class User_PostUpdateForm : BaseUpdateForm<User_Post>
    {
        public User_PostQueryForm User_PostQueryForm { get; set; }
    }
}