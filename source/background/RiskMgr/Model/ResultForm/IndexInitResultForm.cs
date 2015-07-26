﻿using DreamWorkflow.Engine.Model;
using RiskMgr.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.Form
{
    public class IndexInitResultForm
    {
        public UserEntireInfo User { get; set; }

        public List<Menu> Menu { get; set; }

        public List<Task> Task { get; set; }
    }
}