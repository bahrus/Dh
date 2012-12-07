using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace TypeScriptExamples2
{
    public partial class WebForm1 : System.Web.UI.Page
    {

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            for (int i = 1; i < 100000; i++)
            {
                var pnl = new Panel
                {
                    ID = "pnl_" + i,
                    GroupingText = "Panel " + i,
                };
                Panel1.Controls.Add(pnl);
            }
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            
        }
    }
}