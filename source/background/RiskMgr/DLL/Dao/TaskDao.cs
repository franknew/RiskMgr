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
    public partial class TaskDao : SimpleDao<Task, TaskQueryForm, TaskUpdateForm>
    {
        public TaskDao(ISqlMapper mapper)
            : base(mapper)
        {
        }
        
        public TaskDao()
            : base(null)
        {
        }
        
        public DateTime QueryMaxLastUpdateTime()
        {
            return Mapper.QueryForObject<DateTime>("QueryTaskLastUpdateTime", null);
        }
    }
}