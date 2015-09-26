using DreamWorkflow.Engine.Form;
using DreamWorkflow.Engine.Model;
using DreamWorkflow.Engine.DAL;
using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Library.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IBatisNet.DataMapper;

namespace RiskMgr.DAL
{
    public partial class FullTaskDao : TaskDao
    {
        public FullTaskDao(ISqlMapper mapper)
            : base (mapper)
        {

        }

        public List<FullTask> QueryTaskByRelationship(QueryMyTaskServiceForm form)
        {
            return Mapper.QueryForList<FullTask>("QueryTaskByRelationship", form).ToList();
        }
    }
}
