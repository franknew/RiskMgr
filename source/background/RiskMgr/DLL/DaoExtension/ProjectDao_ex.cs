using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Library.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SOAFramework.Library;

namespace RiskMgr.DAL
{
    public partial class ProjectDao : SimpleDao<Project, ProjectQueryForm, ProjectUpdateForm>
    {
        public List<ProjectTask> QueryProjectByRelationship(QueryProjectServiceForm form)
        {
            if (form.PageSize.HasValue && form.PageSize.Value > 0)
            {
                form.RecordCount = Mapper.QueryForObject<int>("QueryProjectByRelationshipCount", form);
            }
            return Mapper.QueryForList<ProjectTask>("QueryProjectByRelationship", form).ToList();
        }

        public int QueryMaxProjectIndex(ProjectQueryForm form)
        {
            object obj = Mapper.QueryForObject("QueryMaxProjectIndex", form);
            int result = 0;
            if (obj != null)
            {
                result = (int)obj;
            }
            return result;
        }

        public List<ProjectTask> QueryMyApply(QueryMyApplyServiceForm form)
        {
            if (form.PageSize.HasValue && form.PageSize.Value > 0)
            {
                form.RecordCount = Mapper.QueryForObject<int>("QueryMyApplyCount", form);
            }
            string sql = Mapper.GetRuntimeSql("QueryMyApply", form);
            LogHelper.WriteLog(sql);
            return Mapper.QueryForList<ProjectTask>("QueryMyApply", form).ToList();
        }
    }
}
