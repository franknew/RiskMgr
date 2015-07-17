using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library.DAL;

namespace RiskMgr.DAL
{
    public partial class LogonHistoryDao : BaseDao<LogonHistory, LogonHistoryQueryForm, LogonHistoryUpdateForm>
    {
        public LogonHistoryDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public LogonHistoryDao()
            : base(null)
        {
        }
        
    }
}