﻿using DreamWorkflow.Engine.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Model
{
    public class FullTask : Task
    {
        public string Applier { get; set; }

        public string Processor { get; set; }
    }
}
