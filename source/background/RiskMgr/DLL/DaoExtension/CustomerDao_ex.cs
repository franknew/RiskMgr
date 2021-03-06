﻿using RiskMgr.Form;
using RiskMgr.Model;
using SOAFramework.Library.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RiskMgr.DAL
{
    public partial class CustomerDao : SimpleDao<Customer, CustomerQueryForm, CustomerUpdateForm>
    {
        public Customer CheckIdentityCode(CustomerQueryForm form)
        {
            return Mapper.QueryForList<Customer>("CheckIdentityCodeExists", form).FirstOrDefault();
        }
    }
}
