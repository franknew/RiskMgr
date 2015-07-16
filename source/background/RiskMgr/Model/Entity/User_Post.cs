using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.Model
{
    public class User_Post : BaseEntity
    {
        public string UserID { get; set; }
        
        public string PostID { get; set; }
        
    }
}