using SOAFramework.Library.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class PagingEntity<T> where T : SimpleEntity
    {
        public int RecordCount { get; set; }

        public int PageCount { get; set; }

        public List<T> Record { get; set; }
    }
}
