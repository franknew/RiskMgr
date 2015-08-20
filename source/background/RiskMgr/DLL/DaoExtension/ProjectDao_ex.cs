using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Library.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.DAL
{
    public partial class ProjectDao : SimpleDao<Project, ProjectQueryForm, ProjectUpdateForm>
    {
        public List<Project> QueryProjectByRelationship(QueryProjectServiceForm form)
        {
            return Mapper.QueryForList<Project>("QueryProjectByRelationship", form).ToList();
        }
    }
}
