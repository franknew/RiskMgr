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
    public partial class ActionDao : SimpleDao<RiskMgr.Model.Action, ActionQueryForm, ActionUpdateForm>
    {
        public ActionDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public ActionDao()
            : base(null)
        {
        }
        
        public DateTime QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime>("QueryActionLastUpdateTime", null);
        }
    }
}