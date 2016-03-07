using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RiskMgr.Form;
using RiskMgr.Model;
using RiskMgr.WeiXinSignIn.Models;
using SOAFramework.Library.WeiXin;
using SOAFramework.Service.SDK.Core;

namespace RiskMgr.WeiXinSignIn.Controllers
{
    public class SignInController : Controller
    {
        // GET: SignIn
        public ActionResult Index()
        {
            //Response.Cookies.Add(new HttpCookie("test", "i m here"));
            string code = Request.QueryString["code"];
            //this.ViewBag.url = Request.Url.OriginalString;
            if (string.IsNullOrEmpty(code)) return View();
            WeiXinSignInRequest request = new WeiXinSignInRequest();
            request.form = new WeiXinLogonServiceForm { code = code };
            var response = SDKFactory.Client.Execute(request);
            //Response.Cookies.Add(new HttpCookie("skey", "test"));
            //if (response.IsError)
            //{
            //    this.ViewBag.url = response.ErrorMessage;
            //    return View();
            //}
            if (response.IsError) return new RedirectResult("/index.html?wx_code=" + response.Code + "&wx_msg=" + response.ErrorMessage);
            Response.Cookies.Add(new HttpCookie("skey", response.result.token));
            Response.Cache.SetOmitVaryStar(true);
            return View();
        }
    }
}