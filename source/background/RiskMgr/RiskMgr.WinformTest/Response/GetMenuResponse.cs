﻿using RiskMgr.Model;
using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.WinformTest
{
    public class GetMenuResponse : BaseResponse
    {
        public List<Menu> Menus { get; set; }
    }
}
