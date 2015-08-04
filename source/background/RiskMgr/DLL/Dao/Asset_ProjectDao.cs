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
    public partial class Asset_ProjectDao : BaseDao<Asset_Project, Asset_ProjectQueryForm, Asset_ProjectUpdateForm>
    {
        public Asset_ProjectDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public Asset_ProjectDao()
            : base(null)
        {
        }
        
    }
}