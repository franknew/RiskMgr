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
    public partial class TrackingMortgageDao : SimpleDao<TrackingMortgage, TrackingMortgageQueryForm, TrackingMortgageUpdateForm>
    {
        public TrackingMortgageDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public TrackingMortgageDao()
            : base(null)
        {
        }
        
        public DateTime? QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime?>("QueryTrackingMortgageLastUpdateTime", null);
        }
    }
}