using RiskMgr.Form;
using RiskMgr.Model;
using IBatisNet.DataMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace RiskMgr.DAL
{
    public class User_PostDao : BaseDao<User_Post, User_PostQueryForm, User_PostUpdateForm>
    {
        public User_PostDao(ISqlMapper mapper = null)
            : base(mapper)
        {

        }
    }
}