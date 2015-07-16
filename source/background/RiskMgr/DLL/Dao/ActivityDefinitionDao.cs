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
        public ActivityDefinitionDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}