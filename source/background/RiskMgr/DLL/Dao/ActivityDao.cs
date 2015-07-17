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
    public partial class ActivityDao : SimpleDao<Activity, ActivityQueryForm, ActivityUpdateForm>
    {
        public ActivityDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public ActivityDao()
            : base(null)
        {
        }
        
        public DateTime QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime>("QueryActivityLastUpdateTime", null);
        }
    }
}