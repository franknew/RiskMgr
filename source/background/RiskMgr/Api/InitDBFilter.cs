﻿using IBatisNet.DataMapper;
using SOAFramework.Library;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Api
{
    [Filter(GlobalUse = true, Index = 0)]
    public class InitDBFilter : BaseFilter
    {
        public override bool OnActionExecuting(ActionContext context)
        {
            ISqlMapper mapper = Mapper.Instance();
            if (!mapper.IsSessionStarted)
            {
                mapper.BeginTransaction();
            }
            context.Parameters["_Mapper"] = mapper;
            return base.OnActionExecuting(context);
        }

        public override bool OnActionExecuted(ActionContext context)
        {
            ISqlMapper mapper = context.Parameters["_Mapper"] as ISqlMapper;
            if (mapper.IsSessionStarted)
            {
                mapper.CommitTransaction();
            }
            return base.OnActionExecuted(context);
        }

        public override void OnExceptionOccurs(ActionContext context)
        {
            ISqlMapper mapper = context.Parameters["_Mapper"] as ISqlMapper;
            if (mapper.IsSessionStarted)
            {
                mapper.RollBackTransaction();
            }
            base.OnExceptionOccurs(context);
        }
    }
}
