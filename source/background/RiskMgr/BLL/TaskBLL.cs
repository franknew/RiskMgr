using DreamWorkflow.Engine.DAL;
using DreamWorkflow.Engine.Form;
using DreamWorkflow.Engine.Model;
using IBatisNet.DataMapper;
using RiskMgr.Form;
using RiskMgr.Model;
using RiskMgr.DAL;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.BLL
{
    public class TaskBLL
    {
        public List<FullTask> Query(QueryMyTaskServiceForm form)
        {
            ISqlMapper mapper = Common.GetMapperFromSession();
            FullTaskDao dao = new FullTaskDao(mapper);
            return dao.QueryTaskByRelationship(form);
        }
    }
}
