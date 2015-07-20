using SOAFramework.Service.SDK.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace RiskMgr.WinformTest
{
    public partial class Index : System.Windows.Forms.Form
    {
        public Index()
        {
            InitializeComponent();
        }

        private string token;

        private void button1_Click(object sender, EventArgs e)
        {
            LogonRequest request = new LogonRequest();
            request.username = "admin";
            request.password = "admin";
            var response = SDKFactory.Client.Execute(request);
            token = response.token;
            MessageBox.Show(response.ResponseBody);
        }

        private void button2_Click(object sender, EventArgs e)
        {
            GetMenuRequest req = new GetMenuRequest();
            req.token = token;
            var res = SDKFactory.Client.Execute(req);
            
            MessageBox.Show(res.ResponseBody);
        }
    }
}
