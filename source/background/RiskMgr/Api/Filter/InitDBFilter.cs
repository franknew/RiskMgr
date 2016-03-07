using IBatisNet.DataMapper;
using SOAFramework.Library;
using SOAFramework.Service.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RiskMgr.BLL;

namespace RiskMgr.Api
{
    [Filter(GlobalUse = true, Index = 0)]
    public class InitDBFilter : BaseFilter
    {
        public override bool OnActionExecuting(ActionContext context)
        {
            ISqlMapper mapper = Mapper.Instance();
            if (!mapper.IsSessionStarted) mapper.BeginTransaction();
            context.Parameters[Common.MapperKey] = mapper;
            return base.OnActionExecuting(context);
        }

        public override bool OnActionExecuted(ActionContext context)
        {
            try
            {
                if (!context.Parameters.ContainsKey(Common.MapperKey))
                {
                    return base.OnActionExecuted(context);
                }
                ISqlMapper mapper = context.Parameters[Common.MapperKey] as ISqlMapper;
                if (mapper == null)
                {
                    MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = "在OnActionExecuted中mapper为null" }, SOAFramework.Library.CacheEnum.FormMonitor);
                    return base.OnActionExecuted(context);
                }
                try
                {
                    if (mapper.IsSessionStarted) mapper.CommitTransaction();
                }
                catch (NullReferenceException ex)
                {
                }
                return base.OnActionExecuted(context);
            }
            catch
            {
                MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = "OnActionExecuted" }, SOAFramework.Library.CacheEnum.FormMonitor);
                throw;
            }
        }

        public override void OnExceptionOccurs(ActionContext context)
        {
            if (!context.Parameters.ContainsKey(Common.MapperKey))
            {
                base.OnExceptionOccurs(context);
                return;
            }
            ISqlMapper mapper = context.Parameters[Common.MapperKey] as ISqlMapper;
            if (mapper == null)
            {
                MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = "在OnExceptionOccurs中mapper为null" }, SOAFramework.Library.CacheEnum.FormMonitor);
                base.OnExceptionOccurs(context);
                return;
            }
            if (mapper.IsSessionStarted) mapper.RollBackTransaction();
            if (context.Response != null) MonitorCache.GetInstance().PushMessage(new CacheMessage { Message = context.Response.ErrorMessage }, SOAFramework.Library.CacheEnum.FormMonitor);
            base.OnExceptionOccurs(context);
        }
    }
}
