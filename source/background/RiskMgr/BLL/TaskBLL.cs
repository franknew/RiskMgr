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
            WorkflowDao wfdao = new WorkflowDao(mapper);
            Customer_ProjectDao cpdao = new Customer_ProjectDao(mapper);
            CustomerDao customerdao = new CustomerDao(mapper);
            var tasks = dao.QueryTaskByRelationship(form);
            var workflowids = (from t in tasks select t.WorkflowID).ToList();
            var workflows = wfdao.Query(new WorkflowQueryForm { IDs = workflowids });
            var projectids = (from w in workflows select w.ProcessID).ToList();
            var cps = cpdao.Query(new Customer_ProjectQueryForm { ProjectIDs = projectids });
            var customerids = (from cp in cps select cp.CustomerID).ToList();
            var customers = customerdao.Query(new CustomerQueryForm { IDs = customerids });
            foreach (var task in tasks)
            {
                var customername = (from cp in cps join c in customers on cp.CustomerID equals c.ID join w in workflows on cp.ProjectID equals w.ProcessID
                                    where w.ID.Equals(task.WorkflowID) && (cp.Type == 1 || cp.Type == 2)
                                    select c.Name.Trim()).ToList();
                task.Title = String.Join(",", customername);
            }
            return tasks;
        }
    }
}
