using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class SimpleEntity : BaseEntity
    {

        public string Name { get; set; }

        public string Creator { get; set; }

        public DateTime? CreateTime { get; set; }
    }
}
