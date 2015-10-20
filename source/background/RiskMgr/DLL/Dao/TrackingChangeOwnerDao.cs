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
    public partial class TrackingChangeOwnerDao : SimpleDao<TrackingChangeOwner, TrackingChangeOwnerQueryForm, TrackingChangeOwnerUpdateForm>
    {
        public TrackingChangeOwnerDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public TrackingChangeOwnerDao()
            : base(null)
        {
        }
        
        public DateTime? QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime?>("QueryTrackingChangeOwnerLastUpdateTime", null);
        }
    }
}