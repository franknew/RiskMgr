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
    public partial class AssetDao : SimpleDao<Asset, AssetQueryForm, AssetUpdateForm>
    {
        public AssetDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public AssetDao()
            : base(null)
        {
        }
        
        public DateTime? QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime?>("QueryAssetLastUpdateTime", null);
        }
    }
}