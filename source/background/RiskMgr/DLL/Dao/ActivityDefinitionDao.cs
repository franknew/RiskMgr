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
    public partial class ActivityDefinitionDao : SimpleDao<ActivityDefinition, ActivityDefinitionQueryForm, ActivityDefinitionUpdateForm>
    {
        public ActivityDefinitionDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public ActivityDefinitionDao()
            : base(null)
        {
        }
        
        public DateTime QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime>("QueryActivityDefinitionLastUpdateTime", null);
        }
    }
}