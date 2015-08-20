using DreamWorkflow.Engine.DAL;
using DreamWorkflow.Engine.Form;
using DreamWorkflow.Engine.Model;
using IBatisNet.DataMapper;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.BLL
{
    public class TaskBLL
    {
        public List<Task> Query(TaskQueryForm form)
        {
            ISqlMapper mapper = null;
            if (ServiceSession.Current.Context.Parameters.ContainsKey("Mapper"))
            {
                mapper = ServiceSession.Current.Context.Parameters["Mapper"] as ISqlMapper;
            }
            else
            {
                mapper = Mapper.Instance();
            }
            TaskDao dao = new TaskDao(mapper);
            return dao.Query(form);
        }
    }
}
