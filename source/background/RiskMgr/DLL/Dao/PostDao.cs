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
    public partial class PostDao : SimpleDao<Post, PostQueryForm, PostUpdateForm>
    {
        public PostDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public PostDao()
            : base(null)
        {
        }
        
        public DateTime? QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime?>("QueryPostLastUpdateTime", null);
        }
    }
}