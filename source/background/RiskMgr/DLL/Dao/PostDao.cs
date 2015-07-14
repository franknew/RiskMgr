using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.DAL
{
    public class PostDao : BaseDao<Post, PostQueryForm, PostUpdateForm>
    {
        public PostDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}