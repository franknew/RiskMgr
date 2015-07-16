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
    public partial class ActivityAuthDao : SimpleDao<ActivityAuth, ActivityAuthQueryForm, ActivityAuthUpdateForm>
    {
        public ActivityAuthDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}