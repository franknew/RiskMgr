using IBatisNet.DataMapper;
using RiskMgr.DAL;
using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.BLL
{
    public class ProjectBLL
    {
        public string Add(Project project, List<Asset_Project> assets, List<Customer_Project> customers)
        {
            ISqlMapper mapper = Mapper.Instance();
            ProjectDao projectdao = new ProjectDao(mapper);
            Asset_ProjectDao apdao = new Asset_ProjectDao(mapper);
            Customer_ProjectDao cpdao = new Customer_ProjectDao(mapper);
            try
            {
                string projectid = null;
                mapper.BeginTransaction();
                projectdao.Add(project);
                foreach (var asset in assets)
                {
                    asset.ProjectID = project.ID;
                    apdao.Add(asset);
                }
                foreach (var customer in customers)
                {
                    customer.ProjectID = project.ID;
                    cpdao.Add(customer);
                }
                mapper.CommitTransaction();
                projectid = project.ID;
                return projectid;
            }
            catch
            {
                mapper.RollBackTransaction();
                throw;
            }
        }
    }
}
