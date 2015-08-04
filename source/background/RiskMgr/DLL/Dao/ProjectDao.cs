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
    public partial class ProjectDao : SimpleDao<Project, ProjectQueryForm, ProjectUpdateForm>
    {
        public ProjectDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public ProjectDao()
            : base(null)
        {
        }
        
        public DateTime? QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime?>("QueryProjectLastUpdateTime", null);
        }
    }
}